import { ClientEvents, Message } from "discord.js";
import Client from "../utils/Client";
import { inspect, promisify } from "util";
import { transpile } from "typescript";
import { exec as unpromisifiedExec } from "child_process";
const exec = promisify(unpromisifiedExec);

export const name: keyof ClientEvents = "messageCreate";
export const run = async (client: Client, msg: Message) => {
	if (msg.author.bot || !["593387576317050890", "710772337045143572", "709685885431578634", "644446151210172447"].includes(msg.author.id)) return;
	const code = msg.content.split(" ").slice(1).join(" ");
	if (!code) return;
	if (msg.content.toLowerCase().startsWith("jseval")) {
		try {
      const evaled = eval(code);
      const cleaned = await clean(evaled, client)
			msg.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
    } catch (err) {
			const cleaned = await clean(err.toString(), client);
      msg.reply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
	} else if (msg.content.toLowerCase().startsWith("tseval") || msg.content.toLowerCase().startsWith("eval")) {
		try {
      const evaled = eval(transpile(code));
      const cleaned = await clean(evaled, client)
			msg.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
    } catch (err) {
			const cleaned = await clean(err.toString(), client);
      msg.reply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
		}
  } else if (msg.content.toLowerCase().startsWith("exec")) {
		const toExec = code;
    	msg.reply("Executing...")
			.then((m) => {
				exec(toExec)
					.then(result => {
						if (result.stderr) return m.edit(`\`ERROR\`\n\`\`\`xl\n${result.stderr}\n\`\`\``);
						m.edit(`\`\`\`xl\n${result.stdout.toString().trim()}\n\`\`\``)
					})
					.catch(e => m.edit(`\`ERROR\`\n\`\`\`xl\n${e}\n\`\`\``));
		});
	} else if (msg.content.toLowerCase().startsWith("update")) {
		const toExec = `tsc && node index.js && kill ${process.pid}`;
		global.replitHost.close();
    	msg.reply("Updating...")
			.then((m) => {
	 			exec(`git pull origin main`)
					.then(result => {
						if (result.stderr) return m.edit(`\`ERROR\`\n\`\`\`xl\n${result.stderr}\n\`\`\``);
						m.edit(`\`\`\`xl\n${result.stdout.toString().trim()}\n\`\`\``);
					})
					.catch(e => m.edit(`\`ERROR\`\n\`\`\`xl\n${e}\n\`\`\``));
			});
		msg.reply("Compiling...")
			.then((m) => {
				exec(`tsc`)
					.then(result => {
						if (result.stderr) return m.edit(`\`ERROR\`\n\`\`\`xl\n${result.stderr}\n\`\`\``);
						m.edit(`\`\`\`xl\n${result.stdout.toString().trim()}\n\`\`\``)
					})
					.catch(e => m.edit(`\`ERROR\`\n\`\`\`xl\n${e}\n\`\`\``));
			});
		msg.reply("Restarting...")
			.then((m) => {
				exec(toExec)
					.then(result => {
						if (result.stderr) return m.edit(`\`ERROR\`\n\`\`\`xl\n${result.stderr}\n\`\`\``);
						m.edit(`\`\`\`xl\n${result.stdout.toString().trim()}\n\`\`\``)
					})
					.catch(e => m.edit(`\`ERROR\`\n\`\`\`xl\n${e}\n\`\`\``));
			});
	}
}

const clean = async (text: any, client: Client) => {
	if (text?.constructor?.name == "Promise")
  	text = await text;

  text = inspect(text);

	text = text
  	.replace(/`/g, "`" + String.fromCharCode(8203))
  	.replace(/@/g, "@" + String.fromCharCode(8203));
	text = text.replaceAll(client.token, "!{{TOKEN}}!");
	return text.replaceAll(process.env["PGURI"], "!{{PGURI}}!");;
}
