import prisma from '../lib/prisma.js';
import { Logger } from '../lib/logger.js';
import { GeneralStatus } from '../enum/generalStatus.js';
import { RegisterStatus } from 'src/enum/registerStatus.js';

export class userModel {
	static async getUserDataByID({ userID }: { userID: string }) {
		try {
			const userData = await prisma.users.findUnique({
				where: { userID },
			});
			Logger.debug(userData);
			if (userData === null) return RegisterStatus.userNotRegistered;
			return userData;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}
}
