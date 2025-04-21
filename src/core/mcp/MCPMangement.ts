import MCPClient from "./McpClient";
import { Tool } from "@anthropic-ai/sdk/resources/messages/messages";

// 管理所有 MCP
class MCPMangement {
  private mcpClients: MCPClient[];
  private isProcessing: boolean = false;
  private tools: Tool[] = [];

  constructor(mcpClients: MCPClient[]) {
    this.mcpClients = mcpClients;
  }

  public listTools() {
    if (!this.isProcessing) {
      return [];
    }
    return this.tools;
  }

  async start() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;

    // 连接所有 MCP Server
    await Promise.all(this.mcpClients.map(i => i.init()));
    // 获取所有 MCP 的工具
    this.tools = this.mcpClients.flatMap(mcpClient => mcpClient.getTools());
    console.log("tools", this.tools);
  }

  async close() {
    await Promise.all(this.mcpClients.map(i => i.close));
  }
}

export default MCPMangement;