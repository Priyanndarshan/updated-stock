import { LiveChartData } from '@/app/Chart/page';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:5000';

/**
 * Fetches stock details from the Flask backend
 * @param symbol Stock symbol (e.g., AAPL, GOOG)
 * @returns Promise with stock data
 */
export async function fetchStockDetails(symbol: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/stock-details?symbol=${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    // Return mock data if API call fails
    return generateMockData(symbol);
  }
}

/**
 * Fetches historical stock data for charting
 * @param symbol Stock symbol (e.g., AAPL, GOOG)
 * @param period Data period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @param interval Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
 * @returns Promise with historical data
 */
export async function fetchHistoricalData(symbol: string, period: string = '3mo', interval: string = '1d'): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/historical-data?symbol=${symbol}&period=${period}&interval=${interval}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return { symbol, data: [], isMockData: true };
  }
}

/**
 * Formats raw stock data into LiveChartData format
 * @param data Raw stock data
 * @param symbol Stock symbol
 * @returns Formatted LiveChartData
 */
export function formatStockData(data: any, symbol: string): LiveChartData {
  // Extract day change if available, otherwise calculate it
  let dayChange = data.dayChange;
  let dayChangePercent = data.dayChangePercent;
  
  // Calculate day change if not directly provided by API
  if (dayChange === undefined && data.regularMarketPrice && data.regularMarketPreviousClose) {
    dayChange = (data.regularMarketPrice - data.regularMarketPreviousClose).toFixed(2);
    dayChangePercent = ((data.regularMarketPrice - data.regularMarketPreviousClose) / 
                        data.regularMarketPreviousClose * 100).toFixed(2) + "%";
  }
  
  return {
    // Core price data
    currentPrice: data.regularMarketPrice?.toString() || 'N/A',
    volume: data.volume || formatVolume(data.regularMarketVolume) || 'N/A',
    support: data.supportLevel?.toString() || data.fiftyTwoWeekLow?.toString() || 'N/A',
    resistance: data.resistanceLevel?.toString() || data.fiftyTwoWeekHigh?.toString() || 'N/A',
    dayChange: dayChange?.toString() || "N/A",
    dayChangePercent: dayChangePercent?.toString() || "N/A",
    trend: data.trend || determineTrend(data),
    timestamp: new Date().toISOString(),
    
    // Store complete raw data for analysis
    rawData: data,
    
    // Additional data for enhanced analysis
    marketOpen: data.regularMarketOpen?.toString() || 'N/A',
    marketCap: formatMarketCap(data.marketCap) || 'N/A',
    peRatio: data.trailingPE?.toString() || 'N/A',
    dividendYield: data.dividendYield ? 
      (typeof data.dividendYield === 'string' ? 
        data.dividendYield : 
        parseFloat(data.dividendYield.toString()).toFixed(2) + '%'
      ) : 'N/A',
    
    // Technical indicators
    fiftyDayAverage: data.fiftyDayAverage?.toString() || 'N/A',
    twoHundredDayAverage: data.twoHundredDayAverage?.toString() || 'N/A',
    rsi: data.rsi?.toString() || 'N/A',
    macd: data.macd?.toString() || 'N/A',
    macdSignal: data.macdSignal?.toString() || 'N/A',
    
    // Performance metrics
    weekChange: data.weekChange?.toString() + '%' || 'N/A',
    monthChange: data.monthChange?.toString() + '%' || 'N/A',
    
    // Volume metrics
    averageVolume10Day: formatVolume(data.averageDailyVolume10Day) || 'N/A',
    averageVolume3Month: formatVolume(data.averageDailyVolume3Month) || 'N/A',
    
    // Fundamental metrics
    forwardPE: data.forwardPE?.toString() || 'N/A',
    priceToBook: data.priceToBook?.toString() || 'N/A',
    beta: data.beta?.toString() || 'N/A',
    
    // Analyst data
    targetPrice: data.targetMeanPrice?.toString() || 'N/A',
    analystRating: data.analystRating?.toString() || 'N/A',
  };
}

/**
 * Formats volume for better readability
 */
function formatVolume(volume: number): string {
  if (!volume) return 'N/A';
  
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(2) + 'B';
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + 'K';
  }
  
  return volume.toString();
}

/**
 * Determines trend based on stock data
 */
function determineTrend(data: any): string {
  if (!data) return 'N/A';
  
  // Use provided trend if available
  if (data.trend) return data.trend;
  
  // Use beta to determine volatility
  if (data.beta !== undefined) {
    if (data.beta > 1.2) return 'Volatile';
    if (data.beta < 0) return 'Downtrend';
    if (data.beta < 0.8) return 'Stable';
  }
  
  // Use RSI to determine overbought/oversold conditions
  if (data.rsi !== undefined) {
    if (data.rsi > 70) return 'Overbought';
    if (data.rsi < 30) return 'Oversold';
  }
  
  // Check price compared to moving averages
  if (data.regularMarketPrice && data.fiftyDayAverage && data.twoHundredDayAverage) {
    const price = parseFloat(data.regularMarketPrice);
    const ma50 = parseFloat(data.fiftyDayAverage);
    const ma200 = parseFloat(data.twoHundredDayAverage);
    
    if (price > ma50 && ma50 > ma200) return 'Strong Uptrend';
    if (price > ma50) return 'Uptrend';
    if (price < ma50 && ma50 < ma200) return 'Strong Downtrend';
    if (price < ma50) return 'Downtrend';
  }
  
  // Check if price is above previous close
  if (data.regularMarketPrice && data.regularMarketPreviousClose) {
    if (data.regularMarketPrice > data.regularMarketPreviousClose) {
      return 'Uptrend';
    } else if (data.regularMarketPrice < data.regularMarketPreviousClose) {
      return 'Downtrend';
    }
  }
  
  return 'Sideways';
}

/**
 * Generates mock data when API fails
 */
function generateMockData(symbol: string): any {
  const price = Math.random() * 200 + 50;
  const prevClose = price * (1 + (Math.random() * 0.04 - 0.02));
  
  return {
    symbol: symbol,
    shortName: `${symbol} Stock`,
    longName: `${symbol} Inc.`,
    regularMarketPrice: price,
    regularMarketPreviousClose: prevClose,
    regularMarketVolume: Math.random() * 10000000 + 1000000,
    fiftyTwoWeekHigh: price * 1.2,
    fiftyTwoWeekLow: price * 0.8,
    beta: Math.random() * 1.5,
    timestamp: Date.now(),
    marketCap: price * 1000000000,
    trailingPE: Math.random() * 25 + 10,
    dividendYield: Math.random() * 0.02,
    isMockData: true
  };
}

/**
 * Formats market cap for better readability
 */
function formatMarketCap(marketCap: number): string {
  if (!marketCap) return 'N/A';
  
  if (marketCap >= 1000000000000) {
    return (marketCap / 1000000000000).toFixed(2) + 'T';
  } else if (marketCap >= 1000000000) {
    return (marketCap / 1000000000).toFixed(2) + 'B';
  } else if (marketCap >= 1000000) {
    return (marketCap / 1000000).toFixed(2) + 'M';
  }
  
  return marketCap.toString();
} 