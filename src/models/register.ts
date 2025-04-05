import prisma from '../lib/prisma.js';
import { Logger } from '../lib/logger.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { GeneralStatus } from '../enum/generalStatus.js';

export class registerModel {
	static async addNewUser({ userID }: { userID: string }) {
		// Check if users exist
		try {
			const existingUser = await prisma.users.findUnique({
				where: { userID },
			});
			if (existingUser && existingUser.setupComplete === true) {
				return RegisterStatus.userSetupComplete;
			} else if (existingUser && existingUser.setupComplete === false) {
				return RegisterStatus.userSetupNotComplete;
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
	static async getUserStep({ userID }: { userID: string }) {
		try {
			const userData = await prisma.users.findUnique({
				where: { userID },
			});
			if (!userData) return RegisterStatus.userNotRegistered;
			return userData.setupCount;
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

			if (!updatedUser) return RegisterStatus.userNotRegistered;
			return GeneralStatus.databaseSucess;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}

	static async getUserTimezone({ userID }: { userID: string }) {
		try {
			const userData = await prisma.users.findUnique({
				where: { userID },
			});
			if (!userData) return RegisterStatus.userNotRegistered;
			return userData.utcOffset;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}
}
