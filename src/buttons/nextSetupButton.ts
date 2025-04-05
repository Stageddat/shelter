import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { registerController } from 'src/controllers/register';
import { Logger } from 'src/lib/logger';
import { errorEmbed } from 'src/views/general';
import { registerView } from 'src/views/register';

// para futuro yo, mover la logica de si es userSetupComplete a controlador y no en view

export default {
	customId: 'nextSetupButton',
	execute: async (interaction: ButtonInteraction) => {
		const messageUserID = interaction.message.interactionMetadata?.user.id;
		if (messageUserID === undefined) {
			return await interaction.editReply({ embeds: [errorEmbed] });
		}

		try {
			await interaction.deferUpdate();

			const response = await registerController.getNextSetupStep({
				userID: interaction.user.id,
				messageUserID: messageUserID,
			});
			const utcOffset = await registerController.getUserTimezone({
				userID: interaction.user.id,
			});
			if (typeof response === 'number' && typeof utcOffset === 'number') {
				const responseEmbed = registerView.getSetupEmbed({
					number: response,
					username: interaction.user.username,
					timezone: utcOffset,
				});
				const components = registerView.getSetupComponents({ number: response });

				if (!(responseEmbed instanceof EmbedBuilder)) {
					return interaction.editReply({ embeds: [errorEmbed] });
				}
				return interaction.editReply({ embeds: [responseEmbed], components: components });
			}
			return response;
		} catch (error) {
			Logger.error('Failed to reply with error message');
			Logger.error(error);
			return await interaction.editReply({ embeds: [errorEmbed] });
		}
	},
};
