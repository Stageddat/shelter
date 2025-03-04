import { CustomClient } from '@/lib/customClient';
import { env } from './schemas/env';
import { Events } from 'discord.js';
import { handleInteraction } from './handlers/handleInteraction';

const client = new CustomClient();

client.on(Events.InteractionCreate, handleInteraction);
client.once(Events.ClientReady, () => {
	console.log(`${client.user?.tag} is ready :3!`);

	if (client.user) {
		client.user.setActivity('having fun?', { type: 4 });
	}
});
client.login(env.DISCORD_TOKEN);
