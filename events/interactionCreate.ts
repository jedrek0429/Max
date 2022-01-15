import { ClientEvents, Interaction } from "discord.js";
import Client from "../utils/Client";

export const name: keyof ClientEvents = "interactionCreate";

export const run = async (client: Client, interaction: Interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.run(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}
