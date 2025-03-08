import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { registerController } from '../controllers/register.js';
import { errorEmbed } from '../views/general.js';
import { Logger } from '../lib/logger.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { registerEmbedsView } from '../views/register/registerEmbeds.js';

const setupCommand = {
	data: new SlashCommandBuilder().setName('setup').setDescription('start your journey!'),
	async execute(interaction: CommandInteraction) {
		const response = await registerController.newUser({ userID: interaction.user.id });
		try {
			// numbers means user is registered but setup not complete
			if (typeof response === 'number') {
				// number 0 means its the first setup page
				if (response === 0) {
					return interaction.reply({
						embeds: [registerEmbedsView.welcomeSetupEmbed(interaction.user.username)],
					});
				}
				return interaction.reply({ content: response.toString() });
			}
			switch (response) {
				case RegisterStatus.userRegisteredSuccessfully:
					return interaction.reply({
						embeds: [registerEmbedsView.welcomeSetupEmbed(interaction.user.username)],
					});
				case RegisterStatus.userSetupComplete:
					return interaction.reply("you're already setup");
				case RegisterStatus.userNotRegistered:
			}

			return interaction.reply({ embeds: [errorEmbed] });
		} catch (error) {
			Logger.error(error);
		}
	},
};

export default setupCommand;
