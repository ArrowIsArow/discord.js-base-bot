const { Client, GatewayIntentBits, Partials, ActivityType, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const Loaders = require('./structures/Loaders');

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
	],
});

client.on(Events.ClientReady, () => {
	console.log(`[DiscordJS] Logged as ${client.user.username}`);

	client.user.setActivity({
		name: 'github.com/rablonkk',
		type: ActivityType.Playing,
	});
});

client.on(Events.Error, (err) => {
	console.log('[Client ERROR] ', err);
});

process.on('unhandledRejection', (reason) => {
	console.log('[ERROR] ', reason);
});

function startStructures(directory) {
	const filePath = path.join(__dirname, directory);
	const files = fs.readdirSync(filePath);

	for (const file of files) {
		const fileStat = fs.lstatSync(path.join(filePath, file));

		if (fileStat.isDirectory()) {
			startStructures(path.join(directory, file));
		}
		else if (file.endsWith('.js')) {
			const Loader = require(path.join(filePath, file));

			if (Loader.prototype instanceof Loaders) {
				const loader = new Loader(client);

				loader.load();
			}
		}
	}
}

(async () => {
	startStructures('./loaders');
	await client.login(process.env.TOKEN);
})();