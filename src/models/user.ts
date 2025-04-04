import prisma from '../lib/prisma.js';
import { Logger } from '../lib/logger.js';
import { GeneralStatus } from '../enum/generalStatus.js';

export class userModel {
	static async isUserSetupComplete({ userID }: { userID: string }) {
		try {
			const userSetupComplete = await prisma.users.findUnique({
				where: { userID },
				select: { setupComplete: true },
			});
			Logger.debug(userSetupComplete);
			if (userSetupComplete === null) return false;
			switch (userSetupComplete?.setupComplete) {
				case true:
					return true;
				case false:
					return false;
				default:
					return false;
			}
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.databaseError;
		}
	}
}
