import { Client as DiscordClient, Intents, Collection, Message } from "discord.js";
import { Client as DbClient } from "pg";
import Command from "./Command";
import Event from "./Event";
import CommandManager from "../utils/CommandManager";
import { readdirSync } from "fs";
import path from "path";

export default class Client extends DiscordClient {
  public commands: Collection<string, Command> = new Collection();
  public snipes: Collection<string, Collection<string, Message[]>> = new Collection();
  public db: DbClient = new DbClient({
		connectionString: process.env["PGURI"]
	});
  public constructor() {
    super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
    this.token = process.env["TOKEN"]!;
  }
	public commandManager: CommandManager = new CommandManager(this);
  public async start(token?: string): Promise<void> {
    this.login(token).then(() => console.log("Logging in..."));
    this.db.connect()
			.then(() => console.log("Conected to the database!"))
			.catch(e => console.error);

		this.db.query(`
		CREATE TABLE IF NOT EXISTS nicks ( id VARCHAR(18) PRIMARY KEY, nick VARCHAR(255) )
	`)
		.then(res => console.log("The database is now ready to use!"))
		.catch(e => console.error("Error while preparing database:\n"+e.stack));

		
    const commandFiles = readdirSync(path.join(__dirname, "..", "commands")).filter(file => file.endsWith('.ts')).filter(file => !file.endsWith('off.ts'));
    for (let file of commandFiles) {
      file = file.replace(/\.[^/.]+$/, "");
	    const command: Command = await import(`../commands/${file}`);
	    this.commands.set(command.data.name, command);	
    }

		const eventFiles = readdirSync(path.join(__dirname, "..", "events")).filter(file => file.endsWith('.ts')).filter(file => !file.endsWith('off.ts'));
		for (let file of eventFiles) {
			file = file.replace(/\.[^/.]+$/, "");
			const event: Event = await import(`../events/${file}`);
			if (event.once) {
				this.once(event.name, (...args) => event.run(this, ...args));
			} else {
				this.on(event.name, (...args) => event.run(this, ...args));
			}
		}
  }
}