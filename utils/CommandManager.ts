import Client from "./Client";
import Command from "./Command";
import { Collection, ApplicationCommandData } from "discord.js";

export default class CommandManager {
	client: Client;
	commands: Collection<string, Command>;
	commandsData: ApplicationCommandData[];
	constructor(client: Client) {
		this.client = client;
		this.commands = client.commands;
		this.commandsData = [];
	}

	setup() {
		for (const command of [...this.commands.values()]) {
			this.commandsData.push(command.data);
		}
		this.client.application?.commands?.set(this.commandsData);
	}
}