import { GeneralStatus } from '../enum/generalStatus.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { Logger } from '../lib/logger.js';
import { registerModel } from '../models/register.js';

export class registerController {
	static async newUser({ userID }: { userID: string }) {
		try {
			// is user registered?
			const registerStatus = await registerModel.addNewUser({ userID: userID });

			// user already registered, get the current register step
			if (registerStatus === RegisterStatus.userSetupNotComplete) {
				const userStep = await registerModel.getUserStep({ userID: userID });
				if (
					userStep === GeneralStatus.databaseError ||
					userStep === RegisterStatus.userNotRegistered
				) {
					return userStep;
				}
				if (typeof userStep === 'number') return userStep;
			}

			// user is registered
			if (registerStatus) return registerStatus;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}
}
