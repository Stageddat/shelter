import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { registerController } from '@/controllers/register';
import { errorEmbed } from '@/views/general';
import { Logger } from '@/lib/logger';
import { RegisterStatus } from '@/enum/registerStatus';

const setupCommand = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('start your journey!'),
	async execute(interaction: CommandInteraction) {
		const response = await registerController.newUser({
			userID: interaction.user.id,
		});
		try {
			if (typeof response === 'number') {
				return interaction.reply('user not registered switchiong to step');
			}
			switch (response) {
				case RegisterStatus.userNotRegistered:
					return interaction.reply('welcome bruh');
				case RegisterStatus.userSetupComplete:
					return interaction.reply("you're already setup");
			}

			return interaction.reply({ embeds: [errorEmbed] });
		} catch (error) {
			Logger.error(error);
		}
	},
};

export default setupCommand;
