import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UserRole } from '../database/schema.js';
import { db } from '../database/db.js';

export interface AuthenticatedUser {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
  region?: string;
  linked_agent_id?: string;
  linked_exporter_id?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      linked_agent_id: user.linked_agent_id,
      linked_exporter_id: user.linked_exporter_id
    },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Role '${req.user.role}' is not authorized. Allowed roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
}

/**
 * Tenant Isolation Guard:
 * Prevents a farmer from accessing another farmer's soil records, media, or farm metrics.
 */
export function enforceFarmerIsolation(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // If the user is a farmer, verify the requested farm belongs to them
  if (req.user.role === 'farmer') {
    const farmId = req.params.farmId || req.body.farm_id || (req.query.farm_id as string);
    if (farmId) {
      const farm = db.getFarmById(farmId);
      if (farm && farm.farmer_id !== req.user.id) {
        return res.status(403).json({
          error: 'TenantIsolationViolation: A farmer cannot view or modify another farmer\'s soil data or media records.'
        });
      }
    }
  }

  next();
}
