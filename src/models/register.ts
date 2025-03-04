import prisma from '@/lib/prisma';
import { Logger } from '@/lib/logger';
import { RegisterStatus } from '@/enum/registerStatus';
import { GeneralStatus } from '@/enum/generalStatus';

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
}
