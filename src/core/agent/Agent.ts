import LLM from "../llm/LLM";
import MCPClient from "../mcp/McpClient";
import "dotenv/config";
import MCPMangement from "../mcp/MCPMangement";

interface AgentConfig {
  model: string;
  mcpClients?: MCPClient[];
  systemPrompt?: string;
  context?: string;
}

export default class Agent {
  private llm: LLM | null = null;
  private mcpMangement: MCPMangement | null = null;

  private model: string;
  private systemPrompt: string;
  private context?: string;
  private mcpClients: MCPClient[];

  isOK: boolean = false;

  constructor({
    model,
    mcpClients = [],
    systemPrompt = '',
    context = '',
  }: AgentConfig) {
    this.model = model;
    this.systemPrompt = systemPrompt;
    this.context = context;
    this.mcpClients = mcpClients;
  }

  private async _initMCP() {
    this.mcpMangement = new MCPMangement(this.mcpClients);
    await this.mcpMangement.start();
  }

  private async _initLLM() {
    this.llm = new LLM({
      modelId: this.model,
      systemPrompt: this.systemPrompt,
      context: this.context,
      tools: this.mcpMangement?.listTools() || [],
    })
  }

  async init() {
    this.isOK = false;
    await this._initMCP();
    await this._initLLM();
    this.isOK = true;
  }

  async chat(prompt: string) {
    try {
      const { content, toolCalls } = await this.llm?.chat(prompt) || {};
      // return content;
    } catch (error) {
      return null;
    }
  }
}

