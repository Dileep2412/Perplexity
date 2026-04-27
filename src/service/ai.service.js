import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAI(){
    model.invoke("Tell about Rohit Sharma in 100 words in points?").then((response) => {
        console.log("AI Response:", response);
    });
}