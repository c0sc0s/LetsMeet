import Agent from "./core/agent/Agent";
import LLM from "./core/llm/LLM";
import "dotenv/config";
import MCPClient from "./core/mcp/McpClient";
import { spawn } from "child_process";

console.log(process.env.PATH);

const agentTestConfig = {
  model: process.env.ARK_MODEL_ID!,
  mcpClients: [
    new MCPClient({
      name: "amap-maps",
      command: "npx",
      "args": ["-y", "@amap/amap-maps-mcp-server"],
      "env": {
        "AMAP_MAPS_API_KEY": "3fc2fcc0366c2d43759aa90edfc2c505"
      }
    }),
  ],
}

async function main() {
  console.log("start");
  const testAgent = new Agent(agentTestConfig)

  await testAgent.init();

  // const res = await testAgent.chat("你好");
}

main();
