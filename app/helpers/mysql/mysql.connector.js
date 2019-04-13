// import {Logger} from './logger';
// import {SecretManager} from './secretManager';
const UserQuery = require('./mysql.user');
class MysqlConnector {
	// private secretManager;
	constructor() {
		// this.connect();
		this.timeout = 3000;
	}
	// constructor(secretManager: SecretManager) {
	// 	this.secretManager = secretManager;
	// }
	connect(res) {
		if (!this.isConnected()) {
            console.log('connecting');
			const hostname = process.env.MYSQL_HOSTNAME;
			const username = process.env.MYSQL_USERNAME;
			const password = process.env.MYSQL_PASSWORD;
			const mysql = require('mysql2/promise');
			mysql.createConnection({
				host: hostname,
				user: username,
				password: password,
				database: 'users',
				connectTimeout: this.timeout
			}).then((client) => {
				this.client = client;
				console.log('connected');
				res(null, client);
			}).catch((connectionError) => {
				res(connectionError);
			});
		} else {
			res(null, 'Already Connected!');
		}
	}
	isConnected() {
		return !!this.client;
	}
    disconnect(res) {
		if (this.client) {
			this.client.end((message) => {
				res(message);
			});
		} else {
			res();
		}
	}
	query(query, timeout) {
        console.log('do query: ', query);
		return new Promise((resolve, reject) => {
            this.connect((connectErr, client) => {
            	if (connectErr) reject(connectErr);
            	else {
                    const timeoutEvent = setTimeout(() => {
                        reject(`MYSQL TIMEOUT - ${timeout}ms`);
                    }, timeout);
                    this.client.execute(query, (err, response) => {
                        clearTimeout(timeoutEvent);
                        if (err) {
                            reject(err);
                        } else {
                            resolve(response);
                        }
                    });
                }
            });
		});
	}
}
module.exports = MysqlConnector;