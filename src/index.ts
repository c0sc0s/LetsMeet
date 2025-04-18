import LLM from "./core/llm";
import "dotenv/config";

const test = new LLM(process.env.ARK_MODEL_ID!);

test.chat("你好");
