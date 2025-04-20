import { rinProfilePicture } from 'config/links';
import { EmbedBuilder } from 'discord.js';
import { timezoneController } from 'src/controllers/timezone';

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

	static timezoneSetupEmbed(utcOffsetMinutes: number) {
		const utcString = timezoneController.minutesToUTCString(utcOffsetMinutes);

		// 3 timestamps (1171616400, 1171638000, 1171659600)

		// horas pa Madrid/Barcelona
		const targetLocalTimes = ['10:00', '16:00', '22:00'];

		// convertir timestamps unix a objetos date pa debug si es necesario
		// const date1 = new Date(1171616400 * 1000);
		// const date2 = new Date(1171638000 * 1000);
		// const date3 = new Date(1171659600 * 1000);
		// console.log(`timestamp 1: ${date1.toISOString()}`);
		// console.log(`timestamp 2: ${date2.toISOString()}`);
		// console.log(`timestamp 3: ${date3.toISOString()}`);

		// calcular hora local pa el usuario
		const formatLocalTime = (targetLocalTime: string) => {
			// convertir hora objetivo de string "HH:MM" a horas y minutos
			const [targetHourStr, targetMinStr] = targetLocalTime.split(':');
			const targetHour = parseInt(targetHourStr);
			const targetMin = parseInt(targetMinStr);

			// calcular diferencia entre offset de Madrid/Barcelona y el offset del usuario
			// Asumiendo que el bot está en Madrid/Barcelona (UTC+1 invierno o UTC+2 verano)
			const serverOffsetMinutes = new Date().getTimezoneOffset() * -1;

			// diferencia en minutos entre la zona del servidor y la zona del usuario
			const diffMinutes = utcOffsetMinutes - serverOffsetMinutes;

			// convertir diferencia a horas y minutos
			const diffHours = Math.floor(Math.abs(diffMinutes) / 60);
			const diffMins = Math.abs(diffMinutes) % 60;

			// calcular hora local pa el usuario
			let userHour = targetHour;
			let userMin = targetMin;

			if (diffMinutes > 0) {
				// Usuario está más al este que el servidor
				userHour += diffHours;
				userMin += diffMins;
			} else if (diffMinutes < 0) {
				// usuario está más al oeste que el servidor
				userHour -= diffHours;
				userMin -= diffMins;
			}

			// ajustar por overflow de minutos
			if (userMin >= 60) {
				userHour += 1;
				userMin -= 60;
			} else if (userMin < 0) {
				userHour -= 1;
				userMin += 60;
			}

			userHour = ((userHour % 24) + 24) % 24;

			return `${userHour.toString().padStart(2, '0')}:${Math.abs(userMin).toString().padStart(2, '0')}`;
		};

		return new EmbedBuilder().setColor(0x5eddff).setTitle('Set Up Your Timezone!').setAuthor({
			name: 'Rin',
			iconURL: rinProfilePicture,
		}).setDescription(`
        First of all! We need your exact timezone
        to know when to send you your daily reminder
        and save your entries at the right time,
        so everything stays organized :3.
        **Current UTC: ${utcString}**
        Synchronize using the <add:1357025119352131775> and <substract:1357025109277413619> buttons until the local time matches the target time.
        Your local time must match the target time.
        **1.**
        🕒 Target time: <t:1171616400:t>
        🌍 Your local time: ${formatLocalTime(targetLocalTimes[0])}
        **2.**
        🕒 Target time: <t:1171638000:t>
        🌍 Your local time: ${formatLocalTime(targetLocalTimes[1])}
        **3.**
        🕒 Target time: <t:1171659600:t>
        🌍 Your local time: ${formatLocalTime(targetLocalTimes[2])}
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

	static userNotRegisteredEmbed() {
		return new EmbedBuilder()
			.setColor(0x5eddff)
			.setTitle('uhhh?')
			.setDescription(
				'looks like u havent registered yet, please do it using the `/setup` command :3',
			);
	}
}
