import prisma from '../lib/prisma.js';
import { Logger } from '../lib/logger.js';
import { GeneralStatus } from '../enum/generalStatus.js';
import { RegisterStatus } from 'src/enum/registerStatus.js';

export class timezoneModel {
	static async setTimezone({ userID, timezone }: { userID: string; timezone: number }) {
		try {
			// verificar si el usuario existe
			const userData = await prisma.users.findUnique({
				where: { userID },
			});

			if (userData === null) return RegisterStatus.userNotRegistered;

			// actualizar la db con el valor en horas (no multiplicamos por 60 aquí)
			const updatedUser = await prisma.users.update({
				where: { userID },
				data: {
					utcOffset: timezone,
				},
			});

			Logger.debug(`Updated timezone for user ${userID} to ${timezone} hours`);
			return updatedUser;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}

	// recuperar el utcOffset del usuario
	static async getUserTimezone(userID: string) {
		try {
			const userData = await prisma.users.findUnique({
				where: { userID },
			});

			if (userData === null) return RegisterStatus.userNotRegistered;

			// Devolver directamente el valor de la base de datos sin dividir por 60
			return userData.utcOffset;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}
}
