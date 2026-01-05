import { GoogleGenAI } from "@google/genai";

// const GEMINI = import.meta.env.GEMINI as string;


const ai = new GoogleGenAI({
  apiKey: "AIzaSyBky_MZWWc_KJj88S5v6lPsFdirwKPEW5E",
});

const getAiResponse = async (data: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `"${data}", this is a content in a blog. I need a brif explanation to get the idea faster. make sure ony summery send no greeting or start prases just breif explanation.`,
    });
    console.log(response.text);
    return response.text;
  } catch (err: any) {
    console.error("AI Response Error:", err);
    
    if (err.message && err.message.includes("429")) {
      return "error-429";
    }
    
    if (err.message && err.message.includes("403")) {
      return "403 error"; 
    }
    
    if (err.status === 403 || err.code === 403) {
      return "test error";
    }

    if (err.response && err.response.status === 403) {
      return "test error";
    }
    return "error";
  }
};

export default getAiResponse;
