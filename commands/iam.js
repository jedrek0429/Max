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
    name: "iam",
    description: "Tell me who you are!",
    options: [
        {
            type: discord_js_1.Constants.ApplicationCommandOptionTypes.STRING,
            name: "nick",
            description: "What nick should i use for you?",
            required: true
        }
    ]
};
const run = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = interaction.client;
    client.db.query(`
		INSERT INTO nicks (id, nick)
		VALUES ($1, $2)
		ON CONFLICT (id) DO UPDATE 
  		SET id = excluded.id, 
      		nick = excluded.nick;
	`, [((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id) || interaction.user.id, interaction.options.getString("nick")])
        .then(res => {
        interaction.reply(`YOUR NICKNAME HAS BEEN SUCCESSFULLY SET TO \`${interaction.options.getString("nick")}\`.`);
    })
        .catch(e => {
        interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        console.error(e.stack);
    });
});
exports.run = run;
