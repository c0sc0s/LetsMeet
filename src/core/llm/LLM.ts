import OpenAI from "openai";
import "dotenv/config";
import { Tool } from "@anthropic-ai/sdk/resources/messages/messages";
import { ToolCall } from "openai/resources/beta/threads/runs/steps";

interface LLMConfig {
  modelId: string;
  tools: Tool[];
  systemPrompt: string;
  context?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

interface ChatResponse {
  content: string;
  toolCalls: ToolCall[];
}

class LLM {
  private llm: OpenAI;
  private modelId: string;
  private toolsValue: Tool[];
  private context?: string;
  private systemPrompt?: string;
  private messages: Message[] = [];

  constructor({ modelId, tools, systemPrompt, context }: LLMConfig) {
    this.llm = new OpenAI({
      apiKey: process.env.ARK_API_KEY,
      baseURL: process.env.ARK_BASE_URL,
    });
    this.modelId = modelId;
    this.toolsValue = tools;
    this.systemPrompt = systemPrompt;
    this.context = context;

    if (systemPrompt) {
      this.messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    if (context) {
      this.messages.push({
        role: "user",
        content: context,
      });
    }
  }

  // chat
  async chat(prompt: string) {
    console.log("chat", prompt);
    const res = await this.llm.chat.completions.create({
      model: this.modelId,
      messages: [{ role: "user", content: prompt }],
      stream: true,
      tools: this.getToolsForOpenAI(),
    });

    // 处理 stream 的 response
    let content = "";
    let toolCalls: ToolCall[] = [];

    for await (const chunk of res) {
      // 拼接完整的 content 
      content += chunk.choices[0].delta.content || "";

      // 补全生成的 tool call
      if (chunk.choices[0].delta.tool_calls) {
        console.log(chunk.choices[0].delta.tool_calls);
      }
    }

    return {
      content,
      toolCalls,
    };
  }

  // tools
  getToolsForOpenAI() {
    return this.toolsValue.map((tool) => ({
      type: "function" as const,
      function: tool,
    }));
  }

  addTool(tool: Tool) {
    this.toolsValue.push(tool);
  }

  setTools(tools: Tool[]) {
    this.toolsValue = tools;
  }
}

export default LLM;