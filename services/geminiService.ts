import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getScanExplanation(scanType: string): Promise<string> {
  try {
    const prompt = `Explain what a "${scanType}" is in simple, easy-to-understand terms for a patient. Keep it concise, under 100 words, and focus on what the patient can expect.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // FIX: Added config to limit output tokens for conciseness, as requested by the prompt.
      config: {
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 20 },
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching scan explanation:", error);
    throw new Error("Could not fetch an explanation at this time. Please check your network and try again.");
  }
}

/**
 * Returns a response from the Gemini model based on the user's prompt.
 * @param prompt The user's question or message.
 * @returns The chatbot's text response.
 */
export async function getChatbotResponse(prompt: string): Promise<string> {
  try {
    const systemInstruction = `You are a friendly and helpful virtual assistant for the JSS Hospital's Radiology Department in Mysuru. 
Your role is to answer patient questions about scheduling, scan types (like MRI, CT, X-Ray), their costs, machine availability, and general hospital information (location, contact).
Keep your answers concise, clear, and easy to understand.
Do NOT provide medical advice, diagnoses, or interpret scan results. If asked for medical advice, gently decline and advise the user to consult with their doctor.
Here is some context about the hospital and services:
- Location: JSS Hospital, M.G. Road, Agrahara, Mysuru, Karnataka 570004
- Phone: +91-821-254-8400
- Scan Prices: MRI Brain: Rs. 8000, CT Chest: Rs. 5000, X-Ray Knee: Rs. 1200, Ultrasound Abdomen: Rs. 2500, PET Scan: Rs. 25000, Mammography: Rs. 3500.
- Operating Hours: 10 AM to 1 PM, and 2 PM to 9 PM.
- You can provide information but cannot book or cancel appointments directly through chat. For that, they must use the scheduling form.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    throw new Error("I'm having trouble connecting right now. Please try again in a moment.");
  }
}
