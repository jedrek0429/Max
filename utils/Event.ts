import { ClientEvents } from "discord.js";
import Client from "./Client";

export default interface Event {
	name: keyof ClientEvents;
	once?: boolean;
	run: (client: Client, ...args: any[]) => Promise<void>;
}