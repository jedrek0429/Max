import { ApplicationCommandData, CommandInteraction, Constants } from "discord.js";
import Client from "../utils/Client";
import { inspect } from "util";

export const data: ApplicationCommandData = {
  name: "whois",
  description: "I will tell you who someone is!",
	options: [
		{
			type: Constants.ApplicationCommandOptionTypes.USER,
			name: "user",
			description: "Whose nick should i check for you?",
			required: true
		}
	]
}

export const run = async (interaction: CommandInteraction) => {
	const client = interaction.client as Client;
	client.db.query(`
		SELECT nick FROM nicks WHERE id = $1
	`, [interaction.options.getUser("user")!.id])
		.then(res => {		interaction.reply(`${interaction.options.getUser("user")}'S NICKNAME IS \`${res.rows[0].toString()}\`.`); 
		})
		.catch(e => {
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); 
			console.error(e.stack)
		});
}