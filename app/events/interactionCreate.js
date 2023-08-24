const { InteractionType, ChannelType, EmbedBuilder } = require('discord.js');

const Events = require('../structures/Events');

module.exports = class interactionCreate extends Events {

	/**
     *
     * @param {ExtendedClient} client
     */
	constructor(client) {
		super(client);
		this.client = client;

		this.name = 'interactionCreate';
	}

	async run(interaction) {
		if (interaction.type === InteractionType.ApplicationCommand) {
			const command = this.client.commands.get(interaction.commandName);

			if (command.ignoreSlash) {
				return this.IgnoreSlash(interaction);
			}

			if (!command) {
				return this.unknownCommand(interaction);
			}

			if (!command.enabled) {
				return this.commandDisabled(interaction);
			}

			if (interaction.channel.type === ChannelType.DM) {
				return this.DmCommand(interaction);
			}

			try {
				command.runAsInteraction(interaction);
			}
			catch (error) {
				this.commandError(interaction);
				console.log('[InteractionCreate ERROR] ', error);
			}
		}
	}

	async unknownCommand(interaction) {
		const unknownEmbed = new EmbedBuilder({ color: this.client.config.colors.error })
			.setDescription('❌ Unknown command');

		await interaction.reply({
			embeds: [unknownEmbed],
			ephemeral: true,
		});
	}

	async commandDisabled(interaction) {
		const disabledEmbed = new EmbedBuilder({ color: this.client.config.colors.error })
			.setDescription('❌ This command is currently disabled!');

		await interaction.reply({
			embeds: [disabledEmbed],
			ephemeral: true,
		});
	}

	async IgnoreSlash(interaction) {
		const ignoreSlash = new EmbedBuilder({ color: this.client.config.colors.error })
			.setDescription('❌ This command is no longer available.');

		await interaction.reply({
			embeds: [ignoreSlash],
			ephemeral: true,
		});
	}

	async DmCommand(interaction) {
		const DmEmbed = new EmbedBuilder({ color: this.client.config.colors.error })
			.setDescription('❌ You can\'t use commands in my DMs');

		await interaction.reply({
			embeds: [DmEmbed],
			ephemeral: true,
		});
	}

	async commandError(interaction) {
		const errorEmbed = new EmbedBuilder({ color: this.client.config.colors.error })
			.setDescription('❌ An error occurred');

		await interaction.reply({
			embeds: [errorEmbed],
			ephemeral: true,
		});
	}

};
