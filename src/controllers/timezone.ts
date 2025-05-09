/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { timezoneModel } from 'src/models/timezone';
import { GeneralStatus } from '../enum/generalStatus.js';
import { Logger } from '../lib/logger.js';
import { permissionController } from './permission.js';
import { RegisterStatus } from 'src/enum/registerStatus.js';

const utcOffsets = [
	'−12:00',
	'−11:00',
	'−10:00',
	'−09:30',
	'−09:00',
	'−08:00',
	'−07:00',
	'−06:00',
	'−05:00',
	'−04:30',
	'−04:00',
	'−03:30',
	'−03:00',
	'−02:00',
	'−01:00',
	'+00:00',
	'+01:00',
	'+02:00',
	'+03:00',
	'+03:30',
	'+04:00',
	'+04:30',
	'+05:00',
	'+05:30',
	'+05:45',
	'+06:00',
	'+06:30',
	'+07:00',
	'+08:00',
	'+08:45',
	'+09:00',
	'+09:30',
	'+10:00',
	'+10:30',
	'+11:00',
	'+12:00',
	'+12:45',
	'+13:00',
	'+14:00',
];

const utcOffsetsInMinutes = {
	'−12:00': -720,
	'−11:00': -660,
	'−10:00': -600,
	'−09:30': -570,
	'−09:00': -540,
	'−08:00': -480,
	'−07:00': -420,
	'−06:00': -360,
	'−05:00': -300,
	'−04:30': -270,
	'−04:00': -240,
	'−03:30': -210,
	'−03:00': -180,
	'−02:00': -120,
	'−01:00': -60,
	'+00:00': 0,
	'+01:00': 60,
	'+02:00': 120,
	'+03:00': 180,
	'+03:30': 210,
	'+04:00': 240,
	'+04:30': 270,
	'+05:00': 300,
	'+05:30': 330,
	'+05:45': 345,
	'+06:00': 360,
	'+06:30': 390,
	'+07:00': 420,
	'+08:00': 480,
	'+08:45': 525,
	'+09:00': 540,
	'+09:30': 570,
	'+10:00': 600,
	'+10:30': 630,
	'+11:00': 660,
	'+12:00': 720,
	'+12:45': 765,
	'+13:00': 780,
	'+14:00': 840,
};

export class timezoneController {
	// convert min to utc string
	static minutesToUTCString(offsetInMinutes: number): string {
		const isNegative = offsetInMinutes < 0;
		const absMinutes = Math.abs(offsetInMinutes);

		const hours = Math.floor(absMinutes / 60);
		const minutes = absMinutes % 60;

		const sign = isNegative ? '−' : '+';
		const formattedHours = hours.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');

		return `${sign}${formattedHours}:${formattedMinutes}`;
	}

	// convert utc to min for database
	static utcStringToMinutes(utcString: string): number {
		if (utcString in utcOffsetsInMinutes) {
			return utcOffsetsInMinutes[utcString as keyof typeof utcOffsetsInMinutes];
		}

		// xd?
		const regex = /([−+])(\d+):(\d+)/;
		const match = utcString.match(regex);

		if (!match) return 0;

		const [_, sign, hours, minutes] = match;

		let offsetMinutes = parseInt(hours) * 60 + parseInt(minutes);
		if (sign === '−') offsetMinutes = -offsetMinutes;

		return offsetMinutes;
	}

	static async addTimezone({
		userID,
		messageUserID,
		embedText,
	}: {
		userID: string;
		messageUserID: string;
		embedText: string;
	}) {
		try {
			// comprovar q no sea otro hijo de puta
			if (!permissionController.isSameUser({ userID: userID, messageUserID: messageUserID })) {
				return GeneralStatus.userNotAllowed;
			}

			// extraer el texto
			const utcRegex = /Current UTC: ([−+]\d{2}:\d{2})/;
			const match = embedText?.match(utcRegex);

			if (!match) {
				Logger.error('Failed to extract UTC from embed');
				return GeneralStatus.internalError;
			}

			// obtener el texto
			const currentUTC = match[1];

			// buscar el index
			const currentIndex = utcOffsets.findIndex((utc) => utc === currentUTC);

			if (currentIndex === -1) {
				Logger.error(`Current UTC ${currentUTC} not found in list`);
				return GeneralStatus.internalError;
			}

			// get next index
			const nextIndex = (currentIndex + 1) % utcOffsets.length;
			const nextUTC = utcOffsets[nextIndex];

			// convert stirng to min back :v
			const nextUTCMinutes = this.utcStringToMinutes(nextUTC);

			// update
			const result = await timezoneModel.setTimezone({ userID, timezone: nextUTCMinutes });

			if (result === RegisterStatus.userNotRegistered) {
				return RegisterStatus.userNotRegistered;
			}

			if (result === GeneralStatus.databaseError) {
				return GeneralStatus.internalError;
			}

			// devolver los minutos para actualizar el embed
			return nextUTCMinutes;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}

	static async subtractTimezone({
		userID,
		messageUserID,
		embedText,
	}: {
		userID: string;
		messageUserID: string;
		embedText: string;
	}) {
		try {
			// comprobar q no sea otro trozo de basura
			if (!permissionController.isSameUser({ userID: userID, messageUserID: messageUserID })) {
				return GeneralStatus.userNotAllowed;
			}

			// extraer el texto
			const utcRegex = /Current UTC: ([−+]\d{2}:\d{2})/;
			const match = embedText?.match(utcRegex);

			if (!match) {
				Logger.error('Failed to extract UTC from embed');
				return GeneralStatus.internalError;
			}

			// obtener el texto
			const currentUTC = match[1];

			// buscar el index
			const currentIndex = utcOffsets.findIndex((utc) => utc === currentUTC);

			if (currentIndex === -1) {
				Logger.error(`Current UTC ${currentUTC} not found in list`);
				return GeneralStatus.internalError;
			}

			// obtener el índice anterior
			const prevIndex = (currentIndex - 1 + utcOffsets.length) % utcOffsets.length;
			const prevUTC = utcOffsets[prevIndex];

			// convertir el string UTC a minutos para la BD
			const prevUTCMinutes = this.utcStringToMinutes(prevUTC);

			// actualizar UTC en la base de datos (siempre en minutos)
			const result = await timezoneModel.setTimezone({ userID, timezone: prevUTCMinutes });

			if (result === RegisterStatus.userNotRegistered) {
				return RegisterStatus.userNotRegistered;
			}

			if (result === GeneralStatus.databaseError) {
				return GeneralStatus.internalError;
			}

			// devolver los minutos para actualizar el embed
			return prevUTCMinutes;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}

	static async restartTimezone({
		userID,
		messageUserID,
		embedText,
	}: {
		userID: string;
		messageUserID: string;
		embedText: string;
	}) {
		try {
			// check if it's the same user who executed /setup
			if (!permissionController.isSameUser({ userID: userID, messageUserID: messageUserID })) {
				return GeneralStatus.userNotAllowed;
			}

			// extract current UTC from embed
			const utcRegex = /Current UTC: ([−+]\d{2}:\d{2})/;
			const match = embedText?.match(utcRegex);

			if (!match) {
				Logger.error('Failed to extract UTC from embed');
				return GeneralStatus.internalError;
			}

			// get current UTC string
			const currentUTC = match[1];

			// verify current UTC exists in list
			const currentIndex = utcOffsets.findIndex((utc) => utc === currentUTC);

			if (currentIndex === -1) {
				Logger.error(`Current UTC ${currentUTC} not found in list`);
				return GeneralStatus.internalError;
			}

			// set UTC to +00:00
			const zeroUTC = '+00:00';

			// convert UTC string to minutes for DB
			const zeroUTCMinutes = this.utcStringToMinutes(zeroUTC);

			// update UTC in database (always in minutes)
			const result = await timezoneModel.setTimezone({ userID, timezone: zeroUTCMinutes });

			if (result === RegisterStatus.userNotRegistered) {
				return RegisterStatus.userNotRegistered;
			}

			if (result === GeneralStatus.databaseError) {
				return GeneralStatus.internalError;
			}

			// return minutes to update the embed
			return zeroUTCMinutes;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}
}
