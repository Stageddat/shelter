import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const helpCommand = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show help info!'),
	async execute(interaction: CommandInteraction) {
		return interaction.reply('egg!');
	},
};

export default helpCommand;
