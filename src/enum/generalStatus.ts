/* eslint-disable no-unused-vars */
export enum GeneralStatus {
	databaseError = 'Something failed accessing the database',
	databaseSuccess = 'Data updated correctly',
	internalError = 'An internal error occurred',
	unexpectedError = 'An unexpected error occurred',
	userNotAllowed = 'User is not allowed to do this',
}
