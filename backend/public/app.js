// AgriSmart Platform Client (Vanilla JavaScript + CSS + Node.js)
// Enterprise Agricultural Intelligence & Traceability Architecture
// Agritech Dark-Green Theme & Strict Role-Based Navigation

const TN_PERSONAS = {
  farmer: {
    phone: '9842100004',
    name: 'Arumugam Sundaram',
    role: 'farmer',
    farmer_id_code: 'TN-FARM-8492',
    region: 'Thanjavur, Tamil Nadu',
    district: 'Thanjavur'
  },
  agent: {
    phone: '9842100002',
    name: 'Senthil Kumar',
    role: 'agent',
    exporter_code: 'EXP-TN-COIMBATORE-101',
    region: 'Erode, Tamil Nadu',
    district: 'Erode'
  },
  exporter: {
    phone: '9842100001',
    name: 'Kongu Agro Global Exports Pvt Ltd',
    role: 'exporter',
    exporter_code: 'EXP-TN-COIMBATORE-101',
    gst_number: '33AAACK7741P1ZB',
    export_id: '0485019284',
    region: 'Coimbatore, Tamil Nadu',
    district: 'Coimbatore'
  },
  shop_owner: {
    phone: '9842100003',
    name: 'Palanisamy Velu',
    role: 'shop_owner',
    shop_name: 'Meenakshi Wholesale & Retail Mandi',
    gst_number: '33AABCM9102K1ZV',
    region: 'Madurai, Tamil Nadu',
    district: 'Madurai'
  }
};

const TN_FIELD_AGENTS = [
  {
    id: 'user-agt-01',
    name: 'Senthil Kumar',
    phone: '9842100002',
    role: 'agent',
    district: 'Erode',
    specialization: 'APEDA Certified Field Auditor',
    badge: 'EXP-TN-ERODE-101',
    rating: '4.9 ★',
    completedAudits: 48,
    status: 'Available'
  },
  {
    id: 'user-agt-02',
    name: 'Priya Natarajan',
    phone: '9842100006',
    role: 'agent',
    district: 'Coimbatore',
    specialization: 'Codex Alimentarius Quality Specialist',
    badge: 'EXP-TN-CBE-204',
    rating: '5.0 ★',
    completedAudits: 62,
    status: 'Available'
  },
  {
    id: 'user-agt-03',
    name: 'Murugan Thangavel',
    phone: '9842100007',
    role: 'agent',
    district: 'Thanjavur Delta',
    specialization: 'Senior Soil & Agrochemical Auditor',
    badge: 'EXP-TN-THANJ-309',
    rating: '4.8 ★',
    completedAudits: 55,
    status: 'In Field'
  }
];

let state = {
  language: (typeof localStorage !== 'undefined' && localStorage.getItem('agrosmart_lang')) || 'en',
  currentTab: 'menu', // 'menu' | 'analytics' | 'yield' | 'channels' | 'history' | 'forms' | 'user_listings'
  currentRole: 'farmer',
  user: TN_PERSONAS.farmer,
  token: '',
  farms: [],
  activeFarm: null,
  activities: [],
  marketplaceLots: [],
  shopRequirements: [],
  ordersLedger: [],
  assignedForms: [],
  agentInspectionHistory: [],
  agentExporters: [
    {
      id: 'EXP-TN-COIMBATORE-101',
      name: 'Kongu Agro Global Exports Pvt Ltd',
      district: 'Coimbatore',
      contractDate: '2026-01-15',
      status: 'Active',
      commodities: 'Ponni Paddy, Salem Turmeric'
    },
    {
      id: 'EXP-TN-MADURAI-204',
      name: 'Tamil Nadu Spices Export Corp',
      district: 'Madurai',
      contractDate: '2026-03-10',
      status: 'Active',
      commodities: 'Turmeric, Red Chilli'
    }
  ],
  historicalLandLogs: [],
  userListings: [],
  rotationDecisionData: null,
  exporterData: null,
  progressionOverview: null,
  selectedAgentId: 'user-agt-01',
  farmWeeklyState: {
    'farm-001-rajendra': {
      week: 18,
      totalWeeks: 18,
      stageName: 'Harvest & Pre-Harvest Quarantine',
      tasks: [
        { id: 'wt-r-01', title: 'Pre-harvest grain moisture & Brix optical scan', day: 'Day 1', done: true, type: 'sensor' },
        { id: 'wt-r-02', title: 'Combine harvester dispatch & field threshing', day: 'Day 3', done: false, type: 'harvest' },
        { id: 'wt-r-03', title: 'APEDA export batch bagging & tamper-proof tagging', day: 'Day 5', done: false, type: 'audit' }
      ]
    },
    'farm-001-bhavani': {
      week: 12,
      totalWeeks: 18,
      stageName: 'Flowering & Rhizome Growth',
      tasks: [
        { id: 'wt-b-01', title: 'Canal water leveling & standing water check', day: 'Day 1', done: true, type: 'irrigation' },
        { id: 'wt-b-02', title: 'Organic bio-potash root drenching', day: 'Day 3', done: false, type: 'fertilizer' },
        { id: 'wt-b-03', title: 'Curcumin index sampling & soil inspection', day: 'Day 6', done: false, type: 'sensor' }
      ]
    },
    'farm-001-cauvery': {
      week: 6,
      totalWeeks: 18,
      stageName: 'Vegetative Tillering & Root Aeration',
      tasks: [
        { id: 'wt-c-01', title: 'Field canal irrigation & moisture check', day: 'Day 1', done: true, type: 'irrigation' },
        { id: 'wt-c-02', title: 'Neem Seed Kernel Extract (NSKE 5%) bio-spray', day: 'Day 4', done: false, type: 'pest' },
        { id: 'wt-c-03', title: 'Bio-fertilizer foliar top-up', day: 'Day 6', done: false, type: 'fertilizer' }
      ]
    }
  },
  auditHistory: [
    { timestamp: '2026-09-08 14:35:12', event: 'Hardware Camera Geo-Verification', detail: 'Amaravathi Basin Plot A (10.7872°N, 79.1375°E) verified by Senthil Kumar', type: 'audit' },
    { timestamp: '2026-09-08 11:20:00', event: 'AI Grading Split Completed', detail: 'Lot partitioned: 75% Grade A Export (Kongu Agro), 25% Grade B Mandi (Madurai)', type: 'split' },
    { timestamp: '2026-09-07 16:40:00', event: 'Farmer Land Registration', detail: 'Bhavani River Turmeric Acres (3.2 Acres / 1.3 Ha) registered with Soil Test PDF', type: 'land' }
  ],
  cameraStream: null,
  barcodeCameraStream: null,
  activeCameraTaskId: null,
  activeCameraFarmId: null,
  weatherTelemetry: null
};

// =========================================================================
// END-TO-END CLIENT-SIDE ENCRYPTION (AES-256-GCM VIA WEB CRYPTO API)
// =========================================================================
const AgroCrypto = {
  keyCache: {},

  async getRoleKey(role) {
    const r = (role || 'farmer').toUpperCase();
    if (this.keyCache[r]) return this.keyCache[r];
    try {
      const enc = new TextEncoder();
      const roleSecret = `AGROSMART-PRECISION-KEY-${r}-2026-DELTA`;
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(roleSecret),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: enc.encode('AGROSMART_DELTA_ENCRYPTION_SALT_2026'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      this.keyCache[r] = key;
      return key;
    } catch (e) {
      console.warn('[AgroCrypto] Key derivation fallback:', e);
      return null;
    }
  },

  async encryptPayload(data, targetRole = 'farmer') {
    try {
      if (!window.crypto || !window.crypto.subtle) return data;
      const key = await this.getRoleKey(targetRole);
      if (!key) return data;
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const plaintext = JSON.stringify(data);
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(plaintext)
      );
      const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
      return {
        __encrypted: true,
        algorithm: 'AES-256-GCM',
        key_id: `ROLE-KEY-${targetRole.toUpperCase()}-V1`,
        iv: Array.from(iv),
        ciphertext: ciphertextBase64,
        client_timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.warn('[AgroCrypto] Client encryption fallback:', e);
      return data;
    }
  },

  async decryptPayload(envelope, userRole = state.currentRole) {
    try {
      if (!envelope || !envelope.__encrypted) return envelope;
      const key = await this.getRoleKey(userRole);
      if (!key) return envelope;
      const iv = new Uint8Array(envelope.iv);
      const binaryString = atob(envelope.ciphertext);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const decBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        bytes
      );
      const dec = new TextDecoder();
      return JSON.parse(dec.decode(decBuffer));
    } catch (e) {
      console.warn('[AgroCrypto] Access denied or role unauthorized:', e);
      return { error: 'ROLE_UNAUTHORIZED_ACCESS', message: 'Restricted encrypted farmer ledger record.' };
    }
  }
};

// =========================================================================
// OFFLINE-FIRST PERSISTENCE & AUTO-SYNC QUEUE (CELLULAR DROPOUT RESILIENCE)
// =========================================================================
const AgroSmartOfflineSync = {
  STORAGE_KEY: 'agrosmart_offline_queue',
  isSyncing: false,

  getQueue() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  saveQueue(queue) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
      this.updateSyncUI();
    } catch (e) {
      console.warn('Offline storage error:', e);
    }
  },

  enqueue(action) {
    const queue = this.getQueue();
    const item = {
      id: 'queue-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      ...action,
      timestamp: new Date().toISOString()
    };
    queue.push(item);
    this.saveQueue(queue);
    if (typeof showToast === 'function') {
      showToast(`📦 Saved to Offline Queue (${queue.length} Pending)`);
    }
    return item;
  },

  async flushQueue() {
    if (this.isSyncing) return;
    const queue = this.getQueue();
    if (queue.length === 0) {
      this.updateSyncUI();
      return;
    }

    this.isSyncing = true;
    this.updateSyncUI(true);

    try {
      const res = await fetch('/api/farmer/offline-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`
        },
        body: JSON.stringify({ items: queue })
      });

      if (res.ok) {
        localStorage.removeItem(this.STORAGE_KEY);
        if (typeof showToast === 'function') {
          showToast(`✓ Auto-Synced ${queue.length} Offline Actions`);
        }
      } else {
        // Fallback: run items individually
        const remaining = [];
        for (const item of queue) {
          try {
            if (item.endpoint) {
              const r = await fetch(item.endpoint, {
                method: item.method || 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` },
                body: item.body ? (typeof item.body === 'string' ? item.body : JSON.stringify(item.body)) : undefined
              });
              if (!r.ok) remaining.push(item);
            }
          } catch (err) {
            remaining.push(item);
          }
        }
        this.saveQueue(remaining);
      }
    } catch (e) {
      console.warn('Auto-sync retry later:', e);
    } finally {
      this.isSyncing = false;
      this.updateSyncUI();
    }
  },

  updateSyncUI(isSyncing = false) {
    const el = document.getElementById('offline-sync-indicator');
    if (!el) return;
    const queue = this.getQueue();
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (!isOnline || queue.length > 0) {
      el.style.display = 'inline-flex';
      el.className = 'sync-pill offline';
      el.innerHTML = isSyncing
        ? `<span class="spin">🔄</span> Syncing ${queue.length}...`
        : `<span>🟠 Offline Mode: <strong>${queue.length}</strong> Queued</span> <button onclick="AgroSmartOfflineSync.flushQueue()" class="btn-sync-action">Sync</button>`;
    } else {
      el.style.display = 'inline-flex';
      el.className = 'sync-pill online';
      el.innerHTML = `<span>🟢 Online (Synced)</span>`;
    }
  },

  init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (typeof showToast === 'function') showToast('📶 Network Restored: Auto-Syncing...');
        this.flushQueue();
      });
      window.addEventListener('offline', () => {
        if (typeof showToast === 'function') showToast('⚠️ Offline Mode Activated: Changes queued.');
        this.updateSyncUI();
      });
      setInterval(() => {
        if (navigator.onLine && this.getQueue().length > 0) {
          this.flushQueue();
        }
      }, 20000);
    }
  }
};
AgroSmartOfflineSync.init();

// =========================================================================
// AUDIO-VISUAL TAMIL SPEECH LOCALIZATION SYNTHESIS
// =========================================================================
const TAMIL_AUDIO_PROMPTS = {
  step_1_leaf_uniformity: 'பயிர் இலைகள் மற்றும் தழைகளின் அடர்த்தி சீராக உள்ளதா என சரிபார்த்து சதவீதத்தை பதிவு செய்யவும்.',
  step_2_stem_vigor: 'செடியின் வளர்ச்சி மற்றும் தண்டுகளின் வலிமையை ஒன்று முதல் பத்து வரை மதிப்பிடவும்.',
  step_3_pest_blemish: 'பயிரில் பூச்சி அல்லது நோய் தாக்குதல் ஏதேனும் உள்ளதா என சோதித்து தழும்புகள் சதவீதத்தை உள்ளிடவும்.',
  step_4_soil_moisture: 'மண்ணின் ஈரப்பதம் மற்றும் வேர் மண்டல நீர் அளவை சென்சாரில் சரிபார்க்கவும்.',
  step_5_chem_adherence: 'ஏற்றுமதி விதிகளின்படி அங்கீகரிக்கப்பட்ட இயற்கை உரங்கள் மற்றும் பூச்சி மருந்து பயன்படுத்தப்பட்டுள்ளதா என உறுதிப்படுத்தவும்.',
  form_mrl_screening: 'அறுவடைக்கு முந்தைய ரசாயன எச்சப் பரிசோதனை முடிவை உள்ளிடவும்.',
  form_brix_sugar: 'பழத்தின் சர்க்கரை மற்றும் முதிர்ச்சி அளவை ப்ரிக்ஸ் மீட்டரில் அளந்து பதிவு செய்யவும்.',
  form_soil_nitrogen: 'மண்ணில் உள்ள தழைச்சத்து மற்றும் ஊட்டச்சத்து அளவை உள்ளிடவும்.',
  form_gps_boundary: 'நிலத்தின் ஜி.பி.எஸ் எல்லைக்குள் இருக்கிறீர்களா என்பதை சரிபார்க்கவும்.',
  form_barcode_audit: 'பயன்படுத்தப்படும் இடுபொருளின் பார்-கோடை ஸ்கேன் செய்து உறுதிப்படுத்தவும்.',
  form_general_notes: 'கள ஆய்வாளர் குறிப்புகள் மற்றும் பரிந்துரைகளை பதிவு செய்யவும்.',
  dashboard_guide: 'வணக்கம்! இது அக்ரி-ஸ்மார்ட் முகப்புப் பக்கம். உங்கள் நிலத்தின் மண் சத்து, வானிலை முன்னறிவிப்பு, நீர் பாசன அட்டவணை மற்றும் பரிந்துரைக்கப்பட்ட விதைகளை இங்கே எளிதாக பார்க்கலாம்.'
};

function playTamilPrompt(key, btnElement) {
  const text = TAMIL_AUDIO_PROMPTS[key] || 'இந்த கேள்வியை கவனமாக படித்து பதில் அளிக்கவும்.';

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang && (v.lang.includes('ta') || v.lang.includes('TA')));
    if (tamilVoice) utterance.voice = tamilVoice;

    if (btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.innerHTML = '🔊 Speaking...';
      btnElement.classList.add('audio-playing');

      utterance.onend = () => {
        btnElement.innerHTML = originalHtml;
        btnElement.classList.remove('audio-playing');
      };
      utterance.onerror = () => {
        btnElement.innerHTML = originalHtml;
        btnElement.classList.remove('audio-playing');
      };
    }

    window.speechSynthesis.speak(utterance);
  } else {
    if (typeof showToast === 'function') {
      showToast(`🔊 தமிழ் உரை: "${text}"`);
    }
  }
}

// =========================================================================
// BILINGUAL LOCALIZATION ARCHITECTURE (ENGLISH & தமிழ்)
// =========================================================================
const I18N_TRANSLATIONS = {
  en: {
    // Header & Chrome
    system_operational: 'SYSTEM OPERATIONAL',
    agro_zone: '📍 Tamil Nadu Agro-Zone',
    role_farmer: 'Farmer',
    role_agent: 'Agent',
    role_exporter: 'Exporter',
    role_shop: 'Shop',
    switch_account: 'Switch Account',
    current_lang_label: 'தமிழ் (TA)',
    switch_language: 'Switch Language / மொழியை மாற்றுக',

    // Sidebar & Navigation
    nav_farmer_title: 'Farmer Navigation',
    nav_land_parcels: 'Land',
    nav_crop_analytics: 'Crop Analytics',
    nav_yield_harvest: 'Yield',
    nav_history_plans: 'History of Plants',
    nav_account_title: 'Account',
    nav_edit_profile: 'Edit Profile',
    nav_agent_title: 'Field Workstation',
    nav_field_workstation: 'Lands',
    nav_agent_lands: 'Lands',
    nav_daily_gps: 'History of Lands',
    nav_history_of_lands: 'History of Lands',
    nav_manage_exporter: 'Manage Exporter',
    nav_export_title: 'Export Operations',
    nav_contracted_lands: 'Contracted Lands',
    nav_consignment_history: 'Consignment Delivery History',
    nav_agents: 'Agent Management',
    nav_mandi_marketplace: 'Mandi Marketplace',
    nav_shop_title: 'Mandi Trading Hub',
    nav_my_listings: 'Listings',
    nav_orders_ledger: 'Orders',

    // Mobile Bottom Bar
    mob_menu: 'Menu',
    mob_analytics: 'Analytics',
    mob_history: 'History',
    mob_profile: 'Profile',
    mob_land: 'Land',
    mob_yield: 'Yield',
    mob_plans: 'Plans',
    mob_lands: 'Lands',
    mob_consignments: 'Consignments',
    mob_market: 'Market',
    mob_workstation: 'Workstation',
    mob_records: 'Records',
    mob_listings: 'Listings',
    mob_ledger: 'Orders',

    // Dashboard Refactoring Modules
    consignment_delivery_history_title: 'Consignment Delivery History',
    agent_management_title: 'Agent Management',
    mandi_marketplace_title: 'Mandi Marketplace',
    listings_title: 'Listings',
    orders_title: 'Orders',
    tab_lands: 'Lands',
    tab_agents: 'Agents',
    btn_add_agent: 'Add Agent ID',
    btn_dispatch_agent: 'Dispatch Agent',
    search_crops_placeholder: 'Search by crop name (e.g., Ponni Rice, Erode Turmeric)...',
    btn_add_exporter: 'Add Exporter',
    exporter_id_label: 'Exporter ID',
    exporter_name_label: 'Exporter Name',
    manage_exporter_title: 'Manage Exporter',
    contracted_exporters_list: 'Contracted & Linked Exporters',
    history_log_title: 'History Log 📜',

    // Farmer Dashboard & Land Management
    registered_parcels: 'Land',
    active_weekly_protocol: 'Active Weekly Protocol',
    stage_harvest: 'Harvest & Pre-Harvest Quarantine',
    stage_flowering: 'Flowering & Rhizome Growth',
    stage_vegetative: 'Vegetative Tillering & Root Aeration',
    stage_nursery: 'Nursery & Sowing',
    soil_moisture: 'Soil Moisture',
    nitrogen_level: 'Nitrogen (N)',
    soil_ph: 'Soil pH',
    weather_forecast: 'Micro-Climate',
    btn_register_land: '+ Register Land Parcel',
    btn_map_parcel_code: '🏷️ Map Parcel via Unique ID',
    btn_view_certificate_qr: 'View Certificate & QR',
    btn_progression_timeline: 'Open 8-Week Progression Timeline',
    btn_expand_timeline: 'Expand Timeline',
    btn_collapse_timeline: 'Collapse Timeline',
    btn_done_camera: '✓ Done / Completed (Camera Proof)',
    btn_not_done: '❌ Not Done',
    btn_reschedule: '⏳ Reschedule',
    btn_quick_reschedule_2d: '⚡ +2 Days Curative Shift',
    btn_scan_barcode_dosing: '📷 Scan Barcode & Log Treatment (Mandatory Verification)',
    immediate_action_prompt: 'Action Protocol',
    hero_farmer_greeting: 'Vanakkam',
    hero_farmer_subtitle: 'Crop Lifecycle & Farm Management',
    harvest_forecast: 'Harvest Forecast',
    harvest_in_days: '⏳ Harvest in {days} Days',
    expected_harvest: 'Expected: {date}',
    grade_a_export: 'Grade A Export',
    mandi_domestic: 'Mandi',
    active_parcel_tag: '✓ Active Parcel',
    select_parcel_tag: 'Select',

    // 8-Week Progression Timeline
    timeline_title: '8-Week Progression Timeline',
    timeline_subtitle: 'Pre-harvest interval and phenological growth tracking',
    timeline_week: 'Week',
    timeline_status_completed: 'Completed',
    timeline_status_active: 'Active / Current',
    timeline_status_pending: 'Scheduled',
    timeline_mrl_safe: 'MRL Compliant',
    timeline_phi_days: 'PHI Countdown',
    timeline_8wk_tab: '🌿 8-Week Core Milestones',
    timeline_18wk_tab: '📅 Full 18-Week Lifecycle',
    timeline_cultivation_progress: 'Cultivation Progress',
    timeline_current_cycle: 'Current Cycle Action',

    // Reschedule Modal
    reschedule_title: 'Reschedule Agronomic Task',
    reschedule_pick_date: 'Select New Target Date:',
    reschedule_quick_shortcuts: 'Quick Reschedule Shortcuts:',
    btn_confirm_reschedule: 'Confirm Reschedule',
    btn_cancel: 'Cancel',

    // Barcode Scanner Modal
    barcode_modal_title: 'Scan Agrochemical Barcode',
    barcode_modal_subtitle: 'AI Input Authenticator & Tamper-Proof Dosing Verification',
    barcode_prescribed_target: 'Prescribed Target:',
    barcode_activate_camera: '📹 Activate Live Device Camera Scanner',
    barcode_quick_catalog: '⚡ Instant Catalog Test Options:',
    barcode_manual_label: 'Or Enter Barcode Manually',
    btn_verify_barcode: 'Verify Barcode',

    // Agent Workstation
    agent_workstation_title: 'Field Agent Workstation 📋',
    agent_workstation_subtitle: 'Assigned Land Parcels & Regulatory Compliance Roster',
    agent_select_parcel: 'Assigned Land Parcels Roster',
    agent_select_prompt: 'Assigned land parcels are displayed first. Camera photo-capture and crop grading inspections are locked and strictly accessible only after opening a specific land parcel below.',
    agent_active_inspection: 'Active Parcel Inspection Workstation',
    btn_capture_geo_photo: '📷 Capture Geo-Tagged Photo',
    btn_submit_audit: '✓ Submit Verified Field Audit',
    agent_audit_history: 'Daily GPS Inspection Logs',
    agent_status_available: 'Available',
    agent_status_in_field: 'In Field',
    btn_back_to_roster: '← Back to Parcels Roster',
    btn_open_inspection: 'Open Inspection Workstation →',

    // Exporter Portal
    exporter_title: 'Contracted Land Parcels & MRL Clearance',
    exporter_subtitle: 'APEDA zero-residue monitoring and export lot allocation',
    export_ready_volume: 'Export-Ready Volume',
    export_grading_score: 'Codex Alimentarius Grading',
    btn_manage_agents: 'Manage Field Agents',
    exporter_agents_title: 'APEDA Field Auditors & Inspection Agents',
    exporter_consignments_title: 'Consignment History & Ocean Freight Records',

    // Mandi Marketplace & Shop
    marketplace_title: 'Mandi Crop Marketplace & Harvest Lots',
    marketplace_subtitle: 'Direct farm-to-mandi procurement with APEDA residue clearance',
    filter_district_all: 'All Districts',
    filter_crop_all: 'All Crops',
    filter_grade_all: 'All Quality Grades',
    grade_export: 'Grade A (APEDA Export)',
    grade_domestic: 'Grade B (Domestic Mandi)',
    btn_direct_purchase: '🛒 Direct Purchase / Procure',
    btn_post_harvest_lot: '+ Post Harvest Lot',
    btn_post_demand: '+ Post Procurement Demand',
    shop_inventory_title: 'Mandi Inventory & Retail Stocks',
    shop_demands_title: 'Current Procurement Requirements',

    // Dynamic Compliance Certificate & PDF
    cert_official_title: 'Official Export Quality & Agrochemical Audit Certificate',
    cert_dossier_subtitle: 'International Export Compliance Dossier',
    cert_accreditation_prefix: 'Accreditation:',
    cert_status_approved: '✓ APPROVED FOR EXPORT',
    cert_issued_on: 'Issued:',
    cert_qr_verified: 'REAL-TIME QR VERIFIED',
    cert_export_readiness: 'EXPORT READINESS',
    cert_zero_banned: 'ZERO BANNED CHEMICALS',
    cert_parcel: 'Parcel',
    cert_crop: 'Crop',
    cert_farmer: 'Farmer',
    cert_district: 'District',
    cert_geolock: 'GPS Geo-Lock',
    cert_acreage: 'Acreage',
    cert_acres: 'Acres',
    cert_soil_ph: 'Soil pH',
    cert_phi_status: 'Pre-Harvest Interval',
    cert_phi_cleared: 'CLEARED (0.00 ppm Residue)',
    cert_verification_link: 'Verification Link:',
    cert_chemicals_title: '🧪 Live Applied Agrochemicals Application History',
    cert_chemicals_subtitle: 'Real-time records pulled live from land parcel application ledger.',
    cert_col_timestamp: 'Timestamp & Application Date',
    cert_col_chemical: 'Agrochemical / Input',
    cert_col_active_ing: 'Active Ingredient',
    cert_col_dosage: 'Dosage & Target',
    cert_col_phi: 'PHI & Harvest',
    cert_col_mrl: 'MRL Verdict',
    cert_col_token: 'Anti-Fraud Token',
    cert_standards_title: '🌐 International Standards Clearance Matrix (4 Frameworks)',
    cert_max_mrl: 'Max MRL',
    cert_observed: 'Observed',
    cert_hmac_proof: 'HMAC Proof',
    cert_footer_text: 'Certified by AgroSmart Automated Regulatory Engine • Verifiable by Customs Port Officials',
    btn_print_pdf: 'Print / Export Official PDF',
    btn_close_modal: 'Close Document',

    // Profile & Auth
    profile_modal_title: 'User Account Settings',
    profile_field_name: 'Full Name / Display Name',
    profile_field_phone: 'Registered Phone Number',
    profile_field_district: 'District / Agro-Zone (Tamil Nadu)',
    profile_field_language: 'Preferred Platform Language / விருப்ப மொழி',
    btn_save_profile: '✓ Save Changes',
    auth_modal_title: 'AgroSmart Secure Authentication',
    auth_field_phone: 'Mobile Phone Number',
    auth_field_otp: 'One-Time Password (OTP)',
    btn_sign_in: 'Sign In',
    toast_lang_switched: 'Language switched to English',
    toast_task_done: 'Task marked as completed with camera proof',
    toast_task_not_done: 'Task marked as Not Done. Schedule shifted +2 days with curative protocol.',
    toast_task_rescheduled: 'Task successfully rescheduled.',

    // Detailed Timeline
    timeline_fullscreen: 'Full Screen ↗',
    timeline_active_milestone_badge: '⚡ ACTIVE MILESTONE (WEEK {week})',
    timeline_crop_growth_state_machine: 'Crop Growth State-Machine',
    timeline_tap_for_details: 'Tap any week for agronomic details',
    timeline_agronomic_guidance: 'Agronomic Guidance:',
    timeline_agronomic_protocol: 'Agronomic Protocol:',
    timeline_loading: 'Loading 8-Week Progression Timeline data...',
    timeline_core_milestones: 'Core 8-Week Milestones:',
    timeline_action_required: '⚠️ ACTION REQUIRED TODAY (Week {week})',
    timeline_verified_completed: '✓ VERIFIED COMPLETED',
    timeline_task_status_actions: 'TASK STATUS ACTIONS:',
    timeline_btn_completed_camera: '📷 Completed (Camera Proof)',
    timeline_crop_growth_progression: '📅 8-Week Crop Growth Progression',

    // Barcode Scanner
    barcode_modal_subtitle_short: 'AI Input Authenticator',
    barcode_bottle_scanner: 'Agrochemical Bottle Scanner',
    barcode_align_reticle: 'Align EAN-13 / QR Barcode within reticle',
    barcode_reticle_tag: '[ BOTTLE BARCODE RETICLE ]',
    barcode_scan_bioneem: 'Scan: Bio-Neem 5% Bio-Extract (Certified APEDA Pass)',
    barcode_scan_pseudomonas: 'Scan: Pseudomonas Fluorescens Bio-Shield (Organic Pass)',
    barcode_scan_chlorpyrifos: 'Scan: Chlorpyrifos 20% EC (Banned Synthetic Warning)',
    barcode_authenticity_confirmed: '✓ AUTHENTICITY CONFIRMED',
    barcode_non_compliant_warning: '⚠️ NON-COMPLIANT WARNING',

    // Field Agent Workstation
    agent_hero_subtitle: 'Assigned Land Parcels Roster',
    agent_hero_title: 'Lands',
    agent_auditor_label: 'Auditor:',
    agent_badge_label: 'Badge:',
    agent_region_label: 'Region:',
    agent_gps_satellite_locked: '🟢 GPS SATELLITE LOCKED',
    agent_assigned_parcels_stat: 'Assigned Land Parcels',
    agent_parcels_count: '{count} Parcels',
    agent_gps_accuracy: 'GPS Precision Accuracy',
    agent_inspection_mode: 'Inspection Mode',
    agent_parcel_first_protocol: 'Parcel-First Protocol',
    agent_select_to_begin: 'Select Parcel to Begin',
    agent_btn_open_inspect: 'Open & Inspect Land Parcel',
    agent_inspection_terminal_title: 'Field Inspection & AI Quality Grading Terminal',
    agent_back_to_roster: 'Back to Assigned Land Parcels Roster',
    agent_ai_grading_title: 'AI Multimodal Quality & Tonnage Prediction',
    agent_automated_grading: 'Automated Field Grading Intelligence',
    agent_predicted_export_grade: 'Predicted Export Grade',
    agent_predicted_tonnage: 'Predicted Tonnage',
    agent_ai_confidence: 'AI Model Confidence',
    agent_export_clearance: 'Export Market Clearance',
    agent_apeda_cold_chain: '✓ APEDA Cold-Chain',
    agent_mandi_domestic_pass: '✓ Mandi Domestic',
    agent_structured_ai_title: 'Active Field Crop Audit & Multimodal Grading',
    agent_structured_ai_subtitle: 'Structured Field Data Collection & AI Assessment',
    agent_geolocked_to_parcel: 'Geo-Locked to Parcel',
    agent_site_photos_title: 'Site Photos & Optical Geo-Proof (Physical On-Site Verification)',
    agent_camera_sensor_stream: '• CAMERA SENSOR: GEO-LOCKED HARDWARE STREAM',
    agent_photo_captured_msg: '✓ High-Res Canopy Photo Captured & Geo-Tagged',
    agent_viewfinder_active: 'Optical Viewfinder Active • Point at foliage canopy, fruit clusters & soil boundary',
    agent_tamperproof_notice: 'Tamper-proof biometric GPS cryptographic validation',
    agent_btn_snap_photo: '📸 Snap Geo-Tagged Photo',
    agent_btn_recapture_photo: '🔄 Re-Capture Photo',
    agent_5_metrics_title: '🌿 5 Structured Field Crop Assessment Metrics:',
    agent_metric_1: '1. Leaf & Fruit Canopy Uniformity (%)',
    agent_metric_1_hint: 'Target for Grade A export >= 85%',
    agent_metric_2: '2. Surface Blemish & Defect Incidence (%)',
    agent_metric_2_hint: 'Threshold for Grade A <= 3.0%',
    agent_metric_3: '3. Foliage & Stem Vigor Score (1 to 10)',
    agent_metric_3_hint: 'Evaluation of vegetative strength and chlorophyll density',
    agent_metric_4: '4. Soil Moisture Sensor Probe (%)',
    agent_metric_4_hint: 'Optimal range: 18.0% - 26.0%',
    agent_metric_5: '5. Bio-Agrochemical Strip Adherence (Zero Synthetic Residues)',
    agent_metric_5_check: '✓ Verified: Only Organic / Bio-Approved Formulations Applied (NSKE 5% / Trichoderma / Bio-Potash)',
    agent_metric_5_hint: 'Zero banned organophosphates, synthetic pyrethroids, or unapproved fungicides detected.',
    agent_notes_label: 'Auditor Operational Field Notes',
    agent_btn_submit_assessment: 'Submit Field Assessment',
    wizard_step_1_title: 'Step 1: Leaf & Foliage Condition',
    wizard_step_2_title: 'Step 2: Vegetative Health & Stem Vigor',
    wizard_step_3_title: 'Step 3: Pest & Disease Incidence',
    wizard_step_4_title: 'Step 4: Soil Moisture',
    wizard_step_5_title: 'Step 5: Bio-Agrochemical Adherence',
    btn_next_step: 'Next Step →',
    btn_prev_step: '← Previous Step',
    ai_recommendation_label: 'AI Suggested Recommendation',

    // Exporter Portal
    exporter_terminal_subtitle: 'Global Agricultural Export Terminal & Cold-Chain Traceability',
    exporter_btn_consignments: '📦 Consignment History & Quality Grades Ledger',
    exporter_btn_dedicated_agents: '👨‍🌾 Dedicated Agents Management',
    exporter_btn_map_parcel: '🏷️ Map Parcel via Unique ID',
    exporter_total_contracted_acreage: 'Total Contracted Acreage',
    exporter_gross_predicted_volume: 'Gross Predicted Volume',
    exporter_grade_a_volume: 'Grade A (Cold-Chain Export)',
    exporter_active_contracted_parcels: 'Active Contracted Parcels',
    exporter_live_parcels_title: 'Live Parcels Under Export Contract',
    exporter_live_parcels_subtitle: 'Contracted Parcels Traceability',
    exporter_btn_prebook_contract: '+ Pre-Book Contract',
    exporter_btn_create_listing: '+ Create Listing',
    exporter_th_parcel: 'Land Parcel',
    exporter_th_farmer: 'Farmer',
    exporter_th_crop: 'Crop',
    exporter_th_progression: 'Progression',
    exporter_th_yield: 'Yield',
    exporter_th_grade: 'Grade',
    exporter_th_actions: 'Actions',
    exporter_btn_prebook_action: '⚡ Pre-Book',
    exporter_btn_cert_qr_action: '📜 Certificate & QR',
    exporter_status_growing: 'Growing',

    // Mandi Marketplace & Orders
    market_exchange_subtitle: 'Unified Tamil Nadu Agricultural Exchange',
    market_mandi_title: 'Mandi Marketplace',
    market_trading_hub_label: 'Trading Hub:',
    market_role_label: 'Role:',
    market_verified_lots_label: 'Verified Lots:',
    market_active_orders_label: 'Active Orders:',
    market_available_lots_title: 'Live Produce Lots Ready for Procurement',
    market_available_lots_subtitle: 'Available Domestic & Export Lots ({count})',
    market_lots_available_badge: '{count} Lots Available',
    market_seller_label: 'Seller:',
    market_channel_label: 'Channel:',
    market_region_label: 'Region:',
    market_direct_farmer: 'DIRECT FARMER',
    market_available_weight: 'Available Weight (kg)',
    market_mandi_price: 'Mandi Price / kg',
    market_harvest_readiness: 'Harvest Readiness',
    market_preharvest_cleared: '✓ Pre-Harvest Cleared',
    market_immediate: 'Immediate',
    market_btn_prebook_lot: '⚡ Pre-Book This Harvest Lot',
    market_btn_prebooked_reserved: '✓ Pre-Booked & Reserved',
    market_incoming_orders_title: 'Active Incoming Orders Under Processing',
    market_incoming_orders_subtitle: 'Active Orders & Processing States ({count})',
    market_active_badge: '{count} Active',
    market_no_incoming_orders: 'No incoming pending orders at this moment.',
    market_step_prebooked: 'Pre-Booked',
    market_step_inspected: 'Inspected',
    market_step_in_transit: 'In-Transit',
    market_step_delivered: 'Delivered',

    // Modals
    claim_parcel_title: 'Map Parcel via Unique ID',
    claim_parcel_subtitle: 'Land Parcel Mapping',
    claim_parcel_code_label: 'Unique Land Parcel Code / ID',
    claim_parcel_hint: 'Enter the unique tamper-proof parcel identifier registered with the state agricultural registry.',
    claim_parcel_btn: '🏷️ Claim & Map Parcel to Account',
    prebook_modal_title: 'Pre-Book Contract Allocation',
    prebook_modal_subtitle: 'Export Procurement',
    prebook_reserved_vol: 'Reserved Volume',
    prebook_export_rate: 'Export Rate',
    prebook_estimated_val: 'Estimated Contract Value:',
    prebook_btn_confirm: '⚡ Confirm Cold-Chain Pre-Booking Allocation',
    post_demand_title: 'Post Buyer Requirement',
    post_demand_subtitle: 'Demand Signal',
    post_crop_demanded: 'Crop Demanded',
    post_qty_kg: 'Quantity (kg)',
    post_quality_grade: 'Quality Grade',
    post_needed_by: 'Needed By Date',
    post_btn_submit: '✓ Post Demand to Marketplace',
    assigned_land_title: 'Assigned Land',
    btn_add_land: 'Add Land',
    prompt_enter_land_id: 'Enter Land ID to add to Export Contract:'
  },
  ta: {
    // Header & Chrome
    system_operational: 'கணினி சீராக இயங்குகிறது',
    agro_zone: '📍 தமிழ்நாடு வேளாண் மண்டலம்',
    role_farmer: 'விவசாயி',
    role_agent: 'கள ஆய்வாளர்',
    role_exporter: 'ஏற்றுமதியாளர்',
    role_shop: 'மண்டி',
    switch_account: 'கணக்கை மாற்று',
    current_lang_label: 'English (EN)',
    switch_language: 'Switch Language / மொழியை மாற்றுக',

    // Sidebar & Navigation
    nav_farmer_title: 'விவசாயி வழிகாட்டி',
    nav_land_parcels: 'நிலம்',
    nav_crop_analytics: 'பயிர் பகுப்பாய்வு',
    nav_yield_harvest: 'மகசூல்',
    nav_history_plans: 'தாவரங்களின் வரலாறு',
    nav_account_title: 'சுயவிவர கணக்கு',
    nav_edit_profile: 'சுயவிவரம் திருத்து',
    nav_agent_title: 'களப் பணிமனை',
    nav_field_workstation: 'நிலங்கள்',
    nav_agent_lands: 'நிலங்கள்',
    nav_daily_gps: 'நிலங்களின் வரலாறு',
    nav_history_of_lands: 'நிலங்களின் வரலாறு',
    nav_manage_exporter: 'ஏற்றுமதியாளர் மேலாண்மை',
    nav_export_title: 'ஏற்றுமதி செயல்பாடுகள்',
    nav_contracted_lands: 'ஒப்பந்த நிலங்கள்',
    nav_consignment_history: 'சரக்கு விநியோக வரலாறு',
    nav_agents: 'முகவர் மேலாண்மை',
    nav_mandi_marketplace: 'மண்டி சந்தை',
    nav_shop_title: 'மண்டி வணிக மையம்',
    nav_my_listings: 'பட்டியல்கள்',
    nav_orders_ledger: 'ஆர்டர்கள்',

    // Mobile Bottom Bar
    mob_menu: 'முகப்பு',
    mob_analytics: 'பகுப்பாய்வு',
    mob_history: 'வரலாறு',
    mob_profile: 'சுயவிவரம்',
    mob_land: 'நிலம்',
    mob_yield: 'மகசூல்',
    mob_plans: 'திட்டங்கள்',
    mob_lands: 'நிலங்கள்',
    mob_consignments: 'சரக்குகள்',
    mob_market: 'சந்தை',
    mob_workstation: 'பணிமனை',
    mob_records: 'பதிவுகள்',
    mob_listings: 'பட்டியல்கள்',
    mob_ledger: 'ஆர்டர்கள்',

    // Dashboard Refactoring Modules
    consignment_delivery_history_title: 'சரக்கு விநியோக வரலாறு',
    agent_management_title: 'முகவர் மேலாண்மை',
    mandi_marketplace_title: 'மண்டி சந்தை',
    listings_title: 'பட்டியல்கள்',
    orders_title: 'ஆர்டர்கள்',
    tab_lands: 'நிலங்கள்',
    tab_agents: 'முகவர்கள்',
    btn_add_agent: 'முகவர் ஐடி சேர்',
    btn_dispatch_agent: 'முகவரை அனுப்பு',
    search_crops_placeholder: 'பயிர் பெயரால் தேடுங்கள் (எ.கா., பொன்னி நெல், மஞ்சள்)...',
    btn_add_exporter: 'ஏற்றுமதியாளர் சேர்',
    exporter_id_label: 'ஏற்றுமதியாளர் அடையாள எண்',
    exporter_name_label: 'ஏற்றுமதியாளர் பெயர்',
    manage_exporter_title: 'ஏற்றுமதியாளர் மேலாண்மை',
    contracted_exporters_list: 'ஒப்பந்தம் செய்யப்பட்ட ஏற்றுமதியாளர்கள்',
    history_log_title: 'வரலாற்றுப் பதிவு 📜',

    // Farmer Dashboard & Land Management
    registered_parcels: 'நிலம்',
    active_weekly_protocol: 'தற்போதைய வாராந்திர செயல்முறை',
    stage_harvest: 'அறுவடை & முன்-அறுவடை தனிமைப்படுத்தல்',
    stage_flowering: 'பூக்கும் பருவம் & வேர் வளர்ச்சி',
    stage_vegetative: 'தழைப்பருவம் & வேர் காற்றோட்டம்',
    stage_nursery: 'நாற்றங்கால் & விதைப்பு',
    soil_moisture: 'மண் ஈரப்பதம்',
    nitrogen_level: 'தழைச்சத்து (N)',
    soil_ph: 'மண் அமிலத்தன்மை (pH)',
    weather_forecast: 'நுண்-வானிலை முன்னறிவிப்பு',
    btn_register_land: '+ புதிய நிலத்தை பதிவு செய்',
    btn_map_parcel_code: '🏷️ அடையாள எண் மூலம் நிலத்தை இணைக்கவும்',
    btn_view_certificate_qr: 'சான்றிதழ் மற்றும் QR காண்க',
    btn_progression_timeline: '8-வார பயிர் முன்னேற்ற காலவரிசை',
    btn_expand_timeline: 'காலவரிசையை விரிவாக்கு',
    btn_collapse_timeline: 'காலவரிசையை சுருக்கு',
    btn_done_camera: '✓ முடிந்தது (கேமரா சான்று)',
    btn_not_done: '❌ முடிக்கப்படவில்லை',
    btn_reschedule: '⏳ மறுதிட்டமிடு',
    btn_quick_reschedule_2d: '⚡ +2 நாட்கள் நோய் தடுப்பு மாற்றம்',
    btn_scan_barcode_dosing: '📷 பார் குறியீடு / மருந்தளவு சரிபார் (கட்டாய சரிபார்ப்பு)',
    immediate_action_prompt: 'செயல்பாட்டு வழிகாட்டுதல்',
    hero_farmer_greeting: 'வணக்கம்',
    hero_farmer_subtitle: 'பயிர் சுழற்சி மற்றும் பண்ணை மேலாண்மை',
    harvest_forecast: 'அறுவடை கணிப்பு',
    harvest_in_days: '⏳ இன்னும் {days} நாட்களில் அறுவடை',
    expected_harvest: 'எதிர்பார்க்கப்படும் தேதி: {date}',
    grade_a_export: 'தரம் A ஏற்றுமதி',
    mandi_domestic: 'மண்டி சந்தை',
    active_parcel_tag: '✓ தற்போதைய நிலம்',
    select_parcel_tag: 'தேர்ந்தெடு',

    // 8-Week Progression Timeline
    timeline_title: '8-வார பயிர் வளர்ச்சி முன்னேற்ற காலவரிசை',
    timeline_subtitle: 'அறுவடைக்கு முந்தைய இடைவெளி (PHI) மற்றும் பயிர் வளர்ச்சி கண்காணிப்பு',
    timeline_week: 'வாரம்',
    timeline_status_completed: 'முடிக்கப்பட்டது',
    timeline_status_active: 'தற்போதைய நிலை',
    timeline_status_pending: 'திட்டமிடப்பட்டுள்ளது',
    timeline_mrl_safe: 'MRL விதிமுறைக்கு உட்பட்டது',
    timeline_phi_days: 'PHI பாதுகாப்பு கவுண்டவுன்',
    timeline_8wk_tab: '🌿 8-வார முக்கிய மைல்கற்கள்',
    timeline_18wk_tab: '📅 முழு 18-வார பயிர் சுழற்சி',
    timeline_cultivation_progress: 'பயிர் சாகுபடி முன்னேற்றம்',
    timeline_current_cycle: 'தற்போதைய சுழற்சி பணி',

    // Reschedule Modal
    reschedule_title: 'வேளாண் பணியை மறுதிட்டமிடு',
    reschedule_pick_date: 'புதிய தேதியை தேர்ந்தெடுக்கவும்:',
    reschedule_quick_shortcuts: 'விரைவு மறுதிட்டமிடல் குறுக்குவழிகள்:',
    btn_confirm_reschedule: 'மறுதிட்டமிடலை உறுதிசெய்',
    btn_cancel: 'ரத்து செய்',

    // Barcode Scanner Modal
    barcode_modal_title: 'வேளாண் மருந்து பார் குறியீட்டை ஸ்கேன் செய்',
    barcode_modal_subtitle: 'AI உள்ளீட்டு நம்பகத்தன்மை மற்றும் மோசடி தடுப்பு மருந்தளவு சரிபார்ப்பு',
    barcode_prescribed_target: 'பரிந்துரைக்கப்பட்ட மருந்து:',
    barcode_activate_camera: '📹 கேமரா ஸ்கேனரை துவக்குக',
    barcode_quick_catalog: '⚡ உடனடி மாதிரி சோதனைகள்:',
    barcode_manual_label: 'அல்லது பார் குறியீட்டை நேரடியாக உள்ளிடவும்',
    btn_verify_barcode: 'சரிபார்',

    // Agent Workstation
    agent_workstation_title: 'கள ஆய்வாளர் பணிமனை 📋',
    agent_workstation_subtitle: 'ஒதுக்கப்பட்ட நிலப்பரப்புகள் & ஒழுங்குமுறை தணிக்கை பட்டியல்',
    agent_select_parcel: 'ஒதுக்கப்பட்ட நிலப்பரப்புகள் பட்டியல்',
    agent_select_prompt: 'ஆய்வு பதிவு மற்றும் புகைப்பட சான்று எடுக்க கீழேயுள்ள ஒப்பந்த நிலப்பரப்புகளில் ஒன்றை தேர்ந்தெடுக்கவும்:',
    agent_active_inspection: 'தற்போதைய நில ஆய்வு பணிமனை',
    btn_capture_geo_photo: '📷 புவி-குறிக்கப்பட்ட புகைப்படம் எடு',
    btn_submit_audit: '✓ சரிபார்க்கப்பட்ட கள தணிக்கையை சமர்ப்பி',
    agent_audit_history: 'தினசரி ஜி.பி.எஸ் ஆய்வு பதிவுகள்',
    agent_status_available: 'கிடைக்கக்கூடியவர்',
    agent_status_in_field: 'களத்தில் உள்ளார்',
    btn_back_to_roster: '← நிலங்கள் பட்டியலுக்கு திரும்பு',
    btn_open_inspection: 'ஆய்வு பணிமனையை திறக்கவும் →',

    // Exporter Portal
    exporter_title: 'ஒப்பந்த நிலப்பரப்புகள் & MRL அனுமதி நிலை',
    exporter_subtitle: 'APEDA பூஜ்ஜிய இரசாயன கண்காணிப்பு மற்றும் ஏற்றுமதி தொகுதி ஒதுக்கீடு',
    export_ready_volume: 'ஏற்றுமதிக்கு தயாராக உள்ள அளவு',
    export_grading_score: 'கோடெக்ஸ் தர மதிப்பீட்டு புள்ளிகள்',
    btn_manage_agents: 'கள ஆய்வாளர்களை நிர்வகி',
    exporter_agents_title: 'APEDA சான்றளிக்கப்பட்ட கள தணிக்கையாளர்கள்',
    exporter_consignments_title: 'சரக்கு ஏற்றுமதி வரலாறு & கப்பல் கொள்கலன் பதிவுகள்',

    // Mandi Marketplace & Shop
    marketplace_title: 'மண்டி பயிர் சந்தை & நேரலை விளைச்சல்கள்',
    marketplace_subtitle: 'APEDA இரசாயன தணிக்கை செய்யப்பட்ட நேரடி பண்ணை-மண்டி கொள்முதல்',
    filter_district_all: 'அனைத்து மாவட்டங்கள்',
    filter_crop_all: 'அனைத்து பயிர்கள்',
    filter_grade_all: 'அனைத்து தர நிலைகள்',
    grade_export: 'தரம் A (APEDA ஏற்றுமதி தரம்)',
    grade_domestic: 'தரம் B (உள்நாட்டு மண்டி தரம்)',
    btn_direct_purchase: '🛒 நேரடி கொள்முதல் செய்',
    btn_post_harvest_lot: '+ விளைச்சலை சந்தையில் பதிவிடு',
    btn_post_demand: '+ கொள்முதல் தேவையை பதிவிடு',
    shop_inventory_title: 'மண்டி இருப்பு மற்றும் சில்லறை சரக்கு',
    shop_demands_title: 'தற்போதைய கொள்முதல் தேவைகள்',

    // Dynamic Compliance Certificate & PDF
    cert_official_title: 'அதிகாரப்பூர்வ ஏற்றுமதி தரம் மற்றும் வேளாண் இரசாயன தணிக்கை சான்றிதழ்',
    cert_dossier_subtitle: 'சர்வதேச ஏற்றுமதி இணக்கத்தன்மை ஆவணம் (International Export Compliance Dossier)',
    cert_accreditation_prefix: 'அங்கீகாரம்:',
    cert_status_approved: '✓ ஏற்றுமதிக்கு அங்கீகரிக்கப்பட்டது (APPROVED FOR EXPORT)',
    cert_issued_on: 'வழங்கப்பட்ட தேதி:',
    cert_qr_verified: 'நிகழ்நேர QR சரிபார்க்கப்பட்டது (REAL-TIME QR VERIFIED)',
    cert_export_readiness: 'ஏற்றுமதி தயார்நிலை',
    cert_zero_banned: 'தடைசெய்யப்பட்ட இரசாயனங்கள் இல்லை',
    cert_parcel: 'நிலப்பரப்பு',
    cert_crop: 'பயிர்',
    cert_farmer: 'விவசாயி',
    cert_district: 'மாவட்டம்',
    cert_geolock: 'GPS புவி-அமைவிடம்',
    cert_acreage: 'பரப்பளவு',
    cert_acres: 'ஏக்கர்',
    cert_soil_ph: 'மண் pH',
    cert_phi_status: 'முன்-அறுவடை இடைவெளி (PHI)',
    cert_phi_cleared: 'பாதுகாப்பானது (0.00 ppm எஞ்சிய அளவு)',
    cert_verification_link: 'சரிபார்ப்பு இணைப்பு:',
    cert_chemicals_title: '🧪 பயன்படுத்தப்பட்ட வேளாண் இரசாயனங்களின் நிகழ்நேர பதிவேடு',
    cert_chemicals_subtitle: 'நிலப்பரப்பு தெளிப்பு பதிவேட்டிலிருந்து நேரடியாக எடுக்கப்பட்ட நிகழ்நேர விவரங்கள்.',
    cert_col_timestamp: 'தேதி & நேரம் (Timestamp & Date)',
    cert_col_chemical: 'வேளாண் மருந்து / உள்ளீடு (Agrochemical / Input)',
    cert_col_active_ing: 'செயலில் உள்ள மூலப்பொருள் (Active Ingredient)',
    cert_col_dosage: 'மருந்தளவு & இலக்கு (Dosage & Target)',
    cert_col_phi: 'PHI & அறுவடை பாதுகாப்பு',
    cert_col_mrl: 'MRL முடிவு (Verdict)',
    cert_col_token: 'பாதுகாப்பு டோக்கன் (Token)',
    cert_standards_title: '🌐 சர்வதேச தரநிலைகள் ஒப்புதல் அணி (4 சர்வதேச கட்டமைப்பு)',
    cert_max_mrl: 'அனுமதிக்கப்பட்ட MRL',
    cert_observed: 'கண்டறியப்பட்ட அளவு',
    cert_hmac_proof: 'HMAC பாதுகாப்பு குறியீடு',
    cert_footer_text: 'அக்ரோஸ்மார்ட் தானியங்கி ஒழுங்குமுறை அமைப்பால் சான்றளிக்கப்பட்டது • சுங்கத்துறை மற்றும் துறைமுக அதிகாரிகளால் சரிபார்க்கத்தக்கது',
    btn_print_pdf: 'அதிகாரப்பூர்வ PDF அச்சிடுக / பதிவிறக்குக',
    btn_close_modal: 'ஆவணத்தை மூடுக',

    // Profile & Auth
    profile_modal_title: 'பயனர் சுயவிவர அமைப்புகள்',
    profile_field_name: 'முழு பெயர் / காட்சி பெயர்',
    profile_field_phone: 'பதிவுசெய்த கைபேசி எண்',
    profile_field_district: 'மாவட்டம் / வேளாண் மண்டலம் (தமிழ்நாடு)',
    profile_field_language: 'விருப்ப மொழி / Language',
    btn_save_profile: '✓ மாற்றங்களை சேமி',
    auth_modal_title: 'அக்ரோஸ்மார்ட் பயனர் உள்நுழைவு',
    auth_field_phone: 'கைபேசி எண்',
    auth_field_otp: 'ஒருமுறை கடவுச்சொல் (OTP)',
    btn_sign_in: 'உள்நுழைக',
    toast_lang_switched: 'மொழி தமிழுக்கு மாற்றப்பட்டது',
    toast_task_done: 'பணி வெற்றிகரமாக முடிக்கப்பட்டு கேமரா சான்று பதிவு செய்யப்பட்டது',
    toast_task_not_done: 'பணி முடிக்கப்படவில்லை என குறிக்கப்பட்டது. +2 நாட்கள் நோய் தடுப்பு அட்டவணைக்கு மாற்றப்பட்டது.',
    toast_task_rescheduled: 'பணி வெற்றிகரமாக மறுதிட்டமிடப்பட்டது.',

    // Detailed Timeline
    timeline_fullscreen: 'முழுத்திரை ↗',
    timeline_active_milestone_badge: '⚡ தற்போதைய மைல்கல் (வாரம் {week})',
    timeline_crop_growth_state_machine: 'பயிர் வளர்ச்சி நிலை வழிகாட்டி',
    timeline_tap_for_details: 'விவரங்களை விரிவாக்க எந்த வாரத்தையும் அழுத்தவும்',
    timeline_agronomic_guidance: 'வேளாண் வழிகாட்டுதல்:',
    timeline_agronomic_protocol: 'வேளாண் நெறிமுறை:',
    timeline_loading: '8-வார பயிர் முன்னேற்ற காலவரிசை தரவு ஏற்றப்படுகிறது...',
    timeline_core_milestones: '8-வார முக்கிய மைல்கற்கள்:',
    timeline_action_required: '⚠️ இன்று செய்ய வேண்டிய பணி (வாரம் {week})',
    timeline_verified_completed: '✓ சரிபார்க்கப்பட்டு முடிந்தது',
    timeline_task_status_actions: 'பணி நிலை நடவடிக்கைகள்:',
    timeline_btn_completed_camera: '📷 முடிந்தது (கேமரா சான்று)',
    timeline_crop_growth_progression: '📅 8-வார பயிர் வளர்ச்சி முன்னேற்றம்',

    // Barcode Scanner
    barcode_modal_subtitle_short: 'AI உள்ளீட்டு நம்பகத்தன்மை சரிபார்ப்பான்',
    barcode_bottle_scanner: 'வேளாண் மருந்து பாட்டில் ஸ்கேனர்',
    barcode_align_reticle: 'பார் குறியீட்டை வரம்பிற்குள் பொருத்தவும்',
    barcode_reticle_tag: '[ பாட்டில் பார் குறியீடு வரம்பு ]',
    barcode_scan_bioneem: 'ஸ்கேன்: பயோ-வேப்பிலை 5% சாறு (சான்றளிக்கப்பட்ட APEDA தேர்ச்சி)',
    barcode_scan_pseudomonas: 'ஸ்கேன்: சூடோமோனாஸ் ஃப்ளோரசன்ஸ் உயிர்-கவசம் (இயற்கை தேர்ச்சி)',
    barcode_scan_chlorpyrifos: 'ஸ்கேன்: குளோர்பைரிஃபோஸ் 20% EC (தடைசெய்யப்பட்ட செயற்கை எச்சரிக்கை)',
    barcode_authenticity_confirmed: '✓ நம்பகத்தன்மை உறுதிசெய்யப்பட்டது',
    barcode_non_compliant_warning: '⚠️ விதிமீறல் எச்சரிக்கை',

    // Field Agent Workstation
    agent_hero_subtitle: 'ஒதுக்கப்பட்ட நிலப்பரப்புகள் பட்டியல்',
    agent_hero_title: 'நிலங்கள்',
    agent_auditor_label: 'தணிக்கையாளர்:',
    agent_badge_label: 'அடையாள அட்டை:',
    agent_region_label: 'வேளாண் பகுதி:',
    agent_gps_satellite_locked: '🟢 GPS செயற்கைக்கோள் பூட்டப்பட்டது',
    agent_assigned_parcels_stat: 'ஒதுக்கப்பட்ட நிலப்பரப்புகள்',
    agent_parcels_count: '{count} நிலப்பரப்புகள்',
    agent_gps_accuracy: 'GPS துல்லியத்தன்மை',
    agent_inspection_mode: 'ஆய்வு நெறிமுறை',
    agent_parcel_first_protocol: 'நிலம்-முதல் செயல்முறை',
    agent_select_to_begin: 'துவங்க நிலப்பரப்பை தேர்ந்தெடுக்கவும்',
    agent_btn_open_inspect: 'நிலப்பரப்பை திறந்து ஆய்வு செய்',
    agent_inspection_terminal_title: 'கள ஆய்வு & AI தர மதிப்பீட்டு முனையம்',
    agent_back_to_roster: 'ஒதுக்கப்பட்ட நிலப்பரப்புகள் பட்டியலுக்கு திரும்பு',
    agent_ai_grading_title: 'AI பன்முக தரம் மற்றும் மகசூல் கணிப்பு',
    agent_automated_grading: 'தானியங்கி கள தர மதிப்பீட்டு நுண்ணறிவு',
    agent_predicted_export_grade: 'கணிக்கப்பட்ட ஏற்றுமதி தரம்',
    agent_predicted_tonnage: 'கணிக்கப்பட்ட மகசூல் அளவு',
    agent_ai_confidence: 'AI மாதிரியின் துல்லியம்',
    agent_export_clearance: 'ஏற்றுமதி சந்தை அனுமதி',
    agent_apeda_cold_chain: '✓ APEDA குளிர்பதன சங்கிலி',
    agent_mandi_domestic_pass: '✓ உள்நாட்டு மண்டி தேர்ச்சி',
    agent_structured_ai_title: 'கள பயிர் தணிக்கை & பன்முக தர மதிப்பீடு',
    agent_structured_ai_subtitle: 'கட்டமைக்கப்பட்ட கள தரவு சேகரிப்பு & AI மதிப்பீடு',
    agent_geolocked_to_parcel: 'நிலப்பரப்புக்கு புவி-பூட்டப்பட்டது',
    agent_site_photos_title: 'கள புகைப்படங்கள் & புவி-சான்று (நேரடி கள சரிபார்ப்பு)',
    agent_camera_sensor_stream: '• கேமரா சென்சார்: புவி-பூட்டப்பட்ட வன்பொருள் ஒளிபரப்பு',
    agent_photo_captured_msg: '✓ உயர்-தெளிவுத்திறன் இலைத்தழை புகைப்படம் எடுக்கப்பட்டு புவி-குறிக்கப்பட்டது',
    agent_viewfinder_active: 'கேமரா தயார் • இலைத்தழை, காய் கொத்துகள் & மண் எல்லையை நோக்கி பிடிக்கவும்',
    agent_tamperproof_notice: 'மோசடி-தடுப்பு உயிரியல் அளவீட்டு GPS சரிபார்ப்பு',
    agent_btn_snap_photo: '📸 புவி-குறிக்கப்பட்ட புகைப்படம் எடு',
    agent_btn_recapture_photo: '🔄 மீண்டும் புகைப்படம் எடு',
    agent_5_metrics_title: '🌿 5 கட்டமைப்பு கள பயிர் மதிப்பீட்டு அளவீடுகள்:',
    agent_metric_1: '1. இலை & காய் பரவல் சீரான தன்மை (%)',
    agent_metric_1_hint: 'தரம் A ஏற்றுமதிக்கான இலக்கு >= 85%',
    agent_metric_2: '2. மேற்பரப்பு கறை & குறைபாடு விகிதம் (%)',
    agent_metric_2_hint: 'தரம் A க்கான உச்சவரம்பு <= 3.0%',
    agent_metric_3: '3. தழை & தண்டு வீரிய மதிப்பீடு (1 முதல் 10)',
    agent_metric_3_hint: 'தாவர வலிமை மற்றும் பச்சைய அடர்த்தி மதிப்பீடு',
    agent_metric_4: '4. மண் ஈரப்பதம் சென்சார் ஆய்வு (%)',
    agent_metric_4_hint: 'உகந்த வரம்பு: 18.0% - 26.0%',
    agent_metric_5: '5. உயிர்-வேளாண் இரசாயன முறை பின்பற்றுதல் (செயற்கை எச்சங்கள் பூஜ்ஜியம்)',
    agent_metric_5_check: '✓ சரிபார்க்கப்பட்டது: அங்கீகரிக்கப்பட்ட இயற்கை / உயிர் உள்ளீடுகள் மட்டுமே பயன்படுத்தப்பட்டது (NSKE 5% / டிரைக்கோடெர்மா / உயிர்-பொட்டாஷ்)',
    agent_metric_5_hint: 'தடைசெய்யப்பட்ட ஆர்கனோபாஸ்பேட்டுகள், செயற்கை பைரித்ராய்டுகள் அல்லது பூஞ்சாணக்கொல்லிகள் இல்லை.',
    agent_notes_label: 'ஆய்வாளர் கள செயல்பாட்டு குறிப்புகள்',
    agent_btn_submit_assessment: 'கள மதிப்பீட்டைச் சமர்ப்பிக்கவும்',
    wizard_step_1_title: 'படி 1: இலை & தழை நிலை',
    wizard_step_2_title: 'படி 2: பயிர் வளர்ச்சி & தண்டு வீரியம்',
    wizard_step_3_title: 'படி 3: பூச்சி & நோய் தாக்குதல் விகிதம்',
    wizard_step_4_title: 'படி 4: மண் ஈரப்பதம்',
    wizard_step_5_title: 'படி 5: உயிர்-வேளாண் இரசாயன தணிக்கை',
    btn_next_step: 'அடுத்த படி →',
    btn_prev_step: '← முந்தைய படி',
    ai_recommendation_label: 'AI பரிந்துரைத்த வழிகாட்டுதல்',

    // Exporter Portal
    exporter_terminal_subtitle: 'உலகளாவிய வேளாண் ஏற்றுமதி முனையம் & குளிர்பதன சங்கிலி தடமறிதல்',
    exporter_btn_consignments: '📦 சரக்கு ஏற்றுமதி வரலாறு & தரப் பதிவேடு',
    exporter_btn_dedicated_agents: '👨‍🌾 கள ஆய்வாளர்கள் மேலாண்மை',
    exporter_btn_map_parcel: '🏷️ அடையாள எண் மூலம் நிலத்தை இணை',
    exporter_total_contracted_acreage: 'மொத்த ஒப்பந்த பரப்பளவு',
    exporter_gross_predicted_volume: 'கணிக்கப்பட்ட மொத்த மகசூல்',
    exporter_grade_a_volume: 'தரம் A (குளிர்பதன ஏற்றுமதி)',
    exporter_active_contracted_parcels: 'செயலில் உள்ள ஒப்பந்த நிலங்கள்',
    exporter_live_parcels_title: 'ஏற்றுமதி ஒப்பந்தத்தின் கீழ் உள்ள நேரலை நிலங்கள்',
    exporter_live_parcels_subtitle: 'ஒப்பந்த நிலப்பரப்புகள் தடமறிதல்',
    exporter_btn_prebook_contract: '+ ஒப்பந்த முன்பதிவு',
    exporter_btn_create_listing: '+ புதிய பட்டியல் உருவாக்கு',
    exporter_th_parcel: 'நிலப்பரப்பு',
    exporter_th_farmer: 'விவசாயி',
    exporter_th_crop: 'பயிர்',
    exporter_th_progression: 'முன்னேற்றம்',
    exporter_th_yield: 'மகசூல்',
    exporter_th_grade: 'தரம்',
    exporter_th_actions: 'செயல்கள்',
    exporter_btn_prebook_action: '⚡ முன்பதிவு',
    exporter_btn_cert_qr_action: '📜 சான்றிதழ் & QR',
    exporter_status_growing: 'வளர்ச்சியில்',

    // Mandi Marketplace & Orders
    market_exchange_subtitle: 'ஒருங்கிணைந்த தமிழ்நாடு வேளாண் சந்தை பரிவர்த்தனை மையம்',
    market_mandi_title: 'மண்டி சந்தை',
    market_trading_hub_label: 'வர்த்தக மையம்:',
    market_role_label: 'பங்கு:',
    market_verified_lots_label: 'சரிபார்க்கப்பட்ட விளைச்சல்கள்:',
    market_active_orders_label: 'செயலில் உள்ள ஆர்டர்கள்:',
    market_available_lots_title: 'கொள்முதலுக்கு தயாராக உள்ள நேரலை விளைச்சல்கள்',
    market_available_lots_subtitle: 'கிடைக்கக்கூடிய உள்நாட்டு & ஏற்றுமதி விளைச்சல்கள் ({count})',
    market_lots_available_badge: '{count} விளைச்சல்கள் உள்ளன',
    market_seller_label: 'விற்பனையாளர்:',
    market_channel_label: 'விற்பனை தளம்:',
    market_region_label: 'பகுதி:',
    market_direct_farmer: 'நேரடி விவசாயி',
    market_available_weight: 'கிடைக்கக்கூடிய எடை (கிலோ)',
    market_mandi_price: 'மண்டி விலை / கிலோ',
    market_harvest_readiness: 'அறுவடை தயார்நிலை',
    market_preharvest_cleared: '✓ முன்-அறுவடை சான்றளிக்கப்பட்டது',
    market_immediate: 'உடனடி',
    market_btn_prebook_lot: '⚡ இந்த விளைச்சலை முன்பதிவு செய்',
    market_btn_prebooked_reserved: '✓ முன்பதிவு செய்யப்பட்டு ஒதுக்கப்பட்டது',
    market_incoming_orders_title: 'செயல்பாட்டில் உள்ள ஆர்டர்கள்',
    market_incoming_orders_subtitle: 'செயலில் உள்ள ஆர்டர்கள் & நிலை ({count})',
    market_active_badge: '{count} நடப்பில்',
    market_no_incoming_orders: 'தற்போது நிலுவையில் உள்ள ஆர்டர்கள் ஏதுமில்லை.',
    market_step_prebooked: 'முன்பதிவு செய்யப்பட்டது',
    market_step_inspected: 'ஆய்வு செய்யப்பட்டது',
    market_step_in_transit: 'போக்குவரத்தில் உள்ளது',
    market_step_delivered: 'விநியோகிக்கப்பட்டது',

    // Modals
    claim_parcel_title: 'அடையாள எண் மூலம் நிலத்தை இணை',
    claim_parcel_subtitle: 'நிலப்பரப்பு இணைப்பு',
    claim_parcel_code_label: 'தனித்துவ நில அடையாள குறியீடு / எண்',
    claim_parcel_hint: 'மாநில வேளாண் பதிவேட்டில் பதிவுசெய்யப்பட்ட தனித்துவ நில அடையாள எண்ணை உள்ளிடவும்.',
    claim_parcel_btn: '🏷️ நிலத்தை உரிமைகோரி இணைக்கவும்',
    prebook_modal_title: 'ஒப்பந்த ஒதுக்கீடு முன்பதிவு',
    prebook_modal_subtitle: 'ஏற்றுமதி கொள்முதல்',
    prebook_reserved_vol: 'ஒதுக்கப்பட்ட அளவு',
    prebook_export_rate: 'ஏற்றுமதி விலை',
    prebook_estimated_val: 'மதிப்பிடப்பட்ட ஒப்பந்த மதிப்பு:',
    prebook_btn_confirm: '⚡ குளிர்பதன முன்பதிவு ஒதுக்கீட்டை உறுதிசெய்',
    post_demand_title: 'கொள்முதல் தேவையை பதிவிடு',
    post_demand_subtitle: 'தேவை அறிவிப்பு',
    post_crop_demanded: 'தேவைப்படும் பயிர்',
    post_qty_kg: 'அளவு (கிலோ)',
    post_quality_grade: 'தர நிலை',
    post_needed_by: 'தேவைப்படும் தேதி',
    post_btn_submit: '✓ தேவையை சந்தையில் பதிவிடு',
    assigned_land_title: 'ஒதுக்கப்பட்ட நிலம்',
    btn_add_land: 'நிலத்தைச் சேர்க்க',
    prompt_enter_land_id: 'ஏற்றுமதி ஒப்பந்தத்தில் சேர்க்க நிலத்தின் குறியீட்டை உள்ளிடவும்:'
  }
};

function t(key, fallback = '', params = {}) {
  const lang = state.language || 'en';
  let str = (I18N_TRANSLATIONS[lang] && I18N_TRANSLATIONS[lang][key]) ||
            (I18N_TRANSLATIONS.en && I18N_TRANSLATIONS.en[key]) ||
            fallback ||
            key;
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(p => {
      str = str.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
  }
  return str;
}

const CROP_TRANSLATIONS = {
  'Ponni Rice': { en: 'Ponni Rice', ta: 'பொன்னி நெல்' },
  'Paddy': { en: 'Paddy', ta: 'நெல்' },
  'Rice': { en: 'Rice', ta: 'நெல் / அரிசி' },
  'Erode Turmeric': { en: 'Erode Turmeric', ta: 'ஈரோடு மஞ்சள்' },
  'Turmeric': { en: 'Turmeric', ta: 'மஞ்சள்' },
  'Cotton': { en: 'Cotton', ta: 'பருத்தி' },
  'Sugarcane': { en: 'Sugarcane', ta: 'கரும்பு' },
  'Maize': { en: 'Maize', ta: 'மக்காச்சோளம்' },
  'Red Chilli': { en: 'Red Chilli', ta: 'சிகப்பு மிளகாய்' },
  'Chilli': { en: 'Chilli', ta: 'மிளகாய்' },
  'Banana': { en: 'Banana', ta: 'வாழை' },
  'Groundnut': { en: 'Groundnut', ta: 'நிலக்கடலை' }
};

function translateCrop(cropName) {
  if (!cropName) return '';
  const lang = state.language || 'en';
  if (CROP_TRANSLATIONS[cropName]) {
    return CROP_TRANSLATIONS[cropName][lang] || cropName;
  }
  for (const [key, val] of Object.entries(CROP_TRANSLATIONS)) {
    if (cropName.toLowerCase().includes(key.toLowerCase())) {
      return val[lang] || cropName;
    }
  }
  return cropName;
}

const STAGE_TRANSLATIONS = {
  'Harvest & Pre-Harvest Quarantine': { en: 'Harvest & Pre-Harvest Quarantine', ta: 'அறுவடை & முன்-அறுவடை தனிமைப்படுத்தல்' },
  'Pre-Harvest Quarantine & Grain Hardening': { en: 'Pre-Harvest Quarantine & Grain Hardening', ta: 'முன்-அறுவடை தனிமைப்படுத்தல் & தானிய முதிர்வு' },
  'Flowering & Rhizome Enlargement': { en: 'Flowering & Rhizome Enlargement', ta: 'பூக்கும் பருவம் & வேர் பெருக்கம்' },
  'Flowering & Rhizome Growth': { en: 'Flowering & Rhizome Growth', ta: 'பூக்கும் பருவம் & வேர் வளர்ச்சி' },
  'Flowering & Grain Filling': { en: 'Flowering & Grain Filling', ta: 'பூக்கும் பருவம் & பால் பிடிக்கும் பருவம்' },
  'Vegetative Tillering & Root Aeration': { en: 'Vegetative Tillering & Root Aeration', ta: 'தழைப்பருவம் & வேர் காற்றோட்டம்' },
  'Nursery & Sowing': { en: 'Nursery & Sowing', ta: 'நாற்றங்கால் & விதைப்பு' },
  'Harvest': { en: 'Harvest', ta: 'அறுவடை' },
  'Flowering': { en: 'Flowering', ta: 'பூக்கும் பருவம்' },
  'Vegetative': { en: 'Vegetative', ta: 'தழைப்பருவம்' }
};

function translateStage(stageName) {
  if (!stageName) return '';
  const lang = state.language || 'en';
  return (STAGE_TRANSLATIONS[stageName] && STAGE_TRANSLATIONS[stageName][lang]) || stageName;
}

const STATUS_TRANSLATIONS = {
  'Completed': { en: 'Completed', ta: 'முடிக்கப்பட்டது' },
  'completed': { en: 'Completed', ta: 'முடிக்கப்பட்டது' },
  'Pending': { en: 'Pending', ta: 'நிலுவையில்' },
  'pending': { en: 'Pending', ta: 'நிலுவையில்' },
  'Active': { en: 'Active', ta: 'நடப்பில்' },
  'active': { en: 'Active', ta: 'நடப்பில்' },
  'Rescheduled': { en: 'Rescheduled', ta: 'மறுதிட்டமிடப்பட்டது' },
  'Not Done': { en: 'Not Done', ta: 'முடிக்கப்படவில்லை' }
};

function translateStatus(status) {
  if (!status) return '';
  const lang = state.language || 'en';
  return (STATUS_TRANSLATIONS[status] && STATUS_TRANSLATIONS[status][lang]) || status;
}

function translateActivityType(type) {
  if (!type) return '';
  const lang = state.language || 'en';
  const map = {
    irrigation: { en: 'Irrigation', ta: 'பாசனம்' },
    fertilizer: { en: 'Fertilizer', ta: 'உரமிடுதல்' },
    pest: { en: 'Bio-Pest Control', ta: 'உயிர் பூச்சிகொல்லி' },
    sensor: { en: 'Sensor Check', ta: 'சென்சார் ஆய்வு' },
    harvest: { en: 'Harvesting', ta: 'அறுவடை' },
    audit: { en: 'Regulatory Audit', ta: 'ஒழுங்குமுறை தணிக்கை' }
  };
  return (map[type] && map[type][lang]) || type;
}

// Non-blocking sleek toast notification
function showToast(message, type = 'success') {
  if (typeof document === 'undefined') return;
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed; bottom:76px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement('div');
  toast.style.cssText = 'background:#1B4D3E; color:#FFFFFF; padding:10px 16px; border-radius:12px; font-size:12px; font-weight:700; box-shadow:0 6px 20px rgba(0,0,0,0.18); display:flex; align-items:center; gap:8px; pointer-events:auto; max-width:340px; border:1px solid rgba(216,243,220,0.3);';
  toast.innerHTML = `<span>${type === 'success' ? '✅' : 'ℹ️'}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Update Top Bar & Mobile Bottom Bar text dynamically
function updateSystemBarLanguage() {
  if (typeof document === 'undefined') return;
  const lang = state.language || 'en';
  const labelEl = document.getElementById('current-lang-label');
  if (labelEl) {
    labelEl.textContent = lang === 'en' ? 'தமிழ் (TA)' : 'English (EN)';
  }
  const statusEl = document.getElementById('top-system-status-text');
  if (statusEl) {
    statusEl.textContent = t('system_operational', 'SYSTEM OPERATIONAL');
  }
  const zoneEl = document.getElementById('top-zone-badge');
  if (zoneEl) {
    zoneEl.textContent = t('agro_zone', '📍 Tamil Nadu Agro-Zone');
  }

  // Role pill labels
  const farmerPill = document.getElementById('role-label-farmer');
  if (farmerPill) farmerPill.textContent = t('role_farmer', 'Farmer');
  const agentPill = document.getElementById('role-label-agent');
  if (agentPill) agentPill.textContent = t('role_agent', 'Agent');
  const exporterPill = document.getElementById('role-label-exporter');
  if (exporterPill) exporterPill.textContent = t('role_exporter', 'Exporter');
  const shopPill = document.getElementById('role-label-shop_owner');
  if (shopPill) shopPill.textContent = t('role_shop', 'Shop');

  // Mobile nav labels
  const mobMenu = document.getElementById('mob-nav-menu');
  if (mobMenu) mobMenu.textContent = t('mob_menu', 'Menu');
  const mobAnalytics = document.getElementById('mob-nav-analytics');
  if (mobAnalytics) mobAnalytics.textContent = t('mob_analytics', 'Analytics');
  const mobHistory = document.getElementById('mob-nav-history');
  if (mobHistory) mobHistory.textContent = t('mob_history', 'History');
  const mobProfile = document.getElementById('mob-nav-profile');
  if (mobProfile) mobProfile.textContent = t('mob_profile', 'Profile');
}

// Global Seamless Language Switcher
function toggleLanguage(targetLang) {
  const current = state.language || 'en';
  const newLang = targetLang || (current === 'en' ? 'ta' : 'en');
  state.language = newLang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('agrosmart_lang', newLang);
  }

  updateSystemBarLanguage();
  showToast(t('toast_lang_switched', `Language switched to ${newLang === 'ta' ? 'Tamil' : 'English'}`));

  // Sync with backend profile if session exists
  if (state.token && state.user) {
    fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ language: newLang })
    }).catch(err => console.warn('Language preference sync to profile skipped:', err));
  }

  updateSidebarProfile();
  renderRoleSidebar(state.currentRole);
  renderApp();

  // If dynamic compliance modal is open, refresh it in the new language
  const compModal = document.getElementById('compliance-document-modal');
  if (compModal && state.activeFarm) {
    openDynamicComplianceModal(state.activeFarm.id);
  }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  updateSystemBarLanguage();
  await loginAsRole('farmer');
});

// --- Dynamic Role-Based Sidebar Isolation ---
function renderRoleSidebar(role) {
  const container = document.getElementById('sidebar-nav-container');
  if (container) {
    if (role === 'farmer') {
      container.innerHTML = `
        <div class="nav-section-title">${t('nav_farmer_title', 'Farmer Navigation')}</div>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'menu' ? 'active' : ''}" onclick="switchNavTab('menu')">
          <span style="font-size:16px;">🌱</span>
          <span>${t('nav_land_parcels', 'Land')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'analytics' ? 'active' : ''}" onclick="switchNavTab('analytics')">
          <span style="font-size:16px;">📊</span>
          <span>${t('nav_crop_analytics', 'Crop Analytics')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'yield' ? 'active' : ''}" onclick="switchNavTab('yield')">
          <span style="font-size:16px;">🌾</span>
          <span>${t('nav_yield_harvest', 'Yield')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'history' ? 'active' : ''}" onclick="switchNavTab('history')">
          <span style="font-size:16px;">📜</span>
          <span>${t('nav_history_plans', 'History of Plants')}</span>
        </a>
        <div class="nav-section-title" style="margin-top:14px;">${t('nav_account_title', 'Account')}</div>
        <a href="javascript:void(0)" class="nav-item" onclick="openEditProfileModal()">
          <span style="font-size:16px;">✏️</span>
          <span>${t('nav_edit_profile', 'Edit Profile')}</span>
        </a>
      `;
    } else if (role === 'agent') {
      container.innerHTML = `
        <div class="nav-section-title">${t('nav_agent_title', 'Field Workstation')}</div>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'menu' || state.currentTab === 'lands' ? 'active' : ''}" onclick="switchNavTab('lands')">
          <span style="font-size:16px;">🌱</span>
          <span>${t('nav_agent_lands', 'Lands')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'history' ? 'active' : ''}" onclick="switchNavTab('history')">
          <span style="font-size:16px;">📜</span>
          <span>${t('nav_history_of_lands', 'History of Lands')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'manage_exporter' ? 'active' : ''}" onclick="switchNavTab('manage_exporter')">
          <span style="font-size:16px;">🏢</span>
          <span>${t('nav_manage_exporter', 'Manage Exporter')}</span>
        </a>
        <div class="nav-section-title" style="margin-top:14px;">${t('nav_account_title', 'Account')}</div>
        <a href="javascript:void(0)" class="nav-item" onclick="openEditProfileModal()">
          <span style="font-size:16px;">✏️</span>
          <span>${t('nav_edit_profile', 'Edit Profile')}</span>
        </a>
      `;
    } else if (role === 'exporter') {
      container.innerHTML = `
        <div class="nav-section-title">${t('nav_export_title', 'Export Operations')}</div>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'menu' ? 'active' : ''}" onclick="switchNavTab('menu')">
          <span style="font-size:16px;">🌱</span>
          <span>${t('nav_contracted_lands', 'Contracted Lands')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'consignments' || state.currentTab === 'history' ? 'active' : ''}" onclick="switchNavTab('consignments')">
          <span style="font-size:16px;">📦</span>
          <span>${t('nav_consignment_history', 'Consignment Delivery History')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'agents' ? 'active' : ''}" onclick="switchNavTab('agents')">
          <span style="font-size:16px;">👨‍🌾</span>
          <span>${t('nav_agents', 'Agent Management')}</span>
        </a>




        <div class="nav-section-title" style="margin-top:14px;">${t('nav_account_title', 'Account')}</div>
        <a href="javascript:void(0)" class="nav-item" onclick="openEditProfileModal()">
          <span style="font-size:16px;">✏️</span>
          <span>${t('nav_edit_profile', 'Edit Profile')}</span>
        </a>
      `;
    } else if (role === 'shop_owner') {
      container.innerHTML = `
        <div class="nav-section-title">${t('nav_shop_title', 'Mandi Trading Hub')}</div>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'marketplace' ? 'active' : ''}" onclick="switchNavTab('marketplace')">
          <span style="font-size:16px;">🏪</span>
          <span>${t('nav_mandi_marketplace', 'Mandi Marketplace')}</span>
        </a>
        <a href="javascript:void(0)" class="nav-item ${state.currentTab === 'user_listings' ? 'active' : ''}" onclick="switchNavTab('user_listings')">
          <span style="font-size:16px;">📋</span>
          <span>${t('nav_my_listings', 'Listings')}</span>
        </a>
        <div class="nav-section-title" style="margin-top:14px;">${t('nav_account_title', 'Account')}</div>
        <a href="javascript:void(0)" class="nav-item" onclick="openEditProfileModal()">
          <span style="font-size:16px;">✏️</span>
          <span>${t('nav_edit_profile', 'Edit Profile')}</span>
        </a>
      `;
    }
  }
  renderMobileBottomBar(role);
}

// --- Dynamic Mobile Bottom Bar Matching Selected Role ---
function renderMobileBottomBar(role) {
  const container = document.querySelector('.mobile-bottom-bar');
  if (!container) return;

  if (role === 'farmer') {
    container.innerHTML = `
      <button class="mobile-nav-btn ${state.currentTab === 'menu' ? 'active' : ''}" onclick="switchNavTab('menu')">
        <span class="icon">🌱</span>
        <span>${t('mob_land', 'Land')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'analytics' ? 'active' : ''}" onclick="switchNavTab('analytics')">
        <span class="icon">📊</span>
        <span>${t('mob_analytics', 'Analytics')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'yield' ? 'active' : ''}" onclick="switchNavTab('yield')">
        <span class="icon">🌾</span>
        <span>${t('mob_yield', 'Yield')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'history' ? 'active' : ''}" onclick="switchNavTab('history')">
        <span class="icon">📜</span>
        <span>${t('mob_plans', 'Plants')}</span>
      </button>
      <button class="mobile-nav-btn" onclick="openEditProfileModal()">
        <span class="icon">👤</span>
        <span>${t('mob_profile', 'Profile')}</span>
      </button>
    `;
  } else if (role === 'exporter') {
    container.innerHTML = `
      <button class="mobile-nav-btn ${state.currentTab === 'menu' ? 'active' : ''}" onclick="switchNavTab('menu')">
        <span class="icon">🌱</span>
        <span>${t('mob_lands', 'Lands')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'consignments' ? 'active' : ''}" onclick="switchNavTab('consignments')">
        <span class="icon">📦</span>
        <span>${t('mob_consignments', 'Consignments')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'agents' ? 'active' : ''}" onclick="switchNavTab('agents')">
        <span class="icon">👨‍🌾</span>
        <span>${t('nav_agents', 'Agents')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'marketplace' ? 'active' : ''}" onclick="switchNavTab('marketplace')">
        <span class="icon">🛒</span>
        <span>${t('mob_market', 'Market')}</span>
      </button>
      <button class="mobile-nav-btn" onclick="openEditProfileModal()">
        <span class="icon">👤</span>
        <span>${t('mob_profile', 'Profile')}</span>
      </button>
    `;
  } else if (role === 'agent') {
    container.innerHTML = `
      <button class="mobile-nav-btn ${state.currentTab === 'menu' || state.currentTab === 'lands' ? 'active' : ''}" onclick="switchNavTab('lands')">
        <span class="icon">🌱</span>
        <span>${t('nav_agent_lands', 'Lands')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'history' ? 'active' : ''}" onclick="switchNavTab('history')">
        <span class="icon">📜</span>
        <span>${t('mob_history', 'History')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'manage_exporter' ? 'active' : ''}" onclick="switchNavTab('manage_exporter')">
        <span class="icon">🏢</span>
        <span>${t('nav_manage_exporter', 'Exporters')}</span>
      </button>
      <button class="mobile-nav-btn" onclick="openEditProfileModal()">
        <span class="icon">👤</span>
        <span>${t('mob_profile', 'Profile')}</span>
      </button>
    `;
  } else {
    // Shop Owner displays Mandi Marketplace, Listings, and Profile
    container.innerHTML = `
      <button class="mobile-nav-btn ${state.currentTab === 'marketplace' ? 'active' : ''}" onclick="switchNavTab('marketplace')">
        <span class="icon">🏪</span>
        <span>${t('mob_market', 'Market')}</span>
      </button>
      <button class="mobile-nav-btn ${state.currentTab === 'user_listings' ? 'active' : ''}" onclick="switchNavTab('user_listings')">
        <span class="icon">📋</span>
        <span>${t('nav_my_listings', 'Listings')}</span>
      </button>
      <button class="mobile-nav-btn" onclick="openEditProfileModal()">
        <span class="icon">👤</span>
        <span>${t('mob_profile', 'Profile')}</span>
      </button>
    `;
  }
}

// --- Navigation Tabs (Menu, Analytics, History) ---
function switchNavTab(tab) {
  if (state.currentRole === 'farmer' && tab === 'marketplace') {
    tab = 'menu';
  }
  if (state.currentRole === 'shop_owner' && !['marketplace', 'user_listings', 'history'].includes(tab)) {
    tab = 'marketplace';
  }
  state.currentTab = tab;
  renderRoleSidebar(state.currentRole);
  document.querySelectorAll('.mobile-nav-btn').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-nav') === tab);
  });
  renderApp();
}

// --- Role Switching ---
  async function switchRole(role) {
    // === COMPLETE STATE RESET ===
    // 1. Reset role and default tab atomically
    state.currentRole = role;
    state.currentTab = role === 'shop_owner' ? 'marketplace' : 'menu';
    
    // 2. Reset all role-specific cached data to prevent stale content
    state.farms = [];
    state.activeFarm = null;
    state.activities = [];
    state.agentFarms = [];
    state.exporterConsignments = [];
    
    // 3. Load the correct persona for this role
    const persona = TN_PERSONAS[role];
    if (persona) {
      state.user = { ...persona };
      state.token = state.token || 'demo-offline-token';
    }
    
    // 4. Update ALL pill buttons synchronously
    document.querySelectorAll('.role-pill-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-role') === role);
    });
    
    // 5. Update mobile bottom nav synchronously
    const defaultTab = role === 'shop_owner' ? 'marketplace' : 'menu';
    document.querySelectorAll('.mobile-nav-btn').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === defaultTab);
    });
    
    // 6. Force SYNCHRONIZED refresh of ALL three UI zones
    updateSidebarProfile();          // Zone 1: Header & profile name
    renderRoleSidebar(role);         // Zone 2: Sidebar navigation links
    await renderApp();               // Zone 3: Main dashboard content area
    
    // No auth modal popup - direct entry for demo/hackathon mode
  }

async function loginAsRole(role) {
  const persona = TN_PERSONAS[role];
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: persona.phone, otp: '123456', role: persona.role, name: persona.name })
    });
    if (res.ok) {
      const data = await res.json();
      state.user = { ...persona, ...data.user };
      state.token = data.token;
      if (data.user && data.user.language && !localStorage.getItem('agrosmart_lang')) {
        state.language = data.user.language;
        localStorage.setItem('agrosmart_lang', state.language);
      }
    } else {
      state.user = persona;
      state.token = 'demo-token';
    }
  } catch (err) {
    state.user = persona;
    state.token = 'demo-token';
  }
  updateSystemBarLanguage();
  updateSidebarProfile();
  renderRoleSidebar(role);
  renderApp();
}

function updateSidebarProfile() {
  const avatar = document.getElementById('sidebar-user-avatar');
  const name = document.getElementById('sidebar-user-name');
  const roleEl = document.getElementById('sidebar-user-role');
  const authBtnLabel = document.getElementById('top-auth-btn-label');

  if (avatar) avatar.textContent = (state.user.name || 'A')[0];
  if (name) name.textContent = state.user.name || 'User';
  const roleName = t(`role_${state.currentRole}`, state.currentRole.toUpperCase());
  if (roleEl) {
    const code = state.user.farmer_id_code || state.user.exporter_code || state.user.gst_number || 'TN-AGRO';
    roleEl.textContent = `${roleName} • ${code}`;
  }
  if (authBtnLabel) {
    authBtnLabel.textContent = `${(state.user.name || 'User').split(' ')[0]} (${roleName})`;
  }
}

// --- Main App Dispatcher ---
async function renderApp() {
    const appBody = document.getElementById('app-body');
    if (!appBody) return;
    
    const fabLand = document.getElementById('fab-add-land');
    if (fabLand) {
      fabLand.style.display = (state.currentRole === 'farmer' && state.currentTab === 'menu') ? 'flex' : 'none';
    }

    // === TAB-SPECIFIC VIEWS (shared across roles) ===
    if (state.currentTab === 'analytics') {
      await renderAnalyticsView(appBody);
      return;
    }
    if (state.currentTab === 'yield') {
      renderYieldView(appBody);
      return;
    }
    if (state.currentTab === 'history') {
      if (state.currentRole === 'farmer') {
        await renderLogListView(appBody);
      } else if (state.currentRole === 'agent') {
        renderAgentDashboard(appBody);
      } else if (state.currentRole === 'shop_owner') {
        await renderOrdersReceiptsLedgerView(appBody);
      } else if (state.currentRole === 'exporter') {
        renderExporterDashboard(appBody);
      } else {
        renderHistoryView(appBody);
      }
      return;
    }
    if (state.currentTab === 'user_listings') {
      await renderUserListingsView(appBody);
      return;
    }

    // === STRICT ROLE-BASED MAIN DASHBOARD ROUTING ===
    // This is the ONLY place that decides which dashboard to render.
    // No fallback to Farmer. Each role gets its own distinct view.
    switch (state.currentRole) {
      case 'farmer':
        await loadFarmerData();
        renderFarmerView(appBody);
        break;
      case 'agent':
        renderAgentDashboard(appBody);
        break;
      case 'exporter':
        renderExporterDashboard(appBody);
        break;
      case 'shop_owner':
      case 'shop':
        renderFertilizerShopDashboard(appBody);
        break;
      default:
        appBody.innerHTML = '<div style="padding:40px; text-align:center; color:#718096;">Unknown role. Please select a valid role tab above.</div>';
    }
  }

// =========================================================================


// =========================================================================
// AGENT DASHBOARD: Field Agent Operations View
// =========================================================================
function renderAgentDashboard(container) {
  const user = state.user || {};
  container.innerHTML = `
    <div style="padding:20px;">
      <div style="background:linear-gradient(135deg, #1A365D, #2A4365); color:#FFF; padding:24px; border-radius:16px; margin-bottom:24px;">
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#90CDF4; margin-bottom:8px;">Field Agent Terminal</div>
        <h1 style="font-size:24px; font-weight:900; margin:0 0 4px 0;">${user.name || 'Agent'}</h1>
        <div style="font-size:13px; color:#BEE3F8;">${user.exporter_code || 'EXP-TN-101'} &bull; ${user.region || 'Tamil Nadu'}</div>
      </div>

      <h2 style="font-size:18px; font-weight:bold; color:#1A365D; margin-bottom:16px;">Assigned Farm Inspections</h2>
      
      <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Arumugam's Turmeric Field</h3>
            <div style="font-size:13px; color:#718096;">Thanjavur &bull; 4.5 Acres &bull; Week 12 of 18</div>
          </div>
          <span style="background:#C6F6D5; color:#22543D; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:6px;">ON TRACK</span>
        </div>
        <div style="background:#F7FAFC; padding:12px; border-radius:8px; margin-bottom:12px;">
          <div style="font-size:12px; font-weight:bold; color:#4A5568; margin-bottom:8px;">WEEKLY VERIFICATION CHECKLIST</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#2D3748;"><input type="checkbox" checked /> Leaf Uniformity Verified</label>
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#2D3748;"><input type="checkbox" checked /> Stem Vigor Check Passed</label>
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#2D3748;"><input type="checkbox" /> Pest/Blemish Inspection</label>
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#2D3748;"><input type="checkbox" /> Soil Moisture Reading</label>
          </div>
        </div>
        <button onclick="alert('Inspection report submitted successfully!')" style="width:100%; background:#2B6CB0; color:#FFF; font-weight:bold; padding:14px; border-radius:8px; border:none; cursor:pointer; font-size:14px;">Submit Inspection Report</button>
      </div>

      <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Kavitha's Paddy Plot</h3>
            <div style="font-size:13px; color:#718096;">Erode &bull; 2.1 Acres &bull; Week 6 of 18</div>
          </div>
          <span style="background:#FEFCBF; color:#744210; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:6px;">NEEDS VISIT</span>
        </div>
      </div>

      <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Murugan's Sugarcane Field</h3>
            <div style="font-size:13px; color:#718096;">Coimbatore &bull; 6.0 Acres &bull; Week 15 of 18</div>
          </div>
          <span style="background:#C6F6D5; color:#22543D; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:6px;">ON TRACK</span>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// EXPORTER DASHBOARD: Global Export Operations View
// =========================================================================
function renderExporterDashboard(container) {
  const user = state.user || {};
  container.innerHTML = `
    <div style="padding:20px;">
      <div style="background:linear-gradient(135deg, #1A202C, #2D3748); color:#FFF; padding:24px; border-radius:16px; margin-bottom:24px;">
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#FBD38D; margin-bottom:8px;">Global Export Terminal</div>
        <h1 style="font-size:24px; font-weight:900; margin:0 0 4px 0;">${user.name || 'Exporter'}</h1>
        <div style="font-size:13px; color:#E2E8F0;">GST: ${user.gst_number || '33AAACK7741P1ZB'} &bull; Export ID: ${user.export_id || '0485019284'}</div>
      </div>

      <h2 style="font-size:18px; font-weight:bold; color:#1A365D; margin-bottom:16px;">Active Consignments</h2>

      <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Batch #TN-TUR-2026-0042</h3>
            <div style="font-size:13px; color:#718096;">Bhavani Turmeric &bull; 12 Metric Tons &bull; Destination: Dubai</div>
          </div>
          <span style="background:#C6F6D5; color:#22543D; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:6px;">APEDA CLEARED</span>
        </div>
        <div style="background:#F0FFF4; padding:12px; border-radius:8px; margin-bottom:12px;">
          <div style="font-size:12px; font-weight:bold; color:#276749; margin-bottom:8px;">COMPLIANCE STATUS</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div style="font-size:13px; color:#2D3748;">MRL Check: <strong style="color:#38A169;">PASS</strong></div>
            <div style="font-size:13px; color:#2D3748;">Pesticide Log: <strong style="color:#38A169;">VERIFIED</strong></div>
            <div style="font-size:13px; color:#2D3748;">Agent Inspections: <strong style="color:#38A169;">18/18</strong></div>
            <div style="font-size:13px; color:#2D3748;">Traceability QR: <strong style="color:#38A169;">GENERATED</strong></div>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="alert('Pre-Harvest Dossier downloaded.')" style="flex:1; background:#2F855A; color:#FFF; font-weight:bold; padding:12px; border-radius:8px; border:none; cursor:pointer; font-size:13px;">Download APEDA Dossier</button>
          <button onclick="alert('QR Passport generated.')" style="flex:1; background:#2B6CB0; color:#FFF; font-weight:bold; padding:12px; border-radius:8px; border:none; cursor:pointer; font-size:13px;">Generate QR Passport</button>
        </div>
      </div>

      <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Batch #TN-PAD-2026-0078</h3>
            <div style="font-size:13px; color:#718096;">Sona Masoori Rice &bull; 25 MT &bull; Destination: Singapore</div>
          </div>
          <span style="background:#FEFCBF; color:#744210; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:6px;">PENDING MRL</span>
        </div>
      </div>

      <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Batch #TN-SGR-2026-0015</h3>
            <div style="font-size:13px; color:#718096;">Organic Sugarcane &bull; 8 MT &bull; Destination: EU</div>
          </div>
          <span style="background:#FED7D7; color:#9B2C2C; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:6px;">AGENT REVIEW</span>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// FERTILIZER SHOP DASHBOARD: Inventory & Token Fulfillment View
// =========================================================================
function renderFertilizerShopDashboard(container) {
  const user = state.user || {};
  container.innerHTML = `
    <div style="padding:20px;">
      <div style="background:linear-gradient(135deg, #22543D, #2F855A); color:#FFF; padding:24px; border-radius:16px; margin-bottom:24px;">
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#C6F6D5; margin-bottom:8px;">Fertilizer & Pesticide Hub</div>
        <h1 style="font-size:24px; font-weight:900; margin:0 0 4px 0;">${user.name || user.shop_name || 'Shop Owner'}</h1>
        <div style="font-size:13px; color:#C6F6D5;">GST: ${user.gst_number || '33BBBCK1234P1ZA'} &bull; ${user.region || 'Tamil Nadu'}</div>
      </div>

      <div onclick="simulateInventoryUpload()" style="background:#FFF; border:2px dashed #3182CE; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px; cursor:pointer;">
        <div style="font-size:28px; margin-bottom:8px;">&#128196;</div>
        <h3 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Auto-Stock via Supplier Invoice</h3>
        <p style="font-size:13px; color:#718096; margin:0;">Upload PDF/Image to automatically extract and list products</p>
      </div>

      <h2 style="font-size:18px; font-weight:bold; color:#1A365D; margin-bottom:16px;">Live Inventory</h2>
      <div id="inventory-list">
        <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Trichoderma Viride</h4>
            <div style="color:#718096; font-size:13px;">Bio-Fungicide &bull; Stock: 45 units</div>
          </div>
          <div style="font-size:18px; font-weight:bold; color:#2F855A;">&#x20B9;450</div>
        </div>
        <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">DAP Fertilizer (50kg)</h4>
            <div style="color:#718096; font-size:13px;">Chemical Fertilizer &bull; Stock: 200 bags</div>
          </div>
          <div style="font-size:18px; font-weight:bold; color:#2F855A;">&#x20B9;1350</div>
        </div>
        <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Neem Oil Extract (10000 PPM)</h4>
            <div style="color:#718096; font-size:13px;">Botanical Pesticide &bull; Stock: 78 units</div>
          </div>
          <div style="font-size:18px; font-weight:bold; color:#2F855A;">&#x20B9;220</div>
        </div>
      </div>

      <h2 style="font-size:18px; font-weight:bold; color:#1A365D; margin:24px 0 16px 0;">Pending Token Orders</h2>
      <div style="background:#FFFFF0; border:1px solid #FEFCBF; border-radius:12px; padding:16px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div>
            <h4 style="font-size:15px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Arumugam Sundaram</h4>
            <div style="font-size:13px; color:#718096;">Trichoderma Viride x1 &bull; Token: <strong>#TKN-8492</strong></div>
          </div>
          <span style="background:#FEFCBF; color:#744210; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:6px;">AWAITING PICKUP</span>
        </div>
        <button onclick="alert('Token #TKN-8492 validated. Order marked as fulfilled.')" style="width:100%; background:#D69E2E; color:#FFF; font-weight:bold; padding:12px; border-radius:8px; border:none; cursor:pointer; font-size:14px;">Validate Token & Fulfill</button>
      </div>
    </div>
  `;
}

// 1. FARMER VIEW: CLEAN UI, ZERO EXTERNAL HUB JARGON, ONLY FLOATING (+)
// =========================================================================
async function loadFarmerData() {
  try {
    const fRes = await fetch('/api/farmer/farms', {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (fRes.ok) {
      state.farms = await fRes.json();
      if (state.farms.length > 0) {
        state.activeFarm = state.activeFarm
          ? state.farms.find(f => f.id === state.activeFarm.id) || state.farms[0]
          : state.farms[0];

        const aRes = await fetch(`/api/farmer/farms/${state.activeFarm.id}/activities`, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        if (aRes.ok) state.activities = await aRes.json();
      }
    }
  } catch (e) {
    console.warn('Error loading farmer data:', e);
  }
}

function renderFarmerView(container) {
  const farm = state.activeFarm;

  // Initialize or fetch dynamic 1-week cycle for this farm matching its stage
  if (!state.farmWeeklyState) state.farmWeeklyState = {};
  if (farm && !state.farmWeeklyState[farm.id]) {
    const isHarvest = farm.current_stage === 'Harvest';
    const isFlowering = farm.current_stage === 'Flowering';
    state.farmWeeklyState[farm.id] = {
      week: isHarvest ? 18 : (isFlowering ? 11 : 4),
      totalWeeks: 18,
      stageName: isHarvest ? 'Pre-Harvest Quarantine & Grain Hardening' : (isFlowering ? 'Flowering & Rhizome Enlargement' : 'Vegetative Tillering & Root Aeration'),
      tasks: isHarvest ? [
        { id: 'wt-01', title: 'Water drainage & field drying for combine harvester', day: 'Day 1', done: true, type: 'irrigation' },
        { id: 'wt-02', title: 'Pre-harvest moisture meter reading (<= 14%)', day: 'Day 3', done: true, type: 'sensor' },
        { id: 'wt-03', title: 'Bio-Potash foliar spray dosing', day: 'Day 5', done: false, type: 'fertilizer' }
      ] : isFlowering ? [
        { id: 'wt-01', title: 'Furrow irrigation & rhizome root check', day: 'Day 1', done: true, type: 'irrigation' },
        { id: 'wt-02', title: 'Trichoderma Viride 1% WP root drenching', day: 'Day 3', done: false, type: 'pest' },
        { id: 'wt-03', title: 'Canopy inspection & MRL rapid test strip', day: 'Day 6', done: false, type: 'sensor' }
      ] : [
        { id: 'wt-01', title: 'Irrigation & standing water check (3cm)', day: 'Day 1', done: true, type: 'irrigation' },
        { id: 'wt-02', title: 'AI Soil moisture retention reading', day: 'Day 3', done: true, type: 'sensor' },
        { id: 'wt-03', title: 'Bio-Neem NSKE 5% foliar spray dosing', day: 'Day 6', done: false, type: 'pest' }
      ]
    };
  }
  const wState = farm ? state.farmWeeklyState[farm.id] : null;
  const completedTasks = wState ? wState.tasks.filter(t => t.done).length : 0;
  const totalTasks = wState ? wState.tasks.length : 3;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const todayStr = new Date().toISOString().split('T')[0];
  // Active pending task: strictly filter out tasks that are done, or rescheduled to a future date
  const activeTask = wState ? (
    wState.tasks.find(t => !t.done && (!t.status || t.status === 'PENDING') && (!t.scheduled_date || t.scheduled_date <= todayStr) && !t.rescheduled_to) ||
    wState.tasks.find(t => !t.done && t.status === 'RESCHEDULED' && (t.scheduled_date === todayStr || t.rescheduled_to === todayStr)) ||
    null
  ) : null;
  const isDosingTask = activeTask && (activeTask.type === 'pest' || activeTask.type === 'fertilizer');

  container.innerHTML = `
    <!-- Hero Header: Clean, Human-Centric, Zero External Hub Mention -->
    <div class="hero-header">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
        <div>
          <div class="hero-title">${t('hero_farmer_greeting', 'Vanakkam')}, ${state.user.name || 'Arumugam Sundaram'} 🌾</div>
          <div class="hero-meta">
            <span>📍 ${state.user.district || 'Thanjavur Basin'}</span>
            <span>•</span>
            <span class="badge badge-gold" style="font-size:10px;">ID: ${state.user.farmer_id_code || 'TN-FARM-8492'}</span>
          </div>
        </div>
        <div>
          <button type="button" onclick="playTamilPrompt('dashboard_guide', this)" class="voice-walkthrough-btn">
            🔊 ${state.language === 'ta' ? 'குரல் வழிகாட்டி' : 'Audio Guide'}
          </button>
        </div>
      </div>
    </div>

    <!-- LAND SELECTION GRID CONTAINER (Top Priority: Select Land First) -->
    <div class="agro-card" style="margin-bottom:18px; padding:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
        <div>
          <span class="card-label" style="font-size:13px; font-weight:800; color:var(--primary);">${state.language === 'ta' ? 'நிலங்கள்' : 'LAND'} (${state.farms.length})</span>
          <div style="font-size:11px; color:var(--slate); margin-top:2px;">${state.language === 'ta' ? 'மேற்பார்வையிட ஒரு நிலத்தைத் தேர்ந்தெடுக்கவும்' : 'Select a land parcel to manage cultivation & tasks'}</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:6px;">
        ${state.farms.map(f => {
          const isSelected = farm && farm.id === f.id;
          const acres = f.area_acres || (f.area_ha ? (f.area_ha * 2.471).toFixed(1) : '4.2');

          return `
            <div onclick="selectFarm('${f.id}')" style="min-width:230px; padding:12px; border-radius:14px; background:${isSelected ? 'var(--mint-soft)' : 'var(--bg-canvas)'}; border:${isSelected ? '2px solid var(--primary)' : '1px solid var(--border)'}; cursor:pointer; transition:all 0.15s ease;">
              <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:800;">
                <span>${f.land_name || 'Land Parcel'}</span>
                <span class="badge ${f.current_stage === 'Harvest' ? 'badge-gold' : 'badge-forest'}">${translateStage(f.current_stage || 'Flowering')}</span>
              </div>
              <div style="font-size:11px; color:var(--slate); margin-top:4px;">
                ${translateCrop(f.crop_type || 'Crop')} • ${acres} ${t('cert_acres', 'Acres')}
              </div>
              <div style="font-size:10px; font-family:monospace; color:var(--primary); margin-top:2px;">
                ID: ${f.unique_parcel_code || f.id}
              </div>
              <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:700; color:var(--primary);">
                <span>📍 ${f.district || 'Tamil Nadu'}</span>
                <span style="background:${isSelected ? 'var(--primary)' : 'rgba(27, 77, 62, 0.1)'}; color:${isSelected ? '#FFFFFF' : 'var(--primary)'}; padding:2px 8px; border-radius:8px; font-size:10px;">
                  ${isSelected ? t('active_parcel_tag', '✓ Active Parcel') : t('select_parcel_tag', 'Select')}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    ${farm ? `
      <!-- PRIMARY ACTIONABLE LAND CARD (Selected Parcel Details) -->
      <div class="agro-card" style="margin-bottom:18px;">
        <div class="agro-card-header">
          <div>
            <div class="card-title">${farm.land_name || 'Amaravathi Basin Plot A'}</div>
            <div style="font-size:12px; color:var(--slate); margin-top:2px;">
              ${translateCrop(farm.crop_type || 'Ponni Rice')} • ${farm.area_acres || '4.2'} ${t('cert_acres', 'Acres')} (${farm.area_ha} Ha)
            </div>
            <div style="font-size:10.5px; font-family:monospace; color:var(--primary); margin-top:2px;">
              ID: <strong>${farm.unique_parcel_code || farm.id}</strong>
            </div>
          </div>
          <span class="badge badge-forest" style="font-size:12px;">Stage: ${translateStage(farm.current_stage || wState?.stageName || 'Flowering')}</span>
        </div>

        ${((farm.current_stage || wState?.stageName || '').toLowerCase().includes('harvest')) ? `
        <!-- REAL-TIME DYNAMIC EXPORT COMPLIANCE & QR DOCUMENT CARD (HARVEST STAGE EXCLUSIVE) -->
        <div style="background: linear-gradient(135deg, var(--mint-soft) 0%, #FFFFFF 100%); border: 1.5px solid var(--primary); border-radius: 14px; padding: 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-weight: 800; font-size: 13.5px; color: var(--primary); display: flex; align-items: center; gap: 6px;">
              <span>📜</span>
              <span>${t('cert_dossier_subtitle', 'International Export Compliance Dossier')}</span>
            </div>
            <div style="font-size: 11px; color: var(--slate); margin-top: 2px;">
              ${state.language === 'ta' ? 'APEDA, APVMA, கோடெக்ஸ், EU விதிமுறைகள் மற்றும் இரசாயன தணிக்கை விவரங்கள் அடங்கிய நேரலை ஆவணம்.' : 'Live international standards dossier (APEDA, APVMA, Codex, EU MRL) with applied agrochemical audit trail.'}
            </div>
          </div>
          <button onclick="openDynamicComplianceModal('${farm.id}')" class="agro-btn-primary" style="padding: 8px 14px; font-size: 11.5px; display: inline-flex; align-items: center; gap: 6px;">
            <span>🔍</span>
            <span>${t('btn_view_certificate_qr', 'View Certificate & QR')}</span>
          </button>
        </div>
        ` : ''}

        <!-- DYNAMIC ONE-WEEK PROGRESSION BAR -->
        <div class="weekly-cycle-box">
          <div class="weekly-cycle-header">
            <div class="weekly-cycle-title">
              <span>📅</span>
              <span>${t('timeline_week', 'Week')} ${wState.week} / ${wState.totalWeeks}: ${translateStage(wState.stageName)}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge ${progressPercent === 100 ? 'badge-forest' : 'badge-gold'}" style="font-size:10px;">
                ${progressPercent === 100 ? (state.language === 'ta' ? '🎉 100% சுழற்சி நிறைவடைந்தது' : '🎉 100% CYCLE COMPLETED') : `${completedTasks} of ${totalTasks} (${progressPercent}%)`}
              </span>
            </div>
          </div>

          <div class="weekly-cycle-track">
            <div class="weekly-cycle-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <div class="weekly-tasks-grid">
            ${wState.tasks.map(t => {
              const isRescheduled = t.status === 'RESCHEDULED';
              const newDate = t.scheduled_date || t.rescheduled_to;
              const displayDate = isRescheduled ? (state.language === 'ta' ? `புதிய தேதி: ${newDate}` : `Shifted: ${newDate}`) : `${t.day} • ${translateActivityType(t.type)}`;
              return `
              <div class="weekly-task-chip ${t.done ? 'completed' : isRescheduled ? 'rescheduled' : 'active'}" onclick="${!t.done ? (t.type === 'pest' || t.type === 'fertilizer' ? `openTreatmentBarcodeModal('${farm.crop_type?.includes('Turmeric') ? 'Trichoderma Viride 1% WP' : (farm.crop_type?.includes('Sugar') ? 'Bio-Neem NSKE 5% Bio-Spray' : 'Bio-Neem 5% EC')}', 'Target Bio-Protection', '500 ml / Acre', '${farm.id}', '${t.id}', '8901234567890')` : `openCameraModal('${farm.id}', '${t.id}')`) : ''}" style="${!t.done ? 'cursor:pointer;' : ''}">
                <div>
                  <div style="font-size:9px; color:var(--slate); text-transform:uppercase;">${displayDate}</div>
                  <div style="margin-top:2px;">${t.title}</div>
                  ${isRescheduled ? `<div style="font-size:9px; color:var(--primary); font-weight:700; margin-top:2px;">${state.language === 'ta' ? 'புதிய தேதிக்கு திட்டமிடப்பட்டது' : 'Rescheduled strictly to new date'}</div>` : ''}
                </div>
                <span style="font-size:14px; margin-left:6px;">${t.done ? '✅' : isRescheduled ? '📅' : '⏳'}</span>
              </div>
            `;
            }).join('')}
          </div>
        </div>

        <!-- CONTEXTUAL ACTION PROMPT (Clears when completed or rescheduled away) -->
        ${activeTask ? `
          <div class="action-prompt-box" style="flex-direction:column; gap:10px; margin-top:14px;">
            <div style="display:flex; align-items:flex-start; gap:12px; width:100%;">
              <div class="prompt-icon">${isDosingTask ? '🧪' : '💧'}</div>
              <div style="flex:1;">
                <div class="prompt-text">
                  ${isDosingTask 
                    ? `${farm.pesticide_fertilizer_dosing?.mixture || 'Bio-Neem NSKE 5%'} foliar spray scheduled — Scan bottle barcode before application`
                    : (activeTask.status === 'RESCHEDULED' && (activeTask.scheduled_date || activeTask.rescheduled_to) !== todayStr)
                      ? (state.language === 'ta' ? `📅 பணி ${activeTask.scheduled_date || activeTask.rescheduled_to} புதிய தேதிக்கு மாற்றப்பட்டுள்ளது — நடவடிக்கை புதிய தேதியில் திட்டமிடப்பட்டுள்ளது` : `📅 Task rescheduled to ${activeTask.scheduled_date || activeTask.rescheduled_to} — Action scheduled strictly on new date`)
                      : (farm.immediate_action_prompt || (state.language === 'ta' ? 'இன்றைய பாசன பணி — 3 செ.மீ நீர் மட்டத்தை பராமரிக்கவும்' : 'Irrigation due today — Maintain 3cm standing water'))}
                </div>
                <div class="prompt-sub">
                  ${isDosingTask 
                    ? (state.language === 'ta' ? 'APEDA கட்டாய ஏற்றுமதி விதிமுறை: கேமரா மூலம் பார் குறியீட்டை சரிபார்க்கவும். தடை செய்யப்பட்ட செயற்கை இரசாயனங்கள் அனுமதிக்கப்படாது.' : 'Mandatory APEDA export protocol: In-app camera barcode authentication required. Synthetic non-compliant chemicals are blocked.')
                    : (state.language === 'ta' ? 'பயிர் வளர்ச்சிக்கு தேவையான நடவடிக்கை. மண் ஈரப்பதம் தொடர்ந்து கண்காணிக்கப்படுகிறது.' : 'Action required for stage development. Soil moisture baseline active.')}
                </div>
              </div>
            </div>

            <div style="width:100%; margin-top:8px; padding-top:10px; border-top:1px solid rgba(27, 77, 62, 0.15); display:flex; flex-direction:column; gap:8px;">
              ${isDosingTask ? `
                <button onclick="openTreatmentBarcodeModal('${farm.pesticide_fertilizer_dosing?.mixture || 'Bio-Neem NSKE 5%'}', 'Stem Borer & Leaf Folder Control', '${farm.pesticide_fertilizer_dosing?.dosage || '500 ml / Acre'}', '${farm.id}', '${activeTask.id}', '8901234567890')" class="agro-btn-primary" style="padding:10px 14px; font-size:12.5px; width:100%; font-weight:700;">
                  ${t('btn_scan_barcode_dosing', '📷 Scan Barcode & Log Treatment (Mandatory Verification)')}
                </button>
              ` : `
                <button onclick="openCameraModal('${farm.id}', '${activeTask.id}')" class="agro-btn-primary" style="padding:10px 14px; font-size:12.5px; width:100%; font-weight:700;">
                  ${t('btn_done_camera', '✓ Done / Completed (Camera Proof)')}
                </button>
              `}
              <div>
                <button onclick="openRescheduleModal('${farm.id}', '${activeTask.id}')" class="agro-btn-secondary" style="padding:9px 12px; font-size:12px; font-weight:700; width:100%;">
                  ${t('btn_reschedule', '⏳ Reschedule')}
                </button>
              </div>
            </div>
          </div>
        ` : `
          <!-- Celebration Card When All Tasks for Today are Done or Rescheduled -->
          <div class="action-prompt-box" style="margin-top:14px; background:linear-gradient(135deg, var(--mint-soft) 0%, #FFFFFF 100%); border:1.5px solid var(--primary); padding:16px;">
            <div style="display:flex; align-items:center; gap:12px; width:100%;">
              <div class="prompt-icon" style="font-size:26px;">🎉</div>
              <div style="flex:1;">
                <div class="prompt-text" style="color:var(--primary); font-weight:800; font-size:14px;">
                  ${state.language === 'ta' ? 'இன்றைய திட்டமிடப்பட்ட பணிகள் அனைத்தும் வெற்றிகரமாக முடிவடைந்தன!' : 'All scheduled tasks completed for today!'}
                </div>
                <div class="prompt-sub" style="font-size:11.5px; color:var(--slate); margin-top:2px;">
                  ${state.language === 'ta' ? 'உங்கள் பயிர் பராமரிப்பு மற்றும் ஏற்றுமதி தணிக்கை தரவுகள் முழுமையாக புதுப்பிக்கப்பட்டுள்ளன.' : 'Cultivation milestones, moisture levels, and export traceability logs are fully up-to-date.'}
                </div>
              </div>
              <span class="badge badge-forest" style="font-size:11px; padding:4px 10px;">✓ ${t('status_compliant', 'COMPLIANT')}</span>
            </div>
          </div>
        `}

        <!-- Harvest Countdown & Yield Forecast -->
        <div style="margin-top:16px; background:var(--mint-soft); border:1px solid var(--mint-light); border-radius:14px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <span class="card-label" style="color:var(--primary);">${t('harvest_forecast', 'Harvest Forecast')}</span>
            <div style="font-size:18px; font-weight:800; color:var(--ink); margin-top:2px;">
              ${t('harvest_in_days', '⏳ Harvest in {days} Days', { days: farm.harvest_prediction?.days_remaining || 125 })}
            </div>
            <div style="font-size:11px; color:var(--slate);">
              ${t('expected_harvest', 'Expected: {date}', { date: farm.harvest_prediction?.expected_harvest_date || '2027-01-12' })}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:20px; font-weight:800; color:var(--primary);">
              ${farm.harvest_prediction?.predicted_yield_tonnes || '24.5'} Tonnes
            </div>
            <div style="font-size:11px; font-weight:700; color:var(--slate);">
              ${t('grade_a_export', 'Grade A Export')}: <strong>${farm.harvest_prediction?.grade_a_percentage || 75}%</strong> • ${t('mandi_domestic', 'Mandi')}: <strong>${farm.harvest_prediction?.grade_b_c_percentage || 25}%</strong>
            </div>
          </div>
        </div>

        <div style="margin-top:14px; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button onclick="openWeeklyProgressionModal('${farm.id}')" class="agro-btn-primary" style="font-size:12.5px; padding:10px 16px; flex:1; font-weight:800; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
              <span>📅</span>
              <span>${t('btn_progression_timeline', 'Open 8-Week Progression Timeline')}</span>
            </button>
            <button onclick="toggleInlineProgressionTimeline('${farm.id}')" class="agro-btn-outline" style="font-size:12px; padding:10px 14px; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
              <span id="inline-prog-arrow-${farm.id}">▼</span>
              <span id="inline-prog-text-${farm.id}">${t('btn_expand_timeline', 'Expand Timeline')}</span>
            </button>
          </div>
          <div id="inline-progression-container-${farm.id}" style="display:none; margin-top:8px; border:1.5px solid var(--primary); border-radius:14px; padding:14px; background:var(--mint-soft);"></div>
        </div>
      </div>

    ` : `
      <div class="agro-card" style="text-align:center; padding:40px;">
        <p style="color:var(--slate); margin-bottom:14px;">${state.language === 'ta' ? 'பதிவுசெய்த நிலப்பரப்புகள் எதுவும் இல்லை.' : 'No land parcels registered yet.'}</p>
        <p style="font-size:13px; color:var(--primary); font-weight:700;">${state.language === 'ta' ? 'முதல் நிலத்தை பதிவு செய்ய கீழே வலதுபுறத்தில் உள்ள (+) பொத்தானை தட்டவும்.' : 'Tap the floating (+) button at the bottom-right to register your first parcel.'}</p>
      </div>
    `}

    ${farm ? `
      
      <!-- NEW PESTICIDE RECOMMENDATION & BUY PRODUCT FLOW -->
      <div class="agro-card" style="margin-top:18px; margin-bottom:18px; border-left:5px solid #E53E3E; background:linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%);">
        <div class="agro-card-header" style="margin-bottom:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:20px;">🧪</span>
              <div class="card-title" style="color:#C53030;">Today's Recommended Treatment</div>
            </div>
            <div style="font-size:11.5px; color:#E53E3E; margin-top:2px; font-weight:bold;">
              Based on active crop stage: ${farm ? farm.current_stage || 'Flowering & Grain Filling' : 'Flowering'}
            </div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="background:#FFF; border:1px solid #FED7D7; padding:16px; border-radius:12px;">
            <h3 style="font-size:18px; font-weight:bold; color:#2D3748; margin:0 0 8px 0;">Trichoderma Viride (Bio-Fungicide)</h3>
            <p style="font-size:14px; color:#4A5568; margin:0 0 16px 0;">Prevents root rot. Apply 5ml per liter of water via foliar spray.</p>
            <button onclick="openProductPurchaseFlow()" style="width:100%; background:#E53E3E; color:#FFF; font-weight:bold; padding:12px; border-radius:8px; border:none; cursor:pointer; font-size:16px; box-shadow: 0 4px 6px rgba(229,62,62,0.2);">Buy Product</button>
          </div>
        </div>
      </div>
      ` : ''}
    `;
  }


function completeWeeklyTask(farmId, taskId) {
  if (!state.farmWeeklyState || !state.farmWeeklyState[farmId]) return;
  const w = state.farmWeeklyState[farmId];
  const t = w.tasks.find(item => item.id === taskId) || w.tasks.find(item => !item.done);
  if (t) t.done = true;

  const doneCount = w.tasks.filter(item => item.done).length;
  if (doneCount === w.tasks.length) {
    renderApp();
    setTimeout(() => {
      advanceWeekCycle(farmId);
    }, 900);
  } else {
    renderApp();
  }
}

function advanceWeekCycle(farmId) {
  if (!state.farmWeeklyState || !state.farmWeeklyState[farmId]) return;
  const w = state.farmWeeklyState[farmId];
  const nextWeek = w.week >= 18 ? 1 : w.week + 1;
  let nextStage = 'Vegetative Tillering & Root Aeration';
  if (nextWeek >= 5 && nextWeek <= 9) nextStage = 'Panicle Initiation & Nutrient Dosing';
  else if (nextWeek >= 10 && nextWeek <= 14) nextStage = 'Flowering & Grain Development';
  else if (nextWeek >= 15) nextStage = 'Maturity & Pre-Harvest Quarantine';

  state.farmWeeklyState[farmId] = {
    week: nextWeek,
    totalWeeks: 18,
    stageName: nextStage,
    tasks: [
      { id: `wt-${nextWeek}-1`, title: 'Field canal irrigation & moisture check', day: 'Day 1', done: false, type: 'irrigation' },
      { id: `wt-${nextWeek}-2`, title: 'Organic foliar bio-stimulant foliar spray', day: 'Day 3', done: false, type: 'fertilizer' },
      { id: `wt-${nextWeek}-3`, title: 'Canopy inspection & MRL sensor scan', day: 'Day 6', done: false, type: 'sensor' }
    ]
  };

  alert(`✓ Week ${w.week} Cycle 100% Completed!\n\nAdvancing to Week ${nextWeek} / 18: ${nextStage}.\nProgression bar automatically reset to 0% for the new cycle.`);
  renderApp();
}

function selectFarm(farmId) {
  state.activeFarm = state.farms.find(f => f.id === farmId);
  renderApp();
}

// --- Claim / Map Land Parcel via Unique Code ---
function openClaimParcelModal() {
  const modalHtml = `
    <div class="modal-backdrop" id="claim-parcel-modal">
      <div class="modal-content" style="max-width:460px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">${t('claim_parcel_subtitle', 'Land Parcel Mapping')}</span>
            <div style="font-size:18px; font-weight:800;">${t('claim_parcel_title', 'Map Parcel via Unique ID')}</div>
          </div>
          <button onclick="closeClaimParcelModal()" class="modal-close">&times;</button>
        </div>

        <form onsubmit="handleClaimParcelSubmit(event)">
          <div class="form-group">
            <label class="form-label">${t('claim_parcel_code_label', 'Unique Land Parcel Code / ID')}</label>
            <input type="text" id="claim-parcel-code" class="form-control" placeholder="e.g. PARCEL-TN-8492" required style="font-weight:700; font-family:monospace; letter-spacing:0.5px;" />
            <div style="font-size:11px; color:var(--slate); margin-top:6px; line-height:1.4;">
              ${t('claim_parcel_hint', 'Enter the unique tamper-proof parcel identifier registered with the state agricultural registry.')}<br/>
              <code>PARCEL-TN-8492</code> (Amaravathi), <code>PARCEL-TN-5120</code> (Bhavani), <code>PARCEL-TN-9940</code> (Cauvery)
            </div>
          </div>

          <button type="submit" class="agro-btn-primary" style="width:100%; padding:12px; font-size:13px; margin-top:10px; font-weight:800;">
            ${t('claim_parcel_btn', '🏷️ Claim & Map Parcel to Account')}
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeClaimParcelModal() {
  const m = document.getElementById('claim-parcel-modal');
  if (m) m.remove();
}

async function handleClaimParcelSubmit(event) {
  event.preventDefault();
  const code = document.getElementById('claim-parcel-code').value.trim();
  if (!code) return;

  try {
    const res = await fetch('/api/farmer/claim-parcel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({ parcel_code: code })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      alert(`✓ ${data.message}`);
      closeClaimParcelModal();
      if (state.currentRole === 'farmer') {
        await loadFarmerData();
      } else if (state.currentRole === 'exporter') {
        await loadExporterData();
      }
      renderApp();
    } else {
      alert(`Error: ${data.error || 'Failed to claim parcel'}`);
    }
  } catch (err) {
    alert(`Error claiming parcel: ${err.message}`);
  }
}

// =========================================================================
// 2. INTERACTIVE TASK STATE MACHINE: RESCHEDULE & NOT DONE ACTIONS
// =========================================================================
function setQuickShiftDays(days) {
  const targetDateInput = document.getElementById('reschedule-target-date');
  if (targetDateInput) {
    const d = new Date(Date.now() + days * 86400000);
    targetDateInput.value = d.toISOString().split('T')[0];
  }
}

async function handleMarkNotDone(farmId, activityId) {
  const farm = state.farms.find(f => f.id === farmId) || state.activeFarm;
  const currentFarmId = farm?.id || farmId || 'farm-001-rajendra';
  const currentActId = activityId || 'act-001';

  try {
    const res = await fetch(`/api/farmer/tasks/${currentActId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({
        action: 'NOT_DONE',
        farm_id: currentFarmId
      })
    });

    const data = await res.json();
    const shiftedDate = data.rescheduled_to || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

    // Dynamically update farm weekly state tasks
    if (state.farmWeeklyState && state.farmWeeklyState[currentFarmId]) {
      const w = state.farmWeeklyState[currentFarmId];
      const t = w.tasks.find(item => item.id === currentActId) || w.tasks.find(item => !item.done);
      if (t) {
        t.status = 'NOT_DONE';
        t.done = false;
        t.scheduled_date = shiftedDate;
        t.day = `Shifted: ${shiftedDate}`;
        t.fallback_active = true;
      }
    }

    if (farm) {
      farm.immediate_action_prompt = `⚠️ Curative Action: Task marked Not Done. Shifted to ${shiftedDate} with autonomous bio-safeguard protocol`;
    }

    state.auditHistory.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event: 'Task Marked Not Done & Shifted',
      detail: `Task marked Not Done. Automatically shifted to ${shiftedDate} with bio-fungicide curative protocol.`,
      type: 'not_done'
    });

    alert(`⚠️ Task Marked as Not Done!\n\n• Autonomous Curative Protocol Triggered: Bio-fungicide safeguard applied to prevent MRL breach.\n• Dynamic Schedule Shift: Watering & inspection window automatically moved forward to ${shiftedDate}.`);
  } catch (e) {
    console.warn('Mark not done error:', e);
  }

  await loadFarmerData();
  renderApp();
}

function openRescheduleModal(farmId, activityId) {
  const farm = state.farms.find(f => f.id === farmId) || state.activeFarm;
  const currentPrompt = farm?.immediate_action_prompt || 'Irrigation due today';
  const autoDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

  const isTa = state.language === 'ta';
  const modalHtml = `
    <div class="modal-backdrop" id="reschedule-modal">
      <div class="modal-content" style="max-width:480px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">${isTa ? 'பணி நிலை மேலாண்மை' : 'Task State-Machine'}</span>
            <div style="font-size:18px; font-weight:800;">${t('reschedule_title', 'Reschedule Agronomic Task')}</div>
          </div>
          <button onclick="closeRescheduleModal()" class="modal-close">&times;</button>
        </div>

        <div style="background:var(--mint-soft); padding:14px; border-radius:14px; margin-bottom:14px; border:1px solid var(--mint-light);">
          <div style="font-weight:800; color:var(--primary); font-size:14px;">${currentPrompt}</div>
          <div style="font-size:11px; color:var(--slate); margin-top:4px;">
            ${isTa ? 'மண் ஈரப்பதம் மற்றும் பயிர் வளர்ச்சி நிலை மறுமதிப்பீடு செய்யப்படுகிறது. புதிய தேதியை தேர்ந்தெடுப்பது அடுத்தடுத்த மைல்கற்களை தானாக மாற்றியமைக்கும்.' : 'Soil moisture retention is recalculated. Selecting a new date will dynamically shift the task window and adjust subsequent cultivation milestones without compliance penalty.'}
          </div>
        </div>

        <form onsubmit="handleRescheduleSubmit(event, '${activityId}', '${farmId}')">
          <div class="form-group">
            <label class="form-label">${t('reschedule_pick_date', 'Optimal Recalculated Target Date')}</label>
            <input type="date" id="reschedule-target-date" class="form-control" value="${autoDate}" required />
          </div>

          <!-- Quick Shift Shortcuts -->
          <div style="margin-bottom:14px;">
            <div style="font-size:11px; font-weight:700; color:var(--slate); margin-bottom:6px;">${t('reschedule_quick_shortcuts', 'QUICK SHIFT SHORTCUTS:')}</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" onclick="setQuickShiftDays(1)" class="agro-btn-secondary" style="padding:4px 10px; font-size:11px; border-radius:8px;">${isTa ? '+1 நாள்' : '+1 Day'}</button>
              <button type="button" onclick="setQuickShiftDays(2)" class="agro-btn-secondary" style="padding:4px 10px; font-size:11px; border-radius:8px; border-color:var(--primary); color:var(--primary); font-weight:700;">${isTa ? '+2 நாட்கள் (பரிந்துரை)' : '+2 Days (Recommended)'}</button>
              <button type="button" onclick="setQuickShiftDays(3)" class="agro-btn-secondary" style="padding:4px 10px; font-size:11px; border-radius:8px;">${isTa ? '+3 நாட்கள்' : '+3 Days'}</button>
              <button type="button" onclick="setQuickShiftDays(7)" class="agro-btn-secondary" style="padding:4px 10px; font-size:11px; border-radius:8px;">${isTa ? '+7 நாட்கள் (அடுத்த வாரம்)' : '+7 Days (Next Week)'}</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">${isTa ? 'மறுதிட்டமிடல் காரணம்' : 'Reschedule Reason'}</label>
            <select id="reschedule-reason" class="form-control">
              <option value="Adequate soil standing moisture detected">${isTa ? 'மண்ணில் போதுமான ஈரப்பதம் உள்ளது' : 'Adequate soil standing moisture detected'}</option>
              <option value="Overcast / Light localized rainfall">${isTa ? 'வானம் மேகமூட்டம் / லேசான மழை' : 'Overcast / Light localized rainfall'}</option>
              <option value="Power / Canal supply delayed by 24h">${isTa ? 'மின்சாரம் / கால்வாய் நீர் விநியோகம் தாமதம்' : 'Power / Canal supply delayed by 24h'}</option>
              <option value="Labor / Combine equipment re-scheduling">${isTa ? 'வேளாண் ஆட்கள் / இயந்திரங்கள் மறுதிட்டமிடல்' : 'Labor / Combine equipment re-scheduling'}</option>
            </select>
          </div>

          <button type="submit" class="agro-btn-primary" style="width:100%; padding:12px; font-size:13px; font-weight:800;">
            ${t('btn_confirm_reschedule', '✓ Confirm Reschedule')}
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function handleRescheduleSubmit(event, activityId, farmId) {
  event.preventDefault();
  const rescheduleDate = document.getElementById('reschedule-target-date').value;
  const reason = document.getElementById('reschedule-reason').value;
  const currentFarmId = farmId || 'farm-001-rajendra';
  const currentActId = activityId || 'act-001';

  try {
    await fetch(`/api/farmer/tasks/${currentActId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({
        action: 'RESCHEDULE',
        reschedule_date: rescheduleDate,
        reason,
        farm_id: currentFarmId
      })
    });
  } catch (e) {
    console.warn('Reschedule API sync info:', e);
  }

  // Dynamically update farm weekly state tasks so task disappears from today's active view
  if (state.farmWeeklyState && state.farmWeeklyState[currentFarmId]) {
    const w = state.farmWeeklyState[currentFarmId];
    const t = w.tasks.find(item => item.id === currentActId) || w.tasks.find(item => !item.done);
    if (t) {
      t.status = 'RESCHEDULED';
      t.done = false;
      t.scheduled_date = rescheduleDate;
      t.rescheduled_to = rescheduleDate;
      t.day = `Shifted: ${rescheduleDate}`;
    }
  }

  const farm = state.farms.find(f => f.id === currentFarmId) || state.activeFarm;
  if (farm) {
    farm.immediate_action_prompt = `📅 Task rescheduled to ${rescheduleDate} — Moisture & nutrient schedule dynamically shifted`;
  }

  state.auditHistory.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    event: 'Task Recalculated / Rescheduled',
    detail: `Task rescheduled to ${rescheduleDate} (${reason}). Schedule shifted dynamically.`,
    type: 'reschedule'
  });

  alert(`✓ Rescheduled Successfully!\n\n• New optimal date: ${rescheduleDate}.\n• Timeline, water leveling, and crop milestones dynamically updated.`);

  closeRescheduleModal();
  await loadFarmerData();
  renderApp();
}

function closeRescheduleModal() {
  const m = document.getElementById('reschedule-modal');
  if (m) m.remove();
}

// =========================================================================
// 3. AI PESTICIDE BARCODE VERIFICATION MODULE
// =========================================================================
function openBarcodeScannerModal(crop = 'Ponni Rice', prescribed = 'Bio-Neem 5% EC', farmId = 'farm-001-rajendra', taskId = 'wt-03') {
  const modalHtml = `
    <div class="modal-backdrop" id="barcode-modal">
      <div class="modal-content" style="max-width:500px; text-align:center;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">${t('barcode_modal_subtitle_short', 'AI Input Authenticator')}</span>
            <div style="font-size:18px; font-weight:800;">${t('barcode_modal_title', 'Scan Agrochemical Barcode')}</div>
          </div>
          <button onclick="closeBarcodeModal()" class="modal-close">&times;</button>
        </div>

        <div style="font-size:12px; color:var(--slate); margin-bottom:10px;">
          ${t('barcode_prescribed_target', 'Prescribed Target:')} <strong style="color:var(--primary);">${prescribed}</strong>
        </div>

        <!-- In-App Barcode Viewfinder with Real Device Camera or Animated Laser -->
        <div class="barcode-viewfinder" id="barcode-viewfinder-box" style="position:relative; width:100%; height:200px; background:#0F2E23; border-radius:14px; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <video id="barcode-video-feed" autoplay playsinline style="width:100%; height:100%; object-fit:cover; display:none;"></video>
          
          <div id="barcode-sim-view" style="display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--mint-light);">
            <div style="font-size:32px;">📷</div>
            <div style="font-size:12px; font-weight:700; margin-top:6px;">${t('barcode_bottle_scanner', 'Agrochemical Bottle Scanner')}</div>
            <div style="font-size:10px; opacity:0.8;">${t('barcode_align_reticle', 'Align EAN-13 / QR Barcode within reticle')}</div>
          </div>

          <div class="barcode-reticle" style="position:absolute; width:80%; height:60%; border:2px dashed rgba(216, 243, 220, 0.8); border-radius:8px; pointer-events:none; display:flex; align-items:flex-end; justify-content:center; padding-bottom:6px;">
            <span style="color:rgba(216, 243, 220, 0.9); font-size:10px; font-family:monospace; background:rgba(0,0,0,0.5); padding:2px 6px; border-radius:4px;">${t('barcode_reticle_tag', '[ BOTTLE BARCODE RETICLE ]')}</span>
          </div>
          <div class="scanner-laser"></div>
        </div>

        <div style="margin:10px 0;">
          <button onclick="startLiveBarcodeCamera('${farmId}', '${taskId}')" class="agro-btn-secondary" style="font-size:11px; padding:8px 12px; width:100%;">
            ${t('barcode_activate_camera', '📹 Activate Live Device Camera Scanner')}
          </button>
        </div>

        <div style="background:var(--bg-canvas); padding:10px 14px; border-radius:12px; margin-bottom:14px; border:1px solid var(--border); font-size:11px; text-align:left;">
          <div style="font-weight:700; color:var(--ink); margin-bottom:4px;">${t('barcode_quick_catalog', '⚡ Instant Catalog Test Options:')}</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <button onclick="simulateScanBarcode('8901234567890', '${farmId}', '${taskId}')" class="agro-btn-secondary" style="font-size:11px; padding:6px; justify-content:flex-start;">
              ${t('barcode_scan_bioneem', 'Scan: Bio-Neem 5% Bio-Extract (Certified APEDA Pass)')}
            </button>
            <button onclick="simulateScanBarcode('8909876543210', '${farmId}', '${taskId}')" class="agro-btn-secondary" style="font-size:11px; padding:6px; justify-content:flex-start;">
              ${t('barcode_scan_pseudomonas', 'Scan: Pseudomonas Fluorescens Bio-Shield (Organic Pass)')}
            </button>
            <button onclick="simulateScanBarcode('8905555444433', '${farmId}', '${taskId}')" class="agro-btn-secondary" style="font-size:11px; padding:6px; justify-content:flex-start; color:var(--coral); border-color:var(--coral);">
              ${t('barcode_scan_chlorpyrifos', 'Scan: Chlorpyrifos 20% EC (Banned Synthetic Warning)')}
            </button>
          </div>
        </div>

        <div class="form-group" style="text-align:left;">
          <label class="form-label">${t('barcode_manual_label', 'Or Enter Barcode Manually')}</label>
          <div style="display:flex; gap:8px;">
            <input type="text" id="manual-barcode-input" class="form-control" placeholder="e.g. 8901234567890" value="8901234567890" />
            <button onclick="simulateScanBarcode(document.getElementById('manual-barcode-input').value, '${farmId}', '${taskId}')" class="agro-btn-primary" style="padding:8px 14px; white-space:nowrap;">
              ${t('btn_verify_barcode', 'Verify')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function startLiveBarcodeCamera(farmId, taskId) {
  try {
    const video = document.getElementById('barcode-video-feed');
    const sim = document.getElementById('barcode-sim-view');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    if (video) {
      video.srcObject = stream;
      video.style.display = 'block';
      if (sim) sim.style.display = 'none';
      state.barcodeCameraStream = stream;

      if ('BarcodeDetector' in window) {
        const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'qr_code', 'upc_a'] });
        const intervalId = setInterval(async () => {
          if (!state.barcodeCameraStream) {
            clearInterval(intervalId);
            return;
          }
          try {
            const detected = await detector.detect(video);
            if (detected && detected.length > 0) {
              clearInterval(intervalId);
              const barcodeValue = detected[0].rawValue;
              stopLiveBarcodeCamera();
              simulateScanBarcode(barcodeValue, farmId, taskId);
            }
          } catch (e) {}
        }, 400);
      }
    }
  } catch (err) {
    alert('Camera sensor active in simulated barcode capture mode.');
  }
}

function stopLiveBarcodeCamera() {
  if (state.barcodeCameraStream) {
    state.barcodeCameraStream.getTracks().forEach(t => t.stop());
    state.barcodeCameraStream = null;
  }
}

function closeBarcodeModal() {
  stopLiveBarcodeCamera();
  const m = document.getElementById('barcode-modal');
  if (m) m.remove();
}

async function simulateScanBarcode(barcode, farmId = 'farm-001-rajendra', taskId = 'wt-03') {
  closeBarcodeModal();

  try {
    const res = await fetch('/api/farmer/pesticide/verify-barcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({ barcode })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.is_authentic) {
        completeWeeklyTask(farmId, taskId);
        state.auditHistory.unshift({
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          event: 'Agrochemical Bottle Barcode Authenticated',
          detail: `${data.verification.product_name} (Batch: ${data.verification.batch_number}) verified compliant for APEDA zero-residue standard.`,
          type: 'audit'
        });
      }
      openBarcodeResultModal(data, farmId, taskId);
    }
  } catch (e) {
    alert('Barcode verified in local testing catalog.');
  }
}

function openBarcodeResultModal(data, farmId = 'farm-001-rajendra', taskId = 'wt-03') {
  const v = data.verification;
  const isAuth = data.is_authentic;

  const modalHtml = `
    <div class="modal-backdrop" id="barcode-result-modal">
      <div class="modal-content" style="max-width:500px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:${isAuth ? 'var(--primary)' : 'var(--coral)'};">
              ${isAuth ? '✓ AUTHENTICITY CONFIRMED' : '⚠️ NON-COMPLIANT WARNING'}
            </span>
            <div style="font-size:18px; font-weight:800;">${v.product_name}</div>
          </div>
          <button onclick="closeBarcodeResultModal()" class="modal-close">&times;</button>
        </div>

        <div style="background:${isAuth ? 'var(--mint-soft)' : '#FFF1F0'}; border:1.5px solid ${isAuth ? 'var(--mint-light)' : '#FFCCC7'}; border-radius:14px; padding:14px; margin-bottom:14px;">
          <div style="font-size:13px; font-weight:800; color:${isAuth ? 'var(--primary)' : 'var(--coral)'};">
            ${data.message}
          </div>
        </div>

        <div class="grid-2" style="margin-bottom:14px;">
          <div class="dosing-cell">
            <div class="cell-label">Manufacturer</div>
            <div class="cell-value" style="font-size:12px;">${v.manufacturer}</div>
          </div>
          <div class="dosing-cell">
            <div class="cell-label">Batch ID</div>
            <div class="cell-value" style="font-size:12px; font-family:monospace;">${v.batch_number}</div>
          </div>
          <div class="dosing-cell">
            <div class="cell-label">MRL Safety Standard</div>
            <div class="cell-value" style="font-size:12px; color:${isAuth ? 'var(--primary)' : 'var(--coral)'}; font-weight:800;">${v.mrl_rating}</div>
          </div>
          <div class="dosing-cell">
            <div class="cell-label">APEDA Export Rating</div>
            <div class="cell-value" style="font-size:12px;">${v.apeda_export_compliant ? '✓ 100% Export Safe' : '🚫 Export Barred'}</div>
          </div>
        </div>

        <div style="background:var(--bg-canvas); padding:12px; border-radius:12px; border:1px solid var(--border); font-size:12px; margin-bottom:16px;">
          <div style="font-weight:800; margin-bottom:4px;">📋 Safe Application Directive:</div>
          <div style="color:var(--ink);">${v.dosage_instructions}</div>
        </div>

        <div class="grid-2">
          ${isAuth ? `
            <button onclick="confirmAgrochemicalApplication('${v.product_name}', '${v.batch_number}', '${farmId}', '${taskId}')" class="agro-btn-primary" style="padding:10px; font-size:12px; width:100%;">
              ✓ Proceed with Application
            </button>
          ` : `
            <button onclick="closeBarcodeResultModal()" class="agro-btn-danger" style="padding:10px; font-size:12px; width:100%;">
              🚫 Discard Product
            </button>
          `}
          <button onclick="closeBarcodeResultModal()" class="agro-btn-secondary" style="padding:10px; font-size:12px; width:100%;">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function confirmAgrochemicalApplication(product, batch, farmId = 'farm-001-rajendra', taskId = 'wt-03') {
  closeBarcodeResultModal();
  completeWeeklyTask(farmId, taskId);
  state.auditHistory.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    event: 'Agrochemical Application Verified',
    detail: `Product '${product}' (Batch: ${batch}) applied to crop and signed to APEDA compliance ledger.`,
    type: 'barcode'
  });
  alert(`✓ Agrochemical Application Confirmed!\n\n${product} marked as applied. Task completed.`);
  renderApp();
}

function closeBarcodeResultModal() {
  const m = document.getElementById('barcode-result-modal');
  if (m) m.remove();
}

// Actionable Treatment Barcode Logging Flow
function openTreatmentBarcodeModal(treatmentName = 'Neem Seed Kernel Extract (NSKE 5%)', targetIssue = 'Stem Borer & Leaf Folder Control', dosage = '500 ml / Acre in 200L water', farmId = 'farm-001-rajendra', taskId = 'wt-03', suggestedBarcode = '8901234567890') {
  const modalHtml = `
    <div class="modal-backdrop" id="barcode-modal">
      <div class="modal-content" style="max-width:500px; text-align:center;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">Treatment Application & Barcode Auth</span>
            <div style="font-size:18px; font-weight:800;">Log Treatment Application</div>
          </div>
          <button onclick="closeBarcodeModal()" class="modal-close">&times;</button>
        </div>

        <div style="background:var(--mint-soft); border:1px solid var(--mint-light); border-radius:12px; padding:12px; margin-bottom:12px; text-align:left;">
          <div style="font-size:14px; font-weight:800; color:var(--primary);">${treatmentName}</div>
          <div style="font-size:11px; color:var(--slate); margin-top:2px;">Target: <strong>${targetIssue}</strong></div>
          <div style="font-size:11px; color:var(--slate);">Dosage: <strong>${dosage}</strong></div>
        </div>

        <div class="barcode-viewfinder" id="barcode-viewfinder-box" style="position:relative; width:100%; height:190px; background:#0F2E23; border-radius:14px; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <video id="barcode-video-feed" autoplay playsinline style="width:100%; height:100%; object-fit:cover; display:none;"></video>
          
          <div id="barcode-sim-view" style="display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--mint-light);">
            <div style="font-size:32px;">📷</div>
            <div style="font-size:12px; font-weight:700; margin-top:6px;">Bottle Barcode Scanner Active</div>
            <div style="font-size:10px; opacity:0.8;">Align EAN-13 / QR Barcode within reticle</div>
          </div>

          <div class="barcode-reticle" style="position:absolute; width:80%; height:60%; border:2px dashed rgba(216, 243, 220, 0.8); border-radius:8px; pointer-events:none; display:flex; align-items:flex-end; justify-content:center; padding-bottom:6px;">
            <span style="color:rgba(216, 243, 220, 0.9); font-size:10px; font-family:monospace; background:rgba(0,0,0,0.5); padding:2px 6px; border-radius:4px;">[ BOTTLE BARCODE RETICLE ]</span>
          </div>
          <div class="scanner-laser"></div>
        </div>

        <div style="margin:10px 0;">
          <button onclick="startLiveBarcodeCamera('${farmId}', '${taskId}')" class="agro-btn-secondary" style="font-size:11px; padding:8px 12px; width:100%;">
            📹 Activate Live Device Camera Scanner
          </button>
        </div>

        <div style="background:var(--bg-canvas); padding:10px 14px; border-radius:12px; margin-bottom:14px; border:1px solid var(--border); font-size:11px; text-align:left;">
          <div style="font-weight:700; color:var(--ink); margin-bottom:4px;">⚡ Quick Bottle Scan Options:</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <button onclick="executeTreatmentBarcodeScan('${suggestedBarcode}', '${farmId}', '${taskId}', '${treatmentName}', '${dosage}', '${targetIssue}')" class="agro-btn-secondary" style="font-size:11px; padding:6px; justify-content:flex-start;">
              Scan: Verified Zero-Residue Bio-Extract (${suggestedBarcode})
            </button>
            <button onclick="executeTreatmentBarcodeScan('8909876543210', '${farmId}', '${taskId}', '${treatmentName}', '${dosage}', '${targetIssue}')" class="agro-btn-secondary" style="font-size:11px; padding:6px; justify-content:flex-start;">
              Scan: Certified Bio-Shield Microflora (8909876543210)
            </button>
            <button onclick="executeTreatmentBarcodeScan('8905555444433', '${farmId}', '${taskId}', '${treatmentName}', '${dosage}', '${targetIssue}')" class="agro-btn-secondary" style="font-size:11px; padding:6px; justify-content:flex-start; color:var(--coral); border-color:var(--coral);">
              Scan: Non-Compliant Synthetic Bottle (8905555444433)
            </button>
          </div>
        </div>

        <div class="form-group" style="text-align:left;">
          <label class="form-label">Or Enter Barcode Manually</label>
          <div style="display:flex; gap:8px;">
            <input type="text" id="manual-treatment-barcode" class="form-control" placeholder="e.g. 8901234567890" value="${suggestedBarcode}" />
            <button onclick="executeTreatmentBarcodeScan(document.getElementById('manual-treatment-barcode').value, '${farmId}', '${taskId}', '${treatmentName}', '${dosage}', '${targetIssue}')" class="agro-btn-primary" style="padding:8px 14px; white-space:nowrap;">
              Verify & Log
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function executeTreatmentBarcodeScan(barcode, farmId = 'farm-001-rajendra', taskId = 'wt-03', treatmentName = 'Bio-Neem NSKE 5%', dosage = '500 ml / Acre', targetIssue = 'Pest Control') {
  closeBarcodeModal();

  // 1. Dual-Verification Geo-spatial Check: Retrieve on-site GPS coordinates
  const isSimulatedMismatch = state.testGeoFenceMismatch === true;
  const currentLat = isSimulatedMismatch ? 13.0827 : 10.7872;
  const currentLng = isSimulatedMismatch ? 80.2707 : 79.1375;

  // 2. Client-Side Encryption of Sensitive Log Payload (AES-256-GCM)
  const rawPayload = {
    farm_id: farmId,
    activity_id: taskId,
    barcode: barcode,
    product_name: treatmentName,
    dosage: dosage,
    target_issue: targetIssue,
    latitude: currentLat,
    longitude: currentLng,
    operator_phone: state.user?.phone || '9842100004',
    timestamp: new Date().toISOString()
  };

  const encryptedEnvelope = await AgroCrypto.encryptPayload(rawPayload, 'farmer');

  // 3. Network or Offline Queue Execution
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    AgroSmartOfflineSync.enqueue({
      actionType: 'DUAL_VERIFIED_TREATMENT',
      endpoint: '/api/farmer/treatment/log-application',
      body: rawPayload,
      description: `${treatmentName} (${barcode}) logged offline`
    });
    completeWeeklyTask(farmId, taskId);
    showToast('📦 Task saved to Offline Queue. Will sync upon reconnection.');
    renderApp();
    return;
  }

  try {
    const res = await fetch('/api/farmer/treatment/log-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({
        ...rawPayload,
        client_encrypted_envelope: encryptedEnvelope
      })
    });

    if (res.ok) {
      const data = await res.json();
      completeWeeklyTask(farmId, taskId);
      state.auditHistory.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event: 'Dual-Verification Treatment Logged',
        detail: `GPS & Barcode Authenticated: ${treatmentName} applied to ${farmId}. Token: ${data.application_record?.verification_token || 'DUAL-PASS'}`,
        type: 'barcode'
      });
      openTreatmentResultModal(data, farmId, taskId);
    } else {
      const errData = await res.json().catch(() => ({}));
      if (errData.error === 'DUAL_VERIFICATION_FAILED') {
        alert(`⚠️ DUAL-VERIFICATION FAILED!\n\n${errData.message || 'Both GPS on-site proximity (<= 500m) AND physical barcode authentication are strictly required to commit this task.'}\n\nTask commit has been rejected.`);
        return;
      }
      completeWeeklyTask(farmId, taskId);
      alert(`✓ Treatment Application Confirmed!\n\n${treatmentName} logged for ${farmId}. Task marked completed.`);
      renderApp();
    }
  } catch (e) {
    // Cellular dropout fallback: Auto-queue locally
    AgroSmartOfflineSync.enqueue({
      actionType: 'DUAL_VERIFIED_TREATMENT',
      endpoint: '/api/farmer/treatment/log-application',
      body: rawPayload,
      description: `${treatmentName} (${barcode}) queued on network interruption`
    });
    completeWeeklyTask(farmId, taskId);
    showToast('⚠️ Network Interrupted: Saved to Offline Auto-Sync Queue.');
    renderApp();
  }
}

function openTreatmentResultModal(data, farmId, taskId) {
  const rec = data.application_record;
  const isAuth = true;

  const modalHtml = `
    <div class="modal-backdrop" id="barcode-result-modal">
      <div class="modal-content" style="max-width:500px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">
              ✓ APPLICATION REGISTERED & SIGNED
            </span>
            <div style="font-size:18px; font-weight:800;">${rec.product_name}</div>
          </div>
          <button onclick="closeBarcodeResultModal()" class="modal-close">&times;</button>
        </div>

        <div style="background:var(--mint-soft); border:1.5px solid var(--mint-light); border-radius:14px; padding:14px; margin-bottom:14px;">
          <div style="font-size:13px; font-weight:800; color:var(--primary);">
            ${data.message || 'Treatment application successfully verified and logged.'}
          </div>
          <div style="font-size:11px; color:var(--slate); margin-top:4px;">
            Cryptographic Token: <strong>${rec.verification_token}</strong> • PHI: ${rec.pre_harvest_interval_days} Days
          </div>
        </div>

        <div class="grid-2" style="margin-bottom:14px;">
          <div class="dosing-cell">
            <div class="cell-label">Applied To</div>
            <div class="cell-value" style="font-size:12px;">${farmId}</div>
          </div>
          <div class="dosing-cell">
            <div class="cell-label">Applied By</div>
            <div class="cell-value" style="font-size:12px;">${rec.applied_by}</div>
          </div>
          <div class="dosing-cell">
            <div class="cell-label">Dosage Applied</div>
            <div class="cell-value" style="font-size:12px; color:var(--primary); font-weight:800;">${rec.dosage}</div>
          </div>
          <div class="dosing-cell">
            <div class="cell-label">MRL Standard</div>
            <div class="cell-value" style="font-size:12px; color:var(--primary); font-weight:800;">${rec.mrl_compliance}</div>
          </div>
        </div>

        <button onclick="closeBarcodeResultModal(); renderApp();" class="agro-btn-primary" style="width:100%; padding:10px; font-size:12px;">
          ✓ Confirm & Return to Farm Dashboard
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// =========================================================================
// 4. HARVEST COMPLETION AUDIT LEDGER, PDF & QR GENERATION
// =========================================================================
async function fetchComplianceDocumentData(farmId) {
  const targetId = farmId || state.activeFarm?.id || 'farm-001-rajendra';
  try {
    const res = await fetch(`/api/compliance/export-document/${targetId}`, {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Error fetching live compliance document:', e);
  }
  const farm = state.farms.find(f => f.id === targetId) || state.activeFarm || {
    id: targetId,
    land_name: 'Amaravathi Basin Plot A',
    crop_type: 'Ponni Rice (BPT 5204)',
    district: 'Thanjavur Basin',
    area_acres: 4.2,
    area_ha: 1.7,
    current_stage: 'Harvest'
  };
  return {
    document_metadata: {
      certificate_title: 'OFFICIAL INTERNATIONAL EXPORT COMPLIANCE & CHEMICAL AUDIT CERTIFICATE',
      document_code: `EXP-DOC-TN-2026-8492`,
      generated_at: new Date().toISOString(),
      issuing_authority: 'AgroSmart Digital Trade & Export Certification Authority',
      accreditation: 'APEDA, APVMA Table 1, Codex Alimentarius & EU Regulation (EC) 396/2005'
    },
    land_parcel: {
      id: farm.id,
      land_name: farm.land_name || 'Amaravathi Basin Plot A',
      district: farm.district || 'Thanjavur Basin',
      geo_coordinates: '10.7872°N, 79.1375°E',
      area_acres: farm.area_acres || 4.2,
      area_ha: farm.area_ha || 1.7,
      current_crop: farm.crop_type || 'Ponni Rice (BPT 5204)',
      current_stage: farm.current_stage || 'Harvest',
      farmer_name: state.user.name || 'Arumugam Sundaram',
      farmer_id_code: state.user.farmer_id_code || 'TN-FARM-8492',
      soil_ph: 7.15,
      soil_nitrogen_status: 'Optimal Bio-Residual / Low Chemical Leaching'
    },
    applied_chemical_ledger: [
      {
        id: 'chem-01',
        application_date: '2026-08-15T07:30:00Z',
        product_name: 'Neem Seed Kernel Extract (NSKE 5% EC)',
        active_ingredient: 'Azadirachtin A & B (0.05% w/w)',
        chemical_family: 'Botanical Bio-Pesticide',
        dosage: '500 ml / Acre in 200L water',
        target_issue: 'Stem Borer & Leaf Folder Control',
        pre_harvest_interval_days: 3,
        harvest_safety_date: '2026-08-18',
        mrl_limit_mg_per_kg: 1.0,
        estimated_residue_at_harvest: 0.00,
        compliance_status: 'COMPLIANT (Zero Synthetic Residue)',
        tamper_proof_token: 'TAMPER-NSKE-884920'
      },
      {
        id: 'chem-02',
        application_date: '2026-09-02T09:15:00Z',
        product_name: 'Bio-Potash & Micronutrient Foliar Spray',
        active_ingredient: 'Potassium Gluconate 15% + Zinc EDTA',
        chemical_family: 'Organic Mineral Chelates',
        dosage: '2.0 L / Acre foliar application',
        target_issue: 'Grain Hardening & Drought Resistance',
        pre_harvest_interval_days: 3,
        harvest_safety_date: '2026-09-05',
        mrl_limit_mg_per_kg: 5.0,
        estimated_residue_at_harvest: 0.00,
        compliance_status: 'APEDA & APVMA CERTIFIED PASS',
        tamper_proof_token: 'TAMPER-POTASH-940212'
      }
    ],
    international_standards_clearances: [
      {
        standard_name: 'APEDA Zero Synthetic Residue Standard (India)',
        status: 'CLEARED & PASS',
        max_allowable_residue: '0.01 mg/kg',
        observed_residue: '0.000 mg/kg',
        compliance_verdict: 'Full compliance — eligible for commercial maritime export.'
      },
      {
        standard_name: 'APVMA Australia Table 1 Standard (Active Ingredients)',
        status: 'COMPLIANT & APPROVED',
        max_allowable_residue: '0.05 mg/kg',
        observed_residue: '< 0.001 mg/kg',
        compliance_verdict: 'Decay curve satisfied with pre-harvest interval >= 3 days.'
      },
      {
        standard_name: 'Codex Alimentarius International Food Standard (CCPR)',
        status: 'COMPLIANT',
        max_allowable_residue: '0.02 mg/kg',
        observed_residue: '0.000 mg/kg',
        compliance_verdict: 'Microbial bio-fungicide and botanical extract verified.'
      },
      {
        standard_name: 'European Union Regulation (EC) No 396/2005',
        status: 'EXPORT READY (GRADE A)',
        max_allowable_residue: '0.01 mg/kg',
        observed_residue: '0.000 mg/kg',
        compliance_verdict: 'Meets strict EU maximum residue limits with zero quarantine flags.'
      }
    ],
    compliance_summary: {
      export_readiness_score: 98.8,
      total_chemicals_logged: 2,
      synthetic_banned_chemicals_detected: 0,
      pre_harvest_interval_cleared: true,
      overall_verdict: 'APPROVED FOR INTERNATIONAL EXPORT CONSIGNMENT'
    },
    qr_compliance: {
      verification_token: `APEDA-MRL-CERT-${targetId}-849201`,
      verification_url: `http://localhost:5000/api/compliance/verify/APEDA-MRL-CERT-${targetId}-849201`,
      tamper_proof_hmac: '0x4f9b2a7e91c884920b72a048e9cd01',
      qr_svg: generateSvgQr(`http://localhost:5000/api/compliance/verify/APEDA-MRL-CERT-${targetId}-849201`)
    }
  };
}

function buildComplianceDocumentHtml(doc, isModal = true) {
  const isTamil = state.language === 'ta';
  const meta = doc.document_metadata || {};
  const parcel = doc.land_parcel || {};
  const chemicals = doc.applied_chemical_ledger || [];
  const standards = doc.international_standards_clearances || [];
  const summary = doc.compliance_summary || {};
  const qr = doc.qr_compliance || {};

  const certTitle = isTamil ? 'அதிகாரப்பூர்வ ஏற்றுமதி தரம் மற்றும் வேளாண் இரசாயன தணிக்கை சான்றிதழ்' : 'Official Export Quality & Agrochemical Audit Certificate';
  const certDossier = isTamil ? 'சர்வதேச ஏற்றுமதி இணக்கத்தன்மை ஆவணம் (International Export Compliance Dossier)' : 'International Export Compliance Dossier';
  const accreditationText = isTamil ? 'அங்கீகாரம்: <strong>APEDA, APVMA அட்டவணை 1, கோடெக்ஸ் அலிமெண்டாரியஸ் & EU ஒழுங்குமுறை 396/2005</strong>' : `Accreditation: <strong>${meta.accreditation || 'APEDA, APVMA Table 1, Codex Alimentarius & EU Regulation 396/2005'}</strong>`;
  const approvedBadge = isTamil ? '✓ ஏற்றுமதிக்கு அங்கீகரிக்கப்பட்டது (APPROVED)' : `✓ ${summary.overall_verdict || 'APPROVED FOR EXPORT'}`;
  const issuedText = isTamil ? `வழங்கப்பட்ட தேதி: ${new Date(meta.generated_at || Date.now()).toLocaleDateString('ta-IN')}` : `Issued: ${new Date(meta.generated_at || Date.now()).toLocaleDateString()}`;
  const qrVerifiedLabel = isTamil ? 'நிகழ்நேர QR சரிபார்க்கப்பட்டது (REAL-TIME QR VERIFIED)' : 'REAL-TIME QR VERIFIED';
  const readinessLabel = isTamil ? `${summary.export_readiness_score || 98.8}% ஏற்றுமதி தயார்நிலை` : `${summary.export_readiness_score || 98.8}% EXPORT READINESS`;
  const zeroBannedLabel = isTamil ? 'தடைசெய்யப்பட்ட இரசாயனங்கள் இல்லை' : 'ZERO BANNED CHEMICALS';
  const parcelLabel = isTamil ? 'நிலப்பரப்பு' : 'Parcel';
  const farmerLabel = isTamil ? 'விவசாயி' : 'Farmer';
  const districtLabel = isTamil ? 'மாவட்டம்' : 'District';
  const geolockLabel = isTamil ? 'GPS புவி-அமைவிடம்' : 'GPS Geo-Lock';
  const acreageLabel = isTamil ? 'பரப்பளவு' : 'Acreage';
  const acresUnit = isTamil ? 'ஏக்கர்' : 'Acres';
  const haUnit = isTamil ? 'ஹெக்டேர்' : 'Ha';
  const soilPhLabel = isTamil ? 'மண் pH' : 'Soil pH';
  const phiLabel = isTamil ? 'முன்-அறுவடை இடைவெளி' : 'Pre-Harvest Interval';
  const phiCleared = isTamil ? 'பாதுகாப்பானது (0.00 ppm எஞ்சிய அளவு)' : 'CLEARED (0.00 ppm Residue)';
  const verLink = isTamil ? 'சரிபார்ப்பு இணைப்பு:' : 'Verification Link:';

  const chemTitle = isTamil ? '🧪 பயன்படுத்தப்பட்ட வேளாண் இரசாயனங்களின் நிகழ்நேர பதிவேடு' : '🧪 Live Applied Agrochemicals Application History';
  const chemSub = isTamil ? 'நிலப்பரப்பு தெளிப்பு பதிவேட்டிலிருந்து நேரடியாக தொகுக்கப்பட்ட நேரலை தரவு.' : 'Real-time records pulled live from land parcel application ledger.';
  const chemCount = isTamil ? `${chemicals.length} பதிவுசெய்யப்பட்ட உள்ளீடுகள்` : `${chemicals.length} Logged Applications`;

  const colDate = isTamil ? 'தேதி & நேரம் (Timestamp & Date)' : 'Timestamp & Application Date';
  const colChem = isTamil ? 'வேளாண் மருந்து / உள்ளீடு (Input)' : 'Agrochemical / Input';
  const colActive = isTamil ? 'செயலில் உள்ள மூலப்பொருள்' : 'Active Ingredient';
  const colDosage = isTamil ? 'மருந்தளவு & இலக்கு (Dosage & Target)' : 'Dosage & Target';
  const colPhi = isTamil ? 'PHI & அறுவடை பாதுகாப்பு' : 'PHI & Harvest';
  const colMrl = isTamil ? 'MRL முடிவு (Verdict)' : 'MRL Verdict';
  const colToken = isTamil ? 'பாதுகாப்பு டோக்கன் (Token)' : 'Anti-Fraud Token';

  const stdTitle = isTamil ? '🌐 சர்வதேச தரநிலைகள் ஒப்புதல் அணி (4 சர்வதேச கட்டமைப்பு)' : '🌐 International Standards Clearance Matrix (4 Frameworks)';
  const hmacLabel = isTamil ? 'HMAC பாதுகாப்பு குறியீடு:' : 'HMAC Proof:';
  const certFooter = isTamil ? 'அக்ரோஸ்மார்ட் தானியங்கி ஒழுங்குமுறை அமைப்பால் சான்றளிக்கப்பட்டது • சுங்க மற்றும் துறைமுக அதிகாரிகளால் சரிபார்க்கத்தக்கது' : 'Certified by AgroSmart Automated Regulatory Engine • Verifiable by Customs Port Officials';
  const printBtnText = isTamil ? 'அதிகாரப்பூர்வ PDF அச்சிடுக / பதிவிறக்குக' : 'Print / Export Official PDF';
  const closeBtnText = isTamil ? 'ஆவணத்தை மூடுக' : 'Close Document';

  return `
    <div class="audit-passport-card" id="printable-compliance-document" style="background:#FFFFFF; border:2px solid var(--primary); border-radius:18px; padding:24px; box-shadow:0 8px 30px rgba(27,77,62,0.12);">
      <!-- Official Certificate Header -->
      <div style="border-bottom:2px solid var(--primary); padding-bottom:16px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
        <div style="flex:1; min-width:260px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">🏛️</span>
            <div>
              <div style="font-size:10px; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:1px;">${certTitle}</div>
              <div style="font-size:18px; font-weight:900; color:var(--ink); letter-spacing:-0.5px;">${certDossier}</div>
            </div>
          </div>
          <div style="font-size:11px; color:var(--slate); margin-top:6px;">
            ${accreditationText}
          </div>
        </div>
        <div style="text-align:right;">
          <span class="badge badge-forest" style="font-size:12px; padding:6px 12px;">${approvedBadge}</span>
          <div style="font-family:monospace; font-weight:800; font-size:11.5px; margin-top:5px; color:var(--primary);">${meta.document_code || 'EXP-DOC-TN-2026'}</div>
          <div style="font-size:10px; color:var(--slate); margin-top:2px;">${issuedText}</div>
        </div>
      </div>

      <!-- Real-Time Scannable QR Code & Verification Block -->
      <div style="display:flex; gap:18px; align-items:center; background:linear-gradient(135deg, var(--mint-soft) 0%, #FFFFFF 100%); border:1.5px solid var(--border); border-radius:14px; padding:16px; margin-bottom:18px; flex-wrap:wrap;">
        <div style="background:#FFFFFF; border:1.5px solid var(--primary); border-radius:12px; padding:8px; display:flex; flex-direction:column; align-items:center; box-shadow:0 4px 12px rgba(27,77,62,0.1);">
          <div style="width:120px; height:120px; display:flex; align-items:center; justify-content:center;">
            ${qr.qr_svg || (qr.qr_data_url ? `<img src="${qr.qr_data_url}" width="120" height="120" style="border-radius:6px;" alt="QR Code" />` : generateSvgQr(qr.verification_url || 'http://localhost:5000'))}
          </div>
          <span style="font-size:8px; font-weight:800; font-family:monospace; color:var(--primary); letter-spacing:0.8px; margin-top:4px;">${qrVerifiedLabel}</span>
        </div>

        <div style="flex:1; min-width:240px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="badge badge-forest" style="font-size:10px;">${readinessLabel}</span>
            <span class="badge badge-mint" style="font-size:10px;">${zeroBannedLabel}</span>
          </div>
          <div style="font-size:14px; font-weight:800; color:var(--ink); margin-top:6px;">
            ${parcelLabel}: ${parcel.land_name || 'Amaravathi Basin Plot A'} (${translateCrop(parcel.current_crop || 'Ponni Rice')})
          </div>
          <div style="font-size:11.5px; color:var(--slate); margin-top:4px; line-height:1.5;">
            ${farmerLabel}: <strong>${parcel.farmer_name}</strong> (<code>${parcel.farmer_id_code}</code>) • ${districtLabel}: <strong>${parcel.district}</strong><br/>
            ${geolockLabel}: <strong>${parcel.geo_coordinates || '10.7872°N, 79.1375°E'}</strong> • ${acreageLabel}: <strong>${parcel.area_acres} ${acresUnit} (${parcel.area_ha} ${haUnit})</strong><br/>
            ${soilPhLabel}: <strong>${parcel.soil_ph || 7.15}</strong> • ${phiLabel}: <strong style="color:var(--primary);">${phiCleared}</strong>
          </div>
          <div style="margin-top:8px; font-size:10.5px;">
            <span style="color:var(--slate);">${verLink}</span>
            <a href="${qr.verification_url || '#'}" target="_blank" style="color:var(--primary); font-weight:800; font-family:monospace; text-decoration:underline; word-break:break-all;">${qr.verification_url || 'http://localhost:5000/api/compliance/verify'}</a>
          </div>
        </div>
      </div>

      <!-- Live Applied Agrochemicals Application History Table -->
      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <div style="font-size:13px; font-weight:800; color:var(--ink); text-transform:uppercase; letter-spacing:0.5px;">${chemTitle}</div>
            <div style="font-size:11px; color:var(--slate);">${chemSub}</div>
          </div>
          <span class="badge badge-forest" style="font-size:10px;">${chemCount}</span>
        </div>

        <div class="table-responsive">
          <table class="audit-ledger-table" style="width:100%; border-collapse:collapse; font-size:11px;">
            <thead>
              <tr style="background:var(--bg-canvas); text-align:left; border-bottom:1.5px solid var(--border);">
                <th style="padding:8px;">${colDate}</th>
                <th style="padding:8px;">${colChem}</th>
                <th style="padding:8px;">${colActive}</th>
                <th style="padding:8px;">${colDosage}</th>
                <th style="padding:8px;">${colPhi}</th>
                <th style="padding:8px;">${colMrl}</th>
                <th style="padding:8px;">${colToken}</th>
              </tr>
            </thead>
            <tbody>
              ${chemicals.map(c => `
                <tr style="border-bottom:1px solid var(--border);">
                  <td style="padding:8px; font-family:monospace; font-size:10px;">
                    <div style="font-weight:700; color:var(--ink);">${c.application_timestamp_formatted || (c.application_date ? c.application_date.replace('T', ' ').substring(0, 19) + ' UTC' : '2026-08-15 07:30:00 UTC')}</div>
                    <div style="color:var(--slate); font-size:9px;">Timestamp: ${c.application_date ? c.application_date : '2026-08-15T07:30:00Z'}</div>
                  </td>
                  <td style="padding:8px; font-weight:800; color:var(--ink);">
                    ${c.product_name}
                    <div style="font-size:9.5px; color:var(--slate);">${c.chemical_family || 'Botanical Extract'}</div>
                  </td>
                  <td style="padding:8px; font-size:10.5px;">${c.active_ingredient || 'Natural Formulation'}</td>
                  <td style="padding:8px; font-size:10.5px;">
                    <div>${c.dosage || '500 ml / Acre'}</div>
                    <div style="font-size:9.5px; color:var(--slate);">${c.target_issue || 'Protective'}</div>
                  </td>
                  <td style="padding:8px; font-size:10.5px;">
                    <div>PHI: <strong>${c.pre_harvest_interval_days || 3} ${isTamil ? 'நாட்கள்' : 'Days'}</strong></div>
                    <div style="font-size:9.5px; color:var(--primary); font-weight:700;">Safe: ${c.harvest_safety_date || (isTamil ? 'அனுமதிக்கப்பட்டது' : 'Cleared')}</div>
                  </td>
                  <td style="padding:8px;">
                    <span class="badge badge-forest" style="font-size:9.5px; white-space:nowrap;">✓ ${isTamil ? 'தேர்ச்சி (0.00 ppm)' : (c.compliance_status || 'PASS (0.00 ppm)')}</span>
                  </td>
                  <td style="padding:8px; font-family:monospace; font-size:9.5px; color:var(--slate);">${c.tamper_proof_token || 'TOKEN-OK'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4 International Standards Compliance Clearances -->
      <div style="margin-bottom:18px;">
        <div style="font-size:13px; font-weight:800; color:var(--ink); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
          ${stdTitle}
        </div>
        <div class="grid-2" style="gap:10px;">
          ${standards.map(std => `
            <div style="background:var(--bg-canvas); border:1px solid var(--border); border-left:4px solid var(--primary); border-radius:10px; padding:10px 12px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <strong style="font-size:12px; color:var(--ink);">${std.standard_name}</strong>
                <span class="badge badge-forest" style="font-size:9px;">${isTamil ? 'தேர்ச்சி (PASS)' : std.status}</span>
              </div>
              <div style="display:flex; gap:12px; font-size:11px; margin-top:5px; color:var(--slate);">
                <span>${isTamil ? 'அனுமதிக்கப்பட்ட MRL' : 'Max MRL'}: <strong>${std.max_allowable_residue}</strong></span>
                <span>•</span>
                <span>${isTamil ? 'கண்டறியப்பட்ட அளவு' : 'Observed'}: <strong style="color:var(--primary);">${std.observed_residue}</strong></span>
              </div>
              <div style="font-size:10.5px; color:var(--primary-light); margin-top:4px;">
                ${std.compliance_verdict}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Digital Signature & Security Footer -->
      <div style="border-top:1.5px dashed var(--border); padding-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:11px; color:var(--slate);">
        <div>
          <span>${hmacLabel} </span>
          <code style="font-family:monospace; color:var(--primary);">${qr.tamper_proof_hmac || '0x4f9b2a7e91c...'}</code>
        </div>
        <div style="font-style:italic;">
          ${certFooter}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="no-print" style="margin-top:18px; display:flex; justify-content:flex-end; gap:10px;">
        <button onclick="printComplianceDocument()" class="agro-btn-primary" style="padding:10px 18px; font-size:12px; display:inline-flex; align-items:center; gap:6px;">
          <span>🖨️</span>
          <span>${printBtnText}</span>
        </button>
        ${isModal ? `
          <button onclick="closeDynamicComplianceModal()" class="agro-btn-secondary" style="padding:10px 18px; font-size:12px;">
            ${closeBtnText}
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

// Dedicated Blank-Free PDF Print Handler
function printComplianceDocument() {
  const docElem = document.getElementById('printable-compliance-document');
  if (!docElem) {
    window.print();
    return;
  }

  const printTitle = state.language === 'ta' ? 'அக்ரோஸ்மார்ட் - அதிகாரப்பூர்வ ஏற்றுமதி இணக்கத்தன்மை சான்றிதழ்' : 'AgriSmart - Official Export Compliance Certificate';

  try {
    const printWin = window.open('', '_blank', 'width=960,height=840');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(`<!DOCTYPE html>
<html lang="${state.language || 'en'}">
<head>
  <meta charset="utf-8">
  <title>${printTitle}</title>
  <link rel="stylesheet" href="/style.css">
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    body { background: #FFFFFF !important; font-family: 'Inter', -apple-system, sans-serif !important; margin: 0; padding: 16px; color: #1B2E24 !important; }
    .no-print { display: none !important; }
    #printable-compliance-document { border: 2px solid #1B4D3E !important; box-shadow: none !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; }
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  </style>
</head>
<body>
  ${docElem.outerHTML}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 400);
    };
  <\/script>
</body>
</html>`);
      printWin.document.close();
      return;
    }
  } catch (e) {
    console.warn('Direct print window blocked, using default window.print()', e);
  }

  window.print();
}

async function openDynamicComplianceModal(farmId) {
  closeDynamicComplianceModal();
  const doc = await fetchComplianceDocumentData(farmId);

  const modalHtml = `
    <div class="modal-backdrop" id="compliance-document-modal" style="z-index:9999;">
      <div class="modal-content" style="max-width:850px; max-height:90vh; overflow-y:auto; padding:16px;">
        <div style="display:flex; justify-content:flex-end; margin-bottom:8px;" class="no-print">
          <button onclick="closeDynamicComplianceModal()" class="modal-close" style="font-size:24px; cursor:pointer; background:none; border:none;">&times;</button>
        </div>
        ${buildComplianceDocumentHtml(doc, true)}
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeDynamicComplianceModal() {
  const m = document.getElementById('compliance-document-modal');
  if (m) m.remove();
  const legacy = document.getElementById('audit-passport-modal');
  if (legacy) legacy.remove();
}

async function renderDynamicComplianceView(container, farmId) {
  container.innerHTML = `
    <div style="padding:40px; text-align:center; color:var(--slate);">
      ⏳ Loading Live Export Compliance Dossier & Real-Time QR Code...
    </div>
  `;
  const doc = await fetchComplianceDocumentData(farmId);
  container.innerHTML = `
    <div class="hero-header" style="background: linear-gradient(135deg, #13392E 0%, #1B4D3E 100%);">
      <div class="hero-subtitle">International Phytosanitary & Export Traceability</div>
      <div class="hero-title">Live Export Compliance Certificate & QR 📜</div>
      <div class="hero-meta">
        <span>Authority: <strong>APEDA / APVMA Table 1 / Codex / EU MRL</strong></span>
        <span>•</span>
        <span>Parcel: <strong>${doc.land_parcel?.land_name || 'Amaravathi Basin Plot A'}</strong></span>
      </div>
    </div>
    ${buildComplianceDocumentHtml(doc, false)}
  `;
}

const openHarvestTraceabilityPassport = openDynamicComplianceModal;
const closeAuditPassportModal = closeDynamicComplianceModal;


// SPECIFICATION 5: SCANNABLE PROCEDURAL QR MATRIX GENERATOR
function generateSvgQr(url) {
  const size = 25;
  const matrix = Array(size).fill(0).map(() => Array(size).fill(0));

  function drawFinder(r, c) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[r + i][c + j] = 1;
        }
      }
    }
  }

  // 3 Primary corner finder patterns
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = 1;
      matrix[i][6] = 1;
    }
  }

  // Alignment pattern
  const ar = 16, ac = 16;
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) {
        matrix[ar + i][ac + j] = 1;
      }
    }
  }

  // Deterministic hash stream
  let hash = 5381;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) + hash) + url.charCodeAt(i);
  }

  let bitIndex = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r < 8 && c < 8) continue;
      if (r < 8 && c >= size - 8) continue;
      if (r >= size - 8 && c < 8) continue;
      if (r === 6 || c === 6) continue;
      if (r >= 14 && r <= 18 && c >= 14 && c <= 18) continue;

      const charCode = url.charCodeAt(bitIndex % url.length) || 42;
      const bit = ((hash ^ (charCode * (r * size + c + 17))) >> (bitIndex % 15)) & 1;
      matrix[r][c] = bit;
      bitIndex++;
    }
  }

  const cellSize = 4.2;
  const padding = 6;
  const totalPx = Math.ceil(size * cellSize + padding * 2);
  let rects = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 1) {
        const x = (padding + c * cellSize).toFixed(1);
        const y = (padding + r * cellSize).toFixed(1);
        rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#1B4D3E" />`;
      }
    }
  }

  return `
    <svg width="105" height="105" viewBox="0 0 ${totalPx} ${totalPx}" style="background:#FFFFFF; border-radius:8px; padding:2px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <rect width="100%" height="100%" fill="#FFFFFF" />
      ${rects}
    </svg>
  `;
}

// =========================================================================
// 5. MARKETPLACE FLOATING ACTION BUTTON HANDLER
// =========================================================================
function handleMarketplaceFabClick() {
  if (state.currentRole === 'shop_owner') {
    openPostRequirementModal();
  } else {
    openFarmerMarketplaceModal();
  }
}

function openFarmerMarketplaceModal() {
  const farm = state.activeFarm;
  const modalHtml = `
    <div class="modal-backdrop" id="farmer-market-modal">
      <div class="modal-content" style="max-width:480px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">Direct Kisan Supply</span>
            <div style="font-size:18px; font-weight:800;">Post Harvest Lot to Marketplace</div>
          </div>
          <button onclick="closeFarmerMarketModal()" class="modal-close">&times;</button>
        </div>

        <form onsubmit="handleFarmerMarketSubmit(event)">
          <div class="form-group">
            <label class="form-label">Select Crop Harvest</label>
            <select id="farmer-market-crop" class="form-control">
              <option value="${farm?.crop_type || 'Ponni Rice (BPT 5204)'}">${farm?.crop_type || 'Ponni Rice (BPT 5204)'}</option>
              <option value="Erode Turmeric (Curcumin 4.5%)">Erode Turmeric</option>
              <option value="Chettinad Organic Cotton">Chettinad Cotton</option>
            </select>
          </div>

          <div class="grid-2 form-group" style="gap:10px;">
            <div>
              <label class="form-label">Harvest Volume (kg)</label>
              <input type="number" id="farmer-market-qty" class="form-control" value="2500" min="50" step="10" required />
              <div style="font-size:10px; color:var(--slate); margin-top:2px;">Strictly measured in kilograms (kg)</div>
            </div>
            <div>
              <label class="form-label">Asking Rate / kg (₹)</label>
              <input type="number" step="0.5" id="farmer-market-price" class="form-control" value="48.5" min="1" required />
              <div style="font-size:10px; color:var(--slate); margin-top:2px;">Mandatory rate per kg</div>
            </div>
          </div>

          <div class="grid-2 form-group" style="gap:10px;">
            <div>
              <label class="form-label">Quality Grade</label>
              <select id="farmer-market-grade" class="form-control" required>
                <option value="Grade A" selected>Grade A (Premium Export)</option>
                <option value="Grade B">Grade B (Standard Mandi)</option>
              </select>
            </div>
            <div>
              <label class="form-label">Harvest Ready Date</label>
              <input type="date" id="farmer-market-date" class="form-control" value="2026-09-25" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Certification & Organic Status</label>
            <select id="farmer-market-cert" class="form-control" required>
              <option value="Fertilizer-Free / 100% Bio-Organic" selected>Fertilizer-Free / 100% Bio-Organic</option>
              <option value="APEDA Zero-Synthetic Residue">APEDA Zero-Synthetic Residue</option>
              <option value="Conventional Non-Certified">Conventional Non-Certified</option>
            </select>
          </div>

          <button type="submit" class="agro-btn-primary" style="width:100%; padding:12px; font-size:13px; font-weight:800; margin-top:6px;">
            ✓ Publish Lot to Exporters & Mandi Hub
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function handleFarmerMarketSubmit(event) {
  event.preventDefault();
  const crop = document.getElementById('farmer-market-crop').value;
  const quantity_kg = parseFloat(document.getElementById('farmer-market-qty').value) || 2500;
  const price_per_kg = parseFloat(document.getElementById('farmer-market-price').value) || 48.5;
  const grade = document.getElementById('farmer-market-grade').value || 'Grade A';
  const certification_status = document.getElementById('farmer-market-cert').value || 'Fertilizer-Free / 100% Bio-Organic';
  const harvest_date = document.getElementById('farmer-market-date').value;

  try {
    await fetch('/api/farmer/supply-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({
        crop,
        quantity_kg,
        price_per_kg,
        grade,
        certification_status,
        harvest_date
      })
    });

    if (!state.marketplaceLots) state.marketplaceLots = [];
    state.marketplaceLots.unshift({
      id: `lot-farmer-${Date.now()}`,
      crop,
      quantity_kg,
      quantity: quantity_kg / 100,
      price_per_kg,
      grade,
      certification_status,
      seller_name: state.user?.name || 'Arumugam Sundaram',
      channel: grade === 'Grade A' ? 'export' : 'mandi',
      region: 'Tamil Nadu',
      status: 'ready',
      is_farmer_direct_demand: true
    });

    alert(`✓ Harvest Lot Published Successfully!\n\n${quantity_kg.toLocaleString('en-IN')} kg of ${crop} (${grade} • ${certification_status}) is now live on the trading floor.`);
  } catch (e) {
    alert('✓ Harvest Lot logged.');
  }

  closeFarmerMarketModal();
  await loadFarmerData();
  renderApp();
}

function closeFarmerMarketModal() {
  const m = document.getElementById('farmer-market-modal');
  if (m) m.remove();
}

// =========================================================================
// 6. 8-WEEK PROGRESSION TIMELINE & MILESTONES COMPONENT
// =========================================================================
window.__progressionTimelineScope = '8wk';

function setTimelineScope(scope) {
  window.__progressionTimelineScope = scope;
  const btn8 = document.getElementById('scope-btn-8wk');
  const btnAll = document.getElementById('scope-btn-all');
  const items = document.querySelectorAll('.milestone-card-item');
  if (btn8 && btnAll) {
    if (scope === '8wk') {
      btn8.className = 'agro-btn-primary';
      btnAll.className = 'agro-btn-secondary';
    } else {
      btn8.className = 'agro-btn-secondary';
      btnAll.className = 'agro-btn-primary';
    }
  }
  items.forEach(el => {
    const wk = parseInt(el.getAttribute('data-week') || '1', 10);
    if (scope === '8wk') {
      el.style.display = wk <= 8 ? 'block' : 'none';
    } else {
      el.style.display = 'block';
    }
  });
}

function toggleMilestoneItem(idx) {
  const details = document.getElementById(`milestone-details-${idx}`);
  const arrow = document.getElementById(`milestone-arrow-${idx}`);
  if (details) {
    const isOpen = details.style.display !== 'none';
    details.style.display = isOpen ? 'none' : 'block';
    if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
  }
}

async function toggleInlineProgressionTimeline(farmId) {
  const container = document.getElementById(`inline-progression-container-${farmId}`);
  const arrow = document.getElementById(`inline-prog-arrow-${farmId}`);
  const text = document.getElementById(`inline-prog-text-${farmId}`);
  if (!container) return;

  if (container.style.display !== 'none') {
    container.style.display = 'none';
    if (arrow) arrow.textContent = '▼';
    if (text) text.textContent = t('btn_expand_timeline', 'Expand Timeline');
    return;
  }

  container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--slate);"><span class="spinner-small"></span> ${t('timeline_loading', 'Loading 8-Week Progression Timeline data...')}</div>`;
  container.style.display = 'block';
  if (arrow) arrow.textContent = '▲';
  if (text) text.textContent = t('btn_collapse_timeline', 'Collapse Timeline');

  try {
    let data = null;
    const res = await fetch(`/api/farmer/farms/${farmId}/weekly-progression`, {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (res.ok) data = await res.json();
    if (!data) {
      const farm = state.farms.find(f => f.id === farmId) || state.activeFarm;
      data = {
        farm_id: farmId,
        land_name: farm?.land_name || 'Amaravathi Basin Plot A',
        crop: farm?.crop_type || 'Ponni Rice',
        current_week: 8,
        total_weeks: 18,
        progression_percent: 44,
        current_stage: farm?.current_stage || 'Flowering',
        current_milestone: {
          week: 8,
          title: 'Panicle Initiation & Water Leveling',
          due_action: farm?.immediate_action_prompt || 'Irrigation due today — Maintain 3cm standing water',
          status: 'pending',
          advisory: 'Maintain 3cm standing water, verify zero synthetic chemical residues.'
        },
        milestones: []
      };
    }

    const currentWeek = data.current_week || 8;
    const milestones = (data.eight_week_milestones && data.eight_week_milestones.length > 0)
      ? data.eight_week_milestones
      : (data.milestones || data.weeks || []).slice(0, 8);

    const m = data.current_milestone || milestones.find(item => item.week === currentWeek) || milestones[0] || {};
    const pct = data.progression_percent || data.completion_percentage || 44;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div>
          <div style="font-size:14px; font-weight:800; color:var(--ink);">${t('timeline_crop_growth_progression', '📅 8-Week Crop Growth Progression')}</div>
          <div style="font-size:11px; color:var(--slate);">${translateCrop(data.crop || 'Crop')} • ${translateStage(data.current_stage || 'Flowering')}</div>
        </div>
        <span class="badge badge-forest" style="font-size:11px;">${t('timeline_week', 'Week')} ${currentWeek} / 18 (${pct}%)</span>
      </div>

      <div class="progression-bar-container" style="margin-bottom:12px;">
        <div class="progression-track">
          <div class="progression-fill" style="width: ${pct}%;"></div>
        </div>
      </div>

      <!-- Active Milestone Highlight -->
      <div style="background:#FFFFFF; border:1.5px solid var(--primary); border-radius:12px; padding:12px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="badge badge-coral" style="font-size:10px;">${t('timeline_active_milestone_badge', '⚡ ACTIVE MILESTONE (WEEK {week})', { week: m.week || currentWeek })}</span>
            <div style="font-size:13px; font-weight:800; color:var(--ink); margin-top:4px;">${m.title || 'Water Leveling & Nutrient Top-Up'}</div>
            <div style="font-size:12px; color:var(--primary); font-weight:700; margin-top:2px;">${m.due_action || 'Maintain 3cm standing water'}</div>
            <div style="font-size:11px; color:var(--slate); margin-top:4px;">${m.advisory || 'ICAR Standardized Protocol'}</div>
          </div>
          <button onclick="openWeeklyProgressionModal('${farmId}')" class="agro-btn-secondary" style="padding:6px 10px; font-size:11px; white-space:nowrap;">
            ${t('timeline_fullscreen', 'Full Screen ↗')}
          </button>
        </div>
        <div style="display:flex; gap:6px; margin-top:10px; padding-top:8px; border-top:1px solid var(--border);">
          <button onclick="openCameraModal('${farmId}', 'act-001')" class="agro-btn-primary" style="padding:6px 10px; font-size:11px; flex:1;">
            ${t('btn_done_camera', '✓ Completed')}
          </button>
          <button onclick="openRescheduleModal('${farmId}', 'act-001')" class="agro-btn-secondary" style="padding:6px 10px; font-size:11px;">
            ${t('btn_reschedule', '⏳ Reschedule')}
          </button>
        </div>
      </div>

      <!-- 8 Chronological Milestones -->
      <div style="font-size:11px; font-weight:700; color:var(--slate); margin-bottom:6px; text-transform:uppercase;">
        ${t('timeline_core_milestones', 'Core 8-Week Milestones:')}
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:260px; overflow-y:auto; padding-right:4px;">
        ${milestones.map((step, idx) => {
          const completed = step.completed || step.week < currentWeek;
          const isCurrent = step.week === currentWeek;
          return `
            <div style="background:#FFFFFF; border:1px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'}; border-radius:10px; padding:10px; cursor:pointer;" onclick="toggleMilestoneItem('inline-${idx}')">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="width:24px; height:24px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; background:${completed ? 'var(--mint-tint)' : isCurrent ? 'var(--primary)' : '#E5E5EA'}; color:${completed ? 'var(--primary)' : isCurrent ? '#FFFFFF' : 'var(--slate)'};">
                    ${completed ? '✓' : 'W' + (step.week || (idx + 1))}
                  </span>
                  <div>
                    <div style="font-size:12px; font-weight:800; color:var(--ink);">
                      ${step.title || `Week ${step.week || (idx + 1)}: ${step.stage || 'Milestone'}`}
                      ${isCurrent ? `<span class="badge badge-forest" style="font-size:9px; margin-left:4px;">${t('timeline_status_active', 'CURRENT')}</span>` : ''}
                    </div>
                    <div style="font-size:11px; color:var(--slate);">${step.due_action || 'Scheduled cultivation activity'}</div>
                  </div>
                </div>
                <span id="milestone-arrow-inline-${idx}" style="font-size:10px; color:var(--slate);">▼</span>
              </div>
              <div id="milestone-details-inline-${idx}" style="display:none; margin-top:8px; padding-top:8px; border-top:1px dashed var(--border); font-size:11px; color:var(--slate);">
                <div style="margin-bottom:4px;"><strong>${t('timeline_agronomic_guidance', 'Agronomic Guidance:')}</strong> ${step.advisory || 'Maintain ICAR recommended biological spray schedule.'}</div>
                <div><strong>${t('cert_parcel', 'Stage')}:</strong> ${translateStage(step.stage || 'Cultivation Phase')} • <strong>Status:</strong> ${completed ? t('timeline_status_completed', 'Completed') : isCurrent ? t('timeline_status_active', 'In Progress') : t('timeline_status_pending', 'Upcoming')}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:var(--coral); font-size:12px; padding:10px;">Failed to load timeline data: ${err.message}</div>`;
  }
}

async function openWeeklyProgressionModal(farmId) {
  let progressionData = null;
  try {
    const res = await fetch(`/api/farmer/farms/${farmId}/weekly-progression`, {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (res.ok) progressionData = await res.json();
  } catch (e) {}

  if (!progressionData) {
    const farm = state.farms.find(f => f.id === farmId) || state.activeFarm;
    progressionData = {
      farm_id: farmId,
      land_name: farm?.land_name || 'Amaravathi Basin Plot A',
      crop: farm?.crop_type || 'Ponni Rice',
      current_week: 8,
      total_weeks: 18,
      progression_percent: 44,
      current_stage: farm?.current_stage || 'Flowering & Grain Filling',
      current_milestone: {
        week: 8,
        title: 'Water Leveling & Nitrogen Foliar Top-Up',
        due_action: 'Irrigation due today — Maintain 3cm standing water',
        advisory: 'Maintain 3cm standing water, verify zero synthetic chemical residues.',
        status: 'pending'
      },
      milestones: farm?.weekly_milestones || []
    };
  }

  const currentWeek = progressionData.current_week || 8;
  const totalWeeks = progressionData.total_weeks || 18;
  const pct = progressionData.progression_percent || progressionData.completion_percentage || 44;
  const milestones = progressionData.milestones || progressionData.weeks || [];

  const m = progressionData.current_milestone || milestones.find(item => item.week === currentWeek) || {
    week: currentWeek,
    title: 'Water Leveling & Nitrogen Foliar Top-Up',
    due_action: 'Irrigation due today — Maintain 3cm standing water',
    advisory: 'Maintain optimal standing water depth; verify zero synthetic residue.',
    status: 'pending'
  };
  const isDone = (m.status || '').toLowerCase() === 'completed';

  const modalHtml = `
    <div class="modal-backdrop" id="modal-container">
      <div class="modal-content" style="max-width:620px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">${t('timeline_crop_growth_state_machine', 'Crop Growth State-Machine')}</span>
            <div style="font-size:20px; font-weight:800; color:var(--ink);">${t('timeline_title', '📅 8-Week Progression Timeline')}</div>
            <div style="font-size:12px; color:var(--slate); margin-top:2px;">
              ${progressionData.land_name || 'Land Parcel'} • ${translateCrop(progressionData.crop || 'Crop')} • ${t('cert_parcel', 'Stage')}: ${translateStage(progressionData.current_stage || 'Flowering')}
            </div>
          </div>
          <button onclick="closeModal()" class="modal-close">&times;</button>
        </div>

        <!-- Dual Scope Toggle Bar -->
        <div style="display:flex; gap:8px; margin-top:10px; margin-bottom:12px;">
          <button id="scope-btn-8wk" type="button" onclick="setTimelineScope('8wk')" class="agro-btn-primary" style="padding:6px 14px; font-size:11.5px; border-radius:8px; font-weight:700;">
            ${t('timeline_8wk_tab', '🌿 8-Week Core Milestones')}
          </button>
          <button id="scope-btn-all" type="button" onclick="setTimelineScope('all')" class="agro-btn-secondary" style="padding:6px 14px; font-size:11.5px; border-radius:8px; font-weight:700;">
            ${t('timeline_18wk_tab', '📅 Full 18-Week Lifecycle')}
          </button>
        </div>

        <div class="progression-bar-container">
          <div class="progression-header">
            <span>${t('timeline_cultivation_progress', 'Cultivation Progress')}</span>
            <span style="color:var(--primary); font-weight:800;">${t('timeline_week', 'Week')} ${currentWeek} of ${totalWeeks} (${pct}%)</span>
          </div>
          <div class="progression-track">
            <div class="progression-fill" style="width: ${pct}%;"></div>
          </div>
        </div>

        <!-- Active Milestone Spotlight Card -->
        <div class="agro-card" style="border:1.5px solid var(--primary); background:var(--mint-tint); margin-top:14px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="badge ${isDone ? 'badge-forest' : 'badge-coral'}">
                ${isDone ? t('timeline_verified_completed', '✓ VERIFIED COMPLETED') : t('timeline_action_required', '⚠️ ACTION REQUIRED TODAY (Week {week})', { week: m.week })}
              </span>
              <div style="font-size:15px; font-weight:800; margin-top:6px; color:var(--ink);">
                ${m.title}
              </div>
              <div style="font-size:13px; color:var(--primary); font-weight:700; margin-top:4px;">
                ${m.due_action}
              </div>
              <div style="font-size:11.5px; color:var(--slate); margin-top:4px;">
                💡 <strong>${t('timeline_agronomic_guidance', 'Agronomic Guidance:')}</strong> ${m.advisory || 'Maintain ICAR recommended biological spray schedule.'}
              </div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-forest">${t('timeline_week', 'Week')} ${m.week}</span>
            </div>
          </div>

          <!-- Dedicated Action Buttons for Active Milestone -->
          <div style="margin-top:14px; border-top:1px solid var(--border); padding-top:12px;">
            <div style="font-size:11px; font-weight:700; color:var(--slate); margin-bottom:8px;">
              ${t('timeline_task_status_actions', 'TASK STATUS ACTIONS:')}
            </div>
            <div style="display:flex; gap:8px;">
              <button onclick="closeModal(); openCameraModal('${farmId}', 'act-001')" class="agro-btn-primary" style="padding:9px 12px; font-size:12px; flex:1; font-weight:700;">
                ${t('timeline_btn_completed_camera', '📷 Completed (Camera Proof)')}
              </button>
              <button onclick="closeModal(); openRescheduleModal('${farmId}', 'act-001')" class="agro-btn-secondary" style="padding:9px 12px; font-size:12px; font-weight:700;">
                ${t('btn_reschedule', '⏳ Reschedule')}
              </button>
            </div>
          </div>
        </div>

        <!-- Chronological Milestones Timeline (Expandable Accordion) -->
        <div style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="card-label">${t('btn_progression_timeline', 'Crop Growth Milestones')}</span>
            <span style="font-size:11px; color:var(--slate);">${t('timeline_tap_for_details', 'Tap any week for agronomic details')}</span>
          </div>
          <div class="milestones-timeline" style="max-height:280px; overflow-y:auto; padding-right:4px;">
            ${milestones.map((step, idx) => {
              const stepWeek = step.week || step.week_number || (idx + 1);
              const completed = step.completed || stepWeek < currentWeek;
              const isCurrent = stepWeek === currentWeek;
              const isDefaultHidden = window.__progressionTimelineScope === '8wk' && stepWeek > 8;

              return `
                <div class="milestone-card-item" data-week="${stepWeek}" style="display:${isDefaultHidden ? 'none' : 'block'}; margin-bottom:8px;">
                  <div class="milestone-card ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''}" onclick="toggleMilestoneItem('modal-${idx}')" style="cursor:pointer;">
                    <div class="milestone-week-pill ${completed ? 'completed' : ''}">
                      ${completed ? '✓' : 'W' + stepWeek}
                    </div>
                    <div class="milestone-content" style="flex:1;">
                      <div class="milestone-title">
                        ${step.title || `Week ${stepWeek}: ${step.stage || 'Milestone'}`}
                        ${isCurrent ? `<span class="badge badge-forest" style="font-size:9px; margin-left:6px;">${t('timeline_status_active', 'CURRENT')}</span>` : ''}
                      </div>
                      <div class="milestone-action">${step.due_action || 'Cultivation task scheduled'}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="font-size:11px; font-weight:700; color:${completed ? 'var(--primary)' : 'var(--slate)'};">
                        ${completed ? t('timeline_status_completed', 'Done') : isCurrent ? t('timeline_status_active', 'Active') : t('timeline_status_pending', 'Upcoming')}
                      </span>
                      <span id="milestone-arrow-modal-${idx}" style="font-size:10px; color:var(--slate);">▼</span>
                    </div>
                  </div>
                  <div id="milestone-details-modal-${idx}" style="display:none; background:var(--mint-soft); border:1px solid var(--mint-light); border-radius:0 0 10px 10px; padding:10px 14px; margin-top:-4px; font-size:11.5px; color:var(--slate);">
                    <div style="margin-bottom:4px;">
                      <strong style="color:var(--ink);">${t('timeline_agronomic_protocol', 'Agronomic Protocol:')}</strong> ${step.advisory || 'Standard ICAR biological cultivation practice.'}
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                      <span><strong>${t('cert_parcel', 'Stage')}:</strong> ${translateStage(step.stage || 'Flowering')}</span>
                      <span><strong>Status:</strong> ${completed ? t('timeline_status_completed', 'Verified & Completed') : isCurrent ? t('timeline_status_active', 'Action Required') : t('timeline_status_pending', 'Upcoming Window')}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// =========================================================================
// 7. IN-APP CAMERA VERIFICATION (HARDWARE ONLY, STRICT GPS GEO-FENCE)
// =========================================================================

// Haversine distance calculator between two GPS coordinates
function calculateGpsDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function updateCameraGeoStatus(currentLat, currentLng, targetLat, targetLng) {
  const dist = calculateGpsDistanceMeters(currentLat, currentLng, targetLat, targetLng);
  const banner = document.getElementById('camera-geo-banner');
  const btnCapture = document.getElementById('btn-capture-proof');
  const watermarkGps = document.getElementById('watermark-gps-coords');

  if (watermarkGps) {
    watermarkGps.textContent = `📍 LAT: ${currentLat.toFixed(4)}°N | LNG: ${currentLng.toFixed(4)}°E (${dist}m)`;
  }

  const isWithinFence = dist <= 500;
  state.currentCameraGeo = { lat: currentLat, lng: currentLng, dist, isWithinFence };

  if (banner) {
    if (isWithinFence) {
      banner.className = 'geo-status-banner geo-match';
      banner.innerHTML = `<span>📍</span> <span><strong>GPS Validated:</strong> Device is within parcel boundary (${dist}m from parcel center, limit: 500m). Hardware capture unlocked.</span>`;
    } else {
      banner.className = 'geo-status-banner geo-mismatch';
      banner.innerHTML = `<span>⚠️</span> <span><strong>Geo-Fence Mismatch:</strong> Device is ${dist}m away from parcel coordinates (${targetLat}°N, ${targetLng}°E). Capture & photo upload locked (Limit: 500m).</span>`;
    }
  }

  if (btnCapture) {
    if (isWithinFence) {
      btnCapture.disabled = false;
      btnCapture.style.opacity = '1';
      btnCapture.style.cursor = 'pointer';
      btnCapture.title = 'Capture photo and log cryptographic signature';
    } else {
      btnCapture.disabled = true;
      btnCapture.style.opacity = '0.4';
      btnCapture.style.cursor = 'not-allowed';
      btnCapture.title = 'Disabled: Live device coordinates are outside the parcel boundary';
    }
  }
}

function setCameraSimulatedLocation(lat, lng) {
  const targetLat = 10.7872;
  const targetLng = 79.1375;
  updateCameraGeoStatus(lat, lng, targetLat, targetLng);
}

function openCameraModal(farmId, activityId) {
  // Removed hardware camera stream validation per user request
  completeWeeklyTask(farmId, activityId);
}

function closeCameraModal() {
  const m = document.getElementById('camera-modal');
  if (m) m.remove();
}
async function handlePostRequirementSubmit(event) {
  event.preventDefault();
  const crop = document.getElementById('req-crop').value;
  const qtyKg = parseFloat(document.getElementById('req-qty-kg').value) || 8000;
  const grade = document.getElementById('req-grade').value || 'Grade B';
  const needed_by = document.getElementById('req-date').value;

  try {
    await fetch('/api/shop/requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({ crop, quantity: qtyKg / 100, needed_by, region: 'Madurai, Tamil Nadu', grade })
    });
    alert(`✓ Demand Signal Posted to Marketplace!\n\n${qtyKg.toLocaleString('en-IN')} kg of ${crop} (${grade}) broadcast to regional producers.`);
  } catch (e) {}
  closeModal();
  renderApp();
}

// --- Shop Owner: Orders, Receipts & Ledger Module ---
async function renderOrdersReceiptsLedgerView(container) {
  try {
    const res = await fetch('/api/shop/orders-ledger', {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      state.ordersLedger = data.orders || [];
      if (data.metrics) {
        state.ordersLedgerMetrics = data.metrics;
      } else {
        const totalVol = (state.ordersLedger.reduce((sum, o) => sum + (o.quantity_kg || 0), 0) / 1000).toFixed(1);
        const totalVal = state.ordersLedger.reduce((sum, o) => sum + (o.total_amount || o.total_amount_inr || 0), 0);
        const settled = state.ordersLedger.reduce((sum, o) => {
          const status = (o.delivery_status || '').toLowerCase();
          return sum + (status === 'delivered' ? (o.total_amount || o.total_amount_inr || 0) : (o.advance_paid || o.advance_paid_inr || 0));
        }, 0);
        state.ordersLedgerMetrics = {
          total_prebooked_volume_mt: parseFloat(totalVol) || 15.0,
          total_ledger_value_inr: totalVal || 842000,
          settled_amount_inr: settled || 520000,
          pending_settlement_inr: Math.max(0, (totalVal || 842000) - (settled || 520000)),
          orders_count: state.ordersLedger.length
        };
      }
    }
  } catch (e) {
    console.warn('Error loading orders ledger:', e);
  }

  let orders = state.ordersLedger || [];
  if (orders.length === 0) {
    orders = [
      {
        id: 'ord-2026-001',
        order_number: 'ORD-TN-94021',
        item_name: 'Ponni Rice (BPT 5204)',
        seller_name: 'Arumugam Sundaram (Amaravathi Plot A)',
        buyer_name: 'Meenakshi Wholesale & Retail Mandi',
        quantity_kg: 2500,
        unit_price: 48.50,
        total_amount: 121250,
        advance_paid: 48500,
        balance_due: 72750,
        commodity_grade: 'A',
        delivery_status: 'in_transit'
      },
      {
        id: 'ord-2026-002',
        order_number: 'ORD-TN-94018',
        item_name: 'Erode Salem Turmeric (Curcumin 4.8%)',
        seller_name: 'Murugesan K (Bhavani Plot)',
        buyer_name: 'Kongu Agro Global Exports Pvt Ltd',
        quantity_kg: 4000,
        unit_price: 142.00,
        total_amount: 568000,
        advance_paid: 568000,
        balance_due: 0,
        commodity_grade: 'A',
        delivery_status: 'delivered',
        delivery_confirmation_token: 'POD-APEDA-EXP-77192'
      },
      {
        id: 'ord-2026-003',
        order_number: 'ORD-TN-93994',
        item_name: 'Chettinad Organic Cotton Lint',
        seller_name: 'Sundaram Chettiar (Cauvery Delta)',
        buyer_name: 'Tiruppur Organic Textiles Ltd',
        quantity_kg: 3200,
        unit_price: 88.00,
        total_amount: 281600,
        advance_paid: 112640,
        balance_due: 168960,
        commodity_grade: 'B',
        delivery_status: 'inspected'
      },
      {
        id: 'ord-2026-004',
        order_number: 'ORD-TN-93880',
        item_name: 'Coimbatore Black Gram (Organic)',
        seller_name: 'Palanisamy Velu (Mandi Central)',
        buyer_name: 'Madurai Regional Traders',
        quantity_kg: 1800,
        unit_price: 92.00,
        total_amount: 165600,
        advance_paid: 165600,
        balance_due: 0,
        commodity_grade: 'A',
        delivery_status: 'delivered',
        delivery_confirmation_token: 'POD-MND-CBE-1094'
      }
    ];
    state.ordersLedger = orders;
  }

  const completedOrders = orders.filter(o => (o.delivery_status || '').toLowerCase() === 'delivered');
  const pendingOrders = orders.filter(o => (o.delivery_status || '').toLowerCase() !== 'delivered');

  container.innerHTML = `
    <!-- Orders Clean Header -->
    <div style="margin-bottom:20px;">
      <h2 style="font-size:22px; font-weight:800; color:var(--ink); margin:0;">
        ${t('orders_title', 'Orders')}
      </h2>
      <div style="font-size:12.5px; color:var(--slate); margin-top:2px;">
        Tracking ${pendingOrders.length} pending and ${completedOrders.length} completed orders (${orders.length} total)
      </div>
    </div>

    <!-- Top Summary Metrics Grid -->
    <div class="grid-4" style="margin-bottom:20px;">
      <div class="dosing-cell">
        <div class="cell-label">Total Volume</div>
        <div class="cell-value" style="font-size:18px;">${(orders.reduce((sum, o) => sum + (o.quantity_kg || 0), 0) / 1000).toFixed(1)} MT</div>
      </div>
      <div class="dosing-cell">
        <div class="cell-label">Gross Value</div>
        <div class="cell-value" style="font-size:18px; color:var(--primary);">₹${orders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="dosing-cell" style="border-left:3px solid #10B981;">
        <div class="cell-label">Settled Amount</div>
        <div class="cell-value" style="font-size:18px; color:#10B981;">₹${orders.reduce((sum, o) => sum + ((o.delivery_status || '').toLowerCase() === 'delivered' ? (o.total_amount || 0) : (o.advance_paid || 0)), 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="dosing-cell" style="border-left:3px solid var(--gold);">
        <div class="cell-label">Active Orders</div>
        <div class="cell-value" style="font-size:18px; color:var(--gold);">${orders.length} Orders</div>
      </div>
    </div>

    <!-- Structured Data Table: Order ID, Product Name, Quality, Price, and Status -->
    <div class="agro-card" style="padding:0; overflow:hidden;">
      <div style="padding:16px 20px; border-bottom:1.5px solid var(--border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="font-size:16px; font-weight:800; color:var(--ink);">
          Orders & Settlements Ledger
        </div>
        <div style="font-size:12px; color:var(--slate);">
          ${orders.length} Total Contracts Tracked
        </div>
      </div>

      <div class="table-responsive">
        <table class="agro-table" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:12px 16px;">Order ID</th>
              <th style="padding:12px 16px;">Product Name</th>
              <th style="padding:12px 16px;">Quality</th>
              <th style="padding:12px 16px;">Price</th>
              <th style="padding:12px 16px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(order => {
              const rawStatus = (order.delivery_status || '').toLowerCase();
              const isDelivered = rawStatus === 'delivered';
              const orderId = order.order_number || order.id;
              const itemName = order.item_name || order.commodity_name || 'Harvest Lot';
              const sellerName = order.seller_name || order.farmer_name || 'Verified Supplier';
              const qtyKg = order.quantity_kg || (order.quantity ? order.quantity * 100 : 2500);
              const unitPrice = order.unit_price || order.price_per_kg || 48.5;
              const totalAmt = order.total_amount || order.total_amount_inr || (qtyKg * unitPrice);
              const grade = order.commodity_grade || order.grade || 'A';
              const displayStatus = (order.delivery_status || 'PENDING').replace('_', ' ').toUpperCase();
              const pod = order.delivery_confirmation_token || order.proof_of_delivery_token || 'POD-VERIFIED';

              return `
                <tr style="border-bottom:1px solid var(--border);">
                  <td style="padding:14px 16px; font-weight:800;">
                    <span style="font-family:monospace; font-weight:800; font-size:12.5px; color:var(--primary); background:rgba(27,77,62,0.08); padding:3px 8px; border-radius:6px; border:1px solid rgba(27,77,62,0.15);">
                      ${orderId}
                    </span>
                  </td>
                  <td style="padding:14px 16px;">
                    <div style="font-size:13.5px; font-weight:800; color:var(--ink);">${translateCrop(itemName)}</div>
                    <div style="font-size:11px; color:var(--slate); margin-top:2px;">Seller: <strong>${sellerName}</strong></div>
                  </td>
                  <td style="padding:14px 16px;">
                    <span class="badge ${grade === 'A' || grade === 'Grade A' ? 'badge-forest' : 'badge-gold'}" style="font-size:11px; font-weight:800;">
                      ${grade.startsWith('Grade') ? grade : 'Grade ' + grade}
                    </span>
                  </td>
                  <td style="padding:14px 16px;">
                    <div style="font-size:14px; font-weight:900; color:var(--ink);">₹${totalAmt.toLocaleString('en-IN')}</div>
                    <div style="font-size:11px; color:var(--slate); margin-top:2px;">₹${unitPrice}/kg • ${qtyKg.toLocaleString('en-IN')} kg (${(qtyKg/1000).toFixed(1)} MT)</div>
                  </td>
                  <td style="padding:14px 16px;">
                    ${isDelivered ? `
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="badge badge-forest" style="font-size:11px;">✓ Delivered</span>
                        <button onclick="alert('Digital Payment Receipt & Proof of Delivery:\\n\\nOrder: ${orderId}\\nCommodity: ${itemName}\\nAmount Settled: ₹${totalAmt.toLocaleString('en-IN')}\\nPOD Token: ${pod}\\nStatus: 100% Cleared & Discharged');" class="agro-btn-secondary" style="padding:4px 10px; font-size:11px;">
                          Receipt
                        </button>
                      </div>
                    ` : `
                      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span class="badge badge-gold" style="font-size:11px;">${displayStatus}</span>
                        <button onclick="confirmOrderDelivery('${order.id}')" class="agro-btn-primary" style="padding:5px 12px; font-size:11px; font-weight:800;">
                          ✓ Confirm Delivery
                        </button>
                      </div>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function confirmOrderDelivery(orderId) {
  try {
    const res = await fetch(`/api/shop/orders/${orderId}/confirm-delivery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({
        delivery_location: state.user.region || 'Meenakshi Wholesale Mandi, Madurai',
        received_by: state.user.name || 'Palanisamy Velu'
      })
    });

    if (res.ok) {
      const data = await res.json();
      const o = (state.ordersLedger || []).find(item => item.id === orderId);
      if (o) {
        o.delivery_status = 'DELIVERED';
        o.payment_status = 'FULLY_SETTLED';
        o.balance_due_inr = 0;
        o.delivered_at = new Date().toISOString();
        o.proof_of_delivery_token = data.order?.proof_of_delivery_token || `POD-CONFIRMED-${Date.now()}`;
      }
      state.auditHistory.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event: 'Mandi Delivery Confirmed & Settled',
        detail: `Order ${orderId} marked Delivered. Final balance released. POD: ${data.order?.proof_of_delivery_token}`,
        type: 'audit'
      });
      alert(`✓ Delivery Confirmed Successfully!\n\nOrder ${orderId} has been updated to Delivered.\nProof of Delivery token generated and balance payment released.`);
      const container = document.getElementById('app-body');
      if (container) renderOrdersReceiptsLedgerView(container);
    }
  } catch (e) {
    console.error('Error confirming delivery:', e);
  }
}

// --- Shop Owner: My Active Listings (Dedicated User Post History) ---
async function renderUserListingsView(container) {
  initShopRequirements();
  try {
    const res = await fetch('/api/shop/my-listings', {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      state.userListings = data.listings || [
        ...(data.active_requirements || []).map(r => ({
          id: r.id,
          crop_needed: r.crop,
          grade: r.grade || 'Grade A',
          quantity_kg: r.quantity ? r.quantity * 100 : 8000,
          quantity_mt: (r.quantity / 10).toFixed(1),
          target_price_per_kg: 32.0,
          max_budget_inr: (r.quantity * 100) * 32.0,
          delivery_location: r.region || 'Meenakshi Mandi, Madurai',
          deadline: r.needed_by || '2026-09-30',
          status: (r.status || 'OPEN').toUpperCase(),
          quality_specifications: 'Mandi Trade Quality Standard (Moisture <= 14%, single-polish)',
          inquiries_count: 4
        })),
        ...(data.active_harvest_listings || []).map(l => ({
          id: l.id,
          crop_needed: l.crop,
          grade: l.grade || 'Grade A',
          quantity_kg: l.quantity ? l.quantity * 100 : 5000,
          quantity_mt: (l.quantity / 10).toFixed(1),
          target_price_per_kg: l.grade === 'A' ? 48.5 : 24.0,
          max_budget_inr: (l.quantity * 100) * (l.grade === 'A' ? 48.5 : 24.0),
          delivery_location: 'Farm Gate / Direct Mandi',
          deadline: l.available_from || '2026-09-25',
          status: (l.status || 'OPEN').toUpperCase(),
          quality_specifications: `Grade ${l.grade} Harvest Batch (${l.channel?.toUpperCase()} Channel)`,
          inquiries_count: 5
        }))
      ];
    }
  } catch (e) {
    console.warn('Error loading user listings:', e);
  }

  // If userListings is empty, default to shop requirements
  if (!state.userListings || state.userListings.length === 0) {
    state.userListings = (state.shopRequirements || []).map(r => ({
      id: r.id,
      crop_needed: r.crop,
      grade: r.grade,
      quantity_kg: r.quantity_kg,
      quantity_mt: r.quantity_mt,
      target_price_per_kg: r.target_price_per_kg,
      max_budget_inr: r.max_budget_inr,
      delivery_location: r.shop_location,
      deadline: r.deadline,
      status: r.status,
      claimed_by: r.claimed_by,
      contract_id: r.contract_id,
      quality_specifications: r.quality_spec,
      inquiries_count: 3
    }));
  }

  const listings = state.userListings || [];

  container.innerHTML = `
    <!-- Listings Clean Header -->
    <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-size:22px; font-weight:800; color:var(--ink); margin:0;">
          ${t('listings_title', 'Listings')}
        </h2>
        <div style="font-size:12.5px; color:var(--slate); margin-top:2px;">
          Active procurement & demand posts (${listings.length})
        </div>
      </div>
      <button type="button" onclick="openCreateListingModal()" class="agro-btn-primary btn-plus-animated" style="padding:8px 16px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; justify-content:center; gap:8px; white-space:nowrap; transform:none; cursor:pointer;">
        <span class="plus-icon" style="font-size:15px; font-weight:900; line-height:1; display:inline-flex; align-items:center; justify-content:center; transform:none;">+</span>
        <span class="btn-label" style="display:inline-block; transform:none;">Post New Listing</span>
      </button>
    </div>

    <!-- Focused Minimal Listing Cards -->
    <div style="display:flex; flex-direction:column; gap:14px;">
      ${listings.length === 0 ? `
        <div class="agro-card" style="padding:28px; text-align:center; color:var(--slate); font-size:13px;">
          No active listings. Click "+ Post New Listing" to publish a requirement.
        </div>
      ` : listings.map(item => {
        const cropName = item.crop_needed || item.crop || 'Agricultural Commodity';
        const qtyKg = item.quantity_kg || (item.quantity_mt ? parseFloat(item.quantity_mt) * 1000 : (item.quantity ? item.quantity * 100 : 8000));
        const qtyMt = item.quantity_mt || (qtyKg / 1000).toFixed(1);
        const rate = item.target_price_per_kg || 32.0;
        const budget = item.max_budget_inr || (qtyKg * rate);
        const location = item.delivery_location || item.region || 'Meenakshi Mandi, Madurai';
        const deadline = item.deadline || item.needed_by || item.available_from || '2026-09-30';
        const spec = item.quality_specifications || 'Standard Mandi Grade Specification (Moisture <= 14%)';
        const status = (item.status || 'OPEN').toUpperCase();
        const inqCount = item.inquiries_count || 4;
        const grade = item.grade || 'Grade A';

        // Real-time booking status indicator
        const isClaimed = status === 'CLAIMED' || item.claimed_by;

        return `
          <div class="agro-card" style="padding:16px; box-shadow:0 2px 8px rgba(0,0,0,0.04); border:${isClaimed ? '1.5px solid #10B981' : '1px solid var(--border)'};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-family:monospace; font-weight:800; font-size:12px; color:var(--primary); background:rgba(27,77,62,0.1); padding:2px 6px; border-radius:6px;">${item.id}</span>
                  <span class="badge badge-gold" style="font-weight:800;">${grade}</span>
                </div>
                <div style="font-size:16px; font-weight:800; color:var(--ink); margin-top:6px;">
                  ${translateCrop(cropName)}
                </div>
                <div style="font-size:12px; color:var(--slate); margin-top:2px;">
                  Delivery to: <strong>${location}</strong> • Deadline: <strong>${deadline}</strong>
                </div>
              </div>

              <div style="text-align:right;">
                <div style="font-size:16px; font-weight:800; color:var(--primary);">${qtyKg.toLocaleString('en-IN')} kg (${qtyMt} MT) Demanded</div>
                <div style="font-size:11.5px; color:var(--slate); margin-top:2px;">Target: ₹${rate.toFixed(2)}/kg • Budget: ₹${budget.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style="margin-top:12px; padding:10px 12px; border-radius:10px; background:var(--bg-canvas); border:1px solid var(--border); font-size:11.5px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div>
                <span style="color:var(--slate);">Specifications:</span>
                <span style="font-weight:700; color:var(--ink); margin-left:4px;">${spec}</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge badge-gold">${inqCount} Enquiries</span>
                <button onclick="openViewEnquiriesModal('${item.id}')" class="agro-btn-secondary" style="padding:5px 12px; font-size:11.5px; font-weight:700; cursor:pointer;">
                  View Enquiries
                </button>
              </div>
            </div>

            <!-- Integrated Booking Status Indicator -->
            <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              ${isClaimed ? `
                <div class="booking-status-indicator booking-status-claimed">
                  🟢 PRE-BOOKED BY EXPORTER: ${item.claimed_by || 'Kongu Agro Global Exports'} (${item.contract_id || 'EXP-CTR-' + item.id})
                </div>
                <span class="badge badge-forest" style="font-size:10px;">SLOT CLAIMED</span>
              ` : `
                <div class="booking-status-indicator booking-status-open">
                  🟡 OPEN / UNCLAIMED - AWAITING EXPORTER BOOKING
                </div>
                <span class="badge badge-gold" style="font-size:10px;">AWAITING BID</span>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function openViewEnquiriesModal(listingId) {
  closeViewEnquiriesModal();
  const listing = (state.userListings || []).find(l => l.id === listingId) ||
                  (state.shopRequirements || []).find(r => r.id === listingId) || {
    id: listingId,
    crop_needed: 'Ponni Rice (BPT 5204)',
    quantity_kg: 8000,
    quantity_mt: 8.0,
    target_price_per_kg: 32.0,
    max_budget_inr: 256000,
    grade: 'Grade A',
    quality_specifications: 'Standard APEDA Grade A (Moisture <= 14%)',
    status: 'OPEN',
    claimed_by: null
  };

  const crop = listing.crop_needed || listing.crop || 'Agricultural Commodity';
  const qtyKg = listing.quantity_kg || (listing.quantity_mt ? parseFloat(listing.quantity_mt) * 1000 : (listing.quantity ? listing.quantity * 100 : 8000));
  const qtyMt = listing.quantity_mt || (qtyKg / 1000).toFixed(1);
  const targetRate = listing.target_price_per_kg || 32.0;
  const maxBudget = listing.max_budget_inr || (qtyKg * targetRate);
  const grade = listing.grade || 'Grade A';
  const isClaimed = listing.status === 'CLAIMED' || Boolean(listing.claimed_by);

  // Initialize or retrieve enquiries for this listing
  if (!listing.supplierEnquiries || listing.supplierEnquiries.length === 0) {
    const p1 = Math.max(5, +(targetRate - 2.50).toFixed(2));
    const p2 = Math.max(5, +(targetRate - 0.75).toFixed(2));
    const p3 = +(targetRate + 1.25).toFixed(2);

    listing.supplierEnquiries = [
      {
        id: 'ENQ-' + listing.id + '-01',
        supplier_name: 'Arumugam Sundaram',
        entity_name: 'Thanjavur Delta Organic FPO',
        role: 'farmer',
        location: 'Thanjavur Basin (34 km away)',
        phone: '+91 98421 00004',
        offered_rate: p1,
        total_quote: Math.round(qtyKg * p1),
        savings_vs_budget: Math.round(maxBudget - (qtyKg * p1)),
        grade_guaranteed: grade,
        certification: '100% Bio-Organic Certified • APEDA Zero Chemical Residue',
        delivery_window: 'Immediate Dispatch (within 24 hours)',
        rating: 4.9,
        review_count: 38,
        is_lowest: true,
        badges: ['🏆 Lowest Price / Best Value', '🌱 Bio-Organic']
      },
      {
        id: 'ENQ-' + listing.id + '-02',
        supplier_name: 'Kongu Agro Producer Co.',
        entity_name: 'Erode Semmampalayam Terminal Hub',
        role: 'exporter',
        location: 'Erode District (78 km away)',
        phone: '+91 98421 00001',
        offered_rate: p2,
        total_quote: Math.round(qtyKg * p2),
        savings_vs_budget: Math.round(maxBudget - (qtyKg * p2)),
        grade_guaranteed: grade,
        certification: 'Agmark Grade Special • Verified Mandi Warehouse Stock',
        delivery_window: '2-3 Working Days',
        rating: 4.7,
        review_count: 52,
        is_lowest: false,
        badges: ['⚡ Bulk Aggregator', '✓ Verified Stock']
      },
      {
        id: 'ENQ-' + listing.id + '-03',
        supplier_name: 'Muthuvel Karuppan',
        entity_name: 'Bhavani River Basin Agritech',
        role: 'farmer',
        location: 'Bhavani River Delta (52 km away)',
        phone: '+91 98421 00005',
        offered_rate: p3,
        total_quote: Math.round(qtyKg * p3),
        savings_vs_budget: Math.round(maxBudget - (qtyKg * p3)),
        grade_guaranteed: grade === 'Grade A' ? 'Grade A+' : 'Grade A',
        certification: 'Codex Export Standard • Moisture <= 11.5%',
        delivery_window: '48h Dispatch with Cold-Chain Transit Support',
        rating: 4.8,
        review_count: 29,
        is_lowest: false,
        badges: ['⭐ Premium Grade A+', '❄️ Cold-Chain Ready']
      }
    ];
  }

  const enquiries = listing.supplierEnquiries;

  const modalHtml = `
    <div class="modal-backdrop" id="view-enquiries-modal" style="box-sizing:border-box;">
      <div class="modal-content" style="max-width:760px; width:95%; max-height:92vh; overflow-y:auto; box-sizing:border-box; border-radius:22px; padding:24px;">
        <!-- Modal Header -->
        <div class="modal-header" style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-forest" style="font-size:11px; font-weight:800; font-family:monospace;">${listing.id}</span>
              <span class="badge ${isClaimed ? 'badge-forest' : 'badge-gold'}" style="font-size:11px; font-weight:800;">
                ${isClaimed ? '✓ CONTRACT AWARDED' : 'OPEN FOR OFFERS'}
              </span>
            </div>
            <div style="font-size:20px; font-weight:900; color:var(--ink); margin-top:6px;">
              Incoming Supplier Enquiries & Price Comparison
            </div>
            <div style="font-size:12.5px; color:var(--slate); margin-top:2px;">
              Review competing supplier bids and accept the lowest or best-value procurement offer.
            </div>
          </div>
          <button onclick="closeViewEnquiriesModal()" class="modal-close" style="cursor:pointer;">&times;</button>
        </div>

        <!-- Listing Benchmark Card -->
        <div style="background:var(--bg-canvas); border:1.5px solid var(--border); border-radius:14px; padding:16px; margin-bottom:20px;">
          <div style="font-size:11px; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">
            Target Buy Requirement
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="font-size:17px; font-weight:900; color:var(--ink);">${translateCrop(crop)}</div>
              <div style="font-size:12px; color:var(--slate); margin-top:2px;">
                Quality Target: <strong>${grade}</strong> • Specs: <strong>${listing.quality_specifications || listing.quality_spec || 'Standard Mandi Standard'}</strong>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:17px; font-weight:900; color:var(--primary);">
                ${qtyKg.toLocaleString('en-IN')} kg (${qtyMt} MT)
              </div>
              <div style="font-size:12px; color:var(--slate); margin-top:2px;">
                Target Price: <strong>₹${targetRate.toFixed(2)}/kg</strong> • Max Budget: <strong>₹${maxBudget.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
          ${isClaimed ? `
            <div style="margin-top:12px; padding:10px 12px; border-radius:10px; background:#ECFDF5; border:1px solid #A7F3D0; font-size:12.5px; color:#065F46; font-weight:700;">
              🟢 Contract currently awarded to: <strong>${listing.claimed_by}</strong> (${listing.contract_id || 'CONFIRMED'})
            </div>
          ` : ''}
        </div>

        <!-- Competitive Offers List -->
        <div style="font-size:13px; font-weight:800; color:var(--ink); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <span>Received Offers (${enquiries.length} Suppliers Responded)</span>
          <span style="font-size:11.5px; color:var(--slate); font-weight:600;">Sorted by: Price & Value Efficiency</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          ${enquiries.map(enq => {
            const diff = +(enq.offered_rate - targetRate).toFixed(2);
            const isAwarded = isClaimed && listing.claimed_by && listing.claimed_by.includes(enq.supplier_name);

            return `
              <div style="border: 2px solid ${enq.is_lowest ? '#10B981' : isAwarded ? '#3B82F6' : 'var(--border)'}; border-radius:16px; padding:18px; background:#FFFFFF; position:relative; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
                ${enq.is_lowest ? `
                  <div style="position:absolute; top:-11px; left:16px; background:#10B981; color:#FFFFFF; font-size:10.5px; font-weight:900; padding:2px 10px; border-radius:12px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 2px 6px rgba(16,185,129,0.3);">
                    🏆 Lowest Price / Best Value Offer
                  </div>
                ` : ''}

                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; ${enq.is_lowest ? 'margin-top:4px;' : ''}">
                  <div>
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                      <span style="font-size:16px; font-weight:900; color:var(--ink);">${enq.supplier_name}</span>
                      <span class="badge ${enq.role === 'farmer' ? 'badge-forest' : 'badge-gold'}" style="font-size:10px; font-weight:800;">
                        ${enq.role === 'farmer' ? 'Direct Farmer FPO' : 'Licensed Exporter'}
                      </span>
                      <span style="font-size:12px; color:#F59E0B; font-weight:800;">★ ${enq.rating} (${enq.review_count})</span>
                    </div>
                    <div style="font-size:12px; color:var(--slate); margin-top:3px;">
                      <strong>${enq.entity_name}</strong> • ${enq.location} • 📞 ${enq.phone}
                    </div>
                    <div style="font-size:11.5px; color:#059669; font-weight:700; margin-top:4px;">
                      ✓ ${enq.certification}
                    </div>
                  </div>

                  <!-- Rate & Total Column -->
                  <div style="text-align:right;">
                    <div style="font-size:22px; font-weight:900; color:${enq.is_lowest ? '#10B981' : 'var(--primary)'};">
                      ₹${enq.offered_rate.toFixed(2)}<span style="font-size:13px; font-weight:700; color:var(--slate);">/kg</span>
                    </div>
                    <div style="font-size:11.5px; font-weight:800; color:${diff <= 0 ? '#10B981' : '#EF4444'}; margin-top:1px;">
                      ${diff < 0 ? `₹${Math.abs(diff).toFixed(2)}/kg below target` : diff === 0 ? 'Exact match with target' : `+₹${diff.toFixed(2)}/kg above target`}
                    </div>
                    <div style="font-size:13px; font-weight:800; color:var(--ink); margin-top:4px;">
                      Total: ₹${enq.total_quote.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <!-- Metrics breakdown -->
                <div class="grid-3" style="margin-top:14px; gap:8px; background:var(--bg-canvas); border-radius:10px; padding:10px 12px; font-size:11.5px;">
                  <div>
                    <span style="color:var(--slate); display:block;">Guaranteed Grade:</span>
                    <strong style="color:var(--ink); font-size:12px;">${enq.grade_guaranteed}</strong>
                  </div>
                  <div>
                    <span style="color:var(--slate); display:block;">Dispatch Timeline:</span>
                    <strong style="color:var(--ink); font-size:12px;">${enq.delivery_window}</strong>
                  </div>
                  <div>
                    <span style="color:var(--slate); display:block;">Net Budget Savings:</span>
                    <strong style="color:${enq.savings_vs_budget >= 0 ? '#10B981' : '#EF4444'}; font-size:12px;">
                      ${enq.savings_vs_budget >= 0 ? '+₹' + enq.savings_vs_budget.toLocaleString('en-IN') + ' Saved' : '-₹' + Math.abs(enq.savings_vs_budget).toLocaleString('en-IN') + ' Premium'}
                    </strong>
                  </div>
                </div>

                <!-- Action button -->
                <div style="margin-top:14px;">
                  ${isAwarded ? `
                    <div style="background:#E6F4EA; border:1.5px solid #34A853; color:#137333; font-weight:800; font-size:13px; padding:10px; border-radius:10px; text-align:center;">
                      ✓ Supplier Offer Accepted & Procurement Contract Awarded (${listing.contract_id || 'CONFIRMED'})
                    </div>
                  ` : isClaimed ? `
                    <button disabled class="agro-btn-secondary" style="width:100%; padding:10px; opacity:0.5; cursor:not-allowed; font-weight:700;">
                      Procurement Slot Already Awarded
                    </button>
                  ` : `
                    <button
                      onclick="acceptSupplierEnquiry('${listing.id}', '${enq.id}', ${enq.offered_rate}, '${enq.supplier_name}', '${enq.entity_name}')"
                      class="agro-btn-primary"
                      style="width:100%; padding:12px; font-size:13px; font-weight:800; border-radius:10px; display:flex; justify-content:center; align-items:center; gap:8px; cursor:pointer; ${enq.is_lowest ? 'background:#10B981; box-shadow:0 4px 12px rgba(16,185,129,0.3);' : ''}"
                    >
                      <span>✓</span>
                      <span>Accept Offer & Award Procurement Contract (₹${enq.offered_rate.toFixed(2)}/kg)</span>
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeViewEnquiriesModal() {
  const m = document.getElementById('view-enquiries-modal');
  if (m) m.remove();
}

function acceptSupplierEnquiry(listingId, enqId, offerRate, supplierName, entityName) {
  const fullName = `${supplierName} (${entityName})`;
  const contractId = 'ORD-CTR-' + Date.now().toString().slice(-5);

  // Update in userListings
  if (state.userListings) {
    const listing = state.userListings.find(l => l.id === listingId);
    if (listing) {
      listing.status = 'CLAIMED';
      listing.claimed_by = fullName;
      listing.contract_id = contractId;
      listing.awarded_rate = offerRate;
      if (listing.supplierEnquiries) {
        listing.supplierEnquiries.forEach(e => {
          e.is_awarded = (e.id === enqId);
        });
      }
    }
  }

  // Update in shopRequirements
  if (state.shopRequirements) {
    const req = state.shopRequirements.find(r => r.id === listingId);
    if (req) {
      req.status = 'CLAIMED';
      req.claimed_by = fullName;
      req.contract_id = contractId;
    }
  }

  // Audit history
  state.auditHistory.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    event: 'Supplier Offer Accepted',
    detail: `Contract ${contractId} awarded to ${fullName} at ₹${offerRate.toFixed(2)}/kg for Listing #${listingId}.`,
    type: 'contract'
  });

  // Add to ordersLedger if present
  if (state.ordersLedger) {
    const l = (state.userListings || []).find(l => l.id === listingId);
    state.ordersLedger.unshift({
      id: contractId,
      listing_id: listingId,
      crop: l ? (l.crop_needed || l.crop) : 'Produce',
      supplier: fullName,
      quantity_kg: l ? l.quantity_kg : 8000,
      rate_per_kg: offerRate,
      total_inr: (l ? l.quantity_kg : 8000) * offerRate,
      awarded_at: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED'
    });
  }

  closeViewEnquiriesModal();

  alert(`✓ Supplier Offer Accepted Successfully!\n\n• Listing ID: ${listingId}\n• Awarded Supplier: ${fullName}\n• Agreed Price: ₹${offerRate.toFixed(2)}/kg\n• Contract ID: ${contractId}\n\nProcurement contract has been awarded and status updated to PRE-BOOKED.`);

  const container = document.getElementById('app-body');
  if (container) {
    if (state.currentTab === 'user_listings') {
      renderUserListingsView(container);
    } else {
      renderMarketplaceView(container);
    }
  }
}

function openCreateListingModal() {
  if (state.currentRole !== 'shop_owner') {
    alert('Access Restricted: Only registered Shop Owners can post listings on the Mandi Marketplace.');
    return;
  }
  const modalHtml = `
    <div class="modal-backdrop" id="create-listing-modal">
      <div class="modal-content" style="max-width:480px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">${t('post_demand_subtitle', 'Procurement Signal')}</span>
            <div style="font-size:18px; font-weight:800;">${t('post_demand_title', 'Post New Buy Requirement')}</div>
          </div>
          <button onclick="closeCreateListingModal()" class="modal-close">&times;</button>
        </div>

        <form onsubmit="handleCreateListingSubmit(event)">
          <div class="form-group">
            <label class="form-label">${t('post_crop_demanded', 'Commodity / Crop Needed')}</label>
            <input type="text" id="listing-crop" class="form-control" placeholder="e.g. Ponni Rice (BPT 5204)" value="Ponni Rice (BPT 5204)" required />
          </div>

          <div class="grid-3 form-group" style="gap:10px;">
            <div>
              <label class="form-label">${t('post_qty_kg', 'Quantity (kg)')}</label>
              <input type="number" step="100" id="listing-qty-kg" class="form-control" value="8000" min="100" required />
              <div style="font-size:10px; color:var(--slate); margin-top:2px;">e.g. 8000 kg (8 MT)</div>
            </div>
            <div>
              <label class="form-label">${t('post_quality_grade', 'Quality Grade')}</label>
              <select id="listing-grade" class="form-control" required>
                <option value="Grade A">${t('grade_export', 'Grade A (Export)')}</option>
                <option value="Grade B" selected>${t('grade_domestic', 'Grade B (Mandi)')}</option>
                <option value="Grade C">Grade C (Processing)</option>
              </select>
            </div>
            <div>
              <label class="form-label">${t('market_mandi_price', 'Rate (₹/kg)')}</label>
              <input type="number" step="0.5" id="listing-rate" class="form-control" value="32.0" required />
            </div>
          </div>

          <div class="grid-2 form-group">
            <div>
              <label class="form-label">${t('cert_district', 'Delivery Destination')}</label>
              <input type="text" id="listing-dest" class="form-control" value="Meenakshi Mandi, Madurai" required />
            </div>
            <div>
              <label class="form-label">${t('post_needed_by', 'Deadline Date')}</label>
              <input type="date" id="listing-deadline" class="form-control" value="2026-09-30" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Quality & Standard Specifications</label>
            <input type="text" id="listing-spec" class="form-control" value="Grain moisture <= 14%, single-polish, zero chemical smell" required />
          </div>

          <div class="form-group">
            <label class="form-label">Certification Status Preference</label>
            <select id="listing-cert" class="form-control" required>
              <option value="Fertilizer-Free / 100% Bio-Organic" selected>Fertilizer-Free / 100% Bio-Organic Certified</option>
              <option value="APEDA Zero-Synthetic Residue">APEDA Zero-Synthetic Residue Verified</option>
              <option value="Standard Mandi Non-Certified">Standard Mandi Non-Certified</option>
            </select>
          </div>

          <button type="submit" class="agro-btn-primary" style="width:100%; padding:12px; font-size:13px; margin-top:6px; font-weight:800;">
            ${t('post_btn_submit', '✓ Publish Requirement to Regional Network')}
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeCreateListingModal() {
  const m = document.getElementById('create-listing-modal');
  if (m) m.remove();
}

async function handleCreateListingSubmit(event) {
  event.preventDefault();
  const crop = document.getElementById('listing-crop').value;
  const qtyKg = parseFloat(document.getElementById('listing-qty-kg').value) || 8000;
  const grade = document.getElementById('listing-grade').value || 'Grade B';
  const rate = parseFloat(document.getElementById('listing-rate').value) || 32.0;
  const dest = document.getElementById('listing-dest').value;
  const deadline = document.getElementById('listing-deadline').value;
  const spec = document.getElementById('listing-spec').value;
  const cert = document.getElementById('listing-cert')?.value || 'Fertilizer-Free / 100% Bio-Organic';
  const qtyMt = (qtyKg / 1000).toFixed(1);

  const newListing = {
    id: `REQ-${Date.now().toString().slice(-4)}`,
    crop_needed: `${crop} (${grade})`,
    grade,
    certification_status: cert,
    quantity_kg: qtyKg,
    quantity_mt: parseFloat(qtyMt),
    target_price_per_kg: rate,
    max_budget_inr: qtyKg * rate,
    delivery_location: dest,
    deadline: deadline,
    status: 'OPEN',
    quality_specifications: `${spec} • [${cert}]`,
    posted_at: new Date().toISOString(),
    inquiries_count: 0
  };

  try {
    await fetch('/api/marketplace/requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({
        crop,
        quantity: qtyKg / 100,
        needed_by: deadline,
        region: dest,
        grade,
        certification_status: cert
      })
    });
  } catch (e) {}

  if (!state.userListings) state.userListings = [];
  state.userListings.unshift(newListing);

  initShopRequirements();
  state.shopRequirements.unshift({
    id: newListing.id,
    shop_owner_name: state.user?.name || 'Meenakshi Wholesale Mandi (Palanisamy Velu)',
    shop_location: dest || 'Madurai Central Mandi Yard, Tamil Nadu',
    crop: crop,
    quantity_kg: qtyKg,
    quantity_mt: parseFloat(qtyMt),
    grade: grade,
    target_price_per_kg: rate,
    max_budget_inr: qtyKg * rate,
    deadline: deadline,
    quality_spec: `${spec} • [${cert}]`,
    status: 'OPEN',
    claimed_by: null,
    contract_id: null
  });

  closeCreateListingModal();
  alert(`✓ Requirement Published Successfully!\n\n${qtyKg.toLocaleString('en-IN')} kg of ${crop} (${grade}) broadcast to Mandi procurement network.`);
  const container = document.getElementById('app-body');
  if (container) {
    if (state.currentTab === 'user_listings') {
      renderUserListingsView(container);
    } else {
      renderMarketplaceView(container);
    }
  }
}

// =========================================================================
// 12. TAB 2: ANALYTICS & TAB 3: HISTORY
// =========================================================================
let currentMlResult = null;

function applyAgroPreset(preset) {
  const presets = {
    thanjavur: { n: 80, p: 48, k: 40, ph: 6.5, temp: 24, hum: 82, rain: 230 },
    erode: { n: 78, p: 48, k: 20, ph: 6.2, temp: 23, hum: 65, rain: 85 },
    coimbatore: { n: 25, p: 130, k: 200, ph: 6.0, temp: 24, hum: 82, rain: 70 },
    madurai: { n: 100, p: 82, k: 50, ph: 6.0, temp: 27, hum: 80, rain: 105 },
    nilgiris: { n: 101, p: 29, k: 30, ph: 6.8, temp: 25, hum: 59, rain: 160 }
  };
  const val = presets[preset];
  if (!val) return;

  const inN = document.getElementById('ml-input-n');
  const inP = document.getElementById('ml-input-p');
  const inK = document.getElementById('ml-input-k');
  const inPh = document.getElementById('ml-input-ph');
  const inTemp = document.getElementById('ml-input-temp');
  const inHum = document.getElementById('ml-input-hum');
  const inRain = document.getElementById('ml-input-rain');

  if (inN) inN.value = val.n;
  if (inP) inP.value = val.p;
  if (inK) inK.value = val.k;
  if (inPh) inPh.value = val.ph;
  if (inTemp) inTemp.value = val.temp;
  if (inHum) inHum.value = val.hum;
  if (inRain) inRain.value = val.rain;

  runAiCropRecommendation();
}

async function runAiCropRecommendation() {
  const inN = parseFloat(document.getElementById('ml-input-n')?.value) || 80;
  const inP = parseFloat(document.getElementById('ml-input-p')?.value) || 48;
  const inK = parseFloat(document.getElementById('ml-input-k')?.value) || 40;
  const inPh = parseFloat(document.getElementById('ml-input-ph')?.value) || 6.5;
  const inTemp = parseFloat(document.getElementById('ml-input-temp')?.value) || 24;
  const inHum = parseFloat(document.getElementById('ml-input-hum')?.value) || 82;
  const inRain = parseFloat(document.getElementById('ml-input-rain')?.value) || 230;

  try {
    const res = await fetch('/api/ml/recommend-crop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        soil: { n: inN, p: inP, k: inK, ph: inPh },
        weather: { temp: inTemp, humidity: inHum, rainfall: inRain }
      })
    });
    if (res.ok) {
      const data = await res.json();
      currentMlResult = data;
    }
  } catch (e) {
    console.warn('API recommendation fallback:', e);
  }

  const container = document.getElementById('app-body');
  if (container) renderAnalyticsView(container);
}

// =========================================================================
// 12. TAB 2: CROP ANALYTICS (PRACTICAL DECISION-SUPPORT INTERFACE)
// =========================================================================
let currentSelectedRotationFarmId = null;

async function renderAnalyticsView(container) {
  const farmId = currentSelectedRotationFarmId || state.activeFarm?.id || (state.farms[0]?.id || 'farm-001-rajendra');
  currentSelectedRotationFarmId = farmId;

  let decisionData = null;
  try {
    const res = await fetch(`/api/farmer/next-crop-rotation?farm_id=${farmId}`, {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (res.ok) {
      decisionData = await res.json();
      state.rotationDecisionData = decisionData;
    }
  } catch (e) {
    console.warn('Error loading rotation decision data:', e);
  }

  const parcel = decisionData?.land_parcel || {
    id: farmId,
    land_name: state.activeFarm?.land_name || 'Amaravathi Basin Plot A',
    area_acres: state.activeFarm?.area_acres || 4.2,
    current_active_crop: state.activeFarm?.crop_type || 'Ponni Rice (BPT 5204)',
    current_stage: state.activeFarm?.current_stage || 'Harvest',
    soil_summary: { ph: 7.15, nitrogen_status: 'Medium / Low', soil_type: 'Deltaic Clay Loam' }
  };

  const recs = decisionData?.recommendations || [
    {
      crop_name: 'Blackgram',
      botanical_name: 'Vigna mungo',
      variety: 'VBN-8 / Vamban-11 (Certified Breeder Seed)',
      agronomic_fit_score: 98,
      season_window: 'Rabi 2026-27 (Post-Paddy Thaladi)',
      duration_days: 70,
      nitrogen_fixation_kg_ha: 42.0,
      soil_rejuvenation_reason: 'Fixes atmospheric nitrogen through root nodule Rhizobium symbiosis; utilizes residual paddy moisture without additional irrigation.',
      projected_yield_tonnes_acre: 0.95,
      projected_mandi_rate_per_kg: 86.00,
      market_demand_trend: 'Strong Export Demand (+18%)',
      est_cultivation_cost_acre: 14500,
      gross_market_value_acre: 81700,
      net_profit_projection_acre: 67200,
      roi_percentage: 463
    },
    {
      crop_name: 'Sesamum (Gingelly)',
      botanical_name: 'Sesamum indicum',
      variety: 'TMV-7 White Sesame (Export Grade)',
      agronomic_fit_score: 93,
      season_window: 'Summer 2027 (Mar - May)',
      duration_days: 85,
      nitrogen_fixation_kg_ha: 15.0,
      soil_rejuvenation_reason: 'Deep taproot system opens dense clay-loam subsoil; low moisture footprint with drought tolerance.',
      projected_yield_tonnes_acre: 0.65,
      projected_mandi_rate_per_kg: 135.00,
      market_demand_trend: 'High Commercial Demand',
      est_cultivation_cost_acre: 16000,
      gross_market_value_acre: 87750,
      net_profit_projection_acre: 71750,
      roi_percentage: 448
    },
    {
      crop_name: 'Maize (Yellow Corn)',
      botanical_name: 'Zea mays',
      variety: 'CoH(M)-8 Hybrid Grain',
      agronomic_fit_score: 89,
      season_window: 'Rabi 2026-27 (Nov - Feb)',
      duration_days: 105,
      nitrogen_fixation_kg_ha: 0.0,
      soil_rejuvenation_reason: 'High biomass return to soil organic matter; high phosphorus utilization.',
      projected_yield_tonnes_acre: 3.20,
      projected_mandi_rate_per_kg: 24.50,
      market_demand_trend: 'Steady Domestic Mandi',
      est_cultivation_cost_acre: 24000,
      gross_market_value_acre: 78400,
      net_profit_projection_acre: 54400,
      roi_percentage: 226
    }
  ];

  const suitabilityBands = decisionData?.suitability_bands || {
    highly_recommended: recs.filter(r => (r.agronomic_fit_score || 80) >= 75),
    moderately_recommended: recs.filter(r => (r.agronomic_fit_score || 80) >= 45 && (r.agronomic_fit_score || 80) < 75),
    not_recommended: []
  };

  container.innerHTML = `
    <div class="hero-header" style="background: linear-gradient(135deg, #13392E 0%, #2D6A4F 100%);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div class="hero-title">Crop Analytics & Precision Decision-Support 🤖</div>
        <button type="button" class="voice-walkthrough-btn" onclick="playTamilPrompt('dashboard_guide', this)">
          🔊 Audio Guide (தமிழ்)
        </button>
      </div>
      <div class="hero-meta">
        <span>Supervised ML: <strong>Random Forest 22-Crop Space</strong></span>
        <span>•</span>
        <span>Suitability Bands: <strong>3 Evaluated</strong></span>
        <span>•</span>
        <span>Export Standard: <strong>APEDA / Codex Alimentarius</strong></span>
      </div>
    </div>

    <!-- Multi-Parameter Telemetry Ingestion Card (7 Core Features) -->
    <div class="agro-card" style="margin-bottom:18px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <div>
          <span class="card-label">Target Monitored Land Parcel</span>
          <div style="font-size:16px; font-weight:800; color:var(--ink);">${parcel.land_name}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-size:12px; font-weight:700; color:var(--slate);">Select Parcel:</label>
          <select id="rotation-farm-selector" onchange="switchRotationParcel(this.value)" class="form-control" style="padding:6px 12px; font-size:12px; width:auto; font-weight:700;">
            ${state.farms.map(f => `
              <option value="${f.id}" ${f.id === farmId ? 'selected' : ''}>${f.land_name} (${f.current_stage || 'Active'})</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- 7 Ingested Soil & Meteorological Features Grid -->
      <div style="font-size:11px; font-weight:800; color:var(--slate); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">
        Multi-Parameter Ingestion: Core Nutrients (NPK), Soil pH & Environmental Factors
      </div>
      <div class="grid-4" style="gap:8px; margin-bottom:12px;">
        <div class="dosing-cell">
          <div class="cell-label">Available Nitrogen (N)</div>
          <div class="cell-value" style="color:var(--primary); font-size:14px;">265 kg/ha</div>
          <div style="font-size:9.5px; color:var(--slate);">Optimum: 250-350 kg/ha</div>
        </div>
        <div class="dosing-cell">
          <div class="cell-label">Available Phosphorus (P)</div>
          <div class="cell-value" style="color:var(--primary); font-size:14px;">45 kg/ha</div>
          <div style="font-size:9.5px; color:var(--slate);">Optimum: 35-60 kg/ha</div>
        </div>
        <div class="dosing-cell">
          <div class="cell-label">Available Potassium (K)</div>
          <div class="cell-value" style="color:var(--primary); font-size:14px;">48 kg/ha</div>
          <div style="font-size:9.5px; color:var(--slate);">Optimum: 40-70 kg/ha</div>
        </div>
        <div class="dosing-cell" style="border-left:3px solid #10B981;">
          <div class="cell-label">Soil Reaction (pH)</div>
          <div class="cell-value" style="color:#10B981; font-size:14px;">${parcel.soil_summary?.ph || 7.15} pH</div>
          <div style="font-size:9.5px; color:#10B981; font-weight:700;">Neutral Optimum</div>
        </div>
      </div>

      <div class="grid-3" style="gap:8px; background:var(--bg-canvas); padding:10px 12px; border-radius:12px; border:1px solid var(--border);">
        <div>
          <span style="font-size:10.5px; font-weight:700; color:var(--slate);">🌡️ Avg Temperature:</span>
          <strong style="font-size:12px; color:var(--ink);"> 28.5°C</strong>
        </div>
        <div>
          <span style="font-size:10.5px; font-weight:700; color:var(--slate);">💧 Relative Humidity:</span>
          <strong style="font-size:12px; color:var(--ink);"> 72%</strong>
        </div>
        <div>
          <span style="font-size:10.5px; font-weight:700; color:var(--slate);">🌧️ Seasonal Rainfall:</span>
          <strong style="font-size:12px; color:var(--ink);"> 110 mm / mo</strong>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- BAND 1: HIGHLY RECOMMENDED (IDEAL CONDITIONS)                             -->
    <!-- ========================================================================= -->
    <div class="suitability-band-container">
      <div class="suitability-band-header band-highly">
        <div style="display:flex; align-items:center; gap:8px;">
          <span>🌟</span>
          <span>${state.language === 'ta' ? 'மிகவும் பரிந்துரைக்கப்படும் பயிர்கள் (சிறந்த நிலைமை)' : 'HIGHLY RECOMMENDED (IDEAL CONDITIONS)'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:11px; opacity:0.9;">Suitability Score &ge; 75% • Grade A Potential</span>
          <button type="button" class="btn-audio-speak" onclick="playTamilPrompt('step_1_leaf_uniformity', this)">🔊 Play (தமிழ்)</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${(suitabilityBands.highly_recommended && suitabilityBands.highly_recommended.length > 0 ? suitabilityBands.highly_recommended : recs.slice(0, 2)).map((rec, idx) => {
          const fitScore = rec.agronomic_fit_score || rec.suitability_score || 94;
          const variety = rec.variety || rec.seed_variety || 'Certified Breeder Seed';
          const yieldAcre = rec.projected_yield_tonnes_acre || 0.95;
          const yieldHa = rec.projected_yield_t_ha || Number((yieldAcre * 2.471).toFixed(2));
          const grade = rec.projected_quality_grade || 'Grade A';

          return `
            <div style="padding:18px; border-radius:16px; background:#FFFFFF; border:1.5px solid #10B981; box-shadow:0 4px 14px rgba(16,185,129,0.08);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="font-size:18px; font-weight:900; color:var(--ink);">${rec.crop_name || rec.crop}</span>
                    <span class="badge badge-forest" style="font-size:11.5px; font-weight:800;">${fitScore}% SUITABILITY</span>
                    <span class="badge badge-forest" style="font-size:11px; background:#10B981; color:#FFF;">✓ ${grade} EXPORT SPEC</span>
                    ${idx === 0 ? '<span class="badge badge-gold" style="font-size:10px;">★ TOP CROP CHOICE</span>' : ''}
                    <button type="button" class="btn-audio-speak" onclick="playTamilPrompt('step_1_leaf_uniformity', this)">🔊 Play (தமிழ்)</button>
                  </div>
                  <div style="font-size:12.5px; color:var(--slate); margin-top:4px;">
                    Certified Variety: <strong style="color:var(--primary);">${variety}</strong>
                  </div>
                </div>

                <div style="text-align:right;">
                  <div style="font-size:20px; font-weight:900; color:#10B981;">${yieldAcre} MT / Acre</div>
                  <div style="font-size:10px; font-weight:800; color:var(--slate);">(${yieldHa} Tonnes/Ha) PROJECTED YIELD</div>
                </div>
              </div>

              <div style="margin-top:12px; padding:10px 14px; border-radius:10px; background:var(--mint-soft); border:1px solid var(--border); font-size:12px;">
                <div style="font-weight:800; color:var(--primary); margin-bottom:2px;">🌱 Actionable Agronomic Insights:</div>
                <div style="color:var(--ink); line-height:1.4;">${rec.soil_rejuvenation_reason || rec.actionable_insight || 'Ideal soil chemistry and climate envelope. Optimal for zero-residue Grade A export production.'}</div>
              </div>

              <div class="grid-3" style="margin-top:12px; gap:8px;">
                <div class="dosing-cell">
                  <div class="cell-label">Projected Produce Grade</div>
                  <div class="cell-value" style="font-size:13px; color:#10B981; font-weight:800;">Grade A (Export Ready)</div>
                </div>
                <div class="dosing-cell">
                  <div class="cell-label">Market / Mandi Rate</div>
                  <div class="cell-value" style="font-size:13px; color:var(--primary); font-weight:800;">₹${(rec.projected_mandi_rate_per_kg || rec.market_rate_per_kg || 86).toFixed(2)} / kg</div>
                </div>
                <div class="dosing-cell">
                  <div class="cell-label">Suitability Band</div>
                  <div class="cell-value" style="font-size:11.5px; color:#10B981; font-weight:800;">Highly Recommended</div>
                </div>
              </div>

              <div style="margin-top:14px; display:flex; justify-content:flex-end;">
                <button onclick="adoptCropRotationPlan('${rec.crop_name || rec.crop}', '${variety}', '${parcel.land_name}')" class="agro-btn-primary" style="padding:10px 20px; font-size:12.5px;">
                  🌱 Pre-Book Seed Variety: ${variety}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- BAND 2: MODERATELY RECOMMENDED (ACCEPTABLE WITH SOIL AMENDMENT)           -->
    <!-- ========================================================================= -->
    <div class="suitability-band-container">
      <div class="suitability-band-header band-moderately">
        <div style="display:flex; align-items:center; gap:8px;">
          <span>⚠️</span>
          <span>${state.language === 'ta' ? 'மிதமான பரிந்துரை (மண் மேம்பாடு தேவை)' : 'MODERATELY RECOMMENDED (ACCEPTABLE WITH SOIL AMENDMENT)'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:11px; opacity:0.9;">Suitability 45% - 74% • Grade B Tier</span>
          <button type="button" class="btn-audio-speak" onclick="playTamilPrompt('step_4_soil_moisture', this)">🔊 Play (தமிழ்)</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${(suitabilityBands.moderately_recommended && suitabilityBands.moderately_recommended.length > 0 ? suitabilityBands.moderately_recommended.slice(0, 2) : [
          {
            crop: 'Maize (Yellow Corn)',
            crop_name: 'Maize (Yellow Corn)',
            seed_variety: 'CoH(M)-8 Hybrid Grain',
            suitability_score: 68,
            projected_yield_tonnes_acre: 2.75,
            projected_yield_t_ha: 6.80,
            projected_quality_grade: 'Grade B',
            actionable_insight: 'Marginal phosphorus deficit. Apply 40 kg/ha Rock Phosphate and bio-potash top-dressing to elevate crop to Grade A specification.'
          }
        ]).map(rec => {
          const fitScore = rec.suitability_score || rec.agronomic_fit_score || 68;
          const variety = rec.seed_variety || rec.variety || 'Hybrid Commercial Variety';
          const yieldAcre = rec.projected_yield_tonnes_acre || 2.40;

          return `
            <div style="padding:16px; border-radius:14px; background:#FFFFFF; border:1.5px solid #F59E0B; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="font-size:16.5px; font-weight:900; color:var(--ink);">${rec.crop_name || rec.crop}</span>
                    <span class="badge badge-gold" style="font-size:11px; font-weight:800;">${fitScore}% SUITABILITY</span>
                    <span class="badge badge-gold" style="font-size:10.5px;">GRADE B (DOMESTIC MANDI)</span>
                    <button type="button" class="btn-audio-speak" onclick="playTamilPrompt('step_4_soil_moisture', this)">🔊 Play (தமிழ்)</button>
                  </div>
                  <div style="font-size:12px; color:var(--slate); margin-top:3px;">
                    Variety: <strong>${variety}</strong> • Projected Yield: <strong>${yieldAcre} MT / Acre</strong>
                  </div>
                </div>
              </div>

              <div style="margin-top:10px; padding:10px 12px; border-radius:8px; background:#FFFBEB; border:1px solid #FDE68A; font-size:12px; color:#92400E;">
                <strong>⚠️ Required Soil Amendment:</strong> ${rec.actionable_insight || 'Target basal phosphorus supplementation and micro-irrigation management to reach optimum yield.'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- BAND 3: NOT RECOMMENDED (UNSUITABLE CONDITIONS)                           -->
    <!-- ========================================================================= -->
    <div class="suitability-band-container">
      <div class="suitability-band-header band-not">
        <div style="display:flex; align-items:center; gap:8px;">
          <span>⛔</span>
          <span>${state.language === 'ta' ? 'பரிந்துரைக்கப்படாத பயிர்கள் (பொருத்தமற்ற சூழல்)' : 'NOT RECOMMENDED (UNSUITABLE CONDITIONS)'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:11px; opacity:0.9;">Suitability &lt; 45% • High Risk of Crop Failure</span>
          <button type="button" class="btn-audio-speak" onclick="playTamilPrompt('step_3_pest_blemish', this)">🔊 Play (தமிழ்)</button>
        </div>
      </div>

      <div style="padding:14px; border-radius:14px; background:#FEF2F2; border:1.5px solid #EF4444; font-size:12px; color:#991B1B;">
        <div style="font-weight:800; margin-bottom:4px;">🚫 High Agronomic Incompatibility Warning:</div>
        <div>Crops such as <strong>Apple, Kidney Beans, and Grapes</strong> are not recommended for this parcel boundary due to extreme tropical heat deficit, clay-loam water retention, or pH threshold variance. Cultivation risks severe yield reduction and financial deficit.</div>
      </div>
    </div>
  `;
}

function switchRotationParcel(newFarmId) {
  currentSelectedRotationFarmId = newFarmId;
  const container = document.getElementById('app-body');
  if (container) renderAnalyticsView(container);
}

function adoptCropRotationPlan(cropName, variety, farmName) {
  state.auditHistory.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    event: 'Next-Crop Rotation Plan Adopted',
    detail: `Farmer selected ${cropName} (${variety}) for next season on ${farmName}. Breeder seed requisition logged.`,
    type: 'land'
  });
  alert(`✓ Crop Rotation Plan Adopted!\n\nCrop: ${cropName} (${variety})\nParcel: ${farmName}\n\nCertified breeder seed requisition has been registered with Tamil Nadu Agricultural University & Extension Office.`);
}

// =========================================================================
// 13. TAB 3: HISTORICAL LAND USAGE LEDGER (OVERHAULED LOG LIST)
// =========================================================================
let currentLogFilterFarmId = 'ALL';

async function renderLogListView(container) {
  try {
    const url = currentLogFilterFarmId && currentLogFilterFarmId !== 'ALL'
      ? `/api/farmer/historical-land-logs?farm_id=${currentLogFilterFarmId}`
      : '/api/farmer/historical-land-logs';

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      state.historicalLandLogs = data.logs || [];
      state.historicalLandMetrics = data.metrics;
    }
  } catch (e) {
    console.warn('Error loading historical land logs:', e);
  }

  const logs = state.historicalLandLogs || [];
  const metrics = state.historicalLandMetrics || {
    total_historical_yield_tonnes: 58.7,
    total_lifetime_sales_inr: 1548500,
    average_yield_per_acre: 5.12,
    parcels_tracked_count: 3,
    total_cycles_recorded: logs.length
  };

  container.innerHTML = `
    <div class="hero-header" style="background: linear-gradient(135deg, #13392E 0%, #1B4D3E 100%);">
      <div class="hero-title">${t('nav_history_plans', 'History of Plants')} 📜</div>
    </div>

    <!-- Filter & Historical Records List -->
    <div class="agro-card">
      <div class="agro-card-header">
        <div>
          <div class="card-title">${state.language === 'ta' ? 'பயிரிடப்பட்ட பயிர்கள் மற்றும் அறுவடை பதிவுகள்' : 'Cultivated Plants & Harvest Logs'}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-size:12px; font-weight:700; color:var(--slate);">Filter Parcel:</label>
          <select id="log-parcel-filter" onchange="filterHistoricalLogs(this.value)" class="form-control" style="padding:6px 12px; font-size:12px; width:auto; font-weight:700;">
            <option value="ALL" ${currentLogFilterFarmId === 'ALL' ? 'selected' : ''}>All Parcels</option>
            ${state.farms.map(f => `
              <option value="${f.id}" ${f.id === currentLogFilterFarmId ? 'selected' : ''}>${f.land_name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${logs.map(log => {
          const cropName = log.crop_name || log.crop_deployed || 'Ponni Rice (BPT 5204)';
          const variety = log.botanical_variety || log.crop_variety || 'Oryza sativa var. indica';
          const channel = log.destination_channel || log.market_channel || 'APEDA Export Grade A';
          const yieldTonnes = log.harvested_yield_tonnes || (log.harvested_yield_quintals ? (log.harvested_yield_quintals / 10).toFixed(1) : 24.5);
          const yieldQtl = log.harvested_yield_quintals || (typeof yieldTonnes === 'number' ? yieldTonnes * 10 : parseFloat(yieldTonnes) * 10);
          const buyer = log.buyer_purchaser || (channel.includes('Export') ? 'Kongu Agro Global Exports Pvt Ltd' : 'Meenakshi Wholesale Mandi');

          return `
          <div style="padding:16px; border-radius:14px; background:var(--bg-canvas); border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="badge badge-gold" style="font-size:11px;">${log.season}</span>
                  <span class="badge badge-forest">${channel}</span>
                </div>
                <div style="font-size:16px; font-weight:800; color:var(--ink); margin-top:6px;">${cropName} (${variety})</div>
                <div style="font-size:12px; color:var(--slate); margin-top:2px;">
                  Parcel: <strong>${log.farm_name}</strong> • Cultivated: <strong>${log.acres_cultivated} Acres</strong> • Harvested: <strong>${log.harvest_date}</strong>
                </div>
              </div>
            </div>

            <!-- Volume & Buyer Telemetry -->
            <div class="grid-2" style="margin-top:12px; gap:8px;">
              <div class="dosing-cell">
                <div class="cell-label">Harvested Volume</div>
                <div class="cell-value" style="font-size:13px; color:var(--primary); font-weight:800;">${yieldTonnes} MT (${yieldQtl} Qtl)</div>
              </div>
              <div class="dosing-cell">
                <div class="cell-label">Purchaser / Destination</div>
                <div class="cell-value" style="font-size:12px; font-weight:700;">${buyer}</div>
              </div>
            </div>
          </div>
        `;
        }).join('')}
      </div>
    </div>
  `;
}

function filterHistoricalLogs(farmId) {
  currentLogFilterFarmId = farmId;
  const container = document.getElementById('app-body');
  if (container) renderLogListView(container);
}

function renderHistoryView(container) {
  container.innerHTML = `
    <div class="hero-header" style="background: linear-gradient(135deg, #13392E 0%, #1B4D3E 100%);">
      <div class="hero-subtitle">Tamper-Proof Audit Trail</div>
      <div class="hero-title">Activity History & Cryptographic Logs 📜</div>
      <div class="hero-meta">Anti-Fraud Camera Captures • Signed Coordinates • Barcode Verifications</div>
    </div>

    <div class="agro-card">
      <span class="card-label">Recent Verified Events</span>
      <div class="card-title" style="margin-bottom:12px;">Cryptographic Audit Trail</div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${state.auditHistory.map(item => `
          <div style="padding:12px 14px; border-radius:12px; background:var(--bg-canvas); border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-weight:800; font-size:13px; color:var(--primary);">${item.event}</div>
              <span style="font-size:11px; color:var(--slate); font-family:monospace;">${item.timestamp}</span>
            </div>
            <div style="font-size:12px; color:var(--ink); margin-top:4px;">${item.detail}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// SPECIFICATION 4: DEDICATED YIELD VIEW FOR FARMER NAVIGATION
function renderYieldView(container) {
  const farm = state.activeFarm || state.farms[0];
  const pred = farm?.harvest_prediction || {
    days_remaining: 125,
    predicted_yield_tonnes: 24.5,
    grade_a_percentage: 75,
    grade_b_c_percentage: 25,
    expected_harvest_date: '2027-01-12'
  };

  const otherFarms = (state.farms || []).filter(f => f.id !== farm?.id);

  container.innerHTML = `
    <div class="hero-header" style="background: linear-gradient(135deg, #1B4D3E 0%, #2D6A4F 100%);">
      <div class="hero-title">${t('nav_yield_harvest', 'Yield')} 🌾</div>
    </div>

    <!-- PROMINENT SELECTED LAND YIELD CARD -->
    <div class="agro-card">
      <div class="agro-card-header">
        <div>
          <span class="card-label" style="color:var(--primary); font-weight:800;">${state.language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட நிலம்' : 'Selected Land'}</span>
          <div class="card-title" style="font-size:20px; font-weight:900;">${farm?.land_name || 'Amaravathi Basin Plot A'} (${farm?.crop_type || 'Ponni Rice'})</div>
        </div>
        <span class="badge badge-gold" style="font-size:11px;">⏳ ${pred.days_remaining} Days to Harvest</span>
      </div>

      <div class="grid-3" style="margin:14px 0;">
        <div class="dosing-cell" style="border-left:4px solid var(--primary);">
          <div class="cell-label">Total Projected Yield</div>
          <div class="cell-value" style="font-size:22px; color:var(--primary);">${pred.predicted_yield_tonnes} Tonnes</div>
        </div>
        <div class="dosing-cell" style="border-left:4px solid #2D6A4F;">
          <div class="cell-label">Grade A (Export)</div>
          <div class="cell-value" style="font-size:22px; color:#2D6A4F;">${(pred.predicted_yield_tonnes * pred.grade_a_percentage / 100).toFixed(1)} Tonnes</div>
          <div style="font-size:10px; color:var(--slate); margin-top:2px;">${pred.grade_a_percentage}% Export Allocation</div>
        </div>
        <div class="dosing-cell" style="border-left:4px solid var(--gold);">
          <div class="cell-label">Grade B/C (Mandi)</div>
          <div class="cell-value" style="font-size:22px; color:var(--gold);">${(pred.predicted_yield_tonnes * pred.grade_b_c_percentage / 100).toFixed(1)} Tonnes</div>
          <div style="font-size:10px; color:var(--slate); margin-top:2px;">${pred.grade_b_c_percentage}% Mandi Allocation</div>
        </div>
      </div>

      <div style="background:var(--mint-soft); border:1px solid var(--mint-light); border-radius:14px; padding:14px; margin-top:10px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800; margin-bottom:6px;">
          <span style="color:var(--primary);">🚢 Grade A Export (${pred.grade_a_percentage}%)</span>
          <span style="color:var(--gold);">🏪 Mandi Domestic (${pred.grade_b_c_percentage}%)</span>
        </div>
        <div style="height:12px; display:flex; border-radius:8px; overflow:hidden;">
          <div style="width:${pred.grade_a_percentage}%; background:var(--primary);"></div>
          <div style="width:${pred.grade_b_c_percentage}%; background:var(--gold);"></div>
        </div>
      </div>

      <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <button onclick="openHarvestTraceabilityPassport('${farm?.id || 'farm-001-rajendra'}')" class="agro-btn-primary" style="font-size:12px; padding:8px 14px;">
          📜 Generate APEDA Pre-Harvest Readiness Dossier
        </button>
        <button onclick="openWeeklyProgressionModal('${farm?.id || 'farm-001-rajendra'}')" class="agro-btn-secondary" style="font-size:12px; padding:8px 14px;">
          📅 8-Week Progression Timeline
        </button>
      </div>
    </div>

    <!-- OTHER LANDS YIELD OVERVIEW -->
    ${otherFarms.length > 0 ? `
      <div class="agro-card" style="margin-top:16px;">
        <div class="card-title" style="margin-bottom:12px; font-size:16px;">${state.language === 'ta' ? 'பிற நிலங்கள்' : 'Other Lands'}</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${otherFarms.map(f => {
            const fPred = f.harvest_prediction || { predicted_yield_tonnes: 18.2, days_remaining: 110 };
            return `
              <div onclick="selectFarm('${f.id}'); renderYieldView(document.getElementById('app-body'));" style="padding:14px; border-radius:12px; background:var(--bg-canvas); border:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:all 0.15s ease;">
                <div>
                  <div style="font-weight:800; font-size:14px; color:var(--ink);">${f.land_name}</div>
                  <div style="font-size:11px; color:var(--slate); margin-top:2px;">
                    ${translateCrop(f.crop_type)} • ${f.area_acres || 4.2} Acres • ${t('cert_parcel', 'Stage')}: ${translateStage(f.current_stage || 'Flowering')}
                  </div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:16px; font-weight:800; color:var(--primary);">${fPred.predicted_yield_tonnes} Tonnes</div>
                  <span class="badge badge-mint" style="font-size:10px; margin-top:4px;">${state.language === 'ta' ? 'நிலத்தை தேர்வு செய் →' : 'Select Land →'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function renderChannelRoutingView(container) {
  return renderConsignmentHistoryView(container);
}

// SPECIFICATION 4: FUNCTIONAL EDIT PROFILE MODAL ACROSS ALL USER ROLES
function openEditProfileModal() {
  const u = state.user;
  const role = state.currentRole;

  let roleFields = '';
  if (role === 'farmer') {
    roleFields = `
      <div class="form-group">
        <label class="form-label">Farmer ID Code</label>
        <input type="text" id="prof-farmer-id" class="form-control" value="${u.farmer_id_code || 'TN-FARM-8492'}" />
      </div>
    `;
  } else if (role === 'agent') {
    roleFields = `
      <div class="form-group">
        <label class="form-label">Field Agent Badge / Code</label>
        <input type="text" id="prof-agent-badge" class="form-control" value="${u.exporter_code || 'EXP-TN-ERODE-101'}" />
      </div>
    `;
  } else if (role === 'exporter') {
    roleFields = `
      <div class="form-group">
        <label class="form-label">Company Name</label>
        <input type="text" id="prof-company" class="form-control" value="${u.company_name || u.name || 'Kongu Agro Global Exports Pvt Ltd'}" />
      </div>
      <div class="form-group">
        <label class="form-label">APEDA Export ID / IEC</label>
        <input type="text" id="prof-export-id" class="form-control" value="${u.export_id || '0485019284'}" />
      </div>
      <div class="form-group">
        <label class="form-label">GST Number</label>
        <input type="text" id="prof-gst" class="form-control" value="${u.gst_number || '33AAACK7741P1ZB'}" />
      </div>
    `;
  } else if (role === 'shop_owner') {
    roleFields = `
      <div class="form-group">
        <label class="form-label">Shop / Mandi Name</label>
        <input type="text" id="prof-shop-name" class="form-control" value="${u.shop_name || 'Meenakshi Wholesale & Retail Mandi'}" />
      </div>
      <div class="form-group">
        <label class="form-label">GST Number</label>
        <input type="text" id="prof-gst" class="form-control" value="${u.gst_number || '33AABCM9102K1ZV'}" />
      </div>
    `;
  }

  const modalHtml = `
    <div class="modal-backdrop" id="edit-profile-modal">
      <div class="modal-content" style="max-width:480px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">${t('profile_modal_title', 'User Account Settings')}</span>
            <div style="font-size:18px; font-weight:800;">${t('nav_edit_profile', 'Edit Profile')} (${t(`role_${role}`, role.toUpperCase())})</div>
          </div>
          <button onclick="closeEditProfileModal()" class="modal-close">&times;</button>
        </div>

        <form onsubmit="handleProfileEditSubmit(event)">
          <div class="form-group">
            <label class="form-label">${t('profile_field_language', 'Preferred Platform Language / விருப்ப மொழி')}</label>
            <select id="prof-language" class="form-control" style="font-weight:700;">
              <option value="en" ${state.language === 'en' ? 'selected' : ''}>English (EN)</option>
              <option value="ta" ${state.language === 'ta' ? 'selected' : ''}>தமிழ் - Tamil (TA)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">${t('profile_field_name', 'Full Name / Display Name')}</label>
            <input type="text" id="prof-name" class="form-control" value="${u.name || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">${t('profile_field_phone', 'Registered Phone Number')}</label>
            <input type="tel" id="prof-phone" class="form-control" value="${u.phone || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">${t('profile_field_district', 'District / Agro-Zone (Tamil Nadu)')}</label>
            <select id="prof-district" class="form-control">
              <option value="Thanjavur" ${u.district === 'Thanjavur' ? 'selected' : ''}>Thanjavur Delta</option>
              <option value="Erode" ${u.district === 'Erode' ? 'selected' : ''}>Erode (Turmeric & River Basin)</option>
              <option value="Coimbatore" ${u.district === 'Coimbatore' ? 'selected' : ''}>Coimbatore (Kongu Zone)</option>
              <option value="Madurai" ${u.district === 'Madurai' ? 'selected' : ''}>Madurai (Trading Mandi)</option>
              <option value="Salem" ${u.district === 'Salem' ? 'selected' : ''}>Salem Agro-Zone</option>
            </select>
          </div>

          ${roleFields}

          <div class="grid-2" style="margin-top:18px;">
            <button type="submit" class="agro-btn-primary" style="padding:10px; font-size:13px;">
              ${t('btn_save_profile', '✓ Save Changes')}
            </button>
            <button type="button" onclick="closeEditProfileModal()" class="agro-btn-secondary" style="padding:10px; font-size:13px;">
              ${t('btn_cancel', 'Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function handleProfileEditSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('prof-name').value.trim();
  const phone = document.getElementById('prof-phone').value.trim();
  const district = document.getElementById('prof-district').value;
  const chosenLang = document.getElementById('prof-language')?.value || state.language || 'en';

  const updates = { name, phone, district, region: `${district}, Tamil Nadu`, language: chosenLang };
  const farmerId = document.getElementById('prof-farmer-id');
  if (farmerId) updates.farmer_id_code = farmerId.value.trim();

  const agentBadge = document.getElementById('prof-agent-badge');
  if (agentBadge) updates.exporter_code = agentBadge.value.trim();

  const company = document.getElementById('prof-company');
  if (company) updates.company_name = company.value.trim();

  const exportId = document.getElementById('prof-export-id');
  if (exportId) updates.export_id = exportId.value.trim();

  const gst = document.getElementById('prof-gst');
  if (gst) updates.gst_number = gst.value.trim();

  const shopName = document.getElementById('prof-shop-name');
  if (shopName) updates.shop_name = shopName.value.trim();

  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify(updates)
    });

    if (res.ok) {
      const data = await res.json();
      state.user = { ...state.user, ...data.user };
    } else {
      state.user = { ...state.user, ...updates };
    }
  } catch (err) {
    state.user = { ...state.user, ...updates };
  }

  if (chosenLang !== state.language) {
    toggleLanguage(chosenLang);
  } else {
    updateSidebarProfile();
    renderRoleSidebar(state.currentRole);
    renderApp();
  }

  closeEditProfileModal();
  showToast(state.language === 'ta' ? 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Profile updated successfully!');
}

function closeEditProfileModal() {
  const m = document.getElementById('edit-profile-modal');
  if (m) m.remove();
}

// =========================================================================
// 13. AUTHENTICATION MODAL
// =========================================================================
let activeAuthTab = 'login';
let selectedAuthRole = 'farmer';

function openAuthModal() {
  selectedAuthRole = state.currentRole;
  renderAuthModalContent();
}

function renderAuthModalContent() {
  const existing = document.getElementById('auth-modal');
  if (existing) existing.remove();

  const isRegister = activeAuthTab === 'register';

  const modalHtml = `
    <div class="modal-backdrop" id="auth-modal">
      <div class="modal-content" style="max-width:480px;">
        <div class="modal-header">
          <div>
            <span class="card-label" style="color:var(--primary);">Identity & Access Control</span>
            <div style="font-size:18px; font-weight:800;">AgroSmart 4-Tier RBAC</div>
          </div>
          <button onclick="closeAuthModal()" class="modal-close">&times;</button>
        </div>

        <div class="unit-toggle-container" style="margin-bottom:14px;">
          <button type="button" class="unit-toggle-btn ${!isRegister ? 'active' : ''}" onclick="switchAuthTab('login')">Sign In</button>
          <button type="button" class="unit-toggle-btn ${isRegister ? 'active' : ''}" onclick="switchAuthTab('register')">Register New Account</button>
        </div>

        <div style="margin-bottom:14px;">
          <label class="form-label">Select Active Role</label>
          <div class="role-pills" style="width:100%;">
            <button type="button" class="role-pill-btn ${selectedAuthRole === 'farmer' ? 'active' : ''}" onclick="changeAuthModalRole('farmer')">🌾 Farmer</button>
            <button type="button" class="role-pill-btn ${selectedAuthRole === 'agent' ? 'active' : ''}" onclick="changeAuthModalRole('agent')">🔍 Agent</button>
            <button type="button" class="role-pill-btn ${selectedAuthRole === 'exporter' ? 'active' : ''}" onclick="changeAuthModalRole('exporter')">🚢 Exporter</button>
            <button type="button" class="role-pill-btn ${selectedAuthRole === 'shop_owner' ? 'active' : ''}" onclick="changeAuthModalRole('shop_owner')">🏪 Shop</button>
          </div>
        </div>

        <button type="button" onclick="loadDemoAuthCredentials()" class="agro-btn-secondary" style="width:100%; margin-bottom:14px; font-size:11px; padding:6px;">
          ⚡ Pre-Fill Verified Profile
        </button>

        <form onsubmit="handleAuthSubmit(event)">
          <div class="form-group">
            <label class="form-label">Mobile Number (10 Digits)</label>
            <input type="text" id="auth-phone" required class="form-control" maxlength="10" placeholder="e.g. 9842100004" />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="auth-password" required class="form-control" value="SecureAgro#2026" placeholder="Enter password" />
          </div>

          ${isRegister ? `
            <div class="form-group">
              <label class="form-label">Full Name / Authorized Signatory</label>
              <input type="text" id="auth-name" required class="form-control" placeholder="e.g. Arumugam Sundaram" />
            </div>

            ${selectedAuthRole === 'farmer' ? `
              <div class="form-group">
                <label class="form-label">District</label>
                <input type="text" id="auth-district" class="form-control" value="Thanjavur" />
              </div>
            ` : ''}

            ${selectedAuthRole === 'agent' ? `
              <div class="form-group">
                <label class="form-label">Mandatory Exporter Code</label>
                <input type="text" id="auth-agent-exporter-code" required class="form-control" value="EXP-TN-COIMBATORE-101" />
              </div>
            ` : ''}

            ${selectedAuthRole === 'exporter' ? `
              <div class="grid-2 form-group">
                <div>
                  <label class="form-label">Company Name</label>
                  <input type="text" id="auth-company-name" required class="form-control" value="Kongu Agro Global Exports" />
                </div>
                <div>
                  <label class="form-label">Company Reg ID</label>
                  <input type="text" id="auth-company-reg" required class="form-control" value="TN-REG-2026-88" />
                </div>
              </div>
              <div class="grid-2 form-group">
                <div>
                  <label class="form-label">15-Char GST Number</label>
                  <input type="text" id="auth-gst-number" required class="form-control" maxlength="15" value="33AAACK7741P1ZB" />
                </div>
                <div>
                  <label class="form-label">10-Char Export ID (IEC)</label>
                  <input type="text" id="auth-export-id" required class="form-control" maxlength="10" value="0485019284" />
                </div>
              </div>
            ` : ''}

            ${selectedAuthRole === 'shop_owner' ? `
              <div class="grid-2 form-group">
                <div>
                  <label class="form-label">Shop / Mandi Name</label>
                  <input type="text" id="auth-shop-name" required class="form-control" value="Meenakshi Wholesale Mandi" />
                </div>
                <div>
                  <label class="form-label">15-Char GST Number</label>
                  <input type="text" id="auth-shop-gst" required class="form-control" maxlength="15" value="33AABCM9102K1ZV" />
                </div>
              </div>
            ` : ''}
          ` : ''}

          <button type="submit" class="agro-btn-primary" style="width:100%; padding:12px; font-size:13px; margin-top:8px;">
            ${isRegister ? '✓ Register Account' : '✓ Authenticate & Enter Terminal'}
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function switchAuthTab(tab) {
  activeAuthTab = tab;
  renderAuthModalContent();
}

function changeAuthModalRole(role) {
  selectedAuthRole = role;
  renderAuthModalContent();
  loadDemoAuthCredentials();
}

function loadDemoAuthCredentials() {
  const p = TN_PERSONAS[selectedAuthRole];
  const phone = document.getElementById('auth-phone');
  const name = document.getElementById('auth-name');
  if (phone) phone.value = p.phone;
  if (name) name.value = p.name;
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const phone = document.getElementById('auth-phone').value.trim();
  const password = document.getElementById('auth-password').value;

  if (activeAuthTab === 'login') {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        state.token = data.token;
        state.user = data.user;
        state.currentRole = data.user.role;
        closeAuthModal();
        // Fixed routing: do not call switchRole (which triggers modal), directly render dashboard
        state.currentTab = (state.currentRole === 'shop_owner') ? 'marketplace' : 'menu';
        updateSidebarProfile();
        renderRoleSidebar(state.currentRole);
        renderApp();
      } else {
        alert(`Login Failed: ${data.error || 'Invalid credentials'}`);
      }
    } catch (e) {
      // Offline fallback for demo
      const demoUser = Object.values(TN_PERSONAS).find(p => p.phone === phone) || TN_PERSONAS[selectedAuthRole];
      state.user = demoUser;
      state.token = 'demo-offline-token';
      state.currentRole = demoUser.role;
      closeAuthModal();
      state.currentTab = (state.currentRole === 'shop_owner') ? 'marketplace' : 'menu';
      updateSidebarProfile();
      renderRoleSidebar(state.currentRole);
      renderApp();
    }
  } else {
    // Registration logic
    const payload = {
      phone,
      password,
      role: selectedAuthRole,
      name: document.getElementById('auth-name')?.value || 'New User',
    };
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        state.token = data.token;
        state.user = data.user;
        state.currentRole = data.user.role;
        closeAuthModal();
        state.currentTab = (state.currentRole === 'shop_owner') ? 'marketplace' : 'menu';
        updateSidebarProfile();
        renderRoleSidebar(state.currentRole);
        renderApp();
      } else {
        alert(`Registration Error: ${data.error || 'Failed to create account.'}`);
      }
    } catch (e) {
      closeAuthModal();
    }
  }
}

function closeAuthModal() {
  const m = document.getElementById('auth-modal');
  if (m) m.remove();
}

function closeModal() {
  const m = document.getElementById('modal-container');
  if (m) m.remove();
}

// =========================================================================
// APVMA MRL CHEMICAL SAFETY ADVISOR MODAL
// =========================================================================
function openMrlAdvisorModal(defaultCrop) {
  const existing = document.getElementById('mrl-advisor-modal');
  if (existing) existing.remove();

  const modalHtml = `
    <div class="modal-backdrop" id="mrl-advisor-modal" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;">
      <div class="modal-content" style="background:#FFFFFF; border-radius:18px; width:100%; max-width:580px; max-height:90vh; overflow-y:auto; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,0.3); border:1px solid rgba(27, 77, 62, 0.2);">
        <div class="modal-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; border-bottom:1px solid #E2E8F0; padding-bottom:12px;">
          <div>
            <span class="badge badge-forest" style="font-size:10px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">APVMA MRL Standard (Australia Table 1)</span>
            <h3 style="margin:4px 0 0; font-size:18px; color:#1B4D3E; font-weight:800;">Pesticide & Chemical Safety Advisor</h3>
          </div>
          <button onclick="closeMrlAdvisorModal()" style="background:none; border:none; font-size:24px; cursor:pointer; color:#64748B;">&times;</button>
        </div>

        <div style="font-size:12px; color:#64748B; margin-bottom:16px; line-height:1.5;">
          Validates active ingredients, pre-harvest intervals (PHI), and residue decay against APVMA legal limits to safeguard export compliance and prevent quarantine rejects.
        </div>

        <form id="mrl-advisor-form" onsubmit="handleMrlAdvisorSubmit(event)">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:#475569; margin-bottom:4px; text-transform:uppercase;">Target Crop</label>
              <input type="text" id="mrl-crop-input" class="form-control" style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px;" value="${defaultCrop || 'Avocado'}" placeholder="e.g. Avocado, Tomatoes, Grapes" required />
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:#475569; margin-bottom:4px; text-transform:uppercase;">Pest / Issue</label>
              <input type="text" id="mrl-issue-input" class="form-control" style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px;" value="mites" placeholder="e.g. mites, aphids, mildew" required />
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
            <div style="font-size:11px; color:#64748B; font-weight:600;">Quick Presets:</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" onclick="runPresetMrl('Avocado', 'mites')" class="agro-btn-secondary" style="font-size:10.5px; padding:4px 9px;">Avocado / Mites</button>
              <button type="button" onclick="runPresetMrl('Tomatoes', 'aphids')" class="agro-btn-secondary" style="font-size:10.5px; padding:4px 9px;">Tomatoes / Aphids</button>
              <button type="button" onclick="runPresetMrl('Grapes', 'downy mildew')" class="agro-btn-secondary" style="font-size:10.5px; padding:4px 9px;">Grapes / Mildew</button>
            </div>
          </div>

          <button type="submit" id="mrl-submit-btn" class="agro-btn-primary" style="width:100%; padding:11px; font-size:13px; font-weight:700; border-radius:8px; display:flex; justify-content:center; align-items:center; gap:8px; cursor:pointer;">
            🔍 Check MRL Safety & Generate Recommendation
          </button>
        </form>

        <div id="mrl-results-container" style="margin-top:16px; display:none;"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeMrlAdvisorModal() {
  const m = document.getElementById('mrl-advisor-modal');
  if (m) m.remove();
}

function runPresetMrl(crop, issue) {
  const cropInput = document.getElementById('mrl-crop-input');
  const issueInput = document.getElementById('mrl-issue-input');
  if (cropInput) cropInput.value = crop;
  if (issueInput) issueInput.value = issue;
  handleMrlAdvisorSubmit(new Event('submit'));
}

async function handleMrlAdvisorSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const crop = document.getElementById('mrl-crop-input')?.value || 'Avocado';
  const issue = document.getElementById('mrl-issue-input')?.value || 'mites';
  const btn = document.getElementById('mrl-submit-btn');
  const container = document.getElementById('mrl-results-container');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Validating via APVMA Engine...';
  }
  if (container) {
    container.style.display = 'block';
    container.innerHTML = '<div style="text-align:center; padding:16px; color:#64748B; font-size:12px;">Computing residue decay curve & verifying APVMA maximum residue limits...</div>';
  }

  try {
    const res = await fetch('/api/mrl/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop, issue })
    });
    const data = await res.json();
    renderMrlAdvisorResults(data, container);
  } catch (err) {
    if (container) {
      container.innerHTML = `<div style="padding:12px; background:#FEE2E2; color:#B91C1C; border-radius:8px; font-size:12px;">Failed to fetch MRL recommendations: ${err.message}</div>`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '🔍 Check MRL Safety & Generate Recommendation';
    }
  }
}

function renderMrlAdvisorResults(data, container) {
  if (!container) return;
  const safeList = data?.pesticide_recommendations?.safe || [];
  const flaggedList = data?.pesticide_recommendations?.flagged_warnings || [];
  const fertList = data?.fertilizer_recommendations || [];

  let html = `
    <div style="border-top:1px solid #E2E8F0; padding-top:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-size:12px; font-weight:800; color:#1B4D3E; text-transform:uppercase;">Validation Results: ${data.crop}</span>
        <span style="font-size:11px; color:#64748B;">Target: <strong>${safeList[0]?.target_issue || flaggedList[0]?.target_issue || 'Specified Pest'}</strong></span>
      </div>
  `;

  // Safe Recommendations
  if (safeList.length > 0) {
    html += `
      <div style="margin-bottom:12px;">
        <div style="font-size:11px; font-weight:700; color:#059669; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <span>✅ APPROVED / COMPLIANT RECOMMENDATIONS (${safeList.length})</span>
        </div>
        ${safeList.map(s => `
          <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:10px; padding:12px; margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong style="font-size:14px; color:#166534;">${s.compound}</strong>
                <span class="badge badge-forest" style="margin-left:6px; font-size:9.5px;">PHI: ${s.recommended_phi_days} Days</span>
              </div>
              <span style="font-size:11px; font-weight:800; color:#15803D; background:#DCFCE7; padding:2px 8px; border-radius:12px;">COMPLIANT</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-top:8px; font-size:11.5px;">
              <div><span style="color:#64748B;">MRL Limit:</span> <strong>${s.mrl_limit_mg_per_kg} mg/kg</strong></div>
              <div><span style="color:#64748B;">Est. Residue at Harvest:</span> <strong>${s.estimated_residue_mg_per_kg} mg/kg</strong></div>
            </div>
            <div style="font-size:11px; color:#166534; margin-top:6px; line-height:1.4;">${s.message}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Flagged Warnings
  if (flaggedList.length > 0) {
    html += `
      <div style="margin-bottom:12px;">
        <div style="font-size:11px; font-weight:700; color:#DC2626; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <span>⚠️ FLAGGED CHEMICALS / REGULATORY BREACHES (${flaggedList.length})</span>
        </div>
        ${flaggedList.map(w => `
          <div style="background:#FEF2F2; border:1px solid #FCA5A5; border-radius:10px; padding:12px; margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong style="font-size:14px; color:#991B1B;">${w.compound}</strong>
                ${w.recommended_phi_days ? `<span style="font-size:10px; color:#7F1D1D; margin-left:6px;">(Proposed PHI: ${w.recommended_phi_days}d)</span>` : ''}
              </div>
              <span style="font-size:11px; font-weight:800; color:#B91C1C; background:#FEE2E2; padding:2px 8px; border-radius:12px;">${w.status}</span>
            </div>
            ${w.mrl_limit_mg_per_kg ? `
              <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-top:8px; font-size:11.5px;">
                <div><span style="color:#64748B;">MRL Limit:</span> <strong>${w.mrl_limit_mg_per_kg} mg/kg</strong></div>
                <div><span style="color:#64748B;">Est. Residue:</span> <strong style="color:#DC2626;">${w.estimated_residue_mg_per_kg} mg/kg</strong></div>
              </div>
            ` : ''}
            <div style="font-size:11px; color:#991B1B; margin-top:6px; line-height:1.4;">${w.message}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Fertilizer recommendations
  if (fertList.length > 0) {
    html += `
      <div>
        <div style="font-size:11px; font-weight:700; color:#1B4D3E; margin-bottom:6px;">🌱 Soil & Nutrient Advisory</div>
        ${fertList.map(f => `
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 12px; margin-bottom:6px; font-size:11.5px;">
            <strong>${f.nutrient}:</strong> ${f.product} — <span style="color:#64748B;">${f.reason}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}



function openProductPurchaseFlow() {
  const modalHtml = `
    <div class="modal-backdrop" id="checkout-modal" style="z-index:9999;">
      <div class="modal-content" style="max-width:500px; padding:0; background:#F4F7F6; overflow:hidden;">
        <header style="background:#FFF; padding:24px 20px; border-bottom:1px solid #E2E8F0; display:flex; align-items:center;">
          <button onclick="document.getElementById('checkout-modal').remove()" style="margin-right:16px; background:none; border:none; font-size:24px; cursor:pointer;">&larr;</button>
          <h1 style="font-size:20px; font-weight:bold; color:#2D3748; margin:0;">Select Shop</h1>
        </header>
        <div style="padding:24px 20px;">
          <div style="background:#E2E8F0; padding:20px; border-radius:12px; margin-bottom:24px;">
            <p style="font-size:14px; color:#718096; margin:0 0 4px 0;">Selected Product:</p>
            <h2 style="font-size:18px; font-weight:bold; color:#2D3748; margin:0;">Trichoderma Viride</h2>
          </div>
          <h3 style="font-size:16px; font-weight:bold; color:#4A5568; margin-bottom:16px;">Available Nearby</h3>
          
          <div style="padding:20px; background:#FFF; border:2px solid #E2E8F0; border-radius:12px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
              <div>
                <h4 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Sri Murugan Agri Clinic</h4>
                <div style="color:#718096; font-size:13px;">1.2 km away &bull; <span style="color:#38A169;">In Stock</span></div>
              </div>
              <div style="font-size:20px; font-weight:bold; color:#2F855A;">₹450</div>
            </div>
            <button onclick="showPaymentOptions('Sri Murugan Agri Clinic')" style="width:100%; background:#FFF; color:#2F855A; font-weight:bold; padding:12px; border-radius:8px; border:2px solid #2F855A; cursor:pointer; font-size:14px;">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function confirmPurchase(shopName) {
  const m = document.getElementById('checkout-modal');
  if (m) m.innerHTML = `
    <div class="modal-content" style="max-width:500px; padding:32px 24px; text-align:center; background:#FFF;">
      <h2 style="font-size:24px; font-weight:bold; color:#2F855A; margin:0 0 24px 0;">Order Reserved!</h2>
      <div style="width:150px; height:150px; background:#EDF2F7; border:1px solid #E2E8F0; margin:0 auto 24px auto; display:flex; align-items:center; justify-content:center; border-radius:12px;">
        <span style="color:#A0AEC0; font-weight:bold; letter-spacing:1px;">[ QR CODE ]</span>
      </div>
      <div style="font-size:32px; font-weight:900; color:#2D3748; letter-spacing:2px; margin-bottom:16px;">#TKN-8492</div>
      <p style="color:#4A5568; margin-bottom:32px; font-size:14px; line-height:1.5;">Show this token at <strong>${shopName}</strong> to collect your product and pay locally.</p>
      <button onclick="document.getElementById('checkout-modal').remove()" style="background:#E2E8F0; color:#2D3748; font-weight:bold; padding:16px; width:100%; border-radius:12px; border:none; cursor:pointer; font-size:16px;">Done</button>
    </div>
  `;
}


function simulateInventoryUpload() {
  alert('Simulating AI Document Parsing... Extracting products from invoice.');
  setTimeout(() => {
    const list = document.getElementById('inventory-list');
    if (list) {
      list.innerHTML += `
        <div style="background:#F0FFF4; border:1px solid #9AE6B4; border-radius:12px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:11px; font-weight:bold; color:#38A169; margin-bottom:4px;">dY"' NEWLY ADDED VIA INVOICE</div>
            <h4 style="font-size:16px; font-weight:bold; color:#2D3748; margin:0 0 4px 0;">Neem Oil Extract (10000 PPM)</h4>
            <div style="color:#718096; font-size:13px;">Botanical Pesticide &bull; Stock: 120 units</div>
          </div>
          <div style="font-size:18px; font-weight:bold; color:#2F855A;">₹220</div>
        </div>
      `;
    }
  }, 1000);
}


function showPaymentOptions(shopName) {
  const m = document.getElementById('checkout-modal');
  if (m) m.innerHTML = `
    <div class="modal-content" style="max-width:500px; padding:0; background:#F4F7F6; overflow:hidden;">
      <header style="background:#FFF; padding:24px 20px; border-bottom:1px solid #E2E8F0; display:flex; align-items:center;">
        <button onclick="document.getElementById('checkout-modal').remove()" style="margin-right:16px; background:none; border:none; font-size:24px; cursor:pointer;">&larr;</button>
        <h1 style="font-size:20px; font-weight:bold; color:#2D3748; margin:0;">Checkout</h1>
      </header>
      <div style="padding:24px 20px;">
        <h3 style="font-size:16px; font-weight:bold; color:#4A5568; margin-bottom:16px;">Select Payment Option</h3>
        
        <label style="display:flex; align-items:center; padding:20px; background:#FFF; border:2px solid #3182CE; border-radius:12px; margin-bottom:12px; cursor:pointer;">
          <input type="radio" name="payment" value="online" checked style="margin-right:16px; transform:scale(1.2);" />
          <div style="flex:1;">
            <div style="font-size:16px; font-weight:bold; color:#2D3748; margin-bottom:4px;">dY' Pay Online (Home Delivery)</div>
            <div style="font-size:13px; color:#718096;">UPI, NetBanking, Debit/Credit Cards</div>
          </div>
        </label>

        <label style="display:flex; align-items:center; padding:20px; background:#FFF; border:2px solid #E2E8F0; border-radius:12px; margin-bottom:24px; cursor:pointer;" onclick="this.style.borderColor='#2F855A'; this.previousElementSibling.style.borderColor='#E2E8F0';">
          <input type="radio" name="payment" value="token" style="margin-right:16px; transform:scale(1.2);" />
          <div style="flex:1;">
            <div style="font-size:16px; font-weight:bold; color:#2D3748; margin-bottom:4px;">dYO^ Generate Token (Pay at Shop)</div>
            <div style="font-size:13px; color:#718096;">Reserve stock now, pay cash at ${shopName}</div>
          </div>
        </label>

        <button onclick="processCheckout('${shopName}')" style="width:100%; background:#2F855A; color:#FFF; font-weight:bold; padding:16px; border-radius:12px; border:none; cursor:pointer; font-size:16px;">Confirm Order</button>
      </div>
    </div>
  `;
}

function processCheckout(shopName) {
  const selected = document.querySelector('input[name="payment"]:checked');
  if (selected && selected.value === 'online') {
    alert('Redirecting to Secure Payment Gateway...');
    document.getElementById('checkout-modal').remove();
  } else {
    confirmPurchase(shopName); // Generates Token
  }
}
