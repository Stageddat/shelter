import { GeneralStatus } from '@/enum/generalStatus';
import { RegisterStatus } from '@/enum/registerStatus';
import { Logger } from '@/lib/logger';
import { registerModel } from '@/models/register';
import { RegisterResponseType } from '@/types/registerType';
import { errorEmbed, testEmbed } from '@/views/general';
import { welcomeSetupEmbed } from '@/views/register';
import { startRow } from '@/views/register/start';
import { number } from 'zod';

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
				)
					return userStep;
				if (typeof userStep === 'number') return userStep;
			}

			//user is registered
			if (registerStatus) return registerStatus;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}
}
