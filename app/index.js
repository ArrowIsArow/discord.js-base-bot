const { Client, GatewayIntentBits, Partials, ActivityType, Events } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env' });

const Loaders = require('./structures/Loaders');

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds
	],
	partials: [
		Partials.Channel,
		Partials.Message
	]
});

client.on(Events.ClientReady, (c) => {
	c.user.setActivity({
		type: ActivityType.Listening, // here you can change the status type, whether Playing, Listening, Streaming or Custom.
		name: 'github.com/rablonkk' // here, you can change the statuses of your application.
	});

	console.log(`[DiscordJS API] Logged as ${c.user.username}`);
});

client.on(Events.Error, (err) => {
	console.log(`[Client ERROR] `, err);
});

process.on('unhandledRejection', (reason) => {
	console.log(`[ERROR] `, reason);
});

function startStructures(directory) {
	const filePath = path.join(__dirname, directory);
	const files = fs.readdir(filePath);

	for (const file of files) {
		const fileStat = fs.lstat(path.join(filePath, file));

		if (fileStat.isDirectory()) {
			startStructures(path.join(directory, file));
		} else if (file.endsWith('.js')) {
			const Loader = require(path.join(filePath, file));

			if (Loader.prototype instanceof Loaders) {
				const loader = new Loader(client);

				loader.load();
			}
		}
	}
}

startStructures('./loaders');
client.login(process.env.TOKEN)