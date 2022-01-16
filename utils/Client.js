"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const pg_1 = require("pg");
const CommandManager_1 = __importDefault(require("../utils/CommandManager"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
class Client extends discord_js_1.Client {
    constructor() {
        super({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
        this.commands = new discord_js_1.Collection();
        this.db = new pg_1.Client({
            connectionString: process.env["PGURI"]
        });
        this.commandManager = new CommandManager_1.default(this);
        this.token = process.env["TOKEN"];
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.login().then(() => console.log("Logging in..."));
            this.db.connect()
                .then(() => console.log("Conected to the database!"))
                .catch(e => console.error);
            const commandFiles = fs_1.readdirSync(path.join(__dirname, "..", "commands")).filter(file => file.endsWith('.ts')).filter(file => !file.endsWith('off.ts'));
            for (let file of commandFiles) {
                file = file.replace(/\.[^/.]+$/, "");
                const command = yield Promise.resolve().then(() => __importStar(require(`../commands/${file}`)));
                this.commands.set(command.data.name, command);
            }
            const eventFiles = fs_1.readdirSync(path.join(__dirname, "..", "events")).filter(file => file.endsWith('.ts')).filter(file => !file.endsWith('off.ts'));
            for (let file of eventFiles) {
                file = file.replace(/\.[^/.]+$/, "");
                const event = yield Promise.resolve().then(() => __importStar(require(`../events/${file}`)));
                if (event.once) {
                    this.once(event.name, (...args) => event.run(this, ...args));
                }
                else {
                    this.on(event.name, (...args) => event.run(this, ...args));
                }
            }
        });
    }
}
exports.default = Client;
