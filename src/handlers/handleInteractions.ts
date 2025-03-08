import { handleButtonInteraction } from './handleButtons';
import { handleCommandInteraction } from './handleCommands';
import { Interaction } from 'discord.js';

// Función principal que maneja todos los tipos de interacciones
export const handleInteraction = async (interaction: Interaction) => {
	if (interaction.isChatInputCommand()) {
		await handleCommandInteraction(interaction);
	} else if (interaction.isButton()) {
		await handleButtonInteraction(interaction);
	}
};
