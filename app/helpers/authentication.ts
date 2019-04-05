import {MysqlConnector} from "./mysql.connector";

export class Authentication {
	constructor() {
	
	}
	async test() {
		return new Promise(async(resolve) => {
			const mysql = new MysqlConnector();
			await mysql.connect();
			resolve('SUCCESS');
		});
	}
}