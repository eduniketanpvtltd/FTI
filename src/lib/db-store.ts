import {
  UserProfile,
  UserAddress,
  ProductCategory,
  CartLineItem,
  Quotation,
  QuotationItem,
  Order,
  Invoice,
  MarketMaterial,
  MandiBulletinData,
  NotificationItem,
  AppSettings,
} from '@/types';
import { generateRefId } from './utils';
import { INITIAL_MANDI_BULLETIN, INITIAL_MANDI_MATERIALS } from './mandi-parser';

// ==========================================
// INITIAL SEED DATA
// ==========================================

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-round-bar',
    slug: 'round-bar',
    name: 'Round Bar',
    description: 'Hot-rolled, normalized, and alloy engineering solid steel round bars strictly complying with IS: 2062, IS: 2073, IS: 1875, and IS: 5517 (BS 970 / EN & AISI equivalents).',
    imageUrl: '/images/products/round-bar.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 1,
    availableGrades: [
      'IS: 2062 Fe410-W / E250 (Fusion Welded Structural)',
      'IS: 2073 C45 / 45C8 (BS 970: 080A40 / EN8)',
      'IS: 2073 C45D / 45C8 (080A47 / EN8D Forging Quality)',
      'IS: 5517 40Cr1Mo28 (BS: 708A42 / EN19 / AISI 4140)',
      'IS: 5517 40Ni2Cr1Mo28 (BS: 826M40 / EN24 / AISI 4340)',
      'IS: 5517 20MnCr5 / 16MnCr5 (Case Hardening Steel)',
      'IS: 5517 103Cr6 / 103Cr1 (BS: 534A99 / EN31 / SAE 52100)',
      'IS: 2073 C20 / 20C8 (AISI 1020 / Class 2 Forging)',
      'IS: 2073 55C8 (BS: 070A55 / EN9 Wear Resistant)',
      'IS: 1570 X04Cr18Ni9 (AISI 304 Austenitic Stainless)',
      'IS: 1570 X04Cr18Ni12Mo2 (AISI 316 Stainless Round)',
    ],
    specificationFields: [
      {
        key: 'diameter',
        label: 'Nominal Bar Diameter (IS: 1732 Standard)',
        type: 'select',
        options: [
          '10 mm', '12 mm', '16 mm', '20 mm', '22 mm', '25 mm', '28 mm', '32 mm', '36 mm', '40 mm',
          '45 mm', '50 mm', '56 mm', '63 mm', '71 mm', '75 mm', '80 mm', '90 mm', '100 mm', '110 mm',
          '125 mm', '140 mm', '150 mm', '160 mm', '180 mm', '200 mm', '220 mm', '250 mm', '280 mm', '300 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'supplyCondition',
        label: 'Supply / Heat Treatment Condition (Handbook Standard)',
        type: 'select',
        options: [
          'AR - As Rolled / Hot Rolled (Black Surface)',
          'N - Normalised (Air Cooled at 880-920°C)',
          'A - Annealed (Furnace Cooled Softened)',
          'H&T - Hardened & Tempered (Quenched & Tempered)',
          'Peeled & Centerless Turned (Descaled)',
        ],
        required: false,
      },
      {
        key: 'length',
        label: 'Bar Length Standard',
        type: 'select',
        options: [
          'Random Mill Length (4.0 to 6.0 Meters)',
          'Fixed Length (3.0 Meters)',
          'Fixed Length (6.0 Meters)',
          'Cut-to-Length Billet / Block',
        ],
        unit: 'Meters',
        required: false,
      },
      {
        key: 'testingRequirement',
        label: 'Testing & Inspection Standard',
        type: 'select',
        options: [
          'Standard Mill Test Certificate (MTC with Chemistry & Tensile per IS: 2049)',
          '100% Ultrasonic Tested (UT per IS: 6396 / IS: 8791)',
          'Third Party Inspection (TPI Witnessed)',
          '100% Spark Tested for Chemical Grade Identity',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-bright-bar',
    slug: 'bright-bar',
    name: 'Bright Bar',
    description: 'Cold-drawn, turned, and centerless ground precision bright steel bars complying with IS: 2073, IS: 1570, BS 970 (EN1A / EN8), and DIN ISO tolerance regimes.',
    imageUrl: '/images/products/bright-bar.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 2,
    availableGrades: [
      'IS: 2073 14Mn1S14 / 14C14S14 (BS: 220M07 / EN1A Non-Leaded Free Cutting)',
      'IS: 2073 14Mn1S14L (EN1A Leaded with 0.15-0.35% Pb)',
      'IS: 2073 C20 / 20C8 (AISI 1018 / 1020 Bright Mild Steel)',
      'IS: 2073 C45 / 45C8 (BS: 080A47 / EN8D Bright Carbon)',
      'IS: 2073 13C10S25 (13S25 Free Machining Steel)',
      'IS: 5517 40Cr1Mo28 (EN19 / 708A42 Ground Bright)',
      'IS: 1570 X04Cr18Ni9 (SS 304 Precision Bright)',
    ],
    specificationFields: [
      {
        key: 'diameter',
        label: 'Bright Bar Diameter',
        type: 'select',
        options: [
          '5 mm', '6 mm', '8 mm', '10 mm', '12 mm', '14 mm', '16 mm', '18 mm', '20 mm', '22 mm',
          '24 mm', '25 mm', '28 mm', '30 mm', '32 mm', '35 mm', '38 mm', '40 mm', '45 mm', '50 mm',
          '55 mm', '60 mm', '65 mm', '70 mm', '75 mm', '80 mm', '90 mm', '100 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'tolerance',
        label: 'Dimensional Tolerance Standard (Handbook ISO / DIN)',
        type: 'select',
        options: [
          'ISO h9 Tolerance (Precision Turned / Cold Drawn)',
          'ISO h11 Tolerance (Standard Commercial Cold Drawn)',
          'ISO h8 Tolerance (Centerless Ground & Polished)',
        ],
        required: true,
      },
      {
        key: 'finishCondition',
        label: 'Surface Processing Condition (Handbook Table)',
        type: 'select',
        options: [
          'CD - Cold Drawn Bright (Scale-Free Smooth)',
          'Peeled & Polished Surface',
          'Centerless Ground & End Chamfered',
        ],
        required: true,
      },
      {
        key: 'length',
        label: 'Bar Length',
        type: 'select',
        options: [
          'Standard 3.0 to 4.0 Meters',
          'Fixed 3.0 Meters',
          'Fixed 6.0 Meters',
        ],
        unit: 'Meters',
        required: true,
      },
    ],
  },
  {
    id: 'cat-flat',
    slug: 'flat',
    name: 'Flat',
    description: 'Hot-rolled structural, medium carbon, and spring steel flats adhering to IS: 2062, IS: 2073, IS: 1570, and IS: 3749 standards from the handbook.',
    imageUrl: '/images/products/flat.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 3,
    availableGrades: [
      'IS: 2062 Fe410-W / St42-W (Standard Fusion Welded Quality)',
      'IS: 2062 Fe410-WC / St42-WC (Weather-Resistant Copper Alloyed)',
      'IS: 2062 Fe540WT / St55HTW (High Tensile Weldable Structural)',
      'IS: 2073 40C8 / C45 (BS 970: 080A40 / EN8 Medium Carbon)',
      'IS: 3749 55Si7 / T55Si7 (BS: 250A53 / EN45 Oil-Hardening Spring Steel)',
      'IS: 3749 65Si7 / 60Si7 (Heavy Laminated Leaf Spring Steel)',
      'IS: 5517 50CrV4 / 50Cr1V23 (BS: 735A50 / EN47 Chrome-Vanadium Spring)',
      'IS: 1570 X04Cr18Ni9 (SS 304 Industrial Stainless Flat)',
    ],
    specificationFields: [
      {
        key: 'width',
        label: 'Flat Width (IS: 1730 Standard Range)',
        type: 'select',
        options: [
          '20 mm', '25 mm', '32 mm', '40 mm', '50 mm', '65 mm', '75 mm',
          '90 mm', '100 mm', '125 mm', '150 mm', '180 mm', '200 mm', '250 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'thickness',
        label: 'Flat Thickness (IS: 1730 Standard Range)',
        type: 'select',
        options: [
          '3 mm', '5 mm', '6 mm', '8 mm', '10 mm', '12 mm', '16 mm', '20 mm', '25 mm', '32 mm', '40 mm', '50 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'supplyCondition',
        label: 'Supply / Heat Treatment Condition (Handbook Standard)',
        type: 'select',
        options: [
          'AR - As Rolled / Hot Rolled Standard',
          'N - Normalised (Uniform Microstructure)',
          'A - Annealed (Softened for Shearing & Punching)',
          'H&T - Hardened & Tempered (Oil Quenched Spring Steel)',
        ],
        required: false,
      },
      {
        key: 'length',
        label: 'Length',
        type: 'select',
        options: [
          'Standard Mill Length (5.5 - 6.0 Meters)',
          'Cut-to-Length Customized',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-sheet',
    slug: 'sheet',
    name: 'Sheet',
    description: 'Cold-rolled (IS: 513 CR1-CR4) and hot-rolled (IS: 1079 HR1-HR4 / IS: 2062 / IS: 2002) steel sheets, coils, and plates matching handbook tables.',
    imageUrl: '/images/products/sheet.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 4,
    availableGrades: [
      'IS: 513 CR1 / Ordinary (O) Commercial Cold Rolled',
      'IS: 513 CR2 / Deep Drawing (D) Stamping Quality',
      'IS: 513 CR3 / Extra Deep Drawing (DD)',
      'IS: 513 CR4 / EDD (Non-Aging Super Deep Drawing)',
      'IS: 1079 HR1 / Ordinary Commercial Hot Rolled Sheet',
      'IS: 1079 HR2 / Deep Drawing HR Sheet & Strip',
      'IS: 2062 Fe410-W / E250 (Hot Rolled Structural Plate)',
      'IS: 2002 Grade 1 / 2 (Boiler & Pressure Vessel Quality Plate)',
      'IS: 1570 X04Cr18Ni9 (SS 304 2B/BA Stainless Sheet)',
      'IS: 2062 Chequered Floor Plate (Tear Drop Raised Pattern)',
    ],
    specificationFields: [
      {
        key: 'thickness',
        label: 'Sheet / Plate Thickness (IS: 513 / IS: 1079 Range)',
        type: 'select',
        options: [
          '0.5 mm', '0.6 mm', '0.8 mm', '1.0 mm', '1.2 mm', '1.6 mm', '2.0 mm', '2.5 mm',
          '3.15 mm', '4.0 mm', '5.0 mm', '6.0 mm', '8.0 mm', '10.0 mm', '12.0 mm', '16.0 mm', '20.0 mm', '25.0 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'width',
        label: 'Standard Sheet Width',
        type: 'select',
        options: [
          '900 mm (3 ft)', '1000 mm (1.0 Mtr)', '1220 mm (4 ft)', '1250 mm (1.25 Mtr)', '1500 mm (5 ft)', '2000 mm (2.0 Mtr)'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'lengthFormat',
        label: 'Length / Product Format (Handbook Standard)',
        type: 'select',
        options: [
          '2000 mm Sheet Standard',
          '2440 mm (8 ft Sheet)',
          '2500 mm Sheet',
          '3000 mm (10 ft Sheet)',
          '6000 mm Industrial Plate',
          'Continuous Coil (CR Coil / HR Coil)',
        ],
        required: true,
      },
      {
        key: 'surfaceFinish',
        label: 'Surface Finish / Processing (Handbook Standard)',
        type: 'select',
        options: [
          'CR 2B - Skin Passed / Scale-Free Cold Rolled',
          'HR Mill Finish (Hot Rolled As Rolled)',
          'HRPO - Hot Rolled Pickled & Oiled (Descaled)',
          'Annealed & Descaled (IS: 1079 General Engineering)',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'cat-square',
    slug: 'square',
    name: 'Square',
    description: 'Hot-rolled solid square steel bars complying with IS: 2062, IS: 1875, IS: 2073, and IS: 5517 for heavy structural, drop forging, and crane shaft applications.',
    imageUrl: '/images/products/square.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 5,
    availableGrades: [
      'IS: 2062 Fe410-W / St42-W (Fusion Welded Structural Square)',
      'IS: 1875 Class 2 / 20C8 (Carbon Steel Forging Billet)',
      'IS: 1875 Class 4 / 45C8 (BS: 080A47 / EN8 Forging Grade)',
      'IS: 2073 40C8 / C45 (Engineering Machining Square)',
      'IS: 5517 40Cr1Mo28 (BS: 708A42 / EN19 Chrome-Moly Square)',
      'IS: 5517 40Ni2Cr1Mo28 (BS: 826M40 / EN24 Heavy Duty Shaft Quality)',
      'IS: 1570 X04Cr18Ni9 (SS 304 Solid Stainless Square)',
    ],
    specificationFields: [
      {
        key: 'squareSize',
        label: 'Square Size (IS: 1732 Standard Square Dimensions)',
        type: 'select',
        options: [
          '10 x 10 mm', '12 x 12 mm', '16 x 16 mm', '20 x 20 mm', '25 x 25 mm',
          '32 x 32 mm', '40 x 40 mm', '50 x 50 mm', '63 x 63 mm', '75 x 75 mm',
          '90 x 90 mm', '100 x 100 mm', '125 x 125 mm', '150 x 150 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'supplyCondition',
        label: 'Supply / Heat Treatment Condition (Handbook Standard)',
        type: 'select',
        options: [
          'AR - As Rolled / Hot Rolled Standard',
          'N - Normalised (Air Cooled at 880-920°C)',
          'A - Annealed (Furnace Cooled)',
          'H&T - Hardened & Tempered',
        ],
        required: false,
      },
      {
        key: 'length',
        label: 'Bar Length Standard',
        type: 'select',
        options: [
          'Standard Mill Length (5.5 - 6.0 Meters)',
          'Cut-to-Length Billet Custom',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-tmt-bar',
    slug: 'tmt-bar',
    name: 'TMT Bar',
    description: 'Thermo-Mechanically Treated high-ductility rebar and deformed bars strictly conforming to IS: 1786 and IS: 432 / IS: 2062 for concrete reinforcement.',
    imageUrl: '/images/products/tmt-bar.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 6,
    availableGrades: [
      'Fe 415 (IS: 1786 Standard Construction Rebar)',
      'Fe 415D (IS: 1786 High Ductility - Earthquake Resistant)',
      'Fe 500 (IS: 1786 High Strength Concrete Reinforcement)',
      'Fe 500D (IS: 1786 High Ductility & Elongation >= 16%)',
      'Fe 550 / Fe 550D (IS: 1786 Heavy Infrastructure & Flyovers)',
      'Fe 600 (IS: 1786 Ultra High Strength Heavy Columns)',
      'CRS Fe 500D (Corrosion Resistant Steel for Coastal / Marine)',
      'Fe 380 / Fe 410 M.S. Gr-I (IS: 432 / IS: 2062 Mild Steel Rebar)',
    ],
    specificationFields: [
      {
        key: 'diameter',
        label: 'Bar Diameter (IS: 1786 Nominal Sizes)',
        type: 'select',
        options: [
          '8 mm', '10 mm', '12 mm', '16 mm', '20 mm', '25 mm', '28 mm', '32 mm', '36 mm', '40 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'length',
        label: 'Length & Packaging Standard',
        type: 'select',
        options: [
          'Standard 12.0 Meters (Straight Bundle)',
          'Standard 12.0 Meters (U-Bend Bundle)',
          'Cut & Bend Custom Project Fabricated',
        ],
        required: true,
      },
      {
        key: 'certification',
        label: 'BIS Certification & Mill Provenance',
        type: 'select',
        options: [
          'Primary Integrated Steel Mill (Tata Tiscon / SAIL / JSW Neosteel / Jindal Panther)',
          'Secondary Quality ISI Certified IS: 1786 with MTC',
          'BIS ISI Hallmarked with 100% 0.2% Proof Stress Test',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-square-bright-bar',
    slug: 'square-bright-bar',
    name: 'Square Bright Bar',
    description: 'Precision cold-drawn bright square steel bars with sharp 90-degree corners per IS: 2073, IS: 1570, BS 970 (EN1A / EN8), and ISO h9/h11 tolerances.',
    imageUrl: '/images/products/square-bright.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 7,
    availableGrades: [
      'IS: 2073 14Mn1S14 / EN1A (Cold Drawn Free Cutting Bright Square)',
      'IS: 2073 14Mn1S14L / EN1A Leaded (High-Speed Machining)',
      'IS: 2073 C20 / 20C8 (AISI 1018 Bright Quality)',
      'IS: 2073 C45 / 45C8 (BS: 080A47 / EN8D Carbon Bright Square)',
      'IS: 1570 X04Cr18Ni9 (SS 304 Precision Bright Square)',
    ],
    specificationFields: [
      {
        key: 'squareSize',
        label: 'Square Dimension (IS Standard)',
        type: 'select',
        options: [
          '6 x 6 mm', '8 x 8 mm', '10 x 10 mm', '12 x 12 mm', '14 x 14 mm', '16 x 16 mm',
          '18 x 18 mm', '20 x 20 mm', '22 x 22 mm', '25 x 25 mm', '30 x 30 mm', '32 x 32 mm',
          '35 x 35 mm', '40 x 40 mm', '45 x 45 mm', '50 x 50 mm', '60 x 60 mm', '75 x 75 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'tolerance',
        label: 'Dimensional Tolerance Standard (Handbook ISO / DIN)',
        type: 'select',
        options: [
          'ISO h9 Tolerance (Sharp 90° Precision Square)',
          'ISO h11 Tolerance (Standard Bright Cold Drawn)',
          'ISO h8 Tolerance (Centerless Ground Finish)',
        ],
        required: true,
      },
      {
        key: 'finishCondition',
        label: 'Supply / Surface Condition (Handbook Standard)',
        type: 'select',
        options: [
          'CD - Cold Drawn Bright (Scale-Free Smooth)',
          'Cold Drawn & Annealed (Stress Relieved)',
          'Peeled & Ground Surface',
        ],
        required: true,
      },
      {
        key: 'length',
        label: 'Bar Length',
        type: 'select',
        options: [
          'Standard 3.0 to 4.0 Meters',
          'Fixed 3.0 Meters',
          'Fixed 6.0 Meters',
        ],
        unit: 'Meters',
        required: true,
      },
    ],
  },
  {
    id: 'cat-fasteners',
    slug: 'fasteners',
    name: 'Fasteners',
    description: 'Industrial high-tensile bolts, nuts, washers, studs, and heavy hex screws. Coming soon to FTI Marketplace.',
    imageUrl: '/images/products/fasteners.png',
    isActive: false,
    isComingSoon: true,
    displayOrder: 8,
    availableGrades: ['Grade 8.8', 'Grade 10.9', 'SS 316 A4-70'],
    specificationFields: [],
  },
  {
    id: 'cat-tractor-parts',
    slug: 'tractor-parts',
    name: 'Tractor Parts',
    description: 'Forged linkage components, rotavator blades, PTO shafts, and agricultural tractor spare parts. Coming soon.',
    imageUrl: '/images/products/tractor-parts.png',
    isActive: false,
    isComingSoon: true,
    displayOrder: 9,
    availableGrades: ['Forged Boron Steel', 'Case Hardened Alloy'],
    specificationFields: [],
  },
];

// Generate realistic historical points for market stock charts
function generateHistory(basePrice: number, days: number = 30, volatilityRatio: number = 0.02) {
  const points = [];
  const now = new Date('2026-11-03T11:30:00.000Z');
  let current = basePrice * (1 - (days * 0.002));
  
  for (let i = days; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Random walk with trend towards basePrice
    const delta = (Math.random() - 0.48) * (basePrice * volatilityRatio);
    current = Math.max(basePrice * 0.7, current + delta);
    
    // Ensure last point matches basePrice
    if (i === 0) current = basePrice;

    points.push({
      date: d.toISOString().split('T')[0],
      timestamp: d.getTime(),
      price: Math.round(current / 100) * 100,
    });
  }
  return points;
}

export const INITIAL_MARKET_MATERIALS: MarketMaterial[] = INITIAL_MANDI_MATERIALS;

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-customer-01',
    fullName: 'Rajesh K. Sharma',
    email: 'rajesh@sharma-fabricators.in',
    mobile: '+91 98201 12345',
    companyName: 'Sharma Precision & Heavy Fabricators Pvt Ltd',
    gstin: '27AABCS1429B1Z8',
    businessType: 'Fabricator',
    role: 'customer',
    isActive: true,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'usr-admin-01',
    fullName: 'Anil Singhania (Head of Operations)',
    email: 'admin@fti-industrial.com',
    mobile: '+91 98111 99999',
    companyName: 'FTI Industrial Metal Trading Co.',
    gstin: '27AAACF0123M1Z5',
    businessType: 'Trader',
    role: 'super_admin',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-01',
    userId: 'usr-customer-01',
    addressType: 'both',
    isDefault: true,
    recipientName: 'Sharma Precision - Works Gate 2',
    phone: '+91 98201 12345',
    companyName: 'Sharma Precision & Heavy Fabricators Pvt Ltd',
    gstin: '27AABCS1429B1Z8',
    streetAddress: 'Plot No. C-44, MIDC Industrial Area, Turbhe',
    landmark: 'Behind Turbhe Railway Goods Yard',
    city: 'Navi Mumbai',
    district: 'Thane',
    state: 'Maharashtra',
    pincode: '400705',
    country: 'India',
  },
  {
    id: 'addr-02',
    userId: 'usr-customer-01',
    addressType: 'shipping',
    isDefault: false,
    recipientName: 'Warehouse 3 Incharge',
    phone: '+91 98201 54321',
    companyName: 'Sharma Precision Warehouse Unit',
    streetAddress: 'Shed 12, Patalganga Industrial Estate',
    city: 'Rasayani',
    district: 'Raigad',
    state: 'Maharashtra',
    pincode: '410220',
    country: 'India',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  companyName: 'FieldFast Tech International (FTI)',
  tagline: 'Direct Mill Sourced Raw Materials & Certified Scrap',
  gstin: '27AAACF0123M1Z5',
  address: 'FTI House, Iron & Steel Market, Kalamboli, Navi Mumbai, Maharashtra 410218, India',
  phone: '+91 22 2742 8800',
  email: 'sales@fti-materials.com',
  bankName: 'State Bank of India',
  accountNumber: '3892010049281',
  ifscCode: 'SBIN0001824',
  branch: 'Steel Market Branch, Kalamboli',
  defaultTaxRate: 18.0,
  quotationValidityDays: 3,
  supportPhone: '+91 98765 43210',
  supportEmail: 'support@fti-materials.com',
};

// Seed Quotation showing realistic B2B quotation workflow
export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'qt-demo-01',
    quotationNumber: 'FTI-QT-2026-0001',
    userId: 'usr-customer-01',
    customerSnapshot: {
      fullName: 'Rajesh K. Sharma',
      mobile: '+91 98201 12345',
      email: 'rajesh@sharma-fabricators.in',
      companyName: 'Sharma Precision & Heavy Fabricators Pvt Ltd',
      gstin: '27AABCS1429B1Z8',
      deliveryAddress: 'Plot No. C-44, MIDC Turbhe, Navi Mumbai, MH 400705',
      deliveryCity: 'Navi Mumbai',
      deliveryState: 'Maharashtra',
      deliveryPincode: '400705',
    },
    items: [
      {
        id: 'qti-01',
        categoryName: 'Round Bar',
        categorySlug: 'round-bar',
        specifications: { diameter: '50 mm', length: 'Random Length (4-6 Meters)', condition: 'Black / As Rolled' },
        grade: 'EN8 / C45',
        quantity: 2.5,
        unit: 'Metric Ton',
        unitPrice: 56500,
        lineTotal: 141250,
        specialInstructions: 'Mill test certificate required with chemical analysis',
      },
      {
        id: 'qti-02',
        categoryName: 'Round Bar',
        categorySlug: 'round-bar',
        specifications: { diameter: '75 mm', length: 'Fixed Length (6 Meters)', condition: 'Normalized' },
        grade: 'EN19 / 4140',
        quantity: 5.0,
        unit: 'Metric Ton',
        unitPrice: 72000,
        lineTotal: 360000,
        specialInstructions: 'Ultrasonic tested sound material',
      },
      {
        id: 'qti-03',
        categoryName: 'Bright Bar',
        categorySlug: 'bright-bar',
        specifications: { diameter: '25 mm', length: '3.0 Meters', tolerance: 'h9 Tolerance' },
        grade: 'EN1A Lead Free',
        quantity: 1.2,
        unit: 'Metric Ton',
        unitPrice: 68500,
        lineTotal: 82200,
      },
    ],
    status: 'quotation_sent',
    version: 1,
    validUntil: '2026-11-06T23:59:59.000Z',
    subtotal: 583450,
    taxRate: 18.0,
    taxAmount: 105021,
    transportationCharges: 14500,
    discountAmount: 5000,
    grandTotal: 697971,
    specialNotes: 'Material available ready in stock at Kalamboli yard. Dispatch within 24 hours of PO confirmation.',
    adminNotes: 'Client has strong credit history. Offered freight concession.',
    termsAndConditions: '1. Quotation valid strictly for 3 days due to steel price volatility.\n2. Payment terms: 100% against proforma invoice before dispatch.\n3. Taxes: 18% GST extra as applicable.\n4. Subject to Kalamboli jurisdiction.',
    statusHistory: [
      { status: 'pending', changedAt: '2026-11-02T14:15:00.000Z', changedBy: 'Customer (Rajesh K. Sharma)', note: 'Quotation request submitted' },
      { status: 'under_review', changedAt: '2026-11-02T16:30:00.000Z', changedBy: 'Admin (Anil Singhania)', note: 'Checking warehouse stock availability' },
      { status: 'quotation_prepared', changedAt: '2026-11-03T09:45:00.000Z', changedBy: 'Admin (Anil Singhania)', note: 'Prices assigned with transport charges' },
      { status: 'quotation_sent', changedAt: '2026-11-03T10:10:00.000Z', changedBy: 'Admin (Anil Singhania)', note: 'Official quotation sent to client' },
    ],
    createdAt: '2026-11-02T14:15:00.000Z',
    updatedAt: '2026-11-03T10:10:00.000Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-demo-01',
    orderNumber: 'FTI-ORD-2026-0001',
    quotationId: 'qt-demo-00',
    quotationNumber: 'FTI-QT-2026-0000',
    userId: 'usr-customer-01',
    customerSnapshot: {
      fullName: 'Rajesh K. Sharma',
      mobile: '+91 98201 12345',
      email: 'rajesh@sharma-fabricators.in',
      companyName: 'Sharma Precision & Heavy Fabricators Pvt Ltd',
      gstin: '27AABCS1429B1Z8',
      deliveryAddress: 'Plot No. C-44, MIDC Turbhe, Navi Mumbai, MH 400705',
    },
    billingAddress: INITIAL_ADDRESSES[0],
    shippingAddress: INITIAL_ADDRESSES[0],
    items: [
      {
        id: 'ord-item-01',
        categoryName: 'TMT Bar',
        specifications: { diameter: '16 mm', make: 'Primary Mill (Tata / JSW / SAIL / Jindal)' },
        grade: 'Fe 500D (IS 1786)',
        quantity: 10,
        unit: 'Metric Ton',
        unitPrice: 53500,
        lineTotal: 535000,
      },
    ],
    status: 'dispatched',
    paymentStatus: 'paid',
    subtotal: 535000,
    taxRate: 18.0,
    taxAmount: 96300,
    transportationCharges: 12000,
    discountAmount: 3000,
    grandTotal: 640300,
    trackingCarrier: 'V-Trans Express Freight Logistics',
    trackingNumber: 'VTR-MH-892147',
    estimatedDelivery: '2026-11-05',
    dispatchDate: '2026-11-03',
    statusHistory: [
      { status: 'order_confirmed', changedAt: '2026-10-31T11:00:00.000Z', changedBy: 'System', note: 'Customer accepted quotation FTI-QT-2026-0000' },
      { status: 'payment_received', changedAt: '2026-11-01T15:20:00.000Z', changedBy: 'Admin (Anil Singhania)', note: 'RTGS payment verified' },
      { status: 'processing', changedAt: '2026-11-02T09:00:00.000Z', changedBy: 'Admin (Anil Singhania)', note: 'Material weighed and bundled' },
      { status: 'dispatched', changedAt: '2026-11-03T08:30:00.000Z', changedBy: 'Admin (Anil Singhania)', note: 'Truck MH-04-GP-9142 loaded and left Kalamboli' },
    ],
    invoiceId: 'inv-demo-01',
    invoiceNumber: 'FTI-INV-2026-0001',
    createdAt: '2026-10-31T11:00:00.000Z',
    updatedAt: '2026-11-03T08:30:00.000Z',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-demo-01',
    invoiceNumber: 'FTI-INV-2026-0001',
    orderId: 'ord-demo-01',
    orderNumber: 'FTI-ORD-2026-0001',
    quotationId: 'qt-demo-00',
    quotationNumber: 'FTI-QT-2026-0000',
    userId: 'usr-customer-01',
    invoiceDate: '2026-11-02',
    dueDate: '2026-11-02',
    companyDetails: {
      name: 'FieldFast Tech International (FTI)',
      tagline: 'Direct Mill Sourced Raw Materials & Certified Scrap',
      address: 'FTI House, Iron & Steel Market, Kalamboli, Navi Mumbai, Maharashtra 410218, India',
      gstin: '27AAACF0123M1Z5',
      pan: 'AAACF0123M',
      phone: '+91 22 2742 8800',
      email: 'billing@fti-materials.com',
      website: 'www.fti-materials.com',
      bankName: 'State Bank of India',
      accountNumber: '3892010049281',
      ifscCode: 'SBIN0001824',
      branch: 'Steel Market Branch, Kalamboli',
    },
    customerDetails: {
      name: 'Rajesh K. Sharma',
      companyName: 'Sharma Precision & Heavy Fabricators Pvt Ltd',
      phone: '+91 98201 12345',
      email: 'rajesh@sharma-fabricators.in',
      gstin: '27AABCS1429B1Z8',
    },
    billingAddress: 'Plot No. C-44, MIDC Industrial Area, Turbhe, Navi Mumbai, Maharashtra 400705',
    shippingAddress: 'Plot No. C-44, MIDC Industrial Area, Turbhe, Navi Mumbai, Maharashtra 400705',
    items: [
      {
        id: 'inv-it-01',
        description: 'TMT Rebar Thermo-Mechanically Treated Bar',
        hsnCode: '72142090',
        specifications: 'Diameter: 16 mm, Primary Mill Make',
        grade: 'Fe 500D (IS 1786)',
        quantity: 10,
        unit: 'Metric Ton',
        unitPrice: 53500,
        taxRate: 18.0,
        lineTotal: 535000,
      },
    ],
    subtotal: 535000,
    cgstAmount: 48150,
    sgstAmount: 48150,
    igstAmount: 0,
    transportationCharges: 12000,
    discountAmount: 3000,
    grandTotal: 640300,
    amountInWords: 'Six Lakh Forty Thousand Three Hundred Rupees Only',
    paymentTerms: '100% Advance Payment received via RTGS UTR# SBIN202611019842',
    status: 'paid',
    createdAt: '2026-11-02T10:00:00.000Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    userId: 'usr-customer-01',
    title: 'Quotation Prepared with Official Rates',
    message: 'Admin has issued official pricing for Quotation #FTI-QT-2026-0001. Review and accept before validity expires.',
    type: 'quotation',
    link: '/quotations/qt-demo-01',
    isRead: false,
    createdAt: '2026-11-03T10:10:00.000Z',
  },
  {
    id: 'notif-02',
    userId: 'usr-customer-01',
    title: 'Order Dispatched (Truck En-Route)',
    message: 'Your Order #FTI-ORD-2026-0001 has been dispatched with V-Trans Express (LR# VTR-MH-892147).',
    type: 'order',
    link: '/orders/ord-demo-01',
    isRead: false,
    createdAt: '2026-11-03T08:30:00.000Z',
  },
  {
    id: 'notif-03',
    userId: 'usr-customer-01',
    title: 'Market Rate Alert: Copper Cathode',
    message: 'Copper Cathode Grade A moved up +1.82% today to ₹8,65,000 / MT.',
    type: 'market',
    link: '/market',
    isRead: true,
    createdAt: '2026-11-03T11:30:00.000Z',
  },
];

// ==========================================
// REPOSITORY & LOCAL STORAGE STATE SYNC
// ==========================================

export const STORAGE_KEY = 'fti_platform_state_v2';

export interface AppState {
  currentUser: UserProfile;
  categories: ProductCategory[];
  cart: CartLineItem[];
  quotations: Quotation[];
  orders: Order[];
  invoices: Invoice[];
  addresses: UserAddress[];
  marketMaterials: MarketMaterial[];
  mandiBulletin: MandiBulletinData;
  notifications: NotificationItem[];
  settings: AppSettings;
}

export function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return {
      currentUser: INITIAL_USERS[0],
      categories: INITIAL_CATEGORIES,
      cart: [],
      quotations: INITIAL_QUOTATIONS,
      orders: INITIAL_ORDERS,
      invoices: INITIAL_INVOICES,
      addresses: INITIAL_ADDRESSES,
      marketMaterials: INITIAL_MARKET_MATERIALS,
      mandiBulletin: INITIAL_MANDI_BULLETIN,
      notifications: INITIAL_NOTIFICATIONS,
      settings: INITIAL_SETTINGS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const hasMandiData =
        parsed.marketMaterials &&
        parsed.marketMaterials.some((m: any) => m.categorySlug === 'ingot' || m.id?.startsWith('mandi-'));
      return {
        currentUser: parsed.currentUser || INITIAL_USERS[0],
        categories: INITIAL_CATEGORIES,
        cart: parsed.cart || [],
        quotations: parsed.quotations || INITIAL_QUOTATIONS,
        orders: parsed.orders || INITIAL_ORDERS,
        invoices: parsed.invoices || INITIAL_INVOICES,
        addresses: parsed.addresses || INITIAL_ADDRESSES,
        marketMaterials: hasMandiData ? parsed.marketMaterials : INITIAL_MARKET_MATERIALS,
        mandiBulletin: parsed.mandiBulletin || INITIAL_MANDI_BULLETIN,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        settings: parsed.settings || INITIAL_SETTINGS,
      };
    }
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
  }

  return {
    currentUser: INITIAL_USERS[0],
    categories: INITIAL_CATEGORIES,
    cart: [],
    quotations: INITIAL_QUOTATIONS,
    orders: INITIAL_ORDERS,
    invoices: INITIAL_INVOICES,
    addresses: INITIAL_ADDRESSES,
    marketMaterials: INITIAL_MARKET_MATERIALS,
    mandiBulletin: INITIAL_MANDI_BULLETIN,
    notifications: INITIAL_NOTIFICATIONS,
    settings: INITIAL_SETTINGS,
  };
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
}
