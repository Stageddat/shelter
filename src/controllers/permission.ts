import { Logger } from '@/lib/logger';
import { adminUserIDs } from 'config/adminUsers';

export class permissionController {
	static async isUserAdmin({ userID }: { userID: string }) {
		Logger.debug(
			`checking if user ${userID} is admin: ${adminUserIDs.includes(userID)}`,
		);
		return adminUserIDs.includes(userID);
	}
}
