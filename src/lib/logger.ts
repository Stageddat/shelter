/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from './env.js';
import pc from 'picocolors';

export class Logger {
	private static _getTimeStamp() {
		return `[${new Date().toISOString()}]`;
	}

	public static log(...messages: any[]) {
		console.log(`${pc.green('[LOG]')} ${this._getTimeStamp()} ${messages.join(' ')}`);
	}
	public static info(...messages: any[]) {
		console.log(`${pc.blue('[INFO]')} ${this._getTimeStamp()} ${messages.join(' ')}`);
	}
	public static error(...messages: any[]) {
		console.error(`${pc.red('[ERROR]')} ${this._getTimeStamp()} ${messages.join(' ')}`);
	}
	public static warn(...messages: any[]) {
		console.warn(`${pc.yellow('[WARN]')} ${this._getTimeStamp()} ${messages.join(' ')}`);
	}
	public static debug(...messages: any[]) {
		if (env.DEBUG === false) return;
		console.debug(`${pc.magenta('[DEBUG]')} ${this._getTimeStamp()} ${messages.join(' ')}`);
	}
}
