import { rinProfilePicture } from 'config/links';
import { EmbedBuilder } from 'discord.js';

export class registerEmbedsView {
	static welcomeSetupEmbed(username: string) {
		return new EmbedBuilder()
			.setColor(0x5eddff)
			.setTitle(`welcome ${username}!`)
			.setAuthor({
				name: 'Rin',
				iconURL: rinProfilePicture,
			})
			.setDescription(
				'hello there, random internet user!\nim Rin and welcome to **shelter**, your special little corner on discord. here you can write your daily adventures and save them in your personal diary, right on the platform you love so much!',
			);
	}

	static setupCompletedEmbed() {
		return new EmbedBuilder()
			.setColor(0x5eddff)
			.setTitle('wopaa')
			.setAuthor({
				name: 'Rin',
				iconURL: rinProfilePicture,
			})
			.setDescription(
				'looks like u already finished setting up, start with `/addEntry` or user `/help` for more info!',
			);
	}
}
