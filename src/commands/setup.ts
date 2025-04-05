import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { registerController } from '../controllers/register.js';
import { errorEmbed } from '../views/general.js';
import { Logger } from '../lib/logger.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { registerEmbedsView } from '../views/register/registerEmbeds.js';
import { GeneralStatus } from 'src/enum/generalStatus.js';
import { registerView } from 'src/views/register.js';
import { startRow } from 'src/views/register/registerComponents.js';

// Comando setup para iniciar con la configuracion
const setupCommand = {
	data: new SlashCommandBuilder().setName('setup').setDescription('start your journey!'),
	async execute(interaction: CommandInteraction) {
		try {
			const response = await registerController.newUser({ userID: interaction.user.id });
			const utcOffset = await registerController.getUserTimezone({
				userID: interaction.user.id,
			});
			console.log(typeof response);
			console.log(typeof utcOffset);
			console.log(utcOffset);
			// numeros significan que el usuario esta registrado pero no ha completado setup
			if (typeof response === 'number' && typeof utcOffset === 'number') {
				console.log('tetas');
				const responseEmbed = registerView.getSetupEmbed({
					number: response,
					username: interaction.user.username,
					timezone: utcOffset,
				});
				const components = registerView.getSetupComponents({ number: response });

				if (!(responseEmbed instanceof EmbedBuilder)) {
					console.log('gay');
					console.log(responseEmbed);
					return interaction.reply({ embeds: [errorEmbed] });
				}

				return interaction.reply({ embeds: [responseEmbed], components: components });
			}

			// manejar las otras respuestas que no el usuario no esta aun en setup
			switch (response) {
				case RegisterStatus.userRegisteredSuccessfully:
					return interaction.reply({
						embeds: [registerEmbedsView.welcomeSetupEmbed(interaction.user.username)],
						components: [startRow],
					});
				case RegisterStatus.userSetupComplete:
					return interaction.reply({ embeds: [registerEmbedsView.setupCompletedEmbed()] });
				case GeneralStatus.internalError:
					return interaction.reply({ embeds: [errorEmbed] });
			}
			console.log(utcOffset);
			return interaction.reply({ embeds: [errorEmbed] });
		} catch (error) {
			Logger.error(error);
			return interaction.reply({ embeds: [errorEmbed] });
		}
	},
};

export default setupCommand;
