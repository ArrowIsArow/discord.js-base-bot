const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

const Commands = require('../../structures/Commands');

module.exports = class Ping extends Commands {

	/**
	 *
	 * @param {ExtendedClient} client
	 */
	constructor(client) {
		super(client);
		this.client = client;

		this.name = 'ping';
		this.description = 'Check ping the bot';

		// the example below will show you how you can make the command options, or a subcommand.
		this.options = [
			/*{
				name: 'test',
				description: 'test'
				type: ApplicationCommandOptionType.Subcommand,
				choices: [
					{
						name: 'test',
						value: 'test'
					}
				],
				required: true
			}*/
		];

		this.category = 'utility';

		this.enabled = true;
		this.ignoreSlash = false;
	}

	runAsInteraction(interaction) {
		const pingEmbed = new EmbedBuilder({ color: this.client.config.colors.embed })
			.setDescription(`📡 API latency: \`${Math.round(interaction.client.ws.ping)}ms.\`\n🏓 Response time: \`${Date.now() - interaction.createdTimestamp}ms.\``);

		interaction.reply({ embeds: [pingEmbed], ephemeral: true });
	}

};
