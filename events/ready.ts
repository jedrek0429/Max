import { ClientEvents } from "discord.js";
import Client from "../utils/Client";

export const name: keyof ClientEvents = "ready";
export const run = async (client: Client) => {
	console.log(`${client.user?.username} is ready.`);
	client.commandManager.setup();
	await dbSetup(client);
}

const dbSetup = (client: Client) => {
	client.db.query(`
		CREATE TABLE IF NOT EXISTS nicks ( id VARCHAR(18) PRIMARY KEY, nick VARCHAR(255) )
	`)
		.then(res => console.log("The database is now ready to use!"))
		.catch(e => console.error("Error while preparing database:\n"+e.stack));
}