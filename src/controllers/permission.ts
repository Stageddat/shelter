import { Logger } from '../lib/logger.js';
import { adminUserIDs } from '../../config/adminUsers.js';

export class permissionController {
	static isUserAdmin({ userID }: { userID: string }) {
		Logger.debug(`checking if user ${userID} is admin: ${adminUserIDs.includes(userID)}`);
		return adminUserIDs.includes(userID);
	}

	// verificar si el quien clica el interaction sea el mismo con el usuario inicial del mensaje
	static isSameUser({ userID, messageUserID }: { userID: string; messageUserID: string }) {
		if (userID === messageUserID) {
			return true;
		}
		return false;
	}
}
