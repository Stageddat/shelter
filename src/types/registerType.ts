import { ActionRowBuilder, EmbedBuilder } from 'discord.js';

export interface RegisterResponseType {
	content: string;
	embed: EmbedBuilder;
	row: ActionRowBuilder | null;
}
