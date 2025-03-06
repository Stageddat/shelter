import { CustomClient } from './lib/customClient.js';
import { env } from './schemas/env.js';
import { Events } from 'discord.js';
import { handleInteraction } from './handlers/handleInteraction.js';

const client = new CustomClient();

client.on(Events.InteractionCreate, handleInteraction);
client.once(Events.ClientReady, () => {
	console.log(`${client.user?.tag} is ready :3!`);

	if (client.user) {
		client.user.setActivity('having fun?', { type: 4 });
	}
});
client.login(env.DISCORD_TOKEN);
