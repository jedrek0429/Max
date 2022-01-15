import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Client from "../utils/Client";
import { inspect } from "util";

export const data: ApplicationCommandData = {
  name: "whoami",
  description: "I will tell you who you are!"
}

export const run = async (interaction: CommandInteraction) => {
	const client = interaction.client as Client;
	client.db.query(`
		SELECT nick FROM nicks WHERE id = $1
	`, [interaction.member?.user.id || interaction.user.id!])
		.then(res => {
			interaction.reply(`YOUR NICKNAME IS \`${res.rows[0].nick}\`.`); 
		})
		.catch(e => {
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); 
			console.error(e.stack)
		});
}