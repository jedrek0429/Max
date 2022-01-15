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
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = {
    name: "whois",
    description: "I will tell you who someone is!",
    options: [
        {
            type: discord_js_1.Constants.ApplicationCommandOptionTypes.USER,
            name: "user",
            description: "Whose nick should i check for you?",
            required: true
        }
    ]
};
const run = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const client = interaction.client;
    client.db.query(`
		SELECT nick FROM nicks WHERE id = $1
	`, [interaction.options.getUser("user").id])
        .then(res => {
        interaction.reply(`${interaction.options.getUser("user")}'S NICKNAME IS \`${res.rows[0].toString()}\`.`);
    })
        .catch(e => {
        interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        console.error(e.stack);
    });
});
exports.run = run;
