import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenAI } from "@google/genai";
import { error } from "console";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || ""});

export const generateSummaryFromGemini = async (pdfText:string) =>{
    try {
        
        const response = await ai.models.generateContent({
            model: "gemini-1.5-pro-002",
            contents: [{
                role:"user",
                parts:[
                    {text:SUMMARY_SYSTEM_PROMPT},
                    {
                        text:`${SUMMARY_SYSTEM_PROMPT}\n\n Transform this document into an engaging, easy to read summary 
                            with contextually relevent emojis and proper markdown formatting:\n\n ${pdfText}`,
                    }
                ]
            }],
        });

        if(!response.text){
            throw new Error("Empty response from gemini API");
        }

        const result = response.text;

        return result;
        
        

    } catch (error:any) {
        
        console.error("Gemini API Error:",error);
        throw error;       
    }
        
        
    
}