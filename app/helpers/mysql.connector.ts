import {Logger} from './logger';
// import {SecretManager} from './secretManager';

export class MysqlConnector {
	private client;
	private timeout = 3000;
	// private secretManager;
	constructor() { }
	// constructor(secretManager: SecretManager) {
	// 	this.secretManager = secretManager;
	// }
	async connect() {
		if (!this.client) {
			// const hostname = await this.secretManager.getMySqlHostname();
			// const username = await this.secretManager.getMySqlUsername();
			// const password = await this.secretManager.getMySqlPassword();
			const hostname = 'menubuilder.cj7gpfr64aqk.us-east-1.rds.amazonaws.com';
			const username = 'menubuilder';
			const password = 'Test12345';
			const mysql = require('mysql2/promise');
			this.client = await mysql.createConnection({
				host: hostname,
				user: username,
				password: password,
				database: 'users',
				connectTimeout: this.timeout
			});
		} else {
			Logger.console('MYSQL Client is already Connected!');
		}
		return;
	}
	isConnected() {
		return !!this.client;
	}
	async disconnect() {
		if (this.client) {
			await this.client.end();
		}
		return;
	}
	async getEmail(snaId: string, username: string, brandId: string) {
		username = username.replace(/\'/g, '\\\'');
		const query = `SELECT * from authentication where snaId='${snaId}' AND username='${username}'
     AND brand_id='${brandId}'`;
		const result = await this.query(query, this.timeout).catch(error => { throw new Error(error); });
		if (result && result.length > 0) {
			return result[0].email;
		} else {
			return null;
		}
	}
	private async query(query: string, timeout: number): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const timeoutEvent = setTimeout(() => {
				reject(`MYSQL TIMEOUT - ${timeout}ms`);
			}, timeout);
			this.client.execute(query, (err, response) => {
				clearTimeout(timeoutEvent);
				if (err) {
					reject(err);
				} else {
					resolve(response as any[]);
				}
			});
		}) as Promise<any[]>;
	}
}