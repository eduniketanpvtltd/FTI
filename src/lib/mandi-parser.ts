import { MarketMaterial, MandiBulletinData, MovementDirection } from '@/types';

export const DEFAULT_MANDI_BULLETIN_TEXT = `_🗓️ 28-🄾🄲🅃🄾🄱🄴🅁-2026_
_⏰12:00_   📉📉📉📉
_*🇺🇸1($)*= *95.04(₹)🇮🇳*_

FIELDFAST TECH INTERNATIONAL 
--------------------------------------
*_Mandi Gobindgarhᵀʳᵉⁿᵈ ᵈᵒʷⁿʷᵃʳᵈˢ💬_*
_Billet Price ᵃˢᵗ=> ₹46,300 (-200)🔻_
_*Ingot Price ᵃˢᵗ=> ₹46,300 (-200)🔻*_
_Old Scrap ᵃˢᵗ=> ₹33,600 (-300)🔻_
_Melting Scrap ᵃˢᵗ=> ₹37,100 (-300)🔻_

*_Ingot💬_*
--------------------------------------
*_Ludhiana (EN8D) ᵃˢᵗ= ₹46,900 (-100)🔻_*
_Ludhiana(MS) ᵃˢᵗ= ₹46,500 *(-100)🔻*_
_Muzaffarnagar ᵃˢᵗ= ₹44,800 *(+300)🔼*_
_Himachal ᵃˢᵗ= ₹45,300 *(-200)🔻*_
_Jammu ᵃˢᵗ= ₹45,800 *(-200)🔻*_
_Raigarh ᵃˢᵗ= ₹42,300 *(-600)🔻*_
_Raipur ᵃˢᵗ= ₹42,600 *(-200)🔻*_
_Ghaziabad ᵃˢᵗ= ₹44,900 *(+100)🔼*_
_Hyderabad ᵃˢᵗ=> ₹45,100 *(0)⏺️*_
_Jaipur ᵃˢᵗ= ₹45,000 *(0)⏺️*_
_Bhiwadi ᵃˢᵗ= ₹45,400 *(0)⏺️*_
_Durgapur ᵃˢᵗ= ₹43,000 *(-400)🔻*_
_Kolkatta ᵃˢᵗ= ₹43,200 *(-400)🔻*_
_Rourkela ᵃˢᵗ=> ₹41,800 *(0)⏺️*_
_Bhavnagar ᵃˢᵗ=> ₹45,500 *(-300)🔻*_

*_Scrap💬_*
--------------------------------------
_*Mandi Gobindgarh ᵃˢᵗ= ₹33,600 (-300)🔻*(OLD)_
_Mandi Melting ᵃˢᵗ = ₹37,100 (-300)🔻_
_*Ludhiana ᵃˢᵗ = ₹38,900 (-100)🔻*_
_Muzaffarnagar ᵃˢᵗ= ₹38,200 *(-200)🔻*_
_Raipur ᵃˢᵗ=> ₹37,400 *(-400)🔻*_
_Durgapur ᵃˢᵗ => ₹35,800 *(-1000)🔻*_
_Kolkatta ᵃˢᵗ => ₹36,300 *(-1000)🔻*_
_Ghaziabad ᵃˢᵗ => ₹36,700 *(0)⏺️*_
_Bhavnagar ᵃˢᵗ = ₹37,500 *(0)⏺️*_
_Jaipur ᵃˢᵗ=> ₹33,500 *(0)⏺️*_

*Billet*💬
--------------------------------------
_Muzaffarnagar ᵃˢᵗ= ₹45,000 *(-400)🔻*_
_Ghaziabad ᵃˢᵗ=> ₹45,300 *(+100)🔼*_
_Chennai ᵃˢᵗ=> ₹47,000 *(0)⏺️*_
_Raipur ᵃˢᵗ=> ₹43,000 *(-200)🔻*_
_Jaipur ᵃˢᵗ=> ₹45,400 *(0)⏺️*_
_Hyderabad ᵃˢᵗ=> ₹45,000 *(-500)🔻*_
_Durgapur ᵃˢᵗ=> ₹43,600 *(-200)🔻*_
_Kolkatta ᵃˢᵗ=> ₹43,800 *(-200)🔻*_
_Bhavnagar ᵃˢᵗ=> ₹45,900 *(-200)🔻*_
======================
*_Note_*
*_# All Rates Are Quoted,Estimated(As per Rumours)_*
*_#All Rates Are P.m.t ,Spot & only information not any offer for sale & purchase._*
*_#We are not responsible for any profit or loss._*
*_#💯% Reliability and Top Service_*
*_# Best Service, Right Time, Right People_*
_# Support 24×7 +91-9780830333
===================
*_👉🏻 SMS ALERTS💬_*
_📲 +91-9780830333
===================
*_👉🏻Whatsapp Alerts💬_*
_📲 +91-9780830333
_📲 +91-9589971567
===================`;

/**
 * Normalizes Unicode enclosed characters (like 🄾🄲🅃🄾🄱🄴🅁) to regular ASCII uppercase
 */
export function normalizeSpecialText(s: string): string {
  return Array.from(s)
    .map((char) => {
      const cp = char.codePointAt(0) || 0;
      // Squared Latin Capitals 0x1F130 - 0x1F149
      if (cp >= 0x1F130 && cp <= 0x1F149) {
        return String.fromCharCode(cp - 0x1F130 + 65);
      }
      // Negative squared latin capitals 0x1F170 - 0x1F189
      if (cp >= 0x1F170 && cp <= 0x1F189) {
        return String.fromCharCode(cp - 0x1F170 + 65);
      }
      return char;
    })
    .join('');
}

/**
 * Generate exactly 50 historical price records ending at current price
 */
export function generateHistoryForMandi(
  basePrice: number,
  recordsCount: number = 50,
  volatilityRatio: number = 0.012,
  seedStr: string = 'mandi'
) {
  const points = [];
  const now = new Date();

  // Deterministic seed hash
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed << 5) - seed + seedStr.charCodeAt(i);
    seed |= 0;
  }
  const pseudoRand = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  // Generate 50 sessions ending at basePrice
  const rawPrices: number[] = [];
  let p = basePrice;
  rawPrices.unshift(p);

  for (let i = 1; i < recordsCount; i++) {
    const rand = pseudoRand(i * 7);
    const delta = (rand - 0.48) * (basePrice * volatilityRatio);
    p = Math.round((p - delta) / 50) * 50;
    p = Math.max(Math.round(basePrice * 0.78), Math.min(Math.round(basePrice * 1.25), p));
    rawPrices.unshift(p);
  }

  rawPrices[rawPrices.length - 1] = basePrice;

  for (let i = 0; i < rawPrices.length; i++) {
    const daysAgo = recordsCount - 1 - i;
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const price = rawPrices[i];
    const prevPrice = i > 0 ? rawPrices[i - 1] : Math.round((price * 0.995) / 50) * 50;
    const priceChange = price - prevPrice;
    const percentageChange = prevPrice > 0 ? Number(((priceChange / prevPrice) * 100).toFixed(2)) : 0;
    const movementDirection: MovementDirection =
      priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral';

    points.push({
      date: d.toISOString().split('T')[0],
      timestamp: d.getTime(),
      price,
      previousPrice: prevPrice,
      priceChange,
      percentageChange,
      movementDirection,
      notes: `Session ${i + 1} of ${recordsCount} - Mandi Close`,
    });
  }

  return points;
}

/**
 * Robust parser for Mandi WhatsApp broadcast messages with 3-level hierarchy:
 * Level 1: mainCategory ('raw_materials' | 'scrap_materials')
 * Level 2: materialName (Ingot, Billet, TMT, Melting Scrap, Old Scrap, HMS, etc.)
 * Level 3: mandiCity (Prices across Mandi Gobindgarh, Ludhiana, Raipur, Muzaffarnagar, etc.)
 */
export function parseMandiBroadcast(
  rawText: string
): { bulletin: MandiBulletinData; materials: MarketMaterial[] } {
  const normalized = normalizeSpecialText(rawText);
  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);

  let dateStr = '28-OCTOBER-2026';
  let timeStr = '12:00';
  let usdInrRate = 95.04;
  let overallTrend: 'up' | 'down' | 'neutral' = 'down';
  let trendText = 'Mandi Gobindgarh Trend downwards';
  const supportPhone = '+91-9780830333';
  const smsPhones = ['+91-9780830333'];
  const whatsappPhones = ['+91-9780830333', '+91-9589971567'];

  let currentCategory: 'header' | 'benchmark' | 'ingot' | 'scrap' | 'billet' | 'footer' = 'header';
  const materials: MarketMaterial[] = [];
  let displayOrderCounter = 1;

  for (const line of lines) {
    // 1. Detect Date
    if (
      line.includes('🗓️') ||
      line.includes('OCTOBER') ||
      line.includes('NOVEMBER') ||
      line.includes('DECEMBER') ||
      line.includes('JANUARY')
    ) {
      const match = line.match(/\d{1,2}-[A-Za-z]+-\d{4}/);
      if (match) dateStr = match[0];
    }

    // 2. Detect Time & Overall Emoji
    if (line.includes('⏰')) {
      const match = line.match(/\d{1,2}:\d{2}/);
      if (match) timeStr = match[0];
      if (line.includes('📉')) {
        overallTrend = 'down';
      } else if (line.includes('📈') || line.includes('🔼')) {
        overallTrend = 'up';
      }
    }

    // 3. Detect USD-INR Forex Spot
    if (line.includes('1($)') || line.includes('1 ($)') || line.includes('1$')) {
      const match = line.match(/(\d+\.?\d*)\s*\(₹\)/) || line.match(/(\d+\.?\d*)/);
      if (match) {
        const val = parseFloat(match[1]);
        if (!isNaN(val) && val > 50 && val < 150) {
          usdInrRate = val;
        }
      }
    }

    const clean = line.replace(/[\s*_~]/g, '');

    // 4. Category Switchers
    if (
      line.toLowerCase().includes('mandi gobindgarh') &&
      (line.toLowerCase().includes('trend') || line.includes('ᵀʳᵉⁿᵈ'))
    ) {
      currentCategory = 'benchmark';
      trendText = line.replace(/[\*_~💬]/g, '').trim();
      if (line.toLowerCase().includes('down') || line.includes('📉')) overallTrend = 'down';
      else if (line.toLowerCase().includes('up') || line.includes('📈') || line.includes('🔼'))
        overallTrend = 'up';
      continue;
    }

    if (
      clean.includes('Ingot💬') ||
      (clean.startsWith('Ingot') && !line.includes('₹') && !line.includes('='))
    ) {
      currentCategory = 'ingot';
      continue;
    }

    if (
      clean.includes('Scrap💬') ||
      (clean.startsWith('Scrap') && !line.includes('₹') && !line.includes('='))
    ) {
      currentCategory = 'scrap';
      continue;
    }

    if (
      clean.includes('Billet💬') ||
      (clean.startsWith('Billet') && !line.includes('₹') && !line.includes('='))
    ) {
      currentCategory = 'billet';
      continue;
    }

    if (
      line.startsWith('===') ||
      line.startsWith('---') ||
      clean.includes('Note') ||
      clean.includes('SMSALERTS')
    ) {
      if (line.startsWith('===') || clean.includes('Note') || clean.includes('SMSALERTS')) {
        currentCategory = 'footer';
      }
      continue;
    }

    // 5. Rate parsing: Look for Price in INR
    const priceMatch = line.match(/₹\s*([\d,]+)/);
    if (
      priceMatch &&
      (currentCategory === 'benchmark' ||
        currentCategory === 'ingot' ||
        currentCategory === 'scrap' ||
        currentCategory === 'billet')
    ) {
      const currentPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      let priceChange = 0;
      const changeMatch = line.match(/\(\s*([+-]?\d+)\s*\)/);
      if (changeMatch) {
        priceChange = parseInt(changeMatch[1], 10);
      }

      // Movement direction
      let movementDirection: MovementDirection = 'neutral';
      if (priceChange > 0 || line.includes('🔼')) movementDirection = 'up';
      else if (priceChange < 0 || line.includes('🔻')) movementDirection = 'down';

      // Previous price calculation
      const previousPrice = currentPrice - priceChange;
      const percentageChange =
        previousPrice > 0 ? Number(((priceChange / previousPrice) * 100).toFixed(2)) : 0;

      // Extract City and Product Name
      let namePart = line
        .split(/[=:]/)[0]
        .replace(/^[_\*~]+|[_\*~]+$/g, '')
        .replace(/ᵃˢᵗ/gi, '')
        .replace(/Price/gi, '')
        .replace(/=>/g, '')
        .trim();

      // Check if extra spec is at line tail, e.g. *(OLD)_
      const extraMatch = line.match(/\*?\(([A-Za-z0-9\s]+)\)\*?_?$/);
      if (extraMatch && !namePart.includes(extraMatch[1])) {
        namePart += ` (${extraMatch[1].trim()})`;
      }

      // Derive Hub city and specification
      let hubCity = namePart;
      let specification = '';
      if (namePart.includes('(')) {
        const specMatch = namePart.match(/(.*?)\s*\((.*?)\)/);
        if (specMatch) {
          hubCity = specMatch[1].trim();
          specification = specMatch[2].trim();
        }
      }

      // Level 1: mainCategory ('raw_materials' | 'scrap_materials')
      // Level 2: materialName ('Ingot', 'Billet', 'Melting Scrap', 'Old Scrap')
      // Level 3: mandiCity ('Mandi Gobindgarh', 'Ludhiana', etc.)
      let mainCategory: 'raw_materials' | 'scrap_materials' = 'raw_materials';
      let materialName = 'Ingot';
      let mandiCity = hubCity;

      if (currentCategory === 'benchmark') {
        mandiCity = 'Mandi Gobindgarh';
        if (namePart.toLowerCase().includes('scrap')) {
          mainCategory = 'scrap_materials';
          materialName = namePart.toLowerCase().includes('old') ? 'Old Scrap' : 'Melting Scrap';
        } else if (namePart.toLowerCase().includes('billet')) {
          mainCategory = 'raw_materials';
          materialName = 'Billet';
        } else {
          mainCategory = 'raw_materials';
          materialName = 'Ingot';
        }
      } else if (currentCategory === 'scrap') {
        mainCategory = 'scrap_materials';
        if (namePart.toLowerCase().includes('old') || specification.toLowerCase().includes('old')) {
          materialName = 'Old Scrap';
        } else {
          materialName = 'Melting Scrap';
        }
      } else if (currentCategory === 'billet') {
        mainCategory = 'raw_materials';
        materialName = 'Billet';
      } else {
        mainCategory = 'raw_materials';
        materialName = 'Ingot';
      }

      const displayName = `${materialName} - ${mandiCity}`;
      const slugKey = `${mainCategory}-${materialName}-${mandiCity}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const symbol = `${mainCategory === 'raw_materials' ? 'RAW' : 'SCR'}-${materialName.substring(
        0,
        3
      ).toUpperCase()}-${mandiCity.substring(0, 3).toUpperCase()}${
        specification ? `-${specification.substring(0, 3).toUpperCase()}` : ''
      }`;
      const id = `mat-${slugKey}`;

      const highPrice = Math.max(currentPrice, previousPrice) + Math.abs(priceChange) * 2;
      const lowPrice = Math.min(currentPrice, previousPrice) - Math.abs(priceChange) * 2;
      const averagePrice = Math.round((currentPrice + previousPrice) / 2);
      const volatility = Math.abs(percentageChange) > 0 ? Math.abs(percentageChange) * 1.5 : 1.0;

      materials.push({
        id,
        mainCategory,
        materialName,
        mandiCity,
        categorySlug: currentCategory,
        categoryName: materialName,
        name: displayName,
        symbol,
        hubCity: mandiCity,
        specification,
        unit: '₹ / Metric Ton',
        currentPrice,
        previousPrice,
        priceChange,
        percentageChange,
        movementDirection,
        highPrice,
        lowPrice,
        averagePrice,
        volatility: Number(volatility.toFixed(1)),
        lastUpdatedAt: new Date().toISOString(),
        displayOrder: displayOrderCounter++,
        isActive: true,
        notes: `${materialName} spot benchmark ex-${mandiCity}. Applicable Sales Tax (ast) extra.`,
        historicalPrices: generateHistoryForMandi(currentPrice, 50, 0.015, id), // Exact past 50 records
      });
    }
  }

  // Add supplementary high-volume steel commodities to provide complete Raw Material & Scrap coverage
  const supplementaryMaterials: MarketMaterial[] = [
    // --- RAW MATERIALS: TMT Rebar ---
    {
      id: 'mat-raw-tmt-mandi-gobindgarh',
      mainCategory: 'raw_materials',
      materialName: 'TMT Rebar',
      mandiCity: 'Mandi Gobindgarh',
      categorySlug: 'raw_materials',
      categoryName: 'TMT Rebar',
      name: 'TMT Rebar (Fe550D) - Mandi Gobindgarh',
      symbol: 'RAW-TMT-MND',
      hubCity: 'Mandi Gobindgarh',
      specification: 'Fe 550D / Primary Grade',
      unit: '₹ / Metric Ton',
      currentPrice: 48200,
      previousPrice: 48050,
      priceChange: 150,
      percentageChange: 0.31,
      movementDirection: 'up',
      highPrice: 48900,
      lowPrice: 47600,
      averagePrice: 48200,
      volatility: 1.1,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'TMT Fe550D ex-Mandi Gobindgarh rolling mills. GST extra.',
      historicalPrices: generateHistoryForMandi(48200, 50, 0.012, 'tmt-mandi'),
    },
    {
      id: 'mat-raw-tmt-raipur',
      mainCategory: 'raw_materials',
      materialName: 'TMT Rebar',
      mandiCity: 'Raipur',
      categorySlug: 'raw_materials',
      categoryName: 'TMT Rebar',
      name: 'TMT Rebar (Fe550D) - Raipur',
      symbol: 'RAW-TMT-RAI',
      hubCity: 'Raipur',
      specification: 'Fe 550D Mill Quality',
      unit: '₹ / Metric Ton',
      currentPrice: 44500,
      previousPrice: 44700,
      priceChange: -200,
      percentageChange: -0.45,
      movementDirection: 'down',
      highPrice: 45200,
      lowPrice: 43900,
      averagePrice: 44500,
      volatility: 1.2,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'TMT Fe550D spot ex-Raipur plants. GST 18% extra.',
      historicalPrices: generateHistoryForMandi(44500, 50, 0.012, 'tmt-raipur'),
    },
    {
      id: 'mat-raw-tmt-durgapur',
      mainCategory: 'raw_materials',
      materialName: 'TMT Rebar',
      mandiCity: 'Durgapur',
      categorySlug: 'raw_materials',
      categoryName: 'TMT Rebar',
      name: 'TMT Rebar (Fe550D) - Durgapur',
      symbol: 'RAW-TMT-DUR',
      hubCity: 'Durgapur',
      specification: 'Fe 550D Commercial',
      unit: '₹ / Metric Ton',
      currentPrice: 44800,
      previousPrice: 44900,
      priceChange: -100,
      percentageChange: -0.22,
      movementDirection: 'down',
      highPrice: 45500,
      lowPrice: 44200,
      averagePrice: 44800,
      volatility: 1.0,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'TMT Rebar spot ex-Durgapur rolling mills.',
      historicalPrices: generateHistoryForMandi(44800, 50, 0.012, 'tmt-durgapur'),
    },
    {
      id: 'mat-raw-tmt-jalna',
      mainCategory: 'raw_materials',
      materialName: 'TMT Rebar',
      mandiCity: 'Jalna',
      categorySlug: 'raw_materials',
      categoryName: 'TMT Rebar',
      name: 'TMT Rebar (Fe550D) - Jalna',
      symbol: 'RAW-TMT-JAL',
      hubCity: 'Jalna',
      specification: 'Fe 550D Certified',
      unit: '₹ / Metric Ton',
      currentPrice: 47000,
      previousPrice: 47000,
      priceChange: 0,
      percentageChange: 0,
      movementDirection: 'neutral',
      highPrice: 47600,
      lowPrice: 46400,
      averagePrice: 47000,
      volatility: 0.9,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'TMT Rebar spot ex-Jalna steel cluster.',
      historicalPrices: generateHistoryForMandi(47000, 50, 0.012, 'tmt-jalna'),
    },
    // --- RAW MATERIALS: Wire Rod ---
    {
      id: 'mat-raw-wire-rod-mandi-gobindgarh',
      mainCategory: 'raw_materials',
      materialName: 'Wire Rod',
      mandiCity: 'Mandi Gobindgarh',
      categorySlug: 'raw_materials',
      categoryName: 'Wire Rod',
      name: 'Wire Rod (5.5mm) - Mandi Gobindgarh',
      symbol: 'RAW-WR-MND',
      hubCity: 'Mandi Gobindgarh',
      specification: '5.5mm SAE 1008 / 1010',
      unit: '₹ / Metric Ton',
      currentPrice: 47500,
      previousPrice: 47700,
      priceChange: -200,
      percentageChange: -0.42,
      movementDirection: 'down',
      highPrice: 48200,
      lowPrice: 46900,
      averagePrice: 47500,
      volatility: 1.1,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'Wire Rod 5.5mm ex-Mandi Gobindgarh.',
      historicalPrices: generateHistoryForMandi(47500, 50, 0.013, 'wire-rod-mandi'),
    },
    // --- SCRAP MATERIALS: HMS 1 & 2 ---
    {
      id: 'mat-scr-hms-mandi-gobindgarh',
      mainCategory: 'scrap_materials',
      materialName: 'HMS (Heavy Melting Scrap)',
      mandiCity: 'Mandi Gobindgarh',
      categorySlug: 'scrap_materials',
      categoryName: 'HMS Scrap',
      name: 'HMS 1&2 (80:20) - Mandi Gobindgarh',
      symbol: 'SCR-HMS-MND',
      hubCity: 'Mandi Gobindgarh',
      specification: '80:20 Foundry Heavy Scrap',
      unit: '₹ / Metric Ton',
      currentPrice: 35800,
      previousPrice: 36000,
      priceChange: -200,
      percentageChange: -0.56,
      movementDirection: 'down',
      highPrice: 36500,
      lowPrice: 35200,
      averagePrice: 35800,
      volatility: 1.3,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'Heavy Melting Scrap 80:20 ex-Mandi Gobindgarh yard.',
      historicalPrices: generateHistoryForMandi(35800, 50, 0.014, 'hms-mandi'),
    },
    {
      id: 'mat-scr-hms-alang-bhavnagar',
      mainCategory: 'scrap_materials',
      materialName: 'HMS (Heavy Melting Scrap)',
      mandiCity: 'Alang / Bhavnagar',
      categorySlug: 'scrap_materials',
      categoryName: 'HMS Scrap',
      name: 'HMS 1 (Ship Breaking) - Alang / Bhavnagar',
      symbol: 'SCR-HMS-ALN',
      hubCity: 'Alang / Bhavnagar',
      specification: 'Ship Breaking Grade 1 Scrap',
      unit: '₹ / Metric Ton',
      currentPrice: 36200,
      previousPrice: 36200,
      priceChange: 0,
      percentageChange: 0,
      movementDirection: 'neutral',
      highPrice: 36800,
      lowPrice: 35700,
      averagePrice: 36200,
      volatility: 1.0,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'Ship Breaking Melting Scrap ex-Alang Yard.',
      historicalPrices: generateHistoryForMandi(36200, 50, 0.013, 'hms-alang'),
    },
    // --- SCRAP MATERIALS: Turning Scrap ---
    {
      id: 'mat-scr-turning-mandi-gobindgarh',
      mainCategory: 'scrap_materials',
      materialName: 'Turning Scrap',
      mandiCity: 'Mandi Gobindgarh',
      categorySlug: 'scrap_materials',
      categoryName: 'Turning Scrap',
      name: 'MS Turning & Boring - Mandi Gobindgarh',
      symbol: 'SCR-TRN-MND',
      hubCity: 'Mandi Gobindgarh',
      specification: 'Machine Shop Boring / Turning',
      unit: '₹ / Metric Ton',
      currentPrice: 31500,
      previousPrice: 31700,
      priceChange: -200,
      percentageChange: -0.63,
      movementDirection: 'down',
      highPrice: 32200,
      lowPrice: 30900,
      averagePrice: 31500,
      volatility: 1.4,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'MS Turning Scrap ex-Mandi Gobindgarh.',
      historicalPrices: generateHistoryForMandi(31500, 50, 0.016, 'turning-mandi'),
    },
    {
      id: 'mat-scr-turning-ludhiana',
      mainCategory: 'scrap_materials',
      materialName: 'Turning Scrap',
      mandiCity: 'Ludhiana',
      categorySlug: 'scrap_materials',
      categoryName: 'Turning Scrap',
      name: 'MS Turning Scrap - Ludhiana',
      symbol: 'SCR-TRN-LUD',
      hubCity: 'Ludhiana',
      specification: 'Clean Dry Machine Turnings',
      unit: '₹ / Metric Ton',
      currentPrice: 32000,
      previousPrice: 32100,
      priceChange: -100,
      percentageChange: -0.31,
      movementDirection: 'down',
      highPrice: 32700,
      lowPrice: 31400,
      averagePrice: 32000,
      volatility: 1.2,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'Industrial turning scrap ex-Ludhiana industrial area.',
      historicalPrices: generateHistoryForMandi(32000, 50, 0.015, 'turning-ludhiana'),
    },
    // --- SCRAP MATERIALS: End Cutting ---
    {
      id: 'mat-scr-end-cutting-mandi-gobindgarh',
      mainCategory: 'scrap_materials',
      materialName: 'End Cutting / Crops',
      mandiCity: 'Mandi Gobindgarh',
      categorySlug: 'scrap_materials',
      categoryName: 'End Cutting',
      name: 'Billet End Cutting - Mandi Gobindgarh',
      symbol: 'SCR-CUT-MND',
      hubCity: 'Mandi Gobindgarh',
      specification: 'Prime Billet / Bloom End Cuts',
      unit: '₹ / Metric Ton',
      currentPrice: 38400,
      previousPrice: 38600,
      priceChange: -200,
      percentageChange: -0.52,
      movementDirection: 'down',
      highPrice: 39100,
      lowPrice: 37800,
      averagePrice: 38400,
      volatility: 1.1,
      lastUpdatedAt: new Date().toISOString(),
      displayOrder: displayOrderCounter++,
      isActive: true,
      notes: 'Billet crop ends ex-Mandi Gobindgarh induction furnace units.',
      historicalPrices: generateHistoryForMandi(38400, 50, 0.012, 'cutting-mandi'),
    },
  ];

  materials.push(...supplementaryMaterials);

  const bulletin: MandiBulletinData = {
    dateStr,
    timeStr,
    usdInrRate,
    overallTrend,
    trendText,
    rawMessageText: rawText,
    supportPhone,
    smsPhones,
    whatsappPhones,
    lastUpdatedAt: new Date().toISOString(),
  };

  return { bulletin, materials };
}

// Pre-parsed initial dataset for zero-latency initial load
export const { bulletin: INITIAL_MANDI_BULLETIN, materials: INITIAL_MANDI_MATERIALS } =
  parseMandiBroadcast(DEFAULT_MANDI_BULLETIN_TEXT);

