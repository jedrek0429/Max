import { ClientEvents, Message } from "discord.js";
import Client from "../utils/Client";
import { inspect } from "util";

export const name: keyof ClientEvents = "messageCreate";
export const run = async (client: Client, msg: Message) => {
	if (msg.author.bot || !["593387576317050890", "710772337045143572"].includes(msg.author.id)) return;
	if (msg.content.toLowerCase().startsWith("eval")) {
		const args = msg.content.split(" ").slice(1);
		try {
      const evaled = eval(args.join(" "));
      const cleaned = await clean(evaled, client)
			msg.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
    } catch (err) {
			const cleaned = await clean(err.toString(), client);
      msg.reply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
	}
}

const clean = async (text: any, client: Client) => {
	if (text.constructor.name == "Promise")
  	text = await text;

  text = inspect(text);

	text = text
  	.replace(/`/g, "`" + String.fromCharCode(8203))
  	.replace(/@/g, "@" + String.fromCharCode(8203));
	text = text.replaceAll(client.token, "!{{TOKEN}}!");
	return text.replaceAll(process.env["PGURI"], "!{{PGURI}}!");;
}
