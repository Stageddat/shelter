import { Interaction, MessageFlags } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { Logger } from '@/lib/logger';

function findCommandFile(dir: string, commandName: string): string | null {
	Logger.debug(`searching files in directory: ${dir}`);
	const files = fs.readdirSync(dir, { withFileTypes: true });

	for (const file of files) {
		const fullPath = path.join(dir, file.name);
		Logger.debug(`processing file/directory: ${fullPath}`);

		if (file.isDirectory()) {
			Logger.debug(`directory found: ${fullPath}, searching recursively...`);
			const found: string | null = findCommandFile(fullPath, commandName);
			if (found) {
				Logger.debug(`command found in directory: ${found}`);
				return found;
			}
		} else if (
			file.isFile() &&
			(file.name === `${commandName}.ts` || file.name === `${commandName}.js`)
		) {
			Logger.debug(`command file found: ${fullPath}`);
			return fullPath;
		}
	}
	Logger.debug(`command file not found for: ${commandName}`);
	return null;
}

export const handleInteraction = async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	Logger.debug(`handling interaction for command: ${commandName}`);

	try {
		const commandsDir = path.join(__dirname, '../commands');
		Logger.debug(`commands directory: ${commandsDir}`);

		const commandPath = findCommandFile(commandsDir, commandName);
		Logger.debug(`command path found: ${commandPath}`);

		if (!commandPath) {
			Logger.warn(`command "${commandName}" not found.`);
			await interaction.reply({
				content: 'this command is not available!',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const commandModule = await import(commandPath);
		Logger.debug(`command module loaded: ${JSON.stringify(commandModule)}`);

		const command =
			commandModule.default?.default || commandModule.default || commandModule;

		Logger.debug(`command extracted from module: ${JSON.stringify(command)}`);

		if (!command || !command.data || !command.execute) {
			Logger.warn(`invalid command "${commandName}".`);
			await interaction.reply({
				content: 'this command is not available!',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		Logger.debug(`executing command: ${commandName}`);
		await command.execute(interaction);
		Logger.debug(`command "${commandName}" executed successfully.`);
	} catch (error) {
		Logger.error(`error executing command "${commandName}":`, error);

		const errorMessage = 'there was an error executing this command!';

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: errorMessage,
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: errorMessage,
				ephemeral: true,
			});
		}
	}
};
