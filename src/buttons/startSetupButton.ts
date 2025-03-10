import { ButtonInteraction } from 'discord.js';
import { Logger } from 'src/lib/logger';
import { errorEmbed } from 'src/views/general';

// para futuro yo, mover la logica de si es userSetupComplete a controlador y no en view

export default {
	customId: 'startSetupButton',
	execute: async (interaction: ButtonInteraction) => {
		await interaction.deferReply();
		try {
			// editar depediendo del step actual + 1
		} catch (error) {
			Logger.error(error);
			return await interaction.followUp({ embeds: [errorEmbed] });
		}
	},
};
