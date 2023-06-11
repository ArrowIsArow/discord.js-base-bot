const Events = require('../structures/Events');
const Config = require('../config/Config');
const SlashEvents = require('../utils/SlashEvents');

module.exports = class Ready extends Events {

	/**
	 *
	 * @param {ExtendedClient} client
	 */
	constructor(client) {
		super(client);
		this.client = client;

		this.name = 'ready';
	}

	async run() {
		this.client.config = Config;

		this.client.slash = new SlashEvents(this.client);
		await this.client.slash.verifyCommands();

		this.client.on('error', (err) => {
			console.log(`[DiscordJS API ERROR] `, err);
		});

		process.on('unhandledRejection', (reason) => {
			console.log(`[APPLICATION ERROR] `, reason);
		});

		process.on('uncaughtException', (err) => {
			console.log(`[uncaughtException ERROR] `, err);
		});

		process.on('uncaughtExceptionMonitor', (err) => {
			console.log(`[uncaughtExceptionMonitor ERROR] ${err}`);
		});

		process.on('warning', (warn) => {
			console.log(`[APPLICATION WARN] `, warn);
		});
	}

};
