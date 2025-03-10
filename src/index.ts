import { CustomClient } from './lib/customClient.js';
import { Events } from 'discord.js';
import { handleInteraction } from './handlers/handleInteractions.js';
import { env } from './lib/env.js';

const client = new CustomClient();

client.on(Events.InteractionCreate, (interaction) => {
	void handleInteraction(interaction);
});

client.once(Events.ClientReady, () => {
	console.log(`${client.user?.tag} is ready :3!`);

	if (client.user) {
		client.user.setActivity('having fun?', { type: 4 });
	}
});

console.log('Logging...');
client.login(env.DISCORD_TOKEN).catch((err) => {
	console.error('Failed to login:', err);
	process.exit(1);
});
