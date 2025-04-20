import prisma from '../lib/prisma.js';
import { Logger } from '../lib/logger.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { GeneralStatus } from '../enum/generalStatus.js';

export class registerModel {
	static async addNewUser({ userID }: { userID: string }) {
		// Check if users exist
		try {
			const userData = await prisma.users.findUnique({
				where: { userID },
			});
			if (userData && userData.setupComplete === true) {
				return RegisterStatus.userSetupComplete;
			} else if (userData && userData.setupComplete === false) {
				return userData;
			}
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}

		// User no exist
		try {
			const newUser = await prisma.users.create({
				data: {
					userID: userID,
				},
			});
			Logger.debug('New user created' + newUser.userID);
			return RegisterStatus.userRegisteredSuccessfully;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}
	static async updateUserStep({ userID, newUserStep }: { userID: string; newUserStep: number }) {
		try {
			const updatedUser = await prisma.users.update({
				where: { userID },
				data: { setupCount: newUserStep },
			});

			if (!updatedUser) return GeneralStatus.databaseError;
			return GeneralStatus.databaseSuccess;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}
}
