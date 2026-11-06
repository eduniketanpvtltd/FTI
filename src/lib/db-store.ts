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
import {
  INITIAL_MANDI_BULLETIN,
  INITIAL_MANDI_MATERIALS,
  syncBulletinWithLatestTime,
} from './mandi-parser';

// ==========================================
// INITIAL SEED DATA
// ==========================================

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-round-bar',
    slug: 'round-bar',
    name: 'Round Bar',
    description: 'Round bars in various engineering grades and standard sizes. Hot-rolled, normalized, and alloy engineering solid steel round bars.',
    imageUrl: '/images/products/round-bar.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 1,
    availableGrades: [
      '16MNCR5',
      '20MNCR5',
      '30MNB5',
      '30MNCR4',
      '41CR4',
      '42CRMO4',
      'A-105',
      'BORON',
      'C-55',
      'CK-45',
      'EN-15',
      'EN-18',
      'EN-18D',
      'EN-19',
      'EN-24',
      'EN-353',
      'EN-36A',
      'EN-45',
      'EN-45A',
      'EN-8D',
      'EN-8DCR',
      'EN-8DLHT',
      'EN-9',
      'LC',
      'S-45C',
      'S-48C',
      'SAE-1018',
      'SAE-1541',
      'SAE-4130',
      'SAE-4140',
      'SAE-8620',
      'SCM-420',
      'SCM-435',
      'ST-52.3',
    ],
    specificationFields: [
      {
        key: 'diameter',
        label: 'Diameter (mm)',
        type: 'select',
        options: [
          '8 mm', '10 mm', '12 mm', '16 mm', '17 mm', '18 mm', '20 mm', '21 mm', '22 mm',
          '23 mm', '24 mm', '25 mm', '26 mm', '27 mm', '28 mm', '30 mm', '32 mm', '34 mm',
          '36 mm', '38 mm', '40 mm', '42 mm', '45 mm', '48 mm', '50 mm', '51 mm', '53 mm',
          '56 mm', '60 mm', '63 mm', '65 mm', '68 mm', '70 mm', '72 mm', '75 mm', '80 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'supplyCondition',
        label: 'Supply / Heat Treatment Condition',
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
          'Standard Mill Test Certificate (MTC 3.1 with Chemistry & Tensile)',
          '100% Ultrasonic Tested (UT per IS: 6396 / IS: 8791)',
          'Third Party Inspection (TPI Witnessed)',
          '100% Spark Tested for Chemical Grade Identity',
        ],
        required: false,
      },
      {
        key: 'handbookGradeEquivalent',
        label: 'IS / BS / AISI Handbook Equivalent Reference',
        type: 'select',
        options: [
          'IS: 2062 Fe410-W / E250 (Structural)',
          'IS: 2073 C45 / 45C8 (BS 970: 080A40 / EN8)',
          'IS: 2073 C45D / 45C8 (080A47 / EN8D Forging Quality)',
          'IS: 5517 40Cr1Mo28 (BS: 708A42 / EN19 / AISI 4140)',
          'IS: 5517 40Ni2Cr1Mo28 (BS: 826M40 / EN24 / AISI 4340)',
          'IS: 5517 20MnCr5 / 16MnCr5 (Case Hardening Steel)',
          'IS: 5517 103Cr6 / 103Cr1 (EN31 / SAE 52100)',
          'IS: 1570 X04Cr18Ni9 (AISI 304 / 316 Stainless)',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-bright-bar',
    slug: 'bright-bar',
    name: 'Bright Bar',
    description: 'Precision finished bright round bars with high surface finish and tight tolerances.',
    imageUrl: '/images/products/bright-bar.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 2,
    availableGrades: [
      '16MNCR5',
      '20MNCR5',
      '30MNB5',
      '30MNCR4',
      '41CR4',
      '42CRMO4',
      'A-105',
      'BORON',
      'C-55',
      'CK-45',
      'EN-15',
      'EN-18',
      'EN-18D',
      'EN-19',
      'EN-24',
      'EN-353',
      'EN-36A',
      'EN-45',
      'EN-45A',
      'EN-8D',
      'EN-8DCR',
      'EN-8DLHT',
      'EN-9',
      'LC',
      'S-45C',
      'S-48C',
      'SAE-1018',
      'SAE-1541',
      'SAE-4130',
      'SAE-4140',
      'SAE-8620',
      'SCM-420',
      'SCM-435',
      'ST-52.3',
    ],
    specificationFields: [
      {
        key: 'diameter',
        label: 'Diameter (mm)',
        type: 'select',
        options: [
          '8 mm', '10 mm', '12 mm', '16 mm', '17 mm', '18 mm', '20 mm', '21 mm', '22 mm',
          '23 mm', '24 mm', '25 mm', '26 mm', '27 mm', '28 mm', '30 mm', '32 mm', '34 mm',
          '36 mm', '38 mm', '40 mm', '42 mm', '45 mm', '48 mm', '50 mm', '51 mm', '53 mm',
          '56 mm', '60 mm', '63 mm', '65 mm', '68 mm', '70 mm', '72 mm', '75 mm', '80 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'tolerance',
        label: 'Dimensional Tolerance Standard (ISO / DIN)',
        type: 'select',
        options: [
          'ISO h9 Tolerance (Precision Turned / Cold Drawn)',
          'ISO h11 Tolerance (Standard Commercial Cold Drawn)',
          'ISO h8 Tolerance (Centerless Ground & Polished)',
        ],
        required: false,
      },
      {
        key: 'finishCondition',
        label: 'Surface Processing Condition',
        type: 'select',
        options: [
          'CD - Cold Drawn Bright (Scale-Free Smooth)',
          'Peeled & Polished Surface',
          'Centerless Ground & End Chamfered',
        ],
        required: false,
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
        required: false,
      },
      {
        key: 'handbookGradeEquivalent',
        label: 'Free-Cutting / IS Handbook Grade Specification',
        type: 'select',
        options: [
          'IS: 2073 14Mn1S14 / EN1A Non-Leaded Free Cutting',
          'IS: 2073 14Mn1S14L / EN1A Leaded (0.15-0.35% Pb)',
          'IS: 2073 C20 / 20C8 (AISI 1018 / 1020 Bright Mild Steel)',
          'IS: 2073 C45 / 45C8 (BS: 080A47 / EN8D Bright Carbon)',
          'IS: 5517 40Cr1Mo28 (EN19 / 708A42 Ground Bright)',
          'IS: 1570 X04Cr18Ni9 (SS 304 Precision Bright)',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-flat',
    slug: 'flat',
    name: 'Flat',
    description: 'Flat steel in LC, MS and alloy steel, with standard and custom thickness and square edges.',
    imageUrl: '/images/products/flat.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 3,
    availableGrades: [
      'MS',
      'LC',
      'ALLOY',
    ],
    specificationFields: [
      {
        key: 'thickness',
        label: 'Thickness / Section (mm)',
        type: 'select',
        options: [
          '5 mm', '6 mm', '8 mm', '10 mm', '12 mm', '15 mm', '16 mm', '18 mm',
          '20 mm', '22 mm', '25 mm', '30 mm', '35 mm', '38 mm', '40 mm', '45 mm', '50 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'width',
        label: 'Flat Width (IS: 1730 Standard Range)',
        type: 'select',
        options: [
          '20 mm', '25 mm', '32 mm', '40 mm', '50 mm', '65 mm', '75 mm',
          '90 mm', '100 mm', '125 mm', '150 mm', '180 mm', '200 mm', '250 mm', '300 mm'
        ],
        unit: 'mm',
        required: false,
      },
      {
        key: 'supplyCondition',
        label: 'Supply / Heat Treatment Condition',
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
      {
        key: 'handbookGradeEquivalent',
        label: 'Detailed IS / Spring Steel Grade (Optional)',
        type: 'select',
        options: [
          'IS: 2062 Fe410-W / E250 (Standard Fusion Welded Quality)',
          'IS: 2062 Fe540WT / E350 (High Tensile Structural)',
          'IS: 2073 40C8 / C45 (EN-8 Medium Carbon)',
          'IS: 3749 55Si7 / EN-45 (Oil-Hardening Spring Steel)',
          'IS: 3749 65Si7 / EN-45A (Heavy Laminated Leaf Spring)',
          'IS: 5517 50CrV4 / EN-47 (Chrome-Vanadium Spring)',
          'IS: 1570 X04Cr18Ni9 (SS 304 Stainless Flat)',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-sheet',
    slug: 'sheet',
    name: 'Sheet',
    description: 'Steel sheets in LC, MS and alloy steel for precision fabrication and structural use.',
    imageUrl: '/images/products/sheet.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 4,
    availableGrades: [
      'MS',
      'LC',
      'ALLOY',
    ],
    specificationFields: [
      {
        key: 'thickness',
        label: 'Thickness (mm)',
        type: 'select',
        options: [
          '2 mm', '3 mm', '4 mm', '5 mm', '6 mm', '8 mm', '10 mm', '12 mm'
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
        required: false,
      },
      {
        key: 'lengthFormat',
        label: 'Length / Product Format',
        type: 'select',
        options: [
          '2000 mm Sheet Standard',
          '2440 mm (8 ft Sheet)',
          '2500 mm Sheet',
          '3000 mm (10 ft Sheet)',
          '6000 mm Industrial Plate',
          'Continuous Coil (CR Coil / HR Coil)',
        ],
        required: false,
      },
      {
        key: 'surfaceFinish',
        label: 'Surface Finish / Processing',
        type: 'select',
        options: [
          'HR Mill Finish (Hot Rolled As Rolled)',
          'HRPO - Hot Rolled Pickled & Oiled (Descaled)',
          'CR 2B - Skin Passed / Scale-Free Cold Rolled',
          'Annealed & Descaled (IS: 1079 General Engineering)',
        ],
        required: false,
      },
      {
        key: 'handbookGradeEquivalent',
        label: 'Detailed IS / CR / HR Sheet Specification (Optional)',
        type: 'select',
        options: [
          'IS: 1079 HR1 / HR2 (Commercial / Deep Drawing Hot Rolled)',
          'IS: 513 CR1 / CR2 / CR3 / CR4 (Cold Rolled Stamping / EDD)',
          'IS: 2062 Fe410-W / E250 (Hot Rolled Structural Plate)',
          'IS: 2002 Grade 1 / 2 (Boiler & Pressure Vessel Plate)',
          'IS: 2062 Chequered Floor Plate (Tear Drop Pattern)',
          'IS: 1570 X04Cr18Ni9 (SS 304 2B/BA Stainless Sheet)',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-square',
    slug: 'square',
    name: 'Square',
    description: 'Square bars in MS and alloy, precision rolled for engineering and machining.',
    imageUrl: '/images/products/square.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 5,
    availableGrades: [
      'ALLOY',
      'MS',
    ],
    specificationFields: [
      {
        key: 'squareSize',
        label: 'Section Size (mm)',
        type: 'select',
        options: [
          '10 mm', '12 mm', '14 mm', '15 mm', '16 mm', '18 mm', '20 mm', '22 mm',
          '25 mm', '28 mm', '30 mm', '32 mm', '35 mm', '36 mm', '38 mm', '40 mm',
          '42 mm', '45 mm', '48 mm', '50 mm', '55 mm', '60 mm', '65 mm', '70 mm',
          '75 mm', '80 mm', '85 mm', '90 mm', '95 mm', '100 mm', '105 mm', '110 mm',
          '115 mm', '120 mm', '125 mm', '130 mm', '135 mm', '140 mm', '145 mm', '150 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'supplyCondition',
        label: 'Supply / Heat Treatment Condition',
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
      {
        key: 'handbookGradeEquivalent',
        label: 'Detailed IS / Alloy Grade Specification (Optional)',
        type: 'select',
        options: [
          'IS: 2062 Fe410-W / St42-W (Structural Square)',
          'IS: 1875 Class 2 / 20C8 (Carbon Steel Forging Billet)',
          'IS: 1875 Class 4 / 45C8 (EN-8D Forging Grade)',
          'IS: 2073 40C8 / C45 (Engineering Machining Square)',
          'IS: 5517 40Cr1Mo28 (EN-19 Chrome-Moly Square)',
          'IS: 5517 40Ni2Cr1Mo28 (EN-24 Heavy Duty Shaft Square)',
          'IS: 1570 X04Cr18Ni9 (SS 304 Solid Stainless Square)',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-tmt-bar',
    slug: 'tmt-bar',
    name: 'TMT Bar',
    description: 'High-strength thermo-mechanically treated reinforcement bars for construction excellence.',
    imageUrl: '/images/products/tmt-bar.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 6,
    availableGrades: [
      'AWADH TMT',
      'BALSHALI 550D',
      'HR PLATINUM',
      'MAJHI TMT',
      'RATHI TMT',
      'SMS TMT',
      'STAR TMT',
      'SUPERX TMT',
      'ZARA TMT',
      'ZEE CON TMT',
    ],
    specificationFields: [
      {
        key: 'diameter',
        label: 'Diameter (mm)',
        type: 'select',
        options: [
          '8 mm', '10 mm', '12 mm', '16 mm', '20 mm', '25 mm', '32 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'rebarGrade',
        label: 'IS: 1786 Strength Grade',
        type: 'select',
        options: [
          'Fe 500D (IS: 1786 High Ductility Seismic Rebar)',
          'Fe 550D (IS: 1786 Heavy Infrastructure & Flyovers)',
          'Fe 500 (IS: 1786 High Strength Concrete Reinforcement)',
          'CRS Fe 500D (Corrosion Resistant Rebar)',
        ],
        required: false,
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
        required: false,
      },
      {
        key: 'certification',
        label: 'BIS Certification & Test Report',
        type: 'select',
        options: [
          'BIS ISI Hallmarked with Mill Test Certificate (MTC)',
          '100% 0.2% Proof Stress & Elongation Test Report',
        ],
        required: false,
      },
    ],
  },
  {
    id: 'cat-square-bright-bar',
    slug: 'square-bright-bar',
    name: 'Square Bright Bar',
    description: 'Precision cold-drawn bright square steel bars with sharp 90-degree corners and tight ISO h9/h11 tolerances.',
    imageUrl: '/images/products/square-bright.png',
    isActive: true,
    isComingSoon: false,
    displayOrder: 7,
    availableGrades: [
      'ALLOY',
      'MS',
      'EN-8D',
      'EN-1A',
      'LC',
      'SAE-1018',
    ],
    specificationFields: [
      {
        key: 'squareSize',
        label: 'Section Size (mm)',
        type: 'select',
        options: [
          '10 mm', '12 mm', '14 mm', '15 mm', '16 mm', '18 mm', '20 mm', '22 mm',
          '25 mm', '28 mm', '30 mm', '32 mm', '35 mm', '36 mm', '38 mm', '40 mm',
          '42 mm', '45 mm', '48 mm', '50 mm', '55 mm', '60 mm', '65 mm', '70 mm',
          '75 mm', '80 mm', '85 mm', '90 mm', '95 mm', '100 mm'
        ],
        unit: 'mm',
        required: true,
      },
      {
        key: 'tolerance',
        label: 'Dimensional Tolerance Standard (ISO / DIN)',
        type: 'select',
        options: [
          'ISO h9 Tolerance (Sharp 90° Precision Square)',
          'ISO h11 Tolerance (Standard Bright Cold Drawn)',
          'ISO h8 Tolerance (Centerless Ground Finish)',
        ],
        required: false,
      },
      {
        key: 'finishCondition',
        label: 'Supply / Surface Condition',
        type: 'select',
        options: [
          'CD - Cold Drawn Bright (Scale-Free Smooth)',
          'Cold Drawn & Annealed (Stress Relieved)',
          'Peeled & Ground Surface',
        ],
        required: false,
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
        required: false,
      },
    ],
  },
  {
    id: 'cat-fasteners',
    slug: 'fasteners',
    name: 'Fasteners',
    description: 'ISO 9001:2015 certified cold & hot forged industrial fasteners across 17 subcategories (Hex Bolts, Hex Nuts, U-Bolts, J-Bolts, L-Bolts, Coach Screws, Heavy Hex, Washers) per IS 1363, IS 1364, IS 730 & IS 1120.',
    imageUrl: 'https://ftis.b-cdn.net/fasteners-catalog/hex-bolt/hex-bolt.jpg',
    isActive: true,
    isComingSoon: false,
    displayOrder: 8,
    availableGrades: [
      'SPL 8.8 (High Tensile Quenched & Tempered)',
      'SPL 10.9 (Alloy Steel High Tensile)',
      'SPL 12.9 (Ultra High Tensile Socket/Hex)',
      'EN-8D (Medium Carbon Forged)',
      'Boron (10B21 / 15B25 Cold Forged)',
      'SAE-4140 / EN-19 (Chrome-Moly High Temperature)',
      'CHQ (Cold Heading Quality)',
      'MS / LC (Mild Steel / Low Carbon)',
    ],
    specificationFields: [
      {
        key: 'subcategory',
        label: 'Fastener Subcategory',
        type: 'select',
        options: [
          'Hex Bolt (IS 1363 / IS 1364)',
          'Hex Nut (IS 1363 / IS 1364)',
          'U-Bolt (Round & Square Bend)',
          'J-Type Bolt (IS 730:1978)',
          'L-Bolt (Foundation Anchor)',
          'Coach Screw (IS 1120:1975)',
          'Heavy Hex Bolt',
          'Heavy Hex Nut',
          'J-Hook',
          'Square J-Bolt',
          'Plain Washer',
          'Machined Washer',
          'Spring Washer',
          'Square Washer',
          'DTI Washer',
          'Square Nut',
          'Square Plate',
        ],
        required: true,
      },
      {
        key: 'diameter',
        label: 'Thread Size / Nominal Diameter',
        type: 'select',
        options: [
          'M5', 'M6', 'M8', 'M10', 'M12', 'M14', 'M16', 'M18', 'M20', 'M22', 'M24',
          'M27', 'M30', 'M33', 'M36', 'M39', 'M42', 'M45', 'M48', 'M52', 'M56', 'M64'
        ],
        required: true,
      },
      {
        key: 'length',
        label: 'Nominal Length',
        type: 'select',
        options: [
          'N/A (Nut / Washer / Plate)',
          '20 mm', '25 mm', '30 mm', '35 mm', '40 mm', '45 mm', '50 mm', '60 mm', '65 mm', '70 mm', '75 mm',
          '80 mm', '90 mm', '100 mm', '110 mm', '120 mm', '130 mm', '140 mm', '150 mm', '160 mm', '180 mm',
          '200 mm', '220 mm', '250 mm', '280 mm', '300 mm', '350 mm', '400 mm', '450 mm', '500 mm'
        ],
        required: true,
      },
      {
        key: 'surfaceFinish',
        label: 'Surface Coating & Finish',
        type: 'select',
        options: [
          'Auto Black (Heat Treated & Oiled)',
          'Zinc Plating (White / Yellow Trivalent Passivated)',
          'Hot Dip Galvanizing (HDG per IS 4759)',
          'Zinc Flake Coating (Geomet / Dacromet)',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'cat-tractor-parts',
    slug: 'tractor-parts',
    name: 'Tractor Parts',
    description: 'Precision forged and CNC-machined agricultural tractor spare parts across 50 OEM-grade SKUs covering Engine, Clutch, Transmission, PTO, Differential, Hydraulics, Steering, Linkage & Brakes.',
    imageUrl: 'https://ftis.b-cdn.net/tractor-workbook-images/001-piston-assembly.jpg',
    isActive: true,
    isComingSoon: false,
    displayOrder: 9,
    availableGrades: [
      'OEM Standard Forged Alloy (20MnCr5 / EN-19 / EN-8D)',
      'Case Hardened Gear Steel (16MnCr5 / SAE-8620)',
      'Boron Steel (30MnB5 Heat Treated)',
      'High-Duty Cast / Ductile Iron (SG Iron / FG 260)',
    ],
    specificationFields: [
      {
        key: 'partSystem',
        label: 'Tractor Assembly System',
        type: 'select',
        options: [
          'Engine (Piston, Liner, Crankshaft, Valves, Gasket, Turbo)',
          'Clutch & Transmission (Clutch Plate, Pressure Plate, Gear Set, Sync Ring)',
          'Transmission / PTO (PTO Shaft, PTO Clutch Plate)',
          'Differential & Axle (Crown Wheel Pinion, Diff Lock, Front/Rear Axle, Stub Axle)',
          'Steering (Power Steering Cylinder, Pump, Tie Rod End)',
          'Hydraulics & Linkage (Hydraulic Pump, Lift Cylinder, Control Valve, Top Link, Lower Link)',
          'Brakes & Wheels (Brake Disc, Drum, Master Cylinder, Wheel Hub, Rim)',
          'Cooling, Fuel, Electrical & Filters',
        ],
        required: true,
      },
      {
        key: 'partNumber',
        label: 'FTI Catalog SKU / Part Name',
        type: 'text',
        placeholder: 'e.g., FTI-AGRI-XLSX-001 (Piston Assembly) or OEM Ref',
        required: true,
      },
    ],
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

export const GUEST_USER: UserProfile = {
  id: 'guest',
  fullName: 'Guest Visitor',
  email: '',
  mobile: '',
  companyName: 'Guest Visitor',
  gstin: '',
  businessType: 'Manufacturer',
  role: 'customer',
  isActive: true,
  isProfileComplete: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-customer-01',
    fullName: 'Rajesh K. Sharma',
    email: 'rajesh@sharma-fabricators.in',
    mobile: '+91 98201 12345',
    companyName: 'Sharma Precision & Heavy Fabricators Pvt Ltd',
    gstin: '27AABCS1429B1Z8',
    businessType: 'Fabricator',
    designation: 'Director / Partner',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    role: 'customer',
    isActive: true,
    isProfileComplete: true,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'usr-admin-01',
    fullName: 'Anil Singhania (Head of Operations)',
    email: 'sales@fieldfasttech.com',
    mobile: '+91-9780830333',
    companyName: 'FieldFast Tech International',
    gstin: '03AAACF0123M1Z5',
    businessType: 'Manufacturer',
    designation: 'Head of Operations',
    city: 'Ludhiana',
    state: 'Punjab',
    role: 'super_admin',
    isActive: true,
    isProfileComplete: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-customer-02',
    fullName: 'Vikramaditya Mehta',
    email: 'v.mehta@gujarat-tubes.com',
    mobile: '+91 98791 22334',
    companyName: 'Gujarat Precision Tubes & Forgings Ltd',
    gstin: '24AAACG8812J1Z2',
    businessType: 'Manufacturer',
    designation: 'Purchase / Procurement Head',
    city: 'Ahmedabad',
    state: 'Gujarat',
    role: 'customer',
    isActive: true,
    isProfileComplete: true,
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'usr-customer-03',
    fullName: 'Gurpreet Singh',
    email: 'gsingh@punjab-fasteners.com',
    mobile: '+91 98140 55667',
    companyName: 'Punjab Heavy Bolts & Industrial Fasteners',
    gstin: '03AABCP9912K1Z9',
    businessType: 'Wholesaler',
    designation: 'Owner / Proprietor',
    city: 'Ludhiana',
    state: 'Punjab',
    role: 'customer',
    isActive: true,
    isProfileComplete: true,
    createdAt: '2026-09-20T11:30:00.000Z',
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
  companyName: 'FieldFast Tech International',
  tagline: 'Smart Sourcing. Stronger Business. — Direct Mill Steel, Industrial Fasteners & Tractor Spares',
  gstin: '03AAACF0123M1Z5',
  address: 'St.No.1, New Ram Nagar, Industrial Area-C, Sua Road, Ludhiana 141014, Punjab, India',
  phone: '+91-9780830333',
  email: 'sales@fieldfasttech.com',
  bankName: 'State Bank of India',
  accountNumber: '3892010049281',
  ifscCode: 'SBIN0001824',
  branch: 'Industrial Area-C Branch, Ludhiana',
  defaultTaxRate: 18.0,
  quotationValidityDays: 3,
  supportPhone: '+91-9780830333, +91-9589971567',
  supportEmail: 'sales@fieldfasttech.com',
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
    specialNotes: 'Material available ready in stock at Ludhiana Works (Industrial Area-C). Dispatch within 24 hours of PO confirmation.',
    adminNotes: 'Client has strong credit history. Offered freight concession.',
    termsAndConditions: '1. Quotation valid strictly for 3 days due to steel price volatility.\n2. Payment terms: 100% against proforma invoice before dispatch.\n3. Taxes: 18% GST extra as applicable.\n4. Subject to Ludhiana jurisdiction.',
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
      { status: 'dispatched', changedAt: '2026-11-03T08:30:00.000Z', changedBy: 'Admin (Anil Singhania)', note: 'Truck PB-10-GP-9142 loaded and left Ludhiana Dispatch Hub' },
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
      name: 'FieldFast Tech International',
      tagline: 'Smart Sourcing. Stronger Business. — ISO 9001:2015 Certified (QACS/IND/250321)',
      address: 'St.No.1, New Ram Nagar, Industrial Area-C, Sua Road, Ludhiana 141014, Punjab, India',
      gstin: '03AAACF0123M1Z5',
      pan: 'AAACF0123M',
      phone: '+91-9780830333',
      email: 'sales@fieldfasttech.com',
      website: 'https://fti-app-sooty.vercel.app',
      bankName: 'State Bank of India',
      accountNumber: '3892010049281',
      ifscCode: 'SBIN0001824',
      branch: 'Industrial Area-C Branch, Ludhiana',
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
  isAuthenticated: boolean;
  currentUser: UserProfile;
  users: UserProfile[];
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
      isAuthenticated: false,
      currentUser: GUEST_USER,
      users: INITIAL_USERS,
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
      
      // Cleanse any legacy cached entries, deduplicate IDs, and merge any new initial materials
      let cleanedMaterials: MarketMaterial[] = [];
      if (hasMandiData && Array.isArray(parsed.marketMaterials)) {
        const seenIds = new Set<string>();
        const seenSymbols = new Set<string>();

        for (const m of parsed.marketMaterials as MarketMaterial[]) {
          if (m.materialName === 'Mandi Benchmark' || m.categoryName === 'Mandi Benchmark') {
            continue;
          }
          // Skip legacy unsuffixed Ludhiana IDs so they are replaced by properly suffixed EN8D/MS items
          if (
            m.id === 'mat-raw-materials-ingot-ludhiana' ||
            m.id === 'mat-scrap-materials-melting-scrap-ludhiana'
          ) {
            continue;
          }
          if (!seenIds.has(m.id) && !seenSymbols.has(m.symbol)) {
            seenIds.add(m.id);
            seenSymbols.add(m.symbol);
            cleanedMaterials.push(m);
          }
        }

        for (const initMat of INITIAL_MARKET_MATERIALS) {
          if (!seenIds.has(initMat.id) && !seenSymbols.has(initMat.symbol)) {
            seenIds.add(initMat.id);
            seenSymbols.add(initMat.symbol);
            cleanedMaterials.push(initMat);
          }
        }
      }

      const isAuth = parsed.isAuthenticated === true;
      const mergedUsers: UserProfile[] = Array.isArray(parsed.users) && parsed.users.length > 0
        ? parsed.users
        : INITIAL_USERS;

      const resolvedMaterials =
        hasMandiData && cleanedMaterials.length > 0 ? cleanedMaterials : INITIAL_MARKET_MATERIALS;
      const resolvedBulletin = parsed.mandiBulletin || INITIAL_MANDI_BULLETIN;

      return {
        isAuthenticated: isAuth,
        currentUser: isAuth && parsed.currentUser ? parsed.currentUser : GUEST_USER,
        users: mergedUsers,
        categories: INITIAL_CATEGORIES,
        cart: parsed.cart || [],
        quotations: parsed.quotations || INITIAL_QUOTATIONS,
        orders: parsed.orders || INITIAL_ORDERS,
        invoices: parsed.invoices || INITIAL_INVOICES,
        addresses: parsed.addresses || INITIAL_ADDRESSES,
        marketMaterials: resolvedMaterials,
        mandiBulletin: resolvedBulletin,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        settings:
          parsed.settings && !parsed.settings.address?.includes('Kalamboli')
            ? parsed.settings
            : INITIAL_SETTINGS,
      };
    }
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
  }

  return {
    isAuthenticated: false,
    currentUser: GUEST_USER,
    users: INITIAL_USERS,
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
