import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { registerController } from '../controllers/register.js';
import { errorEmbed } from '../views/generalEmbeds.js';
import { Logger } from '../lib/logger.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { registerEmbedsView } from '../views/register/registerEmbeds.js';
import { GeneralStatus } from 'src/enum/generalStatus.js';
import { registerView } from 'src/views/register.js';

// Comando setup para iniciar con la configuracion
const setupCommand = {
	data: new SlashCommandBuilder().setName('setup').setDescription('start your journey!'),
	async execute(interaction: CommandInteraction) {
		try {
			const userData = await registerController.newUser({ userID: interaction.user.id });
			switch (userData) {
				case GeneralStatus.internalError: {
					return interaction.reply({ embeds: [errorEmbed] });
				}
				case RegisterStatus.userSetupComplete: {
					return interaction.reply({ embeds: [registerEmbedsView.setupCompletedEmbed()] });
				}
				case RegisterStatus.userRegisteredSuccessfully: {
					return interaction.reply({
						embeds: [registerEmbedsView.welcomeSetupEmbed(interaction.user.username)],
					});
				}
				default: {
					const responseEmbed = registerView.getSetupEmbed({
						number: userData.setupCount,
						username: interaction.user.username,
						timezone: userData.utcOffset,
					});
					const components = registerView.getSetupComponents({ number: userData.setupCount });
					if (!(responseEmbed instanceof EmbedBuilder)) {
						return interaction.reply({ embeds: [errorEmbed] });
					}
					return interaction.reply({ embeds: [responseEmbed], components: components });
				}
			}
		} catch (error) {
			Logger.error(error);
			return interaction.reply({ embeds: [errorEmbed] });
		}
	},
};

export default setupCommand;
