import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Configure the API with your API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-1.5-pro';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Capture a screenshot of the current page
 */
export const captureScreenshot = async (): Promise<string | null> => {
  try {
    // Use html2canvas to capture the screenshot
    // We need to dynamically import it since it's a client-side only library
    const html2canvas = (await import('html2canvas')).default;
    
    // Capture visible content
    const canvas = await html2canvas(document.body);
    
    // Convert to base64 data URL (JPEG format with 0.8 quality)
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Return base64 data
    return imageData;
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    return null;
  }
};

/**
 * Send a message with optional screenshot to Gemini API
 */
export const sendMessageToGemini = async (
  message: string,
  includeScreenshot: boolean = false
): Promise<string> => {
  try {
    // Create a new chat for each request (stateless approach)
    // This avoids issues with history formatting
    const chat = model.startChat({
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    if (includeScreenshot) {
      // Capture the screenshot
      const screenshot = await captureScreenshot();
      
      if (screenshot) {
        // Create a message with text and image
        const result = await model.generateContent([
          message,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: screenshot.split(',')[1] // Remove the data URL prefix
            }
          }
        ]);
        
        return result.response.text();
      }
    }
    
    // If no screenshot or screenshot failed, just send the text
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    return "I'm having trouble connecting to my AI services. Please try again later.";
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = () => {
  chatHistory = [];
  return true;
}; 