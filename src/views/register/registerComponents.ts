import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const startButton = new ButtonBuilder()
	.setCustomId('next')
	.setLabel('Get started!')
	.setStyle(ButtonStyle.Success)
	.setEmoji('➡️');

export const startRow = new ActionRowBuilder<ButtonBuilder>().addComponents(startButton);
