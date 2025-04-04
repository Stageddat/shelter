/* eslint-disable no-unused-vars */
export enum RegisterStatus {
	userSetupComplete = 'User is already registered and setup complete',
	userSetupNotComplete = 'User is registered but setup not complete',
	userNotRegistered = 'User is not registered in the database',
	userRegisteredSuccessfully = 'User registered successfully to the database',
	usernameNotProvided = 'Username not provided',
	timezoneNotProvided = 'Timezone not provided',
}
