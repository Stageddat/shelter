import {
	Interaction,
	CommandInteraction,
	MessageFlags,
	Events,
} from 'discord.js';
import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';
import { Logger } from '@/lib/logger';
import { CustomClient } from '@/lib/customClient';

function findCommandFile(dir: string, commandName: string): string | null {
	const files = fs.readdirSync(dir, { withFileTypes: true });

	for (const file of files) {
		const fullPath = path.join(dir, file.name);

		if (file.isDirectory()) {
			const found: string | null = findCommandFile(fullPath, commandName);
			if (found) return found;
		} else if (file.isFile() && file.name === `${commandName}.ts`) {
			return fullPath;
		}
	}
	return null;
}

export const handleInteraction = async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	try {
		const commandsDir = path.join(__dirname, '../commands');
		const commandPath = findCommandFile(commandsDir, commandName);

		if (!commandPath) {
			Logger.warn(`Command "${commandName}" not found.`);
			await interaction.reply({
				content: 'This command is not available!',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const commandURL = pathToFileURL(commandPath).href;
		const commandModule = await import(commandURL);
		const command = commandModule.default;

		if (!command || !command.execute) {
			Logger.warn(`Invalid "${commandName}" command.`);
			await interaction.reply({
				content: 'This command is not available!',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await command.execute(interaction);
	} catch (error) {
		Logger.error(`Failed executing command "${commandName}":`, error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
};
