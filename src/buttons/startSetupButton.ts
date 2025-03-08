import { ButtonInteraction } from 'discord.js';

export default {
	customId: 'startSetupButton',
	execute: async (interaction: ButtonInteraction) => {
		return await interaction.reply({
			content: '¡Has iniciado el proceso de configuración!',
			ephemeral: true,
		});
	},
};
