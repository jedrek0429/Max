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
const typescript_1 = require("typescript");
const child_process_1 = require("child_process");
const exec = util_1.promisify(child_process_1.exec);
exports.name = "messageCreate";
const run = (client, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.bot || !["593387576317050890", "710772337045143572", "709685885431578634"].includes(msg.author.id))
        return;
    const code = msg.content.split(" ").slice(1).join(" ");
    if (msg.content.toLowerCase().startsWith("jseval")) {
        try {
            const evaled = eval(code);
            const cleaned = yield clean(evaled, client);
            msg.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
        }
        catch (err) {
            const cleaned = yield clean(err.toString(), client);
            msg.reply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
        }
    }
    else if (msg.content.toLowerCase().startsWith("tseval") || msg.content.toLowerCase().startsWith("eval")) {
        try {
            const evaled = eval(typescript_1.transpile(code));
            const cleaned = yield clean(evaled, client);
            msg.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
        }
        catch (err) {
            const cleaned = yield clean(err.toString(), client);
            msg.reply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
        }
    }
    else if (msg.content.toLowerCase().startsWith("exec")) {
        const toExec = code;
        msg.reply("Executing...")
            .then((m) => {
            exec(toExec)
                .then(result => {
                if (result.stderr)
                    m.edit(`\`ERROR\`\n\`\`\`xl\n${result.stderr}\n\`\`\``);
                m.edit(`\`\`\`xl\n${result.stdout.toString().trim()}\n\`\`\``);
            })
                .catch(e => m.edit(`\`ERROR\`\n\`\`\`xl\n${e}\n\`\`\``));
        });
    }
});
exports.run = run;
const clean = (text, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = text.constructor) === null || _a === void 0 ? void 0 : _a.name) == "Promise")
        text = yield text;
    text = util_1.inspect(text);
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    text = text.replaceAll(client.token, "!{{TOKEN}}!");
    return text.replaceAll(process.env["PGURI"], "!{{PGURI}}!");
    ;
});
