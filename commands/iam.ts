import { ApplicationCommandData, CommandInteraction, Constants } from "discord.js";
import Client from "../utils/Client";

export const data: ApplicationCommandData = {
  name: "iam",
  description: "Tell me who you are!",
	options: [
		{
			type: Constants.ApplicationCommandOptionTypes.STRING,
			name: "nick",
			description: "What nick should i use for you?",
			required: true
		}
	]
}

export const run = async (interaction: CommandInteraction) => {
	const client = interaction.client as Client;
	client.db.query(`
		INSERT INTO nicks (id, nick)
		VALUES ($1, $2)
		ON CONFLICT (id) DO UPDATE 
  		SET id = excluded.id, 
      		nick = excluded.nick;
	`, [interaction.member?.user.id || interaction.user.id!, interaction.options.getString("nick")])
		.then(res => {
			interaction.reply(`YOUR NICKNAME HAS BEEN SUCCESSFULLY SET TO \`${interaction.options.getString("nick")}\`.`); 
		})
		.catch(e => {
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); 
			console.error(e.stack)
		});
}