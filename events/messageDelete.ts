import { ClientEvents, Collection, Message } from "discord.js";
import Client from "../utils/Client";

export const name: keyof ClientEvents = "messageDelete";
export const run = async (client: Client, msg: Message) => {
	if (msg.guild) {
    if (client.snipes.has(msg.guild.id)) {
			console.log("This guild is in ram")
        if (!client.snipes.has(msg.channel.id)) {
					console.log("This channel is in ram");
					client.snipes.get(msg.guild.id)!.set(msg.channel.id, []);
				}
			client.snipes.get(msg.guild.id)!.get(msg.channel.id)!.push(msg);
    } else {
			console.log("This guid is not in ram")
        client.snipes.set(msg.guild.id, new Collection());
        client.snipes.get(msg.guild.id)!.set(msg.channel.id, [msg]);
    }
}
}