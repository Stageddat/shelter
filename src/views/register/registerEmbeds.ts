import { rinProfilePicture } from 'config/links';
import { EmbedBuilder } from 'discord.js';

// clase q devuelve embeds personalizados
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

	static introductionEmbed() {
		return new EmbedBuilder()
			.setColor(0x5eddff)
			.setTitle('before starting...')
			.setAuthor({
				name: 'Rin',
				iconURL: rinProfilePicture,
			})
			.setDescription(
				'shelter is a place where you can save your personal diary—simple and easy to use.\n\nwrite about your day, your dreams, your wildest ideas—anything you want! shelter is your private space: no judgments, no worries, just you and your thoughts.\n\nit’s super easy to use—no complicated settings, no distractions. just write and send.\n\nyour secrets are **safe** in shelter. every single entry is encrypted **veeeeery securely**, so only you (yep, just you!) can see them.\n\nready to dive in? let’s do this!',
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
