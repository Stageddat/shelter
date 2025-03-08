import { Interaction, MessageFlags } from 'discord.js';
import path from 'node:path';
import fs from 'node:fs';
import { Logger } from '../lib/logger.js';
import { errorEmbed } from 'src/views/general.js';

function findCommandFile(dirs: string[], commandName: string): string | null {
	Logger.debug(`Searching for command '${commandName}' in directories:`);
	dirs.forEach((dir) => Logger.debug(dir));

	for (const dir of dirs) {
		if (!fs.existsSync(dir)) {
			Logger.debug(`Directory does not exist: ${dir}`);
			continue;
		}

		if (!fs.statSync(dir).isDirectory()) {
			Logger.debug(`Path is not a directory: ${dir}`);
			continue;
		}

		try {
			const files = fs.readdirSync(dir, { withFileTypes: true });

			for (const file of files) {
				const fullPath = path.join(dir, file.name);

				if (file.isDirectory()) {
					const found = findCommandFile([fullPath], commandName);
					if (found) return found;
				} else if (
					file.isFile() &&
					(file.name === `${commandName}.ts` || file.name === `${commandName}.js`)
				) {
					return fullPath;
				}
			}
		} catch (error) {
			Logger.error(`Error scanning directory ${dir}:`, error);
		}
	}

	return null;
}

export const handleCommandInteraction = async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	Logger.debug(`Handling interaction for command: ${commandName}`);

	try {
		const potentialCommandDirs = [
			path.join(process.cwd(), 'src', 'commands'),
			path.join(process.cwd(), 'commands'),

			// path.join(__dirname, '..', 'commands'),
			// path.join(__dirname, 'commands'),
		];

		const uniqueDirs = [...new Set(potentialCommandDirs)].filter(
			(dir) => dir && typeof dir === 'string',
		);

		const commandPath = findCommandFile(uniqueDirs, commandName);

		if (!commandPath) {
			Logger.warn(`Command "${commandName}" not found. Attempted directories:`);
			uniqueDirs.forEach((dir) => Logger.warn(dir));

			await interaction.reply({
				content: 'This command is not available!',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		Logger.debug(`Command path found: ${commandPath}`);

		const commandModule = await import(`file://${commandPath}`);
		Logger.debug(`Command module loaded: ${JSON.stringify(Object.keys(commandModule))}`);

		const command = commandModule.default?.default || commandModule.default || commandModule;

		Logger.debug(`Command extracted from module: ${JSON.stringify(Object.keys(command))}`);

		if (!command || !command.data || !command.execute) {
			Logger.warn(`Invalid command "${commandName}".`);
			await interaction.reply({
				content: 'This command is not available!',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		Logger.debug(`Executing command: ${commandName}`);
		await command.execute(interaction);
		Logger.debug(`Command "${commandName}" executed successfully.`);
	} catch (error) {
		Logger.error(`Error executing command "${commandName}":`, error);
		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					embeds: [errorEmbed],
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					embeds: [errorEmbed],
					flags: MessageFlags.Ephemeral,
				});
			}
		} catch (e) {
			Logger.error('Error sending error message:', e);
		}
	}
};
