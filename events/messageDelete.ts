import { ClientEvents, Collection, Message } from "discord.js";
import Client from "../utils/Client";

export const name: keyof ClientEvents = "messageDelete";
export const run = async (client: Client, msg: Message) => {
	if (msg.guild) {
    if (client.snipes.get(msg.guild.id)) {
        if (!client.snipes.get(msg.channel.id)) {
            client.snipes.get(msg.guild.id)!.set(msg.channel.id, [msg]);
        } else {
            client.snipes.get(msg.guild.id)!.get(msg.channel.id)!.push(msg);
        }
    } else {
        client.snipes.set(msg.guild.id, new Collection());
        client.snipes.get(msg.guild.id)!.set(msg.channel.id, [msg]);
    }
}
}