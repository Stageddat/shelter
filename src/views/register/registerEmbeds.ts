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

	static timezoneSetupEmbed(utcOffset: number) {
		// calcular hroas y min
		const hours = Math.floor(utcOffset);
		const minutes = Math.round((utcOffset - hours) * 60);

		return new EmbedBuilder().setColor(0x5eddff).setTitle('Set Up Your Timezone!').setAuthor({
			name: 'Rin',
			iconURL: rinProfilePicture,
		}).setDescription(`
        First of all! We need your exact timezone 
        to know when to send you your daily reminder 
        and save your entries at the right time, 
        so everything stays organized :3.

        **Current UTC: ${utcOffset >= 0 ? '+' : ''}${utcOffset}**

        Synchronize using the <add:1357025119352131775> and <substract:1357025109277413619> buttons until the local time matches the target time.
        Your local time must match the target time.

        **1.**
        🕒 Target time: <t:1171616400:t>
        🌍 Your local time: ${(9 + hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}

        **2.**
        🕒 Target time: <t:1171638000:t>
        🌍 Your local time: ${(15 + hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}

        **3.**
        🕒 Target time: <t:1171656000:t>
        🌍 Your local time: ${(21 + hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}
    `);
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
