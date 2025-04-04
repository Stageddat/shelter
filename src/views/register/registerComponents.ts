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

const addTimezoneButton = new ButtonBuilder()
	.setCustomId('addTimezoneButton')
	// .setLabel('')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('<add:1357025119352131775>');

const restartTimezoneButton = new ButtonBuilder()
	.setCustomId('restartTimezoneButton')
	// .setLabel('🔄')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('🔄');

const substractTimezoneButton = new ButtonBuilder()
	.setCustomId('substractTimezoneButton')
	// .setLabel('')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('<substract:1357025109277413619>');

export const setTimezoneRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
	addTimezoneButton,
	restartTimezoneButton,
	substractTimezoneButton,
);

// const timeZones = Intl.supportedValuesOf('timeZone');
// const selectTimezone = new StringSelectMenuBuilder()
// 	.setCustomId('timezoneSelect')
// 	.setPlaceholder('choose your timezone!')
// 	.addOptions(
// 		new StringSelectMenuOptionBuilder().setLabel('test1').setValue('test1'),
// 		new StringSelectMenuOptionBuilder().setLabel('test2').setValue('2'),
// 	);

// export const selectTimezoneRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
// 	selectTimezone,
// );
