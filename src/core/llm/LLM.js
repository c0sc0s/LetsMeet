"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var openai_1 = require("openai");
require("dotenv/config");
var LLM = /** @class */ (function () {
    function LLM(_a) {
        var modelId = _a.modelId, tools = _a.tools, systemPrompt = _a.systemPrompt, context = _a.context;
        this.messages = [];
        this.llm = new openai_1.default({
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
    LLM.prototype.chat = function (prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var res, content, toolCalls, _a, res_1, res_1_1, chunk, e_1_1;
            var _b, e_1, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("chat", prompt);
                        return [4 /*yield*/, this.llm.chat.completions.create({
                                model: this.modelId,
                                messages: [{ role: "user", content: prompt }],
                                stream: true,
                                tools: this.getToolsForOpenAI(),
                            })];
                    case 1:
                        res = _e.sent();
                        content = "";
                        toolCalls = [];
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 8, 13]);
                        _a = true, res_1 = __asyncValues(res);
                        _e.label = 3;
                    case 3: return [4 /*yield*/, res_1.next()];
                    case 4:
                        if (!(res_1_1 = _e.sent(), _b = res_1_1.done, !_b)) return [3 /*break*/, 6];
                        _d = res_1_1.value;
                        _a = false;
                        chunk = _d;
                        // 拼接完整的 content 
                        content += chunk.choices[0].delta.content || "";
                        // 补全生成的 tool call
                        if (chunk.choices[0].delta.tool_calls) {
                            console.log(chunk.choices[0].delta.tool_calls);
                        }
                        _e.label = 5;
                    case 5:
                        _a = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _e.trys.push([8, , 11, 12]);
                        if (!(!_a && !_b && (_c = res_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _c.call(res_1)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/, {
                            content: content,
                            toolCalls: toolCalls,
                        }];
                }
            });
        });
    };
    // tools
    LLM.prototype.getToolsForOpenAI = function () {
        return this.toolsValue.map(function (tool) { return ({
            type: "function",
            function: tool,
        }); });
    };
    LLM.prototype.addTool = function (tool) {
        this.toolsValue.push(tool);
    };
    LLM.prototype.setTools = function (tools) {
        this.toolsValue = tools;
    };
    return LLM;
}());
exports.default = LLM;
