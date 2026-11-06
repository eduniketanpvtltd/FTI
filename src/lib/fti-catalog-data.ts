// Auto-synced from https://fti-app-sooty.vercel.app/ (FieldFast Tech International B2B Catalog)

export const FTI_COMPANY_INFO = {
  companyName: "FieldFast Tech International",
  shortName: "FTI",
  tagline: "Smart Sourcing. Stronger Business.",
  footerTagline: "Built for the businesses that build India.",
  registeredWorks: "St. No. 1, Industrial Area-C, Ludhiana 141014, India",
  fullAddress: "St.No.1, New Ram Nagar, Industrial Area-C, Sua Road, Ludhiana 141014, Punjab, India",
  dispatchHub: "Ludhiana Dispatch Hub",
  city: "Ludhiana",
  state: "Punjab",
  pincode: "141014",
  gstin: "03AAACF0123M1Z5",
  supportPhone: "+91-9780830333",
  whatsappPhones: ["+91-9780830333", "+91-9589971567"],
  smsPhone: "+91-9780830333",
  email: "sales@fieldfasttech.com",
  supportEmail: "support@fieldfasttech.com",
  website: "https://fti-app-sooty.vercel.app",
};

export const FTI_ISO_CERTIFICATE = {
  standard: "ISO 9001:2015",
  qmsLabel: "ISO 9001:2015 (QMS)",
  scope: "Quality Management System for Industrial Fasteners, Steel Components & Tractor Spares",
  organization: "FIELDFAST TECH INTERNATIONAL",
  address: "St.No.1, New Ram Nagar, Industrial Area-C, Sua Road, Ludhiana 141014, Punjab, India",
  registeredWorks: "Registered Works: St. No. 1, Industrial Area-C, Ludhiana 141014, India",
  certificateNumber: "QACS/IND/250321",
  accreditation: "IAS Accredited (MSCB-196) & IAF MLA Member",
  registrationPeriod: "21/Dec/2025 – 03/Mar/2028",
  validUntil: "March 03, 2028",
  issuer: "QACS International — Certification & Assessment Services (London / India)",
  verificationUrl: "https://www.qacscert.com",
  cdnUrl: "https://ftis.b-cdn.net/company-certificates/iso-9001-2015-qacs-ind-250321.jpg",
  badgeCdnUrl: "https://ftis.b-cdn.net/icons/iso-9001-certified-badge.png",
};

export interface FastenerSubcategoryItem {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  hasPublishedPhoto: boolean;
  drawingsCount: number;
  standards: string[];
  shapes: string[];
  sizes: string[];
  diameters: number[];
  lengths: number[];
  grades: string[];
  threads: string[];
  finishes: string[];
  specifications: { label: string; value: string }[];
  sampleDrawings: {
    id: string;
    size: string;
    shape: string;
    standard: string;
    edition: string;
    dimensions: Record<string, any>;
    notes: string;
  }[];
}

export const FTI_FASTENER_SUBCATEGORIES: FastenerSubcategoryItem[] = [
  {
    "slug": "hex-bolt",
    "title": "Hex bolt",
    "description": "Hex bolts with advertised cold and hot forging capabilities for industrial and OEM supply. Cold forged sizes cover diameters of 5–24 mm and lengths of 10–200 mm; hot forged sizes cover diameters of 24–56 mm and lengths of 50–450 mm. Confirm property class, product standard, thread pitch and coating specification when requesting a quotation.",
    "imageUrl": "https://ftis.b-cdn.net/product-images/4145a5a5-148f-4ca2-98cc-a16a8f861cf3/06e3ee5c-52b9-4e0a-8e41-543b1a08b5f6.jpg",
    "hasPublishedPhoto": true,
    "drawingsCount": 257,
    "standards": [
      "IS 1363:1967",
      "IS 1363:1992",
      "IS 1364:1967",
      "IS 1364:1992"
    ],
    "shapes": [
      "hex-bolt",
      "hex-screw"
    ],
    "sizes": [
      "M10",
      "M12",
      "M14",
      "M16",
      "M18",
      "M20",
      "M22",
      "M24",
      "M27",
      "M30",
      "M33",
      "M36",
      "M39",
      "M6",
      "M8",
      "M5",
      "M1.6",
      "M1.6 x 0.2 Fine",
      "M10 x 0.75 Fine",
      "M10 x 1 Fine",
      "M10 x 1.25 Fine",
      "M12 x 1 Fine",
      "M12 x 1.25 Fine",
      "M12 x 1.5 Fine",
      "M14 x 1 Fine",
      "M14 x 1.5 Fine",
      "M16 x 1 Fine",
      "M16 x 1.5 Fine",
      "M18 x 1 Fine",
      "M18 x 1.5 Fine",
      "M2",
      "M2 x 0.25 Fine",
      "M2.5",
      "M2.5 x 0.35 Fine",
      "M20 x 1 Fine",
      "M20 x 1.5 Fine",
      "M20 x 2 Fine",
      "M22 x 1 Fine",
      "M22 x 1.5 Fine",
      "M22 x 2 Fine",
      "M24 x 1 Fine",
      "M24 x 1.5 Fine",
      "M24 x 2 Fine",
      "M27 x 1 Fine",
      "M27 x 1.5 Fine",
      "M27 x 2 Fine",
      "M3",
      "M3 x 0.35 Fine",
      "M3.5",
      "M3.5 x 0.35 Fine",
      "M30 x 1 Fine",
      "M30 x 1.5 Fine",
      "M30 x 2 Fine",
      "M33 x 1.5 Fine",
      "M33 x 2 Fine",
      "M36 x 1.5 Fine",
      "M36 x 2 Fine",
      "M36 x 3 Fine",
      "M39 x 1.5 Fine",
      "M39 x 2 Fine",
      "M39 x 3 Fine",
      "M4",
      "M4 x 0.5 Fine",
      "M42",
      "M42 x 1.5 Fine",
      "M42 x 2 Fine",
      "M42 x 3 Fine",
      "M42 x 4 Fine",
      "M45",
      "M45 x 1.5 Fine",
      "M45 x 2 Fine",
      "M45 x 3 Fine",
      "M45 x 4 Fine",
      "M48",
      "M48 x 1.5 Fine",
      "M48 x 2 Fine",
      "M48 x 3 Fine",
      "M48 x 4 Fine",
      "M5 x 0.5 Fine",
      "M52",
      "M56",
      "M6 x 0.75 Fine",
      "M60",
      "M64",
      "M8 x 0.75 Fine",
      "M8 x 1 Fine"
    ],
    "diameters": [
      1.6,
      2,
      2.5,
      3,
      3.5,
      4,
      5,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      27,
      30,
      33,
      36,
      39,
      42,
      45,
      48,
      52,
      56,
      60,
      64
    ],
    "lengths": [],
    "grades": [
      "LC",
      "MS",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [
      {
        "label": "Material used",
        "value": "Wire and round bars"
      },
      {
        "label": "Material grades",
        "value": "LC / MS / CHQ · EN-8D · Boron · SAE-4140 · EN-19"
      },
      {
        "label": "Cold forging",
        "value": "Diameter 5–24 mm · Length 10–200 mm"
      },
      {
        "label": "Hot forging",
        "value": "Diameter 24–56 mm · Length 50–450 mm"
      },
      {
        "label": "Threading capacity",
        "value": "5–56 mm"
      },
      {
        "label": "Threads available",
        "value": "BSW · UNC · UNF · Coarse metric and inch; confirm designation and pitch"
      },
      {
        "label": "Manufacturing process",
        "value": "Raw material → Cutting to length → Cold or hot forging → Threading → Inspection. The forging route depends on the required size."
      },
      {
        "label": "Inspection",
        "value": "Dimensional check and quality inspection"
      },
      {
        "label": "Facilities available",
        "value": "Cold forging headers · Screw forgings (multiple stages) · Nut forging M24–M42 using a friction press"
      },
      {
        "label": "Finishing facilities",
        "value": "Auto black · Zinc plating · Hot dip galvanizing · Zinc flake"
      },
      {
        "label": "Specification confirmation",
        "value": "Advertised capabilities only. Confirm grade, thread pitch, finish and availability with your quote. Nut forging is a facility capability."
      }
    ],
    "sampleDrawings": [
      {
        "id": "111a90c2-f46a-486c-b081-6a83925b9705",
        "size": "M10",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.5,
          "widths": [],
          "lengths": [],
          "diameter": 10,
          "head_width": 17,
          "head_height": 7.45,
          "diameter_max": 9.968,
          "diameter_min": 9.593,
          "head_width_max": 17,
          "head_width_min": 16.57,
          "head_height_max": 7.45,
          "head_height_min": 6.55,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 18.72,
          "pitch_diameter_max": 8.994,
          "pitch_diameter_min": 8.782
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "2e8bf8ee-0f67-4b2b-b5f1-19ec07e39122",
        "size": "M12",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.75,
          "widths": [],
          "lengths": [],
          "diameter": 12,
          "head_width": 19,
          "head_height": 8.45,
          "diameter_max": 11.966,
          "diameter_min": 11.541,
          "head_width_max": 19,
          "head_width_min": 18.48,
          "head_height_max": 8.45,
          "head_height_min": 7.55,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 20.88,
          "pitch_diameter_max": 10.829,
          "pitch_diameter_min": 10.593
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "8034f126-12d3-4fe0-8fba-7e00264b97d8",
        "size": "M14",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 14,
          "head_width": 22,
          "head_height": 9.45,
          "diameter_max": 13.962,
          "diameter_min": 13.512,
          "head_width_max": 22,
          "head_width_min": 21.16,
          "head_height_max": 9.45,
          "head_height_min": 8.55,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 23.91,
          "pitch_diameter_max": 12.663,
          "pitch_diameter_min": 12.413
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "46f1325e-f4af-499e-b9f4-2664374f6482",
        "size": "M16",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 16,
          "head_width": 24,
          "head_height": 10.45,
          "diameter_max": 15.962,
          "diameter_min": 15.512,
          "head_width_max": 24,
          "head_width_min": 23.16,
          "head_height_max": 10.45,
          "head_height_min": 9.55,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 26.17,
          "pitch_diameter_max": 14.663,
          "pitch_diameter_min": 14.413
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "12c4349e-f793-4ef4-8f4e-9c51212dc1ba",
        "size": "M18",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 18,
          "head_width": 27,
          "head_height": 12.55,
          "diameter_max": 17.962,
          "diameter_min": 17.512,
          "head_width_max": 27,
          "head_width_min": 26.16,
          "head_height_max": 12.55,
          "head_height_min": 11.45,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 29.56,
          "pitch_diameter_max": 16.334,
          "pitch_diameter_min": 16.069
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "fd31e758-5c31-41dc-a7d8-703118a02b3e",
        "size": "M20",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 20,
          "head_width": 30,
          "head_height": 13.55,
          "diameter_max": 19.958,
          "diameter_min": 19.428,
          "head_width_max": 30,
          "head_width_min": 29.16,
          "head_height_max": 13.55,
          "head_height_min": 12.45,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 32.95,
          "pitch_diameter_max": 18.334,
          "pitch_diameter_min": 18.069
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "0756c325-9710-4cbb-81be-667775f0c1de",
        "size": "M22",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 22,
          "head_width": 32,
          "head_height": 14.55,
          "diameter_max": 21.958,
          "diameter_min": 21.428,
          "head_width_max": 32,
          "head_width_min": 31,
          "head_height_max": 14.55,
          "head_height_min": 13.45,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 35.03,
          "pitch_diameter_max": 20.334,
          "pitch_diameter_min": 20.069
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "955b961c-1ec0-4fbd-9563-2a083a75683a",
        "size": "M24",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3,
          "widths": [],
          "lengths": [],
          "diameter": 24,
          "head_width": 36,
          "head_height": 15.55,
          "diameter_max": 23.952,
          "diameter_min": 23.352,
          "head_width_max": 36,
          "head_width_min": 35,
          "head_height_max": 15.55,
          "head_height_min": 15.45,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 39.55,
          "pitch_diameter_max": 22.003,
          "pitch_diameter_min": 21.688
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "265977ce-05a5-433f-9ab6-08d5f881bc84",
        "size": "M27",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3,
          "widths": [],
          "lengths": [],
          "diameter": 27,
          "head_width": 41,
          "head_height": 17.55,
          "diameter_max": 26.952,
          "diameter_min": 26.352,
          "head_width_max": 41,
          "head_width_min": 40,
          "head_height_max": 17.55,
          "head_height_min": 16.45,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 45.2,
          "pitch_diameter_max": 25.003,
          "pitch_diameter_min": 24.688
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "e18b1d94-721c-4ecc-a121-1365e2249a6b",
        "size": "M30",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3.5,
          "widths": [],
          "lengths": [],
          "diameter": 30,
          "head_width": 46,
          "head_height": 19.65,
          "diameter_max": 29.947,
          "diameter_min": 29.277,
          "head_width_max": 46,
          "head_width_min": 45,
          "head_height_max": 19.65,
          "head_height_min": 18.35,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 50.85,
          "pitch_diameter_max": 27.674,
          "pitch_diameter_min": 27.339
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "b6722f21-8eda-4ef2-8ea1-990d52b67afd",
        "size": "M33",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3.5,
          "widths": [],
          "lengths": [],
          "diameter": 33,
          "head_width": 50,
          "head_height": 21.65,
          "diameter_max": 32.947,
          "diameter_min": 32.277,
          "head_width_max": 50,
          "head_width_min": 49,
          "head_height_max": 21.65,
          "head_height_min": 20.35,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 55.37,
          "pitch_diameter_max": 30.674,
          "pitch_diameter_min": 30.339
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "ec1e4150-5783-4a1a-b61b-63e7652ae806",
        "size": "M36",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 4,
          "widths": [],
          "lengths": [],
          "diameter": 36,
          "head_width": 55,
          "head_height": 23.65,
          "diameter_max": 35.94,
          "diameter_min": 35.19,
          "head_width_max": 55,
          "head_width_min": 53.8,
          "head_height_max": 23.65,
          "head_height_min": 22.35,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 60.79,
          "pitch_diameter_max": 33.342,
          "pitch_diameter_min": 32.987
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "c6157db6-440c-4347-bbb9-b9a230ede67d",
        "size": "M39",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 4,
          "widths": [],
          "lengths": [],
          "diameter": 39,
          "head_width": 60,
          "head_height": 25.65,
          "diameter_max": 38.94,
          "diameter_min": 38.19,
          "head_width_max": 60,
          "head_width_min": 58.8,
          "head_height_max": 25.65,
          "head_height_min": 24.35,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 66.44,
          "pitch_diameter_max": 36.342,
          "pitch_diameter_min": 35.987
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "9ebe53c2-83a6-4d94-a8ca-caf5b9284203",
        "size": "M6",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1,
          "widths": [],
          "lengths": [],
          "diameter": 6,
          "head_width": 10,
          "head_height": 4.38,
          "diameter_max": 5.974,
          "diameter_min": 5.694,
          "head_width_max": 10,
          "head_width_min": 9.64,
          "head_height_max": 4.38,
          "head_height_min": 3.62,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 10.89,
          "pitch_diameter_max": 5.324,
          "pitch_diameter_min": 5.144
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "58df0f53-81af-4825-a971-d63cb38ed2a8",
        "size": "M8",
        "shape": "hex-bolt",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.25,
          "widths": [],
          "lengths": [],
          "diameter": 8,
          "head_width": 13,
          "head_height": 5.88,
          "diameter_max": 7.972,
          "diameter_min": 7.637,
          "head_width_max": 13,
          "head_width_min": 12.57,
          "head_height_max": 5.88,
          "head_height_min": 5.12,
          "thread_add_long": 25,
          "thread_add_short": 6,
          "thread_add_medium": 12,
          "across_corners_min": 14.2,
          "pitch_diameter_max": 7.16,
          "pitch_diameter_min": 6.97
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "72c6afe9-c274-46f8-b471-9e1a749346db",
        "size": "M10",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.5,
          "widths": [],
          "lengths": [],
          "diameter": 10,
          "head_width": 17,
          "head_height": 7.45,
          "diameter_max": 9.968,
          "diameter_min": 9.593,
          "head_width_max": 17,
          "head_width_min": 16.57,
          "head_height_max": 7.45,
          "head_height_min": 6.55,
          "across_corners_min": 18.72,
          "pitch_diameter_max": 8.994,
          "pitch_diameter_min": 8.782,
          "thread_end_allowance": 5
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "fa75d744-05ea-4bde-a987-087953f7b7e9",
        "size": "M12",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.75,
          "widths": [],
          "lengths": [],
          "diameter": 12,
          "head_width": 19,
          "head_height": 8.45,
          "diameter_max": 11.966,
          "diameter_min": 11.541,
          "head_width_max": 19,
          "head_width_min": 18.48,
          "head_height_max": 8.45,
          "head_height_min": 7.55,
          "across_corners_min": 20.88,
          "pitch_diameter_max": 10.829,
          "pitch_diameter_min": 10.593,
          "thread_end_allowance": 6
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "e5436897-3bf6-47cd-a42f-1b4d5e328295",
        "size": "M14",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 14,
          "head_width": 22,
          "head_height": 9.45,
          "diameter_max": 13.962,
          "diameter_min": 13.512,
          "head_width_max": 22,
          "head_width_min": 21.16,
          "head_height_max": 9.45,
          "head_height_min": 8.55,
          "across_corners_min": 23.91,
          "pitch_diameter_max": 12.663,
          "pitch_diameter_min": 12.413,
          "thread_end_allowance": 7.5
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "ec231450-af8c-4f6e-9c55-c9804e8f3e39",
        "size": "M16",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 16,
          "head_width": 24,
          "head_height": 10.45,
          "diameter_max": 15.962,
          "diameter_min": 15.512,
          "head_width_max": 24,
          "head_width_min": 23.16,
          "head_height_max": 10.45,
          "head_height_min": 9.55,
          "across_corners_min": 26.17,
          "pitch_diameter_max": 14.663,
          "pitch_diameter_min": 14.413,
          "thread_end_allowance": 7.5
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "a55496a0-3b58-4f6b-82bd-5b99c299218e",
        "size": "M18",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 18,
          "head_width": 27,
          "head_height": 12.55,
          "diameter_max": 17.962,
          "diameter_min": 17.512,
          "head_width_max": 27,
          "head_width_min": 26.16,
          "head_height_max": 12.55,
          "head_height_min": 11.45,
          "across_corners_min": 29.56,
          "pitch_diameter_max": 16.334,
          "pitch_diameter_min": 16.069,
          "thread_end_allowance": 9
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "d69088a4-fd7f-4fa0-8ffc-e106f6ac20fb",
        "size": "M20",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 20,
          "head_width": 30,
          "head_height": 13.55,
          "diameter_max": 19.958,
          "diameter_min": 19.428,
          "head_width_max": 30,
          "head_width_min": 29.16,
          "head_height_max": 13.55,
          "head_height_min": 12.45,
          "across_corners_min": 32.95,
          "pitch_diameter_max": 18.334,
          "pitch_diameter_min": 18.069,
          "thread_end_allowance": 9
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "1f32baf5-1065-4bc9-887d-4a901ae12510",
        "size": "M22",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 22,
          "head_width": 32,
          "head_height": 14.55,
          "diameter_max": 21.958,
          "diameter_min": 21.428,
          "head_width_max": 32,
          "head_width_min": 31,
          "head_height_max": 14.55,
          "head_height_min": 13.45,
          "across_corners_min": 35.03,
          "pitch_diameter_max": 20.334,
          "pitch_diameter_min": 20.069,
          "thread_end_allowance": 9
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "4a8bf72b-c07c-46c8-a746-f28ed6a165a4",
        "size": "M24",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3,
          "widths": [],
          "lengths": [],
          "diameter": 24,
          "head_width": 36,
          "head_height": 15.55,
          "diameter_max": 23.952,
          "diameter_min": 23.352,
          "head_width_max": 36,
          "head_width_min": 35,
          "head_height_max": 15.55,
          "head_height_min": 15.45,
          "across_corners_min": 39.55,
          "pitch_diameter_max": 22.003,
          "pitch_diameter_min": 21.688,
          "thread_end_allowance": 11
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "108d8d28-a144-4853-836e-c531b842e141",
        "size": "M6",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1,
          "widths": [],
          "lengths": [],
          "diameter": 6,
          "head_width": 10,
          "head_height": 4.38,
          "diameter_max": 5.974,
          "diameter_min": 5.694,
          "head_width_max": 10,
          "head_width_min": 9.64,
          "head_height_max": 4.38,
          "head_height_min": 3.62,
          "across_corners_min": 10.89,
          "pitch_diameter_max": 5.324,
          "pitch_diameter_min": 5.144,
          "thread_end_allowance": 4
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "9b693744-7044-4ec9-8ded-98a38fafc8b2",
        "size": "M8",
        "shape": "hex-screw",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.25,
          "widths": [],
          "lengths": [],
          "diameter": 8,
          "head_width": 13,
          "head_height": 5.88,
          "diameter_max": 7.972,
          "diameter_min": 7.637,
          "head_width_max": 13,
          "head_width_min": 12.57,
          "head_height_max": 5.88,
          "head_height_min": 5.12,
          "across_corners_min": 14.2,
          "pitch_diameter_max": 7.16,
          "pitch_diameter_min": 6.97,
          "thread_end_allowance": 4.5
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      }
    ]
  },
  {
    "slug": "hex-nut",
    "title": "Hex nut",
    "description": "Hex nut requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "https://ftis.b-cdn.net/product-images/4732a8ac-1fdf-406c-b51e-40779106ca63/b72ea6b8-18ea-49a0-abcd-21be05fcbea5.jpg",
    "hasPublishedPhoto": true,
    "drawingsCount": 262,
    "standards": [
      "IS 1363:1967",
      "IS 1363:1992",
      "IS 1364:1967",
      "IS 1364:1992"
    ],
    "shapes": [
      "hex-nut",
      "lock-nut"
    ],
    "sizes": [
      "M10",
      "M12",
      "M14",
      "M16",
      "M18",
      "M20",
      "M22",
      "M24",
      "M27",
      "M30",
      "M33",
      "M36",
      "M39",
      "M6",
      "M8",
      "M5",
      "M1.6",
      "M1.6 x 0.2 Fine",
      "M10 x 0.75 Fine",
      "M10 x 1 Fine",
      "M10 x 1.25 Fine",
      "M12 x 1 Fine",
      "M12 x 1.25 Fine",
      "M12 x 1.5 Fine",
      "M14 x 1 Fine",
      "M14 x 1.5 Fine",
      "M16 x 1 Fine",
      "M16 x 1.5 Fine",
      "M18 x 1 Fine",
      "M18 x 1.5 Fine",
      "M2",
      "M2 x 0.25 Fine",
      "M2.5",
      "M2.5 x 0.35 Fine",
      "M20 x 1 Fine",
      "M20 x 1.5 Fine",
      "M20 x 2 Fine",
      "M22 x 1 Fine",
      "M22 x 1.5 Fine",
      "M22 x 2 Fine",
      "M24 x 1 Fine",
      "M24 x 1.5 Fine",
      "M24 x 2 Fine",
      "M27 x 1 Fine",
      "M27 x 1.5 Fine",
      "M27 x 2 Fine",
      "M3",
      "M3 x 0.35 Fine",
      "M3.5",
      "M3.5 x 0.35 Fine",
      "M30 x 1 Fine",
      "M30 x 1.5 Fine",
      "M30 x 2 Fine",
      "M33 x 1.5 Fine",
      "M33 x 2 Fine",
      "M36 x 1.5 Fine",
      "M36 x 2 Fine",
      "M36 x 3 Fine",
      "M39 x 1.5 Fine",
      "M39 x 2 Fine",
      "M39 x 3 Fine",
      "M4",
      "M4 x 0.5 Fine",
      "M42",
      "M42 x 1.5 Fine",
      "M42 x 2 Fine",
      "M42 x 3 Fine",
      "M42 x 4 Fine",
      "M45",
      "M45 x 1.5 Fine",
      "M45 x 2 Fine",
      "M45 x 3 Fine",
      "M45 x 4 Fine",
      "M48",
      "M48 x 1.5 Fine",
      "M48 x 2 Fine",
      "M48 x 3 Fine",
      "M48 x 4 Fine",
      "M5 x 0.5 Fine",
      "M52",
      "M56",
      "M6 x 0.75 Fine",
      "M60",
      "M64",
      "M8 x 0.75 Fine",
      "M8 x 1 Fine"
    ],
    "diameters": [
      1.6,
      2,
      2.5,
      3,
      3.5,
      4,
      5,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      27,
      30,
      33,
      36,
      39,
      42,
      45,
      48,
      52,
      56,
      60,
      64
    ],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": [
      {
        "id": "a71c2aa6-d607-4cd3-a8ae-bfcb66e18931",
        "size": "M10",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.5,
          "widths": [],
          "lengths": [],
          "diameter": 10,
          "head_width": 17,
          "head_height": 8.45,
          "head_width_max": 17,
          "head_width_min": 16.57,
          "head_height_max": 8.45,
          "head_height_min": 7.55,
          "across_corners_min": 18.72,
          "minor_diameter_max": 8.751,
          "minor_diameter_min": 8.376
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "3892db97-d716-444f-8199-3fd2638ce82a",
        "size": "M12",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.75,
          "widths": [],
          "lengths": [],
          "diameter": 12,
          "head_width": 19,
          "head_height": 10.45,
          "head_width_max": 19,
          "head_width_min": 18.48,
          "head_height_max": 10.45,
          "head_height_min": 9.55,
          "across_corners_min": 20.88,
          "minor_diameter_max": 10.531,
          "minor_diameter_min": 10.106
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "b251f6c7-379f-4711-a96e-8fde0fb00e0d",
        "size": "M14",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 14,
          "head_width": 22,
          "head_height": 11.55,
          "head_width_max": 22,
          "head_width_min": 21.16,
          "head_height_max": 11.55,
          "head_height_min": 10.45,
          "across_corners_min": 23.91,
          "minor_diameter_max": 12.31,
          "minor_diameter_min": 11.835
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "0c006f7d-8def-45b8-8c2c-14870405dda0",
        "size": "M16",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 16,
          "head_width": 24,
          "head_height": 13.55,
          "head_width_max": 24,
          "head_width_min": 23.16,
          "head_height_max": 13.55,
          "head_height_min": 12.45,
          "across_corners_min": 26.17,
          "minor_diameter_max": 14.31,
          "minor_diameter_min": 13.835
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "e82e1148-7a32-4a22-a67b-d27064cd2440",
        "size": "M18",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 18,
          "head_width": 27,
          "head_height": 15.55,
          "head_width_max": 27,
          "head_width_min": 26.16,
          "head_height_max": 15.55,
          "head_height_min": 14.45,
          "across_corners_min": 29.56,
          "minor_diameter_max": 15.854,
          "minor_diameter_min": 15.294
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "d14544de-446b-4ca3-b9e3-bcfa9e792e06",
        "size": "M20",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 20,
          "head_width": 30,
          "head_height": 16.55,
          "head_width_max": 30,
          "head_width_min": 29.16,
          "head_height_max": 16.55,
          "head_height_min": 15.45,
          "across_corners_min": 32.95,
          "minor_diameter_max": 17.854,
          "minor_diameter_min": 17.294
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "176cc9e3-1dca-4c10-9395-53d6186a0285",
        "size": "M22",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 22,
          "head_width": 32,
          "head_height": 18.55,
          "head_width_max": 32,
          "head_width_min": 31,
          "head_height_max": 18.55,
          "head_height_min": 17.45,
          "across_corners_min": 35.03,
          "minor_diameter_max": 19.854,
          "minor_diameter_min": 19.274
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "361b2e54-b946-471c-b8d4-08fff825cafd",
        "size": "M24",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3,
          "widths": [],
          "lengths": [],
          "diameter": 24,
          "head_width": 36,
          "head_height": 19.65,
          "head_width_max": 36,
          "head_width_min": 35,
          "head_height_max": 19.65,
          "head_height_min": 18.35,
          "across_corners_min": 39.55,
          "minor_diameter_max": 21.382,
          "minor_diameter_min": 20.752
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "d00a4775-13e1-41ed-b9e0-d758fbef9e9d",
        "size": "M27",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3,
          "widths": [],
          "lengths": [],
          "diameter": 27,
          "head_width": 41,
          "head_height": 22.65,
          "head_width_max": 41,
          "head_width_min": 40,
          "head_height_max": 22.65,
          "head_height_min": 21.35,
          "across_corners_min": 45.2,
          "minor_diameter_max": 24.382,
          "minor_diameter_min": 23.752
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "b291b449-ce5d-44e4-b42a-d46cc06d2abe",
        "size": "M30",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3.5,
          "widths": [],
          "lengths": [],
          "diameter": 30,
          "head_width": 46,
          "head_height": 24.65,
          "head_width_max": 46,
          "head_width_min": 45,
          "head_height_max": 24.65,
          "head_height_min": 23.35,
          "across_corners_min": 50.85,
          "minor_diameter_max": 26.921,
          "minor_diameter_min": 26.211
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "520ba7aa-8d67-4ca7-884b-b6099d7f291c",
        "size": "M33",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3.5,
          "widths": [],
          "lengths": [],
          "diameter": 33,
          "head_width": 50,
          "head_height": 26.65,
          "head_width_max": 50,
          "head_width_min": 49,
          "head_height_max": 26.65,
          "head_height_min": 25.35,
          "across_corners_min": 55.37,
          "minor_diameter_max": 29.921,
          "minor_diameter_min": 29.211
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "9cf0ca0c-05c0-4c1b-b087-ac1124718ee6",
        "size": "M36",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 4,
          "widths": [],
          "lengths": [],
          "diameter": 36,
          "head_width": 55,
          "head_height": 29.65,
          "head_width_max": 55,
          "head_width_min": 53.8,
          "head_height_max": 29.65,
          "head_height_min": 28.35,
          "across_corners_min": 60.79,
          "minor_diameter_max": 32.42,
          "minor_diameter_min": 31.67
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "c872023e-1777-4049-bd80-ded12b319c1b",
        "size": "M39",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 4,
          "widths": [],
          "lengths": [],
          "diameter": 39,
          "head_width": 60,
          "head_height": 31.8,
          "head_width_max": 60,
          "head_width_min": 58.8,
          "head_height_max": 31.8,
          "head_height_min": 30.2,
          "across_corners_min": 66.44,
          "minor_diameter_max": 35.42,
          "minor_diameter_min": 34.67
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "63a157e1-376b-423b-adcb-e71769ad5045",
        "size": "M6",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1,
          "widths": [],
          "lengths": [],
          "diameter": 6,
          "head_width": 10,
          "head_height": 5.38,
          "head_width_max": 10,
          "head_width_min": 9.64,
          "head_height_max": 5.38,
          "head_height_min": 4.62,
          "across_corners_min": 10.89,
          "minor_diameter_max": 5.217,
          "minor_diameter_min": 4.917
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "5d96600a-0b12-4d3d-8520-434846b9686d",
        "size": "M8",
        "shape": "hex-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.25,
          "widths": [],
          "lengths": [],
          "diameter": 8,
          "head_width": 13,
          "head_height": 6.95,
          "head_width_max": 13,
          "head_width_min": 12.57,
          "head_height_max": 6.95,
          "head_height_min": 6.05,
          "across_corners_min": 14.2,
          "minor_diameter_max": 6.982,
          "minor_diameter_min": 6.647
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "c19a15d7-2dca-44f5-8963-49b1fe53ca31",
        "size": "M10",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.5,
          "widths": [],
          "lengths": [],
          "diameter": 10,
          "head_width": 17,
          "head_height": 5.38,
          "head_width_max": 17,
          "head_width_min": 16.57,
          "head_height_max": 5.38,
          "head_height_min": 4.62,
          "across_corners_min": 18.72,
          "minor_diameter_max": 8.751,
          "minor_diameter_min": 8.376
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "866b25a3-1e35-42cf-addc-839aa48dac0c",
        "size": "M12",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 1.75,
          "widths": [],
          "lengths": [],
          "diameter": 12,
          "head_width": 19,
          "head_height": 7.45,
          "head_width_max": 19,
          "head_width_min": 18.48,
          "head_height_max": 7.45,
          "head_height_min": 6.55,
          "across_corners_min": 20.88,
          "minor_diameter_max": 10.531,
          "minor_diameter_min": 10.106
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "c85ea6a5-7565-437a-beb7-844bba00ef43",
        "size": "M14",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 14,
          "head_width": 22,
          "head_height": 8.45,
          "head_width_max": 22,
          "head_width_min": 21.16,
          "head_height_max": 8.45,
          "head_height_min": 7.55,
          "across_corners_min": 23.91,
          "minor_diameter_max": 12.31,
          "minor_diameter_min": 11.835
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "ddf70483-be0d-4488-8941-b75f52933c8d",
        "size": "M16",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2,
          "widths": [],
          "lengths": [],
          "diameter": 16,
          "head_width": 24,
          "head_height": 8.45,
          "head_width_max": 24,
          "head_width_min": 23.16,
          "head_height_max": 8.45,
          "head_height_min": 7.55,
          "across_corners_min": 26.17,
          "minor_diameter_max": 14.31,
          "minor_diameter_min": 13.835
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "aab079cb-9cbc-4fc6-b0f5-35d8ebd8b362",
        "size": "M18",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 18,
          "head_width": 27,
          "head_height": 9.45,
          "head_width_max": 27,
          "head_width_min": 26.16,
          "head_height_max": 9.45,
          "head_height_min": 8.55,
          "across_corners_min": 29.56,
          "minor_diameter_max": 15.854,
          "minor_diameter_min": 15.294
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "1e454e43-2d72-44ad-8f5d-086ab84dcb2c",
        "size": "M20",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 20,
          "head_width": 30,
          "head_height": 9.45,
          "head_width_max": 30,
          "head_width_min": 29.16,
          "head_height_max": 9.45,
          "head_height_min": 8.55,
          "across_corners_min": 32.95,
          "minor_diameter_max": 17.854,
          "minor_diameter_min": 17.294
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "6fad03ad-c2e2-4f27-aeaf-113063cabf52",
        "size": "M22",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 2.5,
          "widths": [],
          "lengths": [],
          "diameter": 22,
          "head_width": 32,
          "head_height": 10.45,
          "head_width_max": 32,
          "head_width_min": 31,
          "head_height_max": 10.45,
          "head_height_min": 9.55,
          "across_corners_min": 35.03,
          "minor_diameter_max": 19.854,
          "minor_diameter_min": 19.274
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "ae90003c-39e0-4999-8eb5-4899bb4bc45e",
        "size": "M24",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3,
          "widths": [],
          "lengths": [],
          "diameter": 24,
          "head_width": 36,
          "head_height": 10.45,
          "head_width_max": 36,
          "head_width_min": 35,
          "head_height_max": 10.45,
          "head_height_min": 9.55,
          "across_corners_min": 39.55,
          "minor_diameter_max": 21.382,
          "minor_diameter_min": 20.752
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "84114657-b36c-451c-a77e-14946b3324d0",
        "size": "M27",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3,
          "widths": [],
          "lengths": [],
          "diameter": 27,
          "head_width": 41,
          "head_height": 12.55,
          "head_width_max": 41,
          "head_width_min": 40,
          "head_height_max": 12.55,
          "head_height_min": 11.45,
          "across_corners_min": 45.2,
          "minor_diameter_max": 24.382,
          "minor_diameter_min": 23.752
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      },
      {
        "id": "0b6d54bd-279b-4175-99d4-c4caaa7e7ac3",
        "size": "M30",
        "shape": "lock-nut",
        "standard": "IS 1363",
        "edition": "1967",
        "dimensions": {
          "pitch": 3.5,
          "widths": [],
          "lengths": [],
          "diameter": 30,
          "head_width": 46,
          "head_height": 12.55,
          "head_width_max": 46,
          "head_width_min": 45,
          "head_height_max": 12.55,
          "head_height_min": 11.45,
          "across_corners_min": 50.85,
          "minor_diameter_max": 26.921,
          "minor_diameter_min": 26.211
        },
        "notes": "Values retained as printed. Drawing uses maximum table limits; no nominal head dimensions or overall lengths are inferred. External thread tolerance class 8g; nut thread class 7H. Shank tolerances and chamfers require manufacturing review."
      }
    ]
  },
  {
    "slug": "u-bolt",
    "title": "U bolt",
    "description": "U bolt requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "https://ftis.b-cdn.net/product-images/afa19f95-621d-4cc1-a4b8-ce9599ef4781/849c5b84-c759-4469-bbf4-bfcc7d66ad84.jpg",
    "hasPublishedPhoto": true,
    "drawingsCount": 6,
    "standards": [
      "IS 730:1978"
    ],
    "shapes": [
      "u-round",
      "u-square"
    ],
    "sizes": [
      "M10",
      "M8",
      "M10 / w90",
      "M8 / w90"
    ],
    "diameters": [
      8,
      10
    ],
    "lengths": [
      150,
      160,
      170,
      180,
      190,
      200,
      225
    ],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": [
      {
        "id": "a9dbaa4d-3ba2-4fa9-b84a-66a8faff143c",
        "size": "M10",
        "shape": "u-round",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "radius": 1.5,
          "widths": [],
          "lengths": [],
          "diameter": 10,
          "thread_base": 30
        },
        "notes": "Round form: radius and return dimensions supplied by purchaser."
      },
      {
        "id": "ddada73d-3552-4a45-b922-989c996a3375",
        "size": "M8",
        "shape": "u-round",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "radius": 1.5,
          "widths": [],
          "lengths": [],
          "diameter": 8,
          "thread_base": 30
        },
        "notes": "Round form: radius and return dimensions supplied by purchaser."
      },
      {
        "id": "74d58251-e8e6-46cf-934e-1e8203a5267d",
        "size": "M10",
        "shape": "u-square",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "radius": 1.5,
          "widths": [
            50,
            60,
            80
          ],
          "lengths": [
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 10,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "4ab098ce-8702-4612-9175-ed0fc77745cb",
        "size": "M10 / w90",
        "shape": "u-square",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "radius": 1.5,
          "widths": [
            90
          ],
          "lengths": [
            225
          ],
          "diameter": 10,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "afb97509-e75c-452e-88f5-5b4553d6eefa",
        "size": "M8",
        "shape": "u-square",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "radius": 1.5,
          "widths": [
            50,
            60,
            80
          ],
          "lengths": [
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 8,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "ae0ab9dd-8ad8-421b-9d7d-fb3f51763302",
        "size": "M8 / w90",
        "shape": "u-square",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "radius": 1.5,
          "widths": [
            90
          ],
          "lengths": [
            225
          ],
          "diameter": 8,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      }
    ]
  },
  {
    "slug": "j-type-bolt",
    "title": "J type bolt",
    "description": "J type bolt requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "https://ftis.b-cdn.net/product-images/483f1aab-2d4f-4e50-b40c-374b5c244204/d9d02286-c325-4b1e-9bfc-161e152a9aac.jpg",
    "hasPublishedPhoto": true,
    "drawingsCount": 6,
    "standards": [
      "IS 730:1978"
    ],
    "shapes": [
      "j-i",
      "j-ii"
    ],
    "sizes": [
      "M10",
      "M6",
      "M8"
    ],
    "diameters": [
      6,
      8,
      10
    ],
    "lengths": [
      70,
      80,
      90,
      100,
      110,
      120,
      130,
      140,
      150,
      160,
      170,
      180,
      190,
      200
    ],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": [
      {
        "id": "f8daf3a3-67e4-4400-a146-6006d9276aad",
        "size": "M10",
        "shape": "j-i",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 20,
          "radius": 4,
          "widths": [
            16
          ],
          "lengths": [
            70,
            80,
            90,
            100,
            110,
            120,
            130,
            140,
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 10,
          "thread_base": 25
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "2535aeaf-794e-4157-b3fc-c4aef79a0d63",
        "size": "M6",
        "shape": "j-i",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 15,
          "radius": 4,
          "widths": [
            12
          ],
          "lengths": [
            70,
            80,
            90,
            100,
            110,
            120,
            130,
            140,
            150
          ],
          "diameter": 6,
          "thread_base": 25
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "7572f8ba-c50c-48b1-8fc0-8cbffeb3a619",
        "size": "M8",
        "shape": "j-i",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 20,
          "radius": 4,
          "widths": [
            14
          ],
          "lengths": [
            70,
            80,
            90,
            100,
            110,
            120,
            130,
            140,
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 8,
          "thread_base": 25
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "f18e9ca3-5ea1-4cf3-b7c3-537fe3a7a437",
        "size": "M10",
        "shape": "j-ii",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 20,
          "radius": 4,
          "widths": [],
          "lengths": [],
          "diameter": 10,
          "thread_base": 25
        },
        "notes": "Round form: radius and return dimensions supplied by purchaser."
      },
      {
        "id": "c8881b2c-fca6-4800-9d37-9261b4d9b867",
        "size": "M6",
        "shape": "j-ii",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 15,
          "radius": 4,
          "widths": [],
          "lengths": [],
          "diameter": 6,
          "thread_base": 25
        },
        "notes": "Round form: radius and return dimensions supplied by purchaser."
      },
      {
        "id": "b8c725de-6c36-484d-becc-d62c90a1e58d",
        "size": "M8",
        "shape": "j-ii",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 20,
          "radius": 4,
          "widths": [],
          "lengths": [],
          "diameter": 8,
          "thread_base": 25
        },
        "notes": "Round form: radius and return dimensions supplied by purchaser."
      }
    ]
  },
  {
    "slug": "l-bolt",
    "title": "L type bolt",
    "description": "L type bolt requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "https://ftis.b-cdn.net/product-images/f39613ed-e49e-4420-ac68-6b7f391535fd/f4ebb166-752a-4a11-a1b3-0f4500720a86.jpg",
    "hasPublishedPhoto": true,
    "drawingsCount": 6,
    "standards": [
      "IS 730:1978"
    ],
    "shapes": [
      "l"
    ],
    "sizes": [
      "M10 / w110",
      "M10 / w80",
      "M10 / w95",
      "M8 / w50",
      "M8 / w60",
      "M8 / w70"
    ],
    "diameters": [
      8,
      10
    ],
    "lengths": [
      120,
      130,
      140,
      150,
      160,
      170,
      180,
      190,
      200,
      225
    ],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": [
      {
        "id": "b9d37df3-dea7-4394-954f-7fc11d63e185",
        "size": "M10 / w110",
        "shape": "l",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 30,
          "radius": 1.5,
          "widths": [
            110
          ],
          "lengths": [
            180,
            190,
            200,
            225
          ],
          "diameter": 10,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "b8151603-3945-4361-84ce-4d233b78e666",
        "size": "M10 / w80",
        "shape": "l",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 25,
          "radius": 1.5,
          "widths": [
            80
          ],
          "lengths": [
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 10,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "e29df1f5-7cd2-4865-99aa-68dcbf001c0c",
        "size": "M10 / w95",
        "shape": "l",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 25,
          "radius": 1.5,
          "widths": [
            95
          ],
          "lengths": [
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 10,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "9e892a24-a3ae-4e4f-b625-b02a8f76ebd0",
        "size": "M8 / w50",
        "shape": "l",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 20,
          "radius": 1.5,
          "widths": [
            50
          ],
          "lengths": [
            120,
            130,
            140,
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 8,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "e9557cf8-3814-461d-ad50-a626bf6c3728",
        "size": "M8 / w60",
        "shape": "l",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 20,
          "radius": 1.5,
          "widths": [
            60
          ],
          "lengths": [
            120,
            130,
            140,
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 8,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      },
      {
        "id": "1ea34a1e-52ad-4f8f-b374-38e101554959",
        "size": "M8 / w70",
        "shape": "l",
        "standard": "IS 730",
        "edition": "1978",
        "dimensions": {
          "depth": 20,
          "radius": 1.5,
          "widths": [
            70
          ],
          "lengths": [
            120,
            130,
            140,
            150,
            160,
            170,
            180,
            190,
            200
          ],
          "diameter": 8,
          "thread_base": 30
        },
        "notes": "Source dimensions only. Tilt angle, nuts and thread profiles remain schematic."
      }
    ]
  },
  {
    "slug": "coach-screw",
    "title": "Coach screw",
    "description": "Coach screw requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "https://ftis.b-cdn.net/product-images/18e0972d-5afc-4e54-93c2-ed78b7392dd4/58125d5d-7a32-45ab-9a21-df43270e5054.jpg",
    "hasPublishedPhoto": true,
    "drawingsCount": 6,
    "standards": [
      "IS 1120:1975"
    ],
    "shapes": [
      "coach"
    ],
    "sizes": [
      "No. 10",
      "No. 14",
      "No. 18",
      "No. 24",
      "No. 28",
      "No. 32"
    ],
    "diameters": [
      4.88,
      6.3,
      7.72,
      9.86,
      11.28,
      12.7
    ],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": [
      {
        "id": "e6d03e11-4e2a-4b88-a741-c76dccf086cd",
        "size": "No. 10",
        "shape": "coach",
        "standard": "IS 1120",
        "edition": "1975",
        "dimensions": {
          "pitch": 2.12,
          "widths": [],
          "lengths": [],
          "diameter": 4.88,
          "head_width": 8,
          "head_height": 3.5
        },
        "notes": "Nominal dimensions transcribed from scan. No.14 head-height nominal 4 differs from printed 4.38?4.62 range; retained as supplied."
      },
      {
        "id": "7cd79939-4be5-4d77-abfb-487b0f10cc19",
        "size": "No. 14",
        "shape": "coach",
        "standard": "IS 1120",
        "edition": "1975",
        "dimensions": {
          "pitch": 2.82,
          "widths": [],
          "lengths": [],
          "diameter": 6.3,
          "head_width": 10,
          "head_height": 4
        },
        "notes": "Nominal dimensions transcribed from scan. No.14 head-height nominal 4 differs from printed 4.38?4.62 range; retained as supplied."
      },
      {
        "id": "ec454c1b-0f5d-405f-b450-06e483c38abf",
        "size": "No. 18",
        "shape": "coach",
        "standard": "IS 1120",
        "edition": "1975",
        "dimensions": {
          "pitch": 3.39,
          "widths": [],
          "lengths": [],
          "diameter": 7.72,
          "head_width": 13,
          "head_height": 5.5
        },
        "notes": "Nominal dimensions transcribed from scan. No.14 head-height nominal 4 differs from printed 4.38?4.62 range; retained as supplied."
      },
      {
        "id": "3b2ec06c-badb-49ac-91ca-bf94427f3a34",
        "size": "No. 24",
        "shape": "coach",
        "standard": "IS 1120",
        "edition": "1975",
        "dimensions": {
          "pitch": 4.23,
          "widths": [],
          "lengths": [],
          "diameter": 9.86,
          "head_width": 17,
          "head_height": 7
        },
        "notes": "Nominal dimensions transcribed from scan. No.14 head-height nominal 4 differs from printed 4.38?4.62 range; retained as supplied."
      },
      {
        "id": "a0622e0c-de4f-44cb-8943-a03f5c1aac01",
        "size": "No. 28",
        "shape": "coach",
        "standard": "IS 1120",
        "edition": "1975",
        "dimensions": {
          "pitch": 4.62,
          "widths": [],
          "lengths": [],
          "diameter": 11.28,
          "head_width": 19,
          "head_height": 8
        },
        "notes": "Nominal dimensions transcribed from scan. No.14 head-height nominal 4 differs from printed 4.38?4.62 range; retained as supplied."
      },
      {
        "id": "8807b70e-c84b-4144-a053-a35887e12250",
        "size": "No. 32",
        "shape": "coach",
        "standard": "IS 1120",
        "edition": "1975",
        "dimensions": {
          "pitch": 5.08,
          "widths": [],
          "lengths": [],
          "diameter": 12.7,
          "head_width": 24,
          "head_height": 10
        },
        "notes": "Nominal dimensions transcribed from scan. No.14 head-height nominal 4 differs from printed 4.38?4.62 range; retained as supplied."
      }
    ]
  },
  {
    "slug": "heavy-hex-bolt",
    "title": "Heavy Hex bolt",
    "description": "Heavy Hex bolt requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "heavy-hex-nut",
    "title": "Heavy Hex nut",
    "description": "Heavy Hex nut requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "j-hook",
    "title": "J hook",
    "description": "J hook requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "square-j-bolt",
    "title": "Sq type J bolt",
    "description": "Sq type J bolt requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "plain-washer",
    "title": "Plain washer",
    "description": "Plain washer requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "machined-washer",
    "title": "Machined washer",
    "description": "Machined washer requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "spring-washer",
    "title": "Spring washer",
    "description": "Spring washer requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "square-washer",
    "title": "Square washer",
    "description": "Square washer requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "dti-washer",
    "title": "DTI washer",
    "description": "DTI washer requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "square-nut",
    "title": "Square nut",
    "description": "Square nut requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  },
  {
    "slug": "square-plate",
    "title": "Sq.plate",
    "description": "Sq.plate requirements can be configured against published standards and drawings. Confirm material, grade, thread, finish, dimensions and availability with FTI when requesting a quotation.",
    "imageUrl": "",
    "hasPublishedPhoto": false,
    "drawingsCount": 0,
    "standards": [],
    "shapes": [],
    "sizes": [],
    "diameters": [],
    "lengths": [],
    "grades": [
      "MS",
      "LC",
      "CHQ",
      "EN-8D",
      "Boron",
      "SAE-4140",
      "EN-19",
      "SPL 8.8",
      "SPL 10.9",
      "SPL 12.9"
    ],
    "threads": [
      "BSW",
      "UNC",
      "UNF",
      "Coarse metric",
      "Coarse inch"
    ],
    "finishes": [
      "Auto black",
      "Zinc plating",
      "Hot dip galvanizing",
      "Zinc flake"
    ],
    "specifications": [],
    "sampleDrawings": []
  }
];

export interface TractorPartItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  description: string;
  sku: string;
  uom: string;
  minOrderQty: number;
  imageUrl: string;
}

export const FTI_TRACTOR_PARTS: TractorPartItem[] = [
  {
    "id": "8a42104c-bba3-4910-aea7-ad92e243e32b",
    "name": "Piston with rings & pin",
    "slug": "fti-agri-xlsx-piston-with-rings-pin",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-001",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-piston-with-rings-pin/e815b4e40095b43c3de8.png"
  },
  {
    "id": "fba7374a-7705-43e1-beda-8a1f4aa048ba",
    "name": "Cylinder liner",
    "slug": "fti-agri-xlsx-cylinder-liner",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-002",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-cylinder-liner/6dadd1ff1cc003763199.png"
  },
  {
    "id": "12153353-3384-430a-9260-b935991b1429",
    "name": "Piston ring set",
    "slug": "fti-agri-xlsx-piston-ring-set",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-003",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-piston-ring-set/6dadd1ff1cc003763199.png"
  },
  {
    "id": "911132b0-2fa7-45e9-afef-59db0410a052",
    "name": "Engine overhaul kit",
    "slug": "fti-agri-xlsx-engine-overhaul-kit",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-004",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-engine-overhaul-kit/e815b4e40095b43c3de8.png"
  },
  {
    "id": "50ee7257-d3b0-4797-a7fd-7134c01bef10",
    "name": "Connecting rod assembly",
    "slug": "fti-agri-xlsx-connecting-rod-assembly",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-005",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-connecting-rod-assembly/e815b4e40095b43c3de8.png"
  },
  {
    "id": "e8594df0-e019-4a63-9ca4-d531386a4ca6",
    "name": "Main/connecting-rod bearing set",
    "slug": "fti-agri-xlsx-main-connecting-rod-bearing-set",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-006",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-main-connecting-rod-bearing-set/644931fd23349a75f781.png"
  },
  {
    "id": "36774988-a22d-46fe-90e8-41d5bccd1e70",
    "name": "Cylinder head gasket",
    "slug": "fti-agri-xlsx-cylinder-head-gasket",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-007",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-cylinder-head-gasket/e815b4e40095b43c3de8.png"
  },
  {
    "id": "866b3156-8305-4434-bad1-997b7c3a87d0",
    "name": "Complete cylinder head",
    "slug": "fti-agri-xlsx-complete-cylinder-head",
    "category": "Engine",
    "categoryId": "d5b6db36-448b-4fcf-a714-bd7b95917209",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-008",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-complete-cylinder-head/e815b4e40095b43c3de8.png"
  },
  {
    "id": "590a64d8-8060-4e5f-9672-c6436bdf454f",
    "name": "Engine oil filter",
    "slug": "fti-agri-xlsx-engine-oil-filter",
    "category": "Filters",
    "categoryId": "5b1e58cc-29c3-4593-9074-cc00e9eef80f",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-009",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-engine-oil-filter/01bc9b418a57d00653de.png"
  },
  {
    "id": "bf63a573-00ef-43ab-99f2-a9ff7db4c91b",
    "name": "Air cleaner element",
    "slug": "fti-agri-xlsx-air-cleaner-element",
    "category": "Filters",
    "categoryId": "5b1e58cc-29c3-4593-9074-cc00e9eef80f",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-010",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-air-cleaner-element/2f4cd9f69d4e7c71b31e.png"
  },
  {
    "id": "23a28c0c-27ef-46f6-ace8-870608a16198",
    "name": "Fuel filter element",
    "slug": "fti-agri-xlsx-fuel-filter-element",
    "category": "Filters",
    "categoryId": "5b1e58cc-29c3-4593-9074-cc00e9eef80f",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-011",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-fuel-filter-element/860857e6c8318fe1bab4.png"
  },
  {
    "id": "34a37b79-f250-4fd0-81a4-0d6090cc0656",
    "name": "Fuel lift/feed pump",
    "slug": "fti-agri-xlsx-fuel-lift-feed-pump",
    "category": "Fuel system",
    "categoryId": "bf9ca03f-39f7-4699-bc41-62d2cfeb9cea",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-012",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-fuel-lift-feed-pump/860857e6c8318fe1bab4.png"
  },
  {
    "id": "0a30e52d-75a4-4ec2-b70d-df38eb0a2dc3",
    "name": "Injector nozzle",
    "slug": "fti-agri-xlsx-injector-nozzle",
    "category": "Fuel system",
    "categoryId": "bf9ca03f-39f7-4699-bc41-62d2cfeb9cea",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-013",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-injector-nozzle/860857e6c8318fe1bab4.png"
  },
  {
    "id": "b7d1c8bb-0393-4ad3-a435-245c4fe1db01",
    "name": "Fuel injection pump",
    "slug": "fti-agri-xlsx-fuel-injection-pump",
    "category": "Fuel system",
    "categoryId": "bf9ca03f-39f7-4699-bc41-62d2cfeb9cea",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-014",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-fuel-injection-pump/860857e6c8318fe1bab4.png"
  },
  {
    "id": "299faba3-bd6d-4451-8638-0c36c06fd467",
    "name": "Clutch disc / driven plate",
    "slug": "fti-agri-xlsx-clutch-disc-driven-plate",
    "category": "Clutch",
    "categoryId": "d65a485f-a5f4-4a0a-9f4d-4585f2927a14",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-015",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-clutch-disc-driven-plate/f380f3456f61733cdeea.png"
  },
  {
    "id": "1fab9c7c-1bca-43a7-9557-56d4d64d2bf4",
    "name": "Clutch pressure plate / cover",
    "slug": "fti-agri-xlsx-clutch-pressure-plate-cover",
    "category": "Clutch",
    "categoryId": "d65a485f-a5f4-4a0a-9f4d-4585f2927a14",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-016",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-clutch-pressure-plate-cover/2c8e6a57df97582e2f87.png"
  },
  {
    "id": "82977b72-be2f-42f1-beff-aff12ff05b60",
    "name": "Clutch release bearing",
    "slug": "fti-agri-xlsx-clutch-release-bearing",
    "category": "Clutch",
    "categoryId": "d65a485f-a5f4-4a0a-9f4d-4585f2927a14",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-017",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-clutch-release-bearing/644931fd23349a75f781.png"
  },
  {
    "id": "c22637c5-eaea-4ac2-b15b-adf0a3007340",
    "name": "Clutch assembly / set",
    "slug": "fti-agri-xlsx-clutch-assembly-set",
    "category": "Clutch",
    "categoryId": "d65a485f-a5f4-4a0a-9f4d-4585f2927a14",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-018",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-clutch-assembly-set/f380f3456f61733cdeea.png"
  },
  {
    "id": "19a71118-8816-4080-be72-524da314f77d",
    "name": "Gearbox gear set",
    "slug": "fti-agri-xlsx-gearbox-gear-set",
    "category": "Transmission",
    "categoryId": "c5f43cb2-4ce0-4b5f-9958-8d81270c2760",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-019",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-gearbox-gear-set/644931fd23349a75f781.png"
  },
  {
    "id": "5200be8f-de99-4198-ac36-61acbe8fdfc0",
    "name": "Transmission input shaft",
    "slug": "fti-agri-xlsx-transmission-input-shaft",
    "category": "Transmission",
    "categoryId": "c5f43cb2-4ce0-4b5f-9958-8d81270c2760",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-020",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-transmission-input-shaft/644931fd23349a75f781.png"
  },
  {
    "id": "9322f389-92e4-4112-83ae-ac56e0a2082a",
    "name": "PTO shaft",
    "slug": "fti-agri-xlsx-pto-shaft",
    "category": "Transmission/PTO",
    "categoryId": "b5774667-1b0c-4807-90fe-17648d6330cb",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-021",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-pto-shaft/644931fd23349a75f781.png"
  },
  {
    "id": "bf1559e0-c02a-429f-9256-c50c21537c14",
    "name": "Differential crown wheel & pinion",
    "slug": "fti-agri-xlsx-differential-crown-wheel-pinion",
    "category": "Differential",
    "categoryId": "19adb7da-aea0-4657-98e0-cc88d4d987ca",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-022",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-differential-crown-wheel-pinion/644931fd23349a75f781.png"
  },
  {
    "id": "276b06a3-2bdd-4271-b850-0a056ba3fa29",
    "name": "Front wheel bearing",
    "slug": "fti-agri-xlsx-front-wheel-bearing",
    "category": "Axle & steering",
    "categoryId": "90e46d06-b62d-49f3-bb1f-ff3ea287ed60",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-023",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-front-wheel-bearing/644931fd23349a75f781.png"
  },
  {
    "id": "90e0898c-2ff2-49e5-a0bb-80f4d7e8e25b",
    "name": "Front wheel hub",
    "slug": "fti-agri-xlsx-front-wheel-hub",
    "category": "Axle & steering",
    "categoryId": "90e46d06-b62d-49f3-bb1f-ff3ea287ed60",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-024",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-front-wheel-hub/644931fd23349a75f781.png"
  },
  {
    "id": "5f0961d8-0ff5-49b4-849c-c9182705a80c",
    "name": "King pin & bush kit",
    "slug": "fti-agri-xlsx-king-pin-bush-kit",
    "category": "Axle & steering",
    "categoryId": "90e46d06-b62d-49f3-bb1f-ff3ea287ed60",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-025",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-king-pin-bush-kit/644931fd23349a75f781.png"
  },
  {
    "id": "6faa8909-b576-448a-a1e7-1175c1d0a97a",
    "name": "Tie rod end / ball joint",
    "slug": "fti-agri-xlsx-tie-rod-end-ball-joint",
    "category": "Axle & steering",
    "categoryId": "90e46d06-b62d-49f3-bb1f-ff3ea287ed60",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-026",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-tie-rod-end-ball-joint/644931fd23349a75f781.png"
  },
  {
    "id": "ebfad4be-62b3-410f-a0e1-bff284b9a9d2",
    "name": "Steering pump",
    "slug": "fti-agri-xlsx-steering-pump",
    "category": "Steering",
    "categoryId": "8aed6d84-d6b0-458d-8b55-d78aeb8c479c",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-027",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-steering-pump/6d8e899a515498e07b73.png"
  },
  {
    "id": "bec98390-0164-46ca-b460-4f5a59c3016f",
    "name": "Hydraulic lift pump",
    "slug": "fti-agri-xlsx-hydraulic-lift-pump",
    "category": "Hydraulics",
    "categoryId": "4e758806-d621-4e2f-a674-5c9de37c8316",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-028",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-hydraulic-lift-pump/6d8e899a515498e07b73.png"
  },
  {
    "id": "29dcf9d1-17ff-46e2-a0d3-ffd262b1b3c0",
    "name": "Hydraulic control valve",
    "slug": "fti-agri-xlsx-hydraulic-control-valve",
    "category": "Hydraulics",
    "categoryId": "4e758806-d621-4e2f-a674-5c9de37c8316",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-029",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-hydraulic-control-valve/6d8e899a515498e07b73.png"
  },
  {
    "id": "6e903eb6-5c30-4ca0-a534-bcec8efe2d2a",
    "name": "Hydraulic lift cylinder / ram",
    "slug": "fti-agri-xlsx-hydraulic-lift-cylinder-ram",
    "category": "Hydraulics",
    "categoryId": "4e758806-d621-4e2f-a674-5c9de37c8316",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-030",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-hydraulic-lift-cylinder-ram/6d8e899a515498e07b73.png"
  },
  {
    "id": "687cc549-3a90-44f5-b2d2-3e21fd4586da",
    "name": "Hydraulic filter",
    "slug": "fti-agri-xlsx-hydraulic-filter",
    "category": "Hydraulics",
    "categoryId": "4e758806-d621-4e2f-a674-5c9de37c8316",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-031",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-hydraulic-filter/01bc9b418a57d00653de.png"
  },
  {
    "id": "954c0870-2ff9-43f1-93c9-8590696e4b06",
    "name": "Brake shoe / brake lining set",
    "slug": "fti-agri-xlsx-brake-shoe-brake-lining-set",
    "category": "Brakes",
    "categoryId": "e1af6467-b983-4e66-af00-97a2978d7a71",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-032",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-brake-shoe-brake-lining-set/7abb81ffe690bc43c14a.png"
  },
  {
    "id": "945b1a56-b295-4915-aa6b-17058f55194e",
    "name": "Brake disc / plate",
    "slug": "fti-agri-xlsx-brake-disc-plate",
    "category": "Brakes",
    "categoryId": "e1af6467-b983-4e66-af00-97a2978d7a71",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-033",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-brake-disc-plate/7abb81ffe690bc43c14a.png"
  },
  {
    "id": "74b85d8a-2925-4785-8195-87c9b9c67c6d",
    "name": "Brake master/actuator assembly",
    "slug": "fti-agri-xlsx-brake-master-actuator-assembly",
    "category": "Brakes",
    "categoryId": "e1af6467-b983-4e66-af00-97a2978d7a71",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-034",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-brake-master-actuator-assembly/7abb81ffe690bc43c14a.png"
  },
  {
    "id": "74f63730-d1a7-44eb-8780-59576b58a32c",
    "name": "Starter motor",
    "slug": "fti-agri-xlsx-starter-motor",
    "category": "Electrical",
    "categoryId": "528f40e6-02cf-46b3-900f-0887cbb01b9a",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-035",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-starter-motor/32151a5e8c45d0f54b75.png"
  },
  {
    "id": "0a25e5df-3856-45d1-93fa-d3b8047992d6",
    "name": "Alternator",
    "slug": "fti-agri-xlsx-alternator",
    "category": "Electrical",
    "categoryId": "528f40e6-02cf-46b3-900f-0887cbb01b9a",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-036",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-alternator/211263514ae2a5909b42.png"
  },
  {
    "id": "0efc2594-8787-456e-b704-cb3c6032a5fb",
    "name": "Voltage regulator",
    "slug": "fti-agri-xlsx-voltage-regulator",
    "category": "Electrical",
    "categoryId": "528f40e6-02cf-46b3-900f-0887cbb01b9a",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-037",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-voltage-regulator/211263514ae2a5909b42.png"
  },
  {
    "id": "fa03ecca-648c-424f-9407-7bd49b5cd782",
    "name": "Head lamp assembly",
    "slug": "fti-agri-xlsx-head-lamp-assembly",
    "category": "Electrical/body",
    "categoryId": "712fb9af-e204-41f2-8091-5fcd2dc21015",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-038",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-head-lamp-assembly/211263514ae2a5909b42.png"
  },
  {
    "id": "200889e3-5849-4c49-85bc-58e43cead48e",
    "name": "Radiator",
    "slug": "fti-agri-xlsx-radiator",
    "category": "Cooling",
    "categoryId": "0e73bbab-167b-423c-9311-33944e177da2",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-039",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-radiator/e815b4e40095b43c3de8.png"
  },
  {
    "id": "b7a5a0d2-68eb-4c43-9ccf-a337b590833d",
    "name": "Water pump",
    "slug": "fti-agri-xlsx-water-pump",
    "category": "Cooling",
    "categoryId": "0e73bbab-167b-423c-9311-33944e177da2",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-040",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-water-pump/e815b4e40095b43c3de8.png"
  },
  {
    "id": "a9caac27-f4de-4070-b7e6-49a09cda0c88",
    "name": "Thermostat",
    "slug": "fti-agri-xlsx-thermostat",
    "category": "Cooling",
    "categoryId": "0e73bbab-167b-423c-9311-33944e177da2",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-041",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-thermostat/e815b4e40095b43c3de8.png"
  },
  {
    "id": "e9b16e07-7532-459d-b31e-fb0df35407d4",
    "name": "Fan belt",
    "slug": "fti-agri-xlsx-fan-belt",
    "category": "Cooling",
    "categoryId": "0e73bbab-167b-423c-9311-33944e177da2",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-042",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-fan-belt/e815b4e40095b43c3de8.png"
  },
  {
    "id": "155d4aba-5a01-4f02-a333-da343abaf141",
    "name": "Seat assembly",
    "slug": "fti-agri-xlsx-seat-assembly",
    "category": "Body & operator",
    "categoryId": "395de36f-8dff-4ffb-b09c-27fc7f6f4169",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-043",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-seat-assembly/32151a5e8c45d0f54b75.png"
  },
  {
    "id": "663023e3-be7d-48f9-9b76-d8bba591022f",
    "name": "Bonnet / hood panel",
    "slug": "fti-agri-xlsx-bonnet-hood-panel",
    "category": "Body & operator",
    "categoryId": "395de36f-8dff-4ffb-b09c-27fc7f6f4169",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-044",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-bonnet-hood-panel/32151a5e8c45d0f54b75.png"
  },
  {
    "id": "97a01ce3-a91e-44d0-965b-4190e8515f09",
    "name": "Fender / mudguard",
    "slug": "fti-agri-xlsx-fender-mudguard",
    "category": "Body & operator",
    "categoryId": "395de36f-8dff-4ffb-b09c-27fc7f6f4169",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-045",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-fender-mudguard/32151a5e8c45d0f54b75.png"
  },
  {
    "id": "ad9f225d-6533-4f1c-b919-06a10a5523f1",
    "name": "Silencer / exhaust assembly",
    "slug": "fti-agri-xlsx-silencer-exhaust-assembly",
    "category": "Exhaust",
    "categoryId": "29dd707a-ac17-4412-b974-df6c97fe4297",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-046",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-silencer-exhaust-assembly/e815b4e40095b43c3de8.png"
  },
  {
    "id": "cb51754c-945a-438d-8065-67993518026e",
    "name": "Drawbar / hitch components",
    "slug": "fti-agri-xlsx-drawbar-hitch-components",
    "category": "Linkage",
    "categoryId": "832594ee-4f54-4a5c-bf8d-e29bad4833e6",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-047",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-drawbar-hitch-components/644931fd23349a75f781.png"
  },
  {
    "id": "04f98d94-efd4-4660-99a2-eb29b128616d",
    "name": "Lift arm / lower link",
    "slug": "fti-agri-xlsx-lift-arm-lower-link",
    "category": "Linkage",
    "categoryId": "832594ee-4f54-4a5c-bf8d-e29bad4833e6",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-048",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-lift-arm-lower-link/644931fd23349a75f781.png"
  },
  {
    "id": "db4f4dcd-9fa0-4486-8309-2b0e187290c8",
    "name": "Wheel rim",
    "slug": "fti-agri-xlsx-wheel-rim",
    "category": "Wheels & tyres",
    "categoryId": "a2d34023-8a46-4415-a16b-b386e66a4b7a",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-049",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-wheel-rim/644931fd23349a75f781.png"
  },
  {
    "id": "699e1292-6798-49e8-92e3-11fa86af13fc",
    "name": "Wheel hub seal / oil seal",
    "slug": "fti-agri-xlsx-wheel-hub-seal-oil-seal",
    "category": "Seals & bearings",
    "categoryId": "a130b599-1af6-4c75-bc3a-68caf1e821b1",
    "description": "Tractor spare part reference. Confirm exact model, fitment and piece/set quantity with FTI before ordering. Price on request.",
    "sku": "FTI-AGRI-XLSX-050",
    "uom": "piece",
    "minOrderQty": 1,
    "imageUrl": "https://ftis.b-cdn.net/tractor-workbook-images/fti-agri-xlsx-wheel-hub-seal-oil-seal/644931fd23349a75f781.png"
  }
];

export const FTI_TRACTOR_CATEGORIES: string[] = [
  "Axle & steering",
  "Body & operator",
  "Brakes",
  "Clutch",
  "Cooling",
  "Differential",
  "Electrical",
  "Electrical/body",
  "Engine",
  "Exhaust",
  "Filters",
  "Fuel system",
  "Hydraulics",
  "Linkage",
  "Seals & bearings",
  "Steering",
  "Transmission",
  "Transmission/PTO",
  "Wheels & tyres"
];

export const FTI_TMT_BRANDS: string[] = [
  "AWADH TMT",
  "BALSHALI 550D",
  "HR PLATINUM",
  "MAJHI TMT",
  "RATHI TMT",
  "SMS TMT",
  "STAR TMT",
  "SUPERX TMT",
  "ZARA TMT",
  "ZEE CON TMT"
];
