import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Function to handle text-based chat queries with stock data
export async function POST(req: Request) {
  try {
    console.log('Chat API route called');
    const { message, analysis } = await req.json();

    if (!message) {
      console.error('Error: No message provided in the request');
      return NextResponse.json(
        { error: "No message was provided. Please send a valid query." },
        { status: 400 }
      );
    }

    console.log('Message received:', message);
    console.log('Stock data received:', JSON.stringify(analysis).substring(0, 200) + '...');

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Format the stock data for the AI prompt
    const stockInfo = {
      stockName: analysis.stockName || 'unknown',
      stockSymbol: analysis.stockSymbol || 'unknown',
      currentPrice: analysis.currentPrice || 'N/A',
      volume: analysis.volume || 'N/A',
      support: analysis.support || 'N/A',
      resistance: analysis.resistance || 'N/A',
      dayChange: analysis.dayChange || 'N/A',
      dayChangePercent: analysis.dayChangePercent || 'N/A',
      trend: analysis.trend || 'Sideways'
    };

    // Initialize the Gemini model - using gemini-1.5-flash for fastest responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('Calling Gemini API...');
    
    // Construct a detailed prompt with market context and the stock data
    const prompt = `You are ROAR AI, an expert financial analyst assistant specializing in stock market analysis and trading insights.
    
    The user has asked: "${message}"
    
    Here is the current data for ${stockInfo.stockName} (${stockInfo.stockSymbol}):
    - Current Price: $${stockInfo.currentPrice}
    - Day Change: ${stockInfo.dayChange} (${stockInfo.dayChangePercent})
    - Volume: ${stockInfo.volume}
    - Support Level: $${stockInfo.support}
    - Resistance Level: $${stockInfo.resistance}
    - Current Trend: ${stockInfo.trend}
    
    Provide a professional, detailed analysis in response to the user's query, using the stock data provided. Format your response using Markdown with appropriate headers and bullet points where useful. Maintain a confident, authoritative tone while being helpful and educational about trading concepts.
    
    If the user's query is about market trends, explain the current trend with supporting evidence.
    If about support/resistance, elaborate on these key levels and their significance.
    If about trading strategies, suggest specific approaches based on the current price relative to support/resistance levels.
    If about volume analysis, explain what the current volume indicates about market sentiment.
    
    Always base your response on the actual data provided, not on general or historical knowledge of the stock.`;

    // Generate a response from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API response received');
    
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: `Failed to process message: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Existing image processing function stays the same below
// But we'll rename it to avoid conflicts
export async function image_POST(req: Request) {
  try {
    console.log('Image API route called');
    const data = await req.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      console.error('Error: No file provided in the request');
      return NextResponse.json(
        { error: "No image file was provided. Please upload a valid image." },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, file.type);

    // Convert image to bytes
    const bytes = await file.arrayBuffer();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    console.log('Calling Gemini API...');
    const prompt = `Analyze this stock chart image in detail and provide a structured analysis. Return ONLY a valid JSON object with the following structure:
    {
      "stockName": "full company name (e.g., 'Apple Inc.')",
      "stockSymbol": "exact stock symbol as used on TradingView (e.g., 'AAPL' for Apple). Do not include exchange prefixes like 'NASDAQ:'. Only provide the symbol itself.",
      "currentPrice": "exact current price",
      "weekRange": "52-week price range",
      "volume": "current trading volume",
      "peRatio": "current P/E ratio",
      "support": "key support level",
      "resistance": "key resistance level",
      "trend": "Uptrend/Downtrend/Sideways",
      "strategies": {
        "shortTerm": "detailed 1-3 month strategy",
        "mediumTerm": "detailed 3-6 month strategy",
        "longTerm": "detailed 6+ month strategy"
      },
      "recommendation": "final investment recommendation"
    }
    
    It is VERY IMPORTANT that you provide the correct TradingView stock symbol (e.g., 'AAPL', 'MSFT', 'GOOGL', etc.) in the stockSymbol field, as this will be used directly to load the chart. The symbol must be accurate and in the correct format without any exchange prefixes.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: Buffer.from(bytes).toString('base64')
        }
      }
    ]);

    console.log('Gemini API response received');
    const response = await result.response;
    let text = response.text();
    console.log('Raw response:', text);
    
    try {
      // Find JSON content between curly braces
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }
      
      const jsonText = jsonMatch[0].replace(/[\u201C\u201D]/g, '"'); // Replace smart quotes
      let analysis;
      try {
        analysis = JSON.parse(jsonText);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        return NextResponse.json(
          { error: "Failed to parse analysis results." },
          { status: 500 }
        );
      }

      // Validate required fields and their types
      const requiredFields = [
        'stockName', 'currentPrice', 'weekRange', 'volume', 'peRatio',
        'support', 'resistance', 'trend', 'strategies', 'recommendation'
      ];

      const missingFields = requiredFields.filter(field => !analysis[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Ensure trend is one of the allowed values
      if (!['Uptrend', 'Downtrend', 'Sideways'].includes(analysis.trend)) {
        analysis.trend = 'Sideways'; // Default to sideways if invalid
      }

      console.log('Analysis processed successfully');
      return NextResponse.json({ analysis });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json(
        { error: `Failed to parse analysis results: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl'); // Get the image URL from the query parameter
    const prompt = searchParams.get('prompt'); // Get the prompt from the query parameter

    // Return the prompt and image URL as a JSON response
    return NextResponse.json({ prompt, imageUrl });
}
