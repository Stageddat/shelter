import { EmbedBuilder } from 'discord.js';
import { RegisterStatus } from '../enum/registerStatus';
import { registerEmbedsView } from './register/registerEmbeds';
import { introRow, startRow } from './register/registerComponents';

export class registerView {
	static getSetupEmbed({
		number,
		username,
	}: {
		number: number;
		username?: string;
	}): EmbedBuilder | RegisterStatus {
		switch (number) {
			case 0:
				// primer embed presentarse como rin
				if (!username) return RegisterStatus.usernameNotProvided;
				return registerEmbedsView.welcomeSetupEmbed(username);
			case 1:
				return registerEmbedsView.introductionEmbed();
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
			default:
				return [];
		}
	}
}
