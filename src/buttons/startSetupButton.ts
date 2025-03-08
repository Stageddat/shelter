import { ButtonInteraction } from 'discord.js';

export default {
	customId: 'startSetupButton',
	execute: async (interaction: ButtonInteraction) => {
		return await interaction.reply({
			content: 'Setting up!',
			ephemeral: true,
		});
	},
};
