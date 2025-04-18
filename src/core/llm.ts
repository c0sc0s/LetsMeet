import OpenAI from "openai";
import "dotenv/config";

class LLM {
  private llm: OpenAI;
  private modelId: string;

  constructor(modelId: string) {
    this.llm = new OpenAI({
      apiKey: process.env.ARK_API_KEY,
      baseURL: process.env.ARK_BASE_URL,
    });
    this.modelId = modelId;
  }

  async chat(prompt: string) {
    const res = await this.llm.chat.completions.create({
      model: this.modelId,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of res) {
      console.log(chunk.choices[0].delta.content);
    }
  }
}

export default LLM;