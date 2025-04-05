import { EmbedBuilder } from 'discord.js';
import { RegisterStatus } from '../enum/registerStatus';
import { registerEmbedsView } from './register/registerEmbeds';
import { introRow, setTimezoneRow, startRow } from './register/registerComponents';

export class registerView {
	static getSetupEmbed({
		number,
		username,
		timezone,
	}: {
		number: number;
		username?: string;
		timezone?: number;
	}): EmbedBuilder | RegisterStatus {
		switch (number) {
			case 0:
				// primer embed presentarse como tu madre
				if (!username) return RegisterStatus.usernameNotProvided;
				return registerEmbedsView.welcomeSetupEmbed(username);
			case 1:
				return registerEmbedsView.introductionEmbed();
			case 2:
				if (timezone === null || timezone === undefined) return RegisterStatus.timezoneNotProvided;
				return registerEmbedsView.timezoneSetupEmbed(timezone);
			default:
				return new EmbedBuilder().setTitle('Setup').setDescription('Unknown setup step');
		}
	}

	static getSetupComponents({ number }: { number: number }) {
		switch (number) {
			case 0:
				// devolver el primer boton (bienvenida a Rin)
				return [startRow];
			case 1:
				// devolver el segundo boton (intro)
				return [introRow];
			case 2:
				// devolver el tercer boton (timezone)
				return [setTimezoneRow];
			default:
				return [];
		}
	}
}
