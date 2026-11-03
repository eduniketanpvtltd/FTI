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
 * Generate historical price curve ending at current price
 */
export function generateHistoryForMandi(
  basePrice: number,
  days: number = 30,
  volatilityRatio: number = 0.015,
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

  let current = basePrice * (1 - days * 0.001);

  for (let i = days; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const rand = pseudoRand(i);
    const delta = (rand - 0.49) * (basePrice * volatilityRatio);
    current = Math.max(basePrice * 0.75, current + delta);

    if (i === 0) current = basePrice;

    points.push({
      date: d.toISOString().split('T')[0],
      timestamp: d.getTime(),
      price: Math.round(current / 100) * 100,
    });
  }
  return points;
}

/**
 * Robust parser for Mandi WhatsApp broadcast messages
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
    if (line.includes('🗓️') || line.includes('OCTOBER') || line.includes('NOVEMBER') || line.includes('DECEMBER') || line.includes('JANUARY')) {
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
      else if (line.toLowerCase().includes('up') || line.includes('📈') || line.includes('🔼')) overallTrend = 'up';
      continue;
    }

    if (clean.includes('Ingot💬') || (clean.startsWith('Ingot') && !line.includes('₹') && !line.includes('='))) {
      currentCategory = 'ingot';
      continue;
    }

    if (clean.includes('Scrap💬') || (clean.startsWith('Scrap') && !line.includes('₹') && !line.includes('='))) {
      currentCategory = 'scrap';
      continue;
    }

    if (clean.includes('Billet💬') || (clean.startsWith('Billet') && !line.includes('₹') && !line.includes('='))) {
      currentCategory = 'billet';
      continue;
    }

    if (line.startsWith('===') || line.startsWith('---') || clean.includes('Note') || clean.includes('SMSALERTS')) {
      if (line.startsWith('===') || clean.includes('Note') || clean.includes('SMSALERTS')) {
        currentCategory = 'footer';
      }
      continue;
    }

    // 5. Rate parsing: Look for Price in INR
    const priceMatch = line.match(/₹\s*([\d,]+)/);
    if (priceMatch && (currentCategory === 'benchmark' || currentCategory === 'ingot' || currentCategory === 'scrap' || currentCategory === 'billet')) {
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
      const percentageChange = previousPrice > 0 ? Number(((priceChange / previousPrice) * 100).toFixed(2)) : 0;

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

      let categorySlug = currentCategory;
      let categoryName = 'Ingot';
      if (currentCategory === 'benchmark') {
        categoryName = 'Mandi Benchmark';
      } else if (currentCategory === 'scrap') {
        categoryName = 'Scrap';
      } else if (currentCategory === 'billet') {
        categoryName = 'Billet';
      }

      // Generate unique symbol and id
      const slugKey = namePart.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const symbol = `${currentCategory.toUpperCase()}-${hubCity.substring(0, 3).toUpperCase()}${
        specification ? `-${specification.substring(0, 4).toUpperCase()}` : ''
      }`;
      const id = `mandi-${currentCategory}-${slugKey}`;

      const highPrice = Math.max(currentPrice, previousPrice) + Math.abs(priceChange) * 2;
      const lowPrice = Math.min(currentPrice, previousPrice) - Math.abs(priceChange) * 2;
      const averagePrice = Math.round((currentPrice + previousPrice) / 2);
      const volatility = Math.abs(percentageChange) > 0 ? Math.abs(percentageChange) * 1.5 : 1.0;

      materials.push({
        id,
        categorySlug,
        categoryName,
        name: namePart,
        symbol,
        hubCity,
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
        notes: `${categoryName} spot benchmark ex-${hubCity}. Applicable Sales Tax (ast) extra.`,
        historicalPrices: generateHistoryForMandi(currentPrice, 30, 0.015, id),
      });
    }
  }

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
