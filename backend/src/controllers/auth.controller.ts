import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db.js';
import { User, UserRole } from '../database/schema.js';
import { generateToken } from '../middleware/auth.js';

const otpStore = new Map<string, string>();

// Strict regex validators
const PHONE_REGEX = /^[6-9]\d{9}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EXPORT_ID_REGEX = /^[0-9A-Za-z]{10}$/;

export class AuthController {
  // --- Standard Role-Based Registration ---
  public static async register(req: Request, res: Response) {
    const {
      role,
      name,
      phone,
      password,
      district,
      region,
      language,
      exporter_code,
      farmer_id_code,
      company_name,
      company_reg_id,
      gst_number,
      export_id,
      shop_name,
      email
    } = req.body;

    const userRole: UserRole = role || 'farmer';

    // 1. Phone number strict 10-digit validation
    if (!phone || !PHONE_REGEX.test(phone.trim())) {
      return res.status(400).json({
        error: 'ValidationError: Mobile number must be strictly 10 valid digits starting with 6, 7, 8, or 9.'
      });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'ValidationError: Full name is required (minimum 2 characters).' });
    }

    // Check if phone already registered
    const existing = db.getUserByPhone(phone.trim());
    if (existing) {
      return res.status(400).json({ error: 'AccountExists: An account with this mobile number already exists. Please log in.' });
    }

    let linkedExporterId: string | undefined = undefined;
    let generatedExporterCode: string | undefined = undefined;
    let generatedFarmerIdCode: string | undefined = undefined;

    // 2. Strict Farmer-Only Role Constraint
    if (userRole !== 'farmer') {
      return res.status(403).json({
        error: 'RoleConstraintError: Platform operates strictly in Farmer-Centric mode. Only Farmer registrations are authorized.'
      });
    }

    generatedFarmerIdCode = `TN-FARM-${Math.floor(1000 + Math.random() * 9000)}`;
    if (exporter_code) {
      const exp = db.getUserByExporterCode(exporter_code);
      if (exp && exp.role === 'exporter') {
        linkedExporterId = exp.id;
      }
    }

    const newUser: User = {
      id: `user-${uuidv4().substring(0, 8)}`,
      phone: phone.trim(),
      role: userRole,
      name: name.trim(),
      region: district ? `${district}, Tamil Nadu` : (region || 'Tamil Nadu'),
      district: district || 'Thanjavur',
      language: language || 'ta',
      password: password || 'AgroSmart@2026',
      farmer_id_code: generatedFarmerIdCode,
      exporter_code: generatedExporterCode || exporter_code,
      company_name,
      company_reg_id,
      gst_number: gst_number?.toUpperCase(),
      export_id,
      shop_name,
      email,
      linked_exporter_id: linkedExporterId,
      created_at: new Date().toISOString()
    };

    try {
      db.createUser(newUser);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }

    const token = generateToken({
      id: newUser.id,
      phone: newUser.phone,
      role: newUser.role,
      name: newUser.name,
      linked_exporter_id: newUser.linked_exporter_id
    });

    return res.status(201).json({
      success: true,
      message: `Account created successfully for ${newUser.name} (${userRole.toUpperCase()}).`,
      token,
      user: newUser
    });
  }

  // --- Role-Based Login ---
  public static async login(req: Request, res: Response) {
    const { phone, password, role, export_id, gst_number } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const cleanPhone = phone.trim();
    let user = db.getUserByPhone(cleanPhone);

    if (!user) {
      // Check if trying to login via export_id or GST
      if (export_id) {
        user = db.getUsers().find(u => u.export_id === export_id.trim());
      } else if (gst_number) {
        user = db.getUsers().find(u => u.gst_number === gst_number.trim().toUpperCase());
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'No account found with these credentials. Please check or register.' });
    }

    if (user.role !== 'farmer') {
      return res.status(403).json({ error: 'Access denied: Platform is operating exclusively for Farmers.' });
    }

    // In demo environment, allow any password or specific match
    if (password && user.password && user.password !== password && password !== '123456') {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const token = generateToken({
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      linked_exporter_id: user.linked_exporter_id
    });

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user
    });
  }

  // --- OTP Verification (Demo Backward-Compatibility) ---
  public static async requestOtp(req: Request, res: Response) {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required.' });
    const otp = '123456';
    otpStore.set(phone, otp);
    return res.json({ success: true, message: `OTP sent to ${phone}. (Demo bypass: 123456)` });
  }

  public static async verifyOtp(req: Request, res: Response) {
    const { phone, otp, name, role, region, language, linked_agent_id, linked_exporter_id } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required.' });

    let user = db.getUserByPhone(phone);
    if (!user) {
      user = {
        id: `user-${uuidv4().substring(0, 8)}`,
        phone,
        role: 'farmer',
        name: name || 'Rajendra Singh',
        region: region || 'Punjab, India',
        language: language || 'en',
        farmer_id_code: `TN-FARM-${Math.floor(1000 + Math.random() * 9000)}`,
        created_at: new Date().toISOString()
      };
      db.createUser(user);
    } else if (user.role !== 'farmer') {
      return res.status(403).json({ error: 'Access denied: Platform is operating exclusively for Farmers.' });
    }

    const token = generateToken({
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      linked_agent_id: user.linked_agent_id,
      linked_exporter_id: user.linked_exporter_id
    });

    return res.json({ success: true, token, user });
  }

  public static async getProfile(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User record not found.' });
    return res.json(user);
  }

  public static async getAgentsAndExporters(req: Request, res: Response) {
    const users = db.getUsers();
    const agents = users.filter(u => u.role === 'agent');
    const exporters = users.filter(u => u.role === 'exporter');
    return res.json({ agents, exporters });
  }

  public static async updateProfile(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { name, phone, district, region, farmer_id_code, exporter_code, company_name, gst_number, export_id, shop_name, language } = req.body;

    const updates: any = {};
    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();
    if (district) {
      updates.district = district.trim();
      updates.region = `${district.trim()}, Tamil Nadu`;
    } else if (region) {
      updates.region = region.trim();
    }
    if (farmer_id_code) updates.farmer_id_code = farmer_id_code.trim();
    if (exporter_code) {
      updates.exporter_code = exporter_code.trim();
      const exp = db.getUserByExporterCode(exporter_code.trim());
      if (exp && exp.role === 'exporter') {
        updates.linked_exporter_id = exp.id;
      }
    }
    if (company_name) updates.company_name = company_name.trim();
    if (gst_number) updates.gst_number = gst_number.trim().toUpperCase();
    if (export_id) updates.export_id = export_id.trim();
    if (shop_name) updates.shop_name = shop_name.trim();
    if (language) updates.language = language;

    try {
      const updatedUser = db.updateUser(req.user.id, updates);
      if (!updatedUser) return res.status(404).json({ error: 'User record not found.' });
      return res.json({ success: true, user: updatedUser });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
