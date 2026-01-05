import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDjXGr2F_ijw-BslrqjIJbe67k4Avyiebo",
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
    if(err.includes("429")){
      return "error-429"
    }
    return "error"
  }
};

export default getAiResponse;
