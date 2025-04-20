import { ButtonInteraction } from 'discord.js';
import { timezoneController } from 'src/controllers/timezone';
import { GeneralStatus } from 'src/enum/generalStatus';
import { RegisterStatus } from 'src/enum/registerStatus';
import { Logger } from 'src/lib/logger';
import { errorEmbed, notAllowedEmbed } from 'src/views/generalEmbeds';
import { registerEmbedsView } from 'src/views/register/registerEmbeds';

export default {
	customId: 'restartTimezoneButton',
	execute: async (interaction: ButtonInteraction) => {
		const messageUserID = interaction.message.interactionMetadata?.user.id;
		if (messageUserID === undefined) {
			return await interaction.editReply({ embeds: [errorEmbed] });
		}

		try {
			await interaction.deferUpdate();
			const embedText = interaction.message.embeds[0].description;
			if (embedText === undefined || embedText === '' || embedText === null) {
				return await interaction.editReply({ embeds: [errorEmbed] });
			}
			const utcOffset = await timezoneController.restartTimezone({
				userID: interaction.user.id,
				messageUserID,	
				embedText: embedText,
			});
			switch (utcOffset) {
				case GeneralStatus.userNotAllowed:
					return await interaction.editReply({ embeds: [notAllowedEmbed] });
				case GeneralStatus.internalError:
					return await interaction.editReply({ embeds: [errorEmbed] });
				case RegisterStatus.userNotRegistered:
					return await interaction.editReply({
						embeds: [registerEmbedsView.userNotRegisteredEmbed()],
					});
			}
			const updatedEmbed = registerEmbedsView.timezoneSetupEmbed(utcOffset);
			return await interaction.editReply({ embeds: [updatedEmbed] });
		} catch (error) {
			Logger.error('Failed to process addTimezoneButton');
			Logger.error(error);
			return await interaction.editReply({ embeds: [errorEmbed] });
		}
	},
};
