import { Logger } from '../lib/logger.js';
import { adminUserIDs } from '../../config/adminUsers.js';

export class permissionController {
	static isUserAdmin({ userID }: { userID: string }) {
		Logger.debug(`checking if user ${userID} is admin: ${adminUserIDs.includes(userID)}`);
		return adminUserIDs.includes(userID);
	}
}
