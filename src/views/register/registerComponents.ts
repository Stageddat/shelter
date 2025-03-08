import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const startButton = new ButtonBuilder()
	.setCustomId('startSetupButton')
	.setLabel('Get started!')
	.setStyle(ButtonStyle.Success)
	.setEmoji('➡️');

export const startRow = new ActionRowBuilder<ButtonBuilder>().addComponents(startButton);
