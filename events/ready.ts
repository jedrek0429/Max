import { ClientEvents } from "discord.js";
import Client from "../utils/Client";
import express from "express";

export const name: keyof ClientEvents = "ready";
export const run = async (client: Client) => {

	const api = express();
		
	const router = express.Router();
	router.get('/users/:id', (req, res) => {
		res.send(client.users.cache.get(req.params.id))
	});
	api.use('/api', router);
	

	client.commandManager.setup();
	console.log(`${client.user?.username} is ready.`);
	api.listen(3000, () => {
		console.log("Api listening on port 3000.")
	});

}