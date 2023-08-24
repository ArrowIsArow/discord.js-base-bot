const fs = require('fs');
const path = require('path');

const Events = require('../structures/Events');
const Loaders = require('../structures/Loaders');

module.exports = class loadEvents extends Loaders {

	/**
	 *
	 * @param {ExtendedClient} client
	 */
	constructor(client) {
		super(client);
		this.client = client;

		this.name = 'loadEvents';
	}

	load() {
		this.loadFolder('../events');
	}

	loadFolder(directory) {
		const filePath = path.join(__dirname, directory);
		const files = fs.readdirSync(filePath);

		for (const file of files) {
			const fileStat = fs.lstatSync(path.join(filePath, file));

			if (fileStat.isDirectory()) {
				this.loadFolder(path.join(directory, file));
			}
			else if (file.endsWith('.js')) {
				const Event = require(path.join(filePath, file));

				if (Event.prototype instanceof Events) {
					this.listenEvent(Event);
				}
			}
		}
	}

	async listenEvent(Event) {
		const event = new Event(this.client);

		await this.client.on(event.name, (...args) => event.run(...args));
	}

};
