"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./utils/Client"));
const http_1 = __importDefault(require("http"));
const client = new Client_1.default();
client.start();
http_1.default.createServer((req, res) => res.end('repl.it host 24/7')).listen(3000);
