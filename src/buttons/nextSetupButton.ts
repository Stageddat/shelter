import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { registerController } from 'src/controllers/register';
import { GeneralStatus } from 'src/enum/generalStatus';
import { RegisterStatus } from 'src/enum/registerStatus';
import { Logger } from 'src/lib/logger';
import { errorEmbed, notAllowedEmbed } from 'src/views/generalEmbeds';
import { registerView } from 'src/views/register';

export default {
	customId: 'nextSetupButton',
	execute: async (interaction: ButtonInteraction) => {
		const messageUserID = interaction.message.interactionMetadata?.user.id;
		if (messageUserID === undefined) {
			return await interaction.editReply({ embeds: [errorEmbed] });
		}

		try {
			await interaction.deferUpdate();

			const userData = await registerController.getNextSetupPage({
				userID: interaction.user.id,
				messageUserID: messageUserID,
			});
			switch (userData) {
				case GeneralStatus.userNotAllowed:
					return interaction.editReply({ embeds: [notAllowedEmbed] });
				case GeneralStatus.internalError:
					return interaction.editReply({ embeds: [errorEmbed] });
				case RegisterStatus.userNotRegistered:
					return interaction.editReply({ embeds: [errorEmbed] });
				default: {
					const responseEmbed = registerView.getSetupEmbed({
						number: userData.setupCount,
						username: interaction.user.username,
						timezone: userData.utcOffset,
					});
					const components = registerView.getSetupComponents({ number: userData.setupCount });
					if (!(responseEmbed instanceof EmbedBuilder)) {
						return interaction.editReply({ embeds: [errorEmbed] });
					}
					return interaction.editReply({ embeds: [responseEmbed], components: components });
				}
			}
		} catch (error) {
			Logger.error('Failed to reply with error message');
			Logger.error(error);
			return await interaction.editReply({ embeds: [errorEmbed] });
		}
	},
};
