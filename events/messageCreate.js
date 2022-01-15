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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
const util_1 = require("util");
exports.name = "messageCreate";
const run = (client, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.bot || !["593387576317050890", "710772337045143572"].includes(msg.author.id))
        return;
    if (msg.content.toLowerCase().startsWith("eval")) {
        const args = msg.content.split(" ").slice(1);
        try {
            const evaled = eval(args.join(" "));
            const cleaned = yield clean(evaled, client);
            msg.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
        }
        catch (err) {
            const cleaned = yield clean(err.toString(), client);
            msg.reply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
        }
    }
});
exports.run = run;
const clean = (text, client) => __awaiter(void 0, void 0, void 0, function* () {
    if (text.constructor.name == "Promise")
        text = yield text;
    text = util_1.inspect(text);
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    text = text.replaceAll(client.token, "!{{TOKEN}}!");
    return text.replaceAll(process.env["PGURI"], "!{{PGURI}}!");
    ;
});
