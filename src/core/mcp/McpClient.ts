import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";
import { Tool } from "@anthropic-ai/sdk/resources/messages/messages";

dotenv.config();

interface MCPClientConfig {
  name: string;
  version?: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

// 一个 MCPClient 对接一个 MCPServer
class MCPClient {
  private mcp: Client;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];
  private command: string = '';
  private args: string[] = [];
  private env: Record<string, string> = {};
  private name: string = '';
  private version: string = '1.0.0';

  constructor({ name, version = "1.0.0", command, args = [], env = {} }: MCPClientConfig) {
    this.command = command;
    this.args = args;
    this.env = env;
    this.name = name;
    this.version = version;

    this.mcp = new Client({ name: this.name, version: this.version });
  }


  getTools() {
    return this.tools;
  }

  init() {
    console.log("init", this)
    this.connectToServer();
  }

  close() {
    this.transport?.close();
  }

  private async connectToServer() {
    try {
      console.log("connectToServer", this.command, this.args, this.env);
      // 与 server 交互的 stdio 传输
      this.transport = new StdioClientTransport({
        command: this.command,
        args: this.args,
        env: this.env,
      });

      this.mcp.connect(this.transport);

      // 获取 server 的工具列表
      const toolsResult = await this.mcp.listTools();

      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        };
      });

      console.log(
        "Connected to server with tools:",
        this.tools.map(({ name }) => name)
      );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }
}

export default MCPClient;