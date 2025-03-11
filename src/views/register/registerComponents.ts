import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const nextSetupButton = new ButtonBuilder()
	.setCustomId('nextSetupButton')
	.setLabel('Get started!')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('➡️');

export const startRow = new ActionRowBuilder<ButtonBuilder>().addComponents(nextSetupButton);
