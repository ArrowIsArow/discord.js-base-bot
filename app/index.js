const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const Loaders = require('./structures/Loaders');

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds
	],
	partials: [
		Partials.Channel,
		Partials.Reaction,
		Partials.Message
	],
	presence: {
		status: 'online',
		activities: [
			{
				type: ActivityType.Playing,
				name: 'github.com/rablonkk'
			}
		]
	}
});

client.on('ready', () => {
	console.log(`[DiscordJS API] Logged as ${client.user.username}`);
});

function startStructures(directory) {
	const filePath = path.join(__dirname, directory);
	const files = fs.readdirSync(filePath);

	for (const file of files) {
		const fileStat = fs.lstatSync(path.join(filePath, file));

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
client.login(process.env.TOKEN);
