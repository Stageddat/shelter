import { EmbedBuilder } from 'discord.js';

export class registerEmbedsView {
	static welcomeSetupEmbed(username: string) {
		return new EmbedBuilder()
			.setColor(0x5eddff)
			.setTitle(`welcome ${username}!`)
			.setAuthor({
				name: 'Rin',
				iconURL: 'https://shelter-d.b-cdn.net/rin-pfp.jpg',
			})
			.setDescription(
				'hello theme, random internet user!\nim Rin and welcome to **shelter**, your special little corner on discord. here you can write your daily adventures and save them in your personal diary, right on the platform you love so much!',
			);
	}
}
