import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, analysis } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }
    
    // Generate specific responses based on keywords in the user's message
    const response = generateStockAnalysisResponse(message, analysis);
    
    return NextResponse.json({ message: response });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

function generateStockAnalysisResponse(message: string, analysis: any): string {
  const lowerCaseMessage = message.toLowerCase();
  
  // Default values for when analysis is missing or incomplete
  const stockName = analysis?.stockName || analysis?.liveData?.shortName || 'the stock';
  const stockSymbol = analysis?.stockSymbol || analysis?.liveData?.symbol || 'unknown';
  const currentPrice = analysis?.currentPrice || analysis?.liveData?.regularMarketPrice || 'unavailable';
  const volume = analysis?.volume || analysis?.liveData?.regularMarketVolume || 'unavailable';
  const support = analysis?.support || analysis?.liveData?.fiftyTwoWeekLow || 'unavailable';
  const resistance = analysis?.resistance || analysis?.liveData?.fiftyTwoWeekHigh || 'unavailable';
  const trend = analysis?.trend || 'unavailable';
  const dayChange = analysis?.dayChange || 'unavailable';
  const dayChangePercent = analysis?.dayChangePercent || 'unavailable';
  
  // Determine if we have real data from API or are using defaults
  const hasRealData = currentPrice !== 'unavailable' && currentPrice !== 'N/A';
  
  // Generate response based on user query
  if (lowerCaseMessage.includes('explain') && lowerCaseMessage.includes('market trend')) {
    if (hasRealData) {
      if (trend.toLowerCase().includes('uptrend')) {
        return `# Market Trend Analysis for ${stockSymbol}\n\n${stockName} is currently in an **uptrend** trading at $${currentPrice}. Today's movement shows ${dayChange} (${dayChangePercent}) with volume of ${volume}.\n\nBased on technical analysis, the stock shows bullish momentum with strong buying pressure. The current price is above key moving averages, signaling positive sentiment. Key resistance is at $${resistance}, and if broken, we could see further upside movement.`;
      } else if (trend.toLowerCase().includes('downtrend')) {
        return `# Market Trend Analysis for ${stockSymbol}\n\n${stockName} is currently in a **downtrend** trading at $${currentPrice}. Today's movement shows ${dayChange} (${dayChangePercent}) with volume of ${volume}.\n\nTechnical indicators suggest bearish sentiment with increased selling pressure. The stock is trading below key moving averages. Watch for support at $${support} which could provide a temporary bounce, but the overall trend remains negative.`;
      } else if (trend.toLowerCase().includes('volatile')) {
        return `# Market Trend Analysis for ${stockSymbol}\n\n${stockName} is currently showing **high volatility** trading at $${currentPrice}. Today's movement shows ${dayChange} (${dayChangePercent}) with volume of ${volume}.\n\nThe stock is experiencing significant price swings, suggesting uncertainty in market sentiment. Beta value indicates higher volatility than the broader market. In such conditions, trade carefully with proper risk management. Key levels to watch are support at $${support} and resistance at $${resistance}.`;
      } else {
        return `# Market Trend Analysis for ${stockSymbol}\n\n${stockName} is currently in a **sideways trend** (consolidation) trading at $${currentPrice}. Today's movement shows ${dayChange} (${dayChangePercent}) with volume of ${volume}.\n\nThe stock is trading in a range-bound pattern with no clear directional bias. This could indicate accumulation or distribution before the next significant move. Watch for breakouts above $${resistance} or breakdowns below $${support} for potential trading opportunities.`;
      }
    } else {
      return `# Market Trend Analysis\n\nI'm sorry, but I don't have enough real-time data to analyze the current market trend for ${stockSymbol}. Please check if the backend API is running correctly, or try again later when live data is available.`;
    }
  }
  
  else if (lowerCaseMessage.includes('support') && lowerCaseMessage.includes('resistance')) {
    if (hasRealData) {
      return `# Support and Resistance Levels for ${stockSymbol}\n\n## Current Support Levels\n- Strong support: $${support}\n- Intermediate support: $${(parseFloat(support) + (parseFloat(resistance) - parseFloat(support)) * 0.25).toFixed(2)}\n\n## Current Resistance Levels\n- Intermediate resistance: $${(parseFloat(support) + (parseFloat(resistance) - parseFloat(support)) * 0.75).toFixed(2)}\n- Strong resistance: $${resistance}\n\n${stockName} is currently trading at $${currentPrice}. The price action suggests that the immediate ${parseFloat(currentPrice) > (parseFloat(support) + (parseFloat(resistance) - parseFloat(support)) * 0.5) ? 'resistance' : 'support'} level is being tested.\n\nTraders should monitor these levels for potential bounces or breakouts, which could provide entry or exit opportunities.`;
    } else {
      return `# Support and Resistance Analysis\n\nI don't have current support and resistance data available for ${stockSymbol}. To get this information, please ensure the backend API is running and providing live market data.`;
    }
  }
  
  else if (lowerCaseMessage.includes('trading strategy') || lowerCaseMessage.includes('should i')) {
    if (hasRealData) {
      const priceToSupportRatio = (parseFloat(currentPrice) - parseFloat(support)) / (parseFloat(resistance) - parseFloat(support));
      
      if (priceToSupportRatio < 0.3) {
        return `# Trading Strategy for ${stockSymbol}\n\n${stockName} is trading near its support level at $${currentPrice}. This presents a potential **buying opportunity** with favorable risk-reward, as the stock is in the lower 30% of its established range.\n\n## Suggested Approach\n- **Strategy**: Consider a long position with tight stop-loss below support\n- **Entry**: Current price $${currentPrice}\n- **Stop Loss**: $${(parseFloat(support) * 0.98).toFixed(2)} (2% below support)\n- **Target**: $${(parseFloat(currentPrice) * 1.1).toFixed(2)} (10% upside)\n\nThis strategy offers a reward-to-risk ratio greater than 3:1, which is favorable for disciplined trading. However, please conduct your own due diligence before making any investment decisions.`;
      } else if (priceToSupportRatio > 0.7) {
        return `# Trading Strategy for ${stockSymbol}\n\n${stockName} is trading near its resistance level at $${currentPrice}. This suggests a cautious approach as the stock is in the upper 30% of its established range.\n\n## Suggested Approach\n- **Strategy**: Consider profit-taking if you're long, or a short position with careful risk management\n- **Entry** (for short): Current price $${currentPrice}\n- **Stop Loss**: $${(parseFloat(resistance) * 1.02).toFixed(2)} (2% above resistance)\n- **Target**: $${(parseFloat(currentPrice) * 0.9).toFixed(2)} (10% downside)\n\nThe stock being near resistance increases the probability of a pullback. However, make sure to confirm with other technical indicators and watch volume for signs of a breakout or rejection.`;
      } else {
        return `# Trading Strategy for ${stockSymbol}\n\n${stockName} is trading in the middle of its range at $${currentPrice}, between support ($${support}) and resistance ($${resistance}).\n\n## Suggested Approach\n- **Strategy**: Consider a neutral strategy like range trading\n- **Buy near support**: Around $${(parseFloat(support) * 1.02).toFixed(2)}\n- **Sell near resistance**: Around $${(parseFloat(resistance) * 0.98).toFixed(2)}\n\nAlternatively, wait for a clearer signal - either a breakout above resistance or a breakdown below support - before establishing a directional position. This patient approach minimizes false signals in a sideways market.`;
      }
    } else {
      return `# Trading Strategy\n\nI cannot recommend a reliable trading strategy for ${stockSymbol} without access to current market data. Please ensure the backend API is functioning correctly to receive live prices and technical levels.`;
    }
  }
  
  else if (lowerCaseMessage.includes('volume')) {
    if (hasRealData && volume !== 'unavailable' && volume !== 'N/A') {
      // Format volume for better readability
      const formattedVolume = typeof volume === 'number' 
        ? volume.toLocaleString() 
        : volume;
      
      return `# Volume Analysis for ${stockSymbol}\n\n${stockName} has a current trading volume of **${formattedVolume}** shares. ${
        trend.toLowerCase().includes('uptrend') 
          ? 'This volume is supporting the current uptrend, showing strong buying interest. Increased volume on up days confirms bullish sentiment and validates the price movement.'
          : trend.toLowerCase().includes('downtrend')
            ? 'This volume is supporting the current downtrend, indicating continued selling pressure. Higher volume on down days confirms bearish sentiment in the market.'
            : 'The current volume pattern is showing mixed signals, which aligns with the sideways price movement. Watch for volume expansion to indicate the next potential directional move.'
      }\n\n## Volume Interpretation\n\nVolume is a key confirmation indicator for price movements. In healthy trends:\n- Rising prices should be accompanied by rising volume\n- Declining prices with falling volume may indicate a weakening downtrend\n- Volume spikes often mark short-term price extremes\n\nMonitor for divergences between price and volume for early warning signs of trend reversals.`;
    } else {
      return `# Volume Analysis\n\nI don't have current volume data available for ${stockSymbol}. Volume analysis requires real-time market data to provide meaningful insights. Please check if the backend API is running and able to provide volume information.`;
    }
  }
  
  else if (lowerCaseMessage.includes('technical indicator') || lowerCaseMessage.includes('indicators')) {
    if (hasRealData) {
      return `# Key Technical Indicators for ${stockSymbol}\n\nBased on the current price of $${currentPrice} for ${stockName}, here are the key technical indicators to watch:\n\n## Trend Indicators\n- **Moving Averages**: Watch the 50-day and 200-day MAs for golden/death crosses\n- **MACD**: Monitor for potential convergence/divergence signals\n- **Price Action**: Current trend appears to be ${trend.toLowerCase()}\n\n## Momentum Indicators\n- **RSI**: Watch for overbought (>70) or oversold (<30) conditions\n- **Stochastic Oscillator**: Look for crossovers in extreme zones\n\n## Support/Resistance\n- **Key Support**: $${support}\n- **Key Resistance**: $${resistance}\n\nThese indicators should be used in combination rather than in isolation. No single indicator is infallible, and confirmation from multiple indicators strengthens a trading signal.`;
    } else {
      return `# Technical Indicators\n\nWithout access to current market data for ${stockSymbol}, I cannot provide reliable information about technical indicators. These indicators require real-time price and volume data to calculate accurately. Please ensure the backend API is running correctly.`;
    }
  }
  
  // Default response for unmatched queries
  else {
    if (hasRealData) {
      return `# ${stockSymbol} Market Analysis\n\n${stockName} is currently trading at $${currentPrice} with a day change of ${dayChange} (${dayChangePercent}).\n\n## Key Levels\n- Support: $${support}\n- Resistance: $${resistance}\n\n## Current Trend\n${trend}\n\nTo get more specific insights, you can ask me about:\n- Market trends and outlook\n- Support and resistance levels\n- Volume analysis\n- Trading strategies\n- Technical indicators to watch`;
    } else {
      return `# Stock Analysis Assistant\n\nI'm your AI trading assistant, but I currently don't have access to real-time data for ${stockSymbol}. To get meaningful market analysis, please ensure the backend API is running correctly.\n\nOnce connected to live data, you can ask me about:\n- Market trends and price movements\n- Support and resistance levels\n- Volume analysis\n- Trading strategies based on technical analysis\n- Key technical indicators to watch`;
    }
  }
} 