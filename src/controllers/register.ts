import { userModel } from 'src/models/user.js';
import { GeneralStatus } from '../enum/generalStatus.js';
import { RegisterStatus } from '../enum/registerStatus.js';
import { Logger } from '../lib/logger.js';
import { registerModel } from '../models/register.js';
import { permissionController } from './permission.js';

export class registerController {
	static async newUser({ userID }: { userID: string }) {
		try {
			// Usar directamente el modelo de registro que ya hace las verificaciones necesarias
			const registerStatus = await registerModel.addNewUser({ userID: userID });

			switch (registerStatus) {
				case RegisterStatus.userSetupComplete:
				case RegisterStatus.userRegisteredSuccessfully:
					return registerStatus;
				case GeneralStatus.databaseError:
					return GeneralStatus.internalError;
				default: {
					const userData = registerStatus;
					return userData;
				}
			}
		} catch (error) {
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}

	static async getCurrentSetupStep({ userID }: { userID: string }) {
		try {
			// ver si el usuario esta de verdad registrado o es un troller de mierda
			const userSetupStatus = await userModel.isUserSetupComplete({
				userID: userID,
			});
			Logger.debug(userSetupStatus);
			switch (userSetupStatus) {
				case true: {
					return RegisterStatus.userSetupComplete;
				}
				case GeneralStatus.databaseError:
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

	static async getNextSetupPage({
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
			// intentar conseguir sus datos
			const userData = await userModel.getUserDataByID({
				userID: userID,
			});
			switch (userData) {
				case RegisterStatus.userNotRegistered: {
					return RegisterStatus.userNotRegistered;
				}
				case GeneralStatus.databaseError:
					return GeneralStatus.internalError;
				// el usuario si q existe asi q cogemos su info
				default: {
					const newUserStep = userData.setupCount + 1;
					const updateUserStepStatus = await registerModel.updateUserStep({
						userID: userID,
						newUserStep: newUserStep,
					});
					switch (updateUserStepStatus) {
						case GeneralStatus.databaseError:
							return GeneralStatus.internalError;
						case GeneralStatus.databaseSuccess:
							return {
								...userData,
								setupCount: newUserStep,
							};
					}
				}
			}
		} catch (error) {
			Logger.error('Error in getNextSetupStep');
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}

	static async getUserTimezone({ userID }: { userID: string }) {
		const userUtcOffset = await registerModel.getUserTimezone({ userID });
		if (typeof userUtcOffset === 'number') return userUtcOffset;
		else return GeneralStatus.internalError;
	}

	static async addUserTimezone({
		userID,
		messageUserID,
		utcOffset,
	}: {
		userID: string;
		messageUserID: string;
		utcOffset: number | 'restart';
	}) {
		try {
			// comprobar si es el mismo usuario q ejecuta el /setup con el quien clica
			if (!permissionController.isSameUser({ userID: userID, messageUserID: messageUserID })) {
				return GeneralStatus.userNotAllowed;
			}
			// intentar conseguir sus datos
			const userData = await userModel.getUserDataByID({
				userID: userID,
			});
			switch (userData) {
				case RegisterStatus.userNotRegistered: {
					return RegisterStatus.userNotRegistered;
				}
				case GeneralStatus.databaseError:
					return GeneralStatus.internalError;
				// el usuario si q existe asi q cogemos su info
				default: {
					const newUserStep = userData.setupCount + 1;
					const updateUserStepStatus = await registerModel.updateUserStep({
						userID: userID,
						newUserStep: newUserStep,
					});
					switch (updateUserStepStatus) {
						case GeneralStatus.databaseError:
							return GeneralStatus.internalError;
						case GeneralStatus.databaseSuccess:
							return {
								...userData,
								setupCount: newUserStep,
							};
					}
				}
			}
		} catch (error) {
			Logger.error('Error in getNextSetupStep');
			Logger.error(error);
			return GeneralStatus.internalError;
		}
	}
}
