import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    console.log('Gemini Chat API route called');
    const { message, analysis } = await req.json();

    if (!message) {
      console.error('Error: No message provided in the request');
      return NextResponse.json(
        { error: "No message was provided. Please send a valid query." },
        { status: 400 }
      );
    }

    console.log('Message received:', message);
    console.log('Analysis data received - Symbol:', analysis?.stockSymbol);
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return NextResponse.json(
        { message: "I don't have access to the Gemini API at the moment. Please make sure the API key is configured." },
        { status: 200 }
      );
    }

    // Get both the formatted data and raw data
    // The rawData now contains fresh data from the liveData.py API
    const rawData = analysis?.rawData || {};
    const isMockData = rawData?.isMockData || false;
    
    // Log whether we're using real API data or mock data
    console.log(`Using ${isMockData ? 'mock' : 'real'} data from the liveData.py API`);
    
    const stockInfo = {
      stockName: analysis?.stockName || 'unknown',
      stockSymbol: analysis?.stockSymbol || 'unknown',
      
      // Core pricing data
      currentPrice: analysis?.currentPrice || 'N/A',
      previousClose: rawData?.regularMarketPreviousClose || 'N/A',
      marketOpen: analysis?.marketOpen || 'N/A',
      dayChange: analysis?.dayChange || 'N/A',
      dayChangePercent: analysis?.dayChangePercent || 'N/A',
      dayHigh: rawData?.regularMarketDayHigh || 'N/A',
      dayLow: rawData?.regularMarketDayLow || 'N/A',
      
      // Volume data
      volume: analysis?.volume || 'N/A',
      avgVolume10Day: analysis?.averageVolume10Day || rawData?.averageDailyVolume10Day || 'N/A',
      avgVolume3Month: analysis?.averageVolume3Month || rawData?.averageDailyVolume3Month || 'N/A',
      
      // Moving averages
      fiftyDayAvg: analysis?.fiftyDayAverage || rawData?.fiftyDayAverage || 'N/A',
      twoHundredDayAvg: analysis?.twoHundredDayAverage || rawData?.twoHundredDayAverage || 'N/A',
      
      // Support/Resistance levels
      support: analysis?.support || 'N/A',
      resistance: analysis?.resistance || 'N/A',
      fiftyTwoWeekLow: rawData?.fiftyTwoWeekLow || 'N/A',
      fiftyTwoWeekHigh: rawData?.fiftyTwoWeekHigh || 'N/A',
      
      // Technical indicators
      rsi: analysis?.rsi || 'N/A',
      macd: analysis?.macd || 'N/A',
      macdSignal: analysis?.macdSignal || 'N/A',
      
      // Performance metrics
      weekChange: analysis?.weekChange || 'N/A',
      monthChange: analysis?.monthChange || 'N/A',
      
      // Fundamental data
      marketCap: analysis?.marketCap || 'N/A',
      peRatio: analysis?.peRatio || 'N/A',
      forwardPE: analysis?.forwardPE || rawData?.forwardPE || 'N/A',
      priceToBook: analysis?.priceToBook || rawData?.priceToBook || 'N/A',
      dividendYield: analysis?.dividendYield || 'N/A',
      dividendRate: rawData?.dividendRate || 'N/A',
      payoutRatio: rawData?.payoutRatio || 'N/A',
      beta: analysis?.beta || rawData?.beta || 'N/A',
      
      // Growth and earnings data
      earningsGrowth: rawData?.earningsQuarterlyGrowth || 'N/A',
      revenueGrowth: rawData?.revenueQuarterlyGrowth || 'N/A',
      
      // Analyst data
      targetPrice: analysis?.targetPrice || rawData?.targetMeanPrice || 'N/A',
      analystRating: analysis?.analystRating || rawData?.analystRating || 'N/A',
      
      // Sector and industry
      sector: rawData?.sector || 'N/A',
      industry: rawData?.industry || 'N/A',
      
      // Trend info
      trend: analysis?.trend || 'Not available',
      timeframe: analysis?.timeframe || "daily",
      lastUpdated: analysis?.lastUpdated || rawData?.dataDate || new Date().toISOString(),
      
      // Data source flag
      dataSource: isMockData ? "mock" : "liveData.py API"
    };

    // Create a chat model - using gemini-1.5-flash for fastest responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a chat session with financial analysis expertise
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "I need help with stock information and trading advice. Please be concise and only analyze stocks when I specifically ask for analysis." }],
        },
        {
          role: "model",
          parts: [{ text: "I'll be your concise financial assistant. I'll provide brief, helpful responses to your questions and only offer detailed stock analysis when you explicitly request it. How can I help you today?" }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    // Check if the user is requesting analysis
    const isAnalysisRequest = message.toLowerCase().includes('analyze') || 
                             message.toLowerCase().includes('analysis') ||
                             message.toLowerCase().includes('what do you think') ||
                             message.toLowerCase().includes('recommend') ||
                             message.toLowerCase().includes('outlook') ||
                             message.toLowerCase().includes('assessment') ||
                             message.toLowerCase().includes('review');
                             
    // Check if user is asking about a trading term or concept
    const isExplanationRequest = message.toLowerCase().includes('what is') || 
                              message.toLowerCase().includes('how do') || 
                              message.toLowerCase().includes('what does') || 
                              message.toLowerCase().includes('explain') ||
                              message.toLowerCase().includes('meaning') ||
                              message.toLowerCase().includes('definition');

    // Create a context-aware prompt based on user request
    let prompt;
    
    if (isAnalysisRequest) {
      // Detailed analysis prompt
      prompt = `
      As an AI Analyst, please provide a concise analysis of ${stockInfo.stockName} (${stockInfo.stockSymbol}) based on the latest available data:

      STOCK DATA:
      Price: ${stockInfo.currentPrice} (${stockInfo.dayChange} / ${stockInfo.dayChangePercent})
      Previous Close: ${stockInfo.previousClose}
      Day High/Low: ${stockInfo.dayHigh} / ${stockInfo.dayLow}
      Support/Resistance: ${stockInfo.support} / ${stockInfo.resistance}
      Volume: ${stockInfo.volume}
      P/E Ratio: ${stockInfo.peRatio}
      Market Cap: ${stockInfo.marketCap}
      50-Day Average: ${stockInfo.fiftyDayAvg}
      200-Day Average: ${stockInfo.twoHundredDayAvg}
      RSI: ${stockInfo.rsi}
      MACD: ${stockInfo.macd}
      Week Change: ${stockInfo.weekChange}
      Month Change: ${stockInfo.monthChange}
      Sector: ${stockInfo.sector}
      Industry: ${stockInfo.industry}
      Data Source: ${stockInfo.dataSource}
      Last Updated: ${stockInfo.lastUpdated}
      
      The user's question is: "${message}"
      
      Provide a brief, focused analysis addressing exactly what the user asked. Format your response with Markdown for readability.
      
      Keep your response concise - no more than 3-4 paragraphs maximum.
      
      If you detect unusual values (like an extremely high dividend yield), note it briefly but don't make it the focus of your analysis.
      
      Do NOT preface your response with statements about data limitations - work with what's available.
      
      Focus on addressing the specific question rather than providing a generic stock analysis.
      `;
    } else if (isExplanationRequest) {
      // Educational prompt for explaining trading concepts
      prompt = `
      As an AI Analyst, the user appears to be asking about a trading or investing concept. They are likely a beginner who needs clear, simple explanations.
      
      CONTEXT:
      The user is looking at data for ${stockInfo.stockName} (${stockInfo.stockSymbol}) priced at ${stockInfo.currentPrice}.
      
      The user's question is: "${message}"
      
      Please provide:
      1. A BRIEF, simple explanation using plain language that a beginner would understand
      2. How this concept applies to ${stockInfo.stockSymbol} specifically, if relevant
      3. Why this concept matters for trading decisions
      
      Keep your explanation under 3 paragraphs, use simple analogies where helpful, and format with Markdown for readability.
      Avoid jargon unless you immediately explain it.
      `;
    } else {
      // Regular conversation prompt
      prompt = `
      As an AI Analyst, please respond to this message from what appears to be a beginner trader looking at ${stockInfo.stockName} (${stockInfo.stockSymbol}).
      
      CONTEXT:
      Current stock price: ${stockInfo.currentPrice}
      Today's change: ${stockInfo.dayChange} (${stockInfo.dayChangePercent})
      Previous close: ${stockInfo.previousClose}
      Data Source: ${stockInfo.dataSource}
      Last Updated: ${stockInfo.lastUpdated}
      
      The user's message is: "${message}"
      
      Provide a helpful, friendly response using plain language. Assume the person might be new to trading.
      
      Keep your response concise - just 1-2 short paragraphs maximum.
      
      If they're asking something that seems basic, don't make them feel bad about it - just explain clearly.
      
      Format your response with Markdown if it helps readability, but keep it simple.
      `;
    }

    console.log('Calling Gemini API with prompt optimized for', 
      isAnalysisRequest ? 'analysis' : 
      isExplanationRequest ? 'concept explanation' : 
      'conversation');
    
    try {
      // Send the message to the Gemini API
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Received response from Gemini API');
      
      // Return the response to the client
      return NextResponse.json({ message: text });
    } catch (error) {
      console.error('Error from Gemini API:', error);
      return NextResponse.json(
        { message: "I apologize, but I encountered an error. Please try again with a different question." },
        { status: 200 }
      );
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { message: "I apologize, but I encountered an error processing your request. Please try again later." },
      { status: 200 }
    );
  }
} 