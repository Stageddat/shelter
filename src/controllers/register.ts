import { GeneralStatus } from '../enum/generalStatus.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { Logger } from '../lib/logger.js';
import { registerModel } from '../models/register.js';
import { permissionController } from './permission.js';

export class registerController {
	static async newUser({ userID }: { userID: string }) {
		try {
			// is user registered?
			const registerStatus = await registerModel.addNewUser({ userID: userID });

			switch (registerStatus) {
				// if user is already registered but setup not complete, get the current register step
				case RegisterStatus.userSetupNotComplete: {
					const userStep = await registerModel.getUserStep({ userID: userID });
					// if smth fails or user is somehow not registered, return error
					if (typeof userStep === 'number') return userStep;
					else return GeneralStatus.internalError;
				}
				case RegisterStatus.userSetupComplete: {
					return RegisterStatus.userSetupComplete;
				}
				case RegisterStatus.userRegisteredSuccessfully: {
					return RegisterStatus.userRegisteredSuccessfully;
				}
				case GeneralStatus.databaseError: {
					return GeneralStatus.internalError;
				}
			}
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}

	static async isUserSetupComplete({ userID }: { userID: string }) {
		try {
			// check if user setup is complete
			const isUserSetupComplete = await registerModel.isUserSetupComplete({ userID });
			if (isUserSetupComplete === true) return true;
			else if (isUserSetupComplete === GeneralStatus.databaseError) {
				throw new Error(GeneralStatus.databaseError);
			}
			return false;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}

	static async getCurrentSetupStep({ userID }: { userID: string }) {
		try {
			// ver si el usuario esta de verdad registrado o es un troller de mierda
			const userSetupStatus = await registerController.isUserSetupComplete({
				userID: userID,
			});
			Logger.debug(userSetupStatus);
			switch (userSetupStatus) {
				case true: {
					return RegisterStatus.userSetupComplete;
				}
				case GeneralStatus.internalError:
					return GeneralStatus.internalError;
				case false:
					break;
			}
			// conseguir su paso real
			const userStep = await registerModel.getUserStep({ userID });
			if (typeof userStep === 'number') return userStep;
			else if (userStep === RegisterStatus.userNotRegistered) {
				return RegisterStatus.userNotRegistered;
			} else if (userStep === GeneralStatus.databaseError) return GeneralStatus.internalError;
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}

	static async getNextSetupStep({
		userID,
		messageUserID,
	}: {
		userID: string;
		messageUserID: string;
	}) {
		try {
			// comprobar si es el mismo usuario q ejecuta el /setup con el quien clica
			if (!permissionController.isSameUser({ userID: userID, messageUserID: messageUserID })) {
				return GeneralStatus.userNotAllowed;
			}
			// ver si el usuario esta de verdad registrado o es un troller de mierda
			const userSetupStatus = await registerController.isUserSetupComplete({
				userID: userID,
			});
			Logger.debug(userSetupStatus);
			switch (userSetupStatus) {
				case true: {
					return RegisterStatus.userSetupComplete;
				}
				case GeneralStatus.internalError:
					return GeneralStatus.internalError;
				case false: {
					const userStep = await registerModel.getUserStep({ userID });
					if (typeof userStep === 'number') return userStep + 1;
					else if (userStep === RegisterStatus.userNotRegistered) {
						return RegisterStatus.userNotRegistered;
					}
					return GeneralStatus.internalError;
				}
				default:
					return GeneralStatus.internalError;
			}
		} catch (error) {
			Logger.error('Error in getNextSetupStep');
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}
}
