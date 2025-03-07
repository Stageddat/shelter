import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const next = new ButtonBuilder()
	.setCustomId('next')
	.setLabel('➡️')
	.setStyle(ButtonStyle.Success);

export const startRow = new ActionRowBuilder().addComponents(next);
