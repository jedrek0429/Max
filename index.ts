import Client from "./utils/Client";
import http from "http";
const client = new Client();

client.start();
global.replitHost = http.createServer((req, res) => res.end('repl.it host 24/7')).listen(3000);