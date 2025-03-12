import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const startSetupButton = new ButtonBuilder()
	.setCustomId('nextSetupButton')
	.setLabel('Get started!')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('➡️');

export const startRow = new ActionRowBuilder<ButtonBuilder>().addComponents(startSetupButton);

const nextIntroButton = new ButtonBuilder()
	.setCustomId('nextSetupButton')
	.setLabel('let’s start!')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('🛩️');

export const introRow = new ActionRowBuilder<ButtonBuilder>().addComponents(nextIntroButton);
