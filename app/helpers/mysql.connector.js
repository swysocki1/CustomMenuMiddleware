// import {Logger} from './logger';
// import {SecretManager} from './secretManager';

class MysqlConnector {
	// private secretManager;
	constructor() {
		// this.connect();
		this.timeout = 10000;
	}
	// constructor(secretManager: SecretManager) {
	// 	this.secretManager = secretManager;
	// }
	connect(res) {
		console.log('connecting');
		if (!this.isConnected()) {
			// const hostname = await this.secretManager.getMySqlHostname();
			// const username = await this.secretManager.getMySqlUsername();
			// const password = await this.secretManager.getMySqlPassword();
			const hostname = process.env.MYSQL_HOSTNAME;
			const username = process.env.MYSQL_USERNAME;
			const password = process.env.MYSQL_PASSWORD;
			const mysql = require('mysql2/promise');
			mysql.createConnection({
				host: hostname,
				user: username,
				password: password,
				database: 'users',
				connectTimeout: 5000
			}).then((client) => {
				this.client = client;
				console.log('connected', this.client);
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
	getUsersByUsername(username, res) {
		const query = `SELECT * from user where username='${username}'`;
        this.query(query, this.timeout).then( (queryRes) => {
            console.log('queryRes', queryRes);
			if (queryRes && queryRes.length > 0)
				res(null, queryRes);
			else
				res(null, []);
		}).catch(queryError => { res(queryError); });
	}
    createUser(user, res) {
		const query = `Insert into user (username, password, firstname, lastname, email) values ('${user.username}', '${user.password}', '${user.firstname}', '${user.lastname}', '${username.email}')`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getUserByUsername(user.username, (getUserErr, userRes) => {
            	res(getUserErr, userRes);
			});
        }).catch(queryError => { res(queryError); });
	}
	getUserByUsername(username, res) {
        this.getUsersByUsername(username, (queryError, users) => {
        	if (queryError) {
        		res(queryError);
			} else if (users && users.length > 0) {
        		res(null, users[0]);
			} else {
        		res('No Users Found');
			}
		})
	}
	getUserById(id, res) {
        const query = `SELECT * from user where id=${id}`;
        this.query(query, this.timeout).then( (users) => {
            if (users && users.length > 0)
                res(null, users[0]);
            else
                res(null, null);
        }).catch(queryError => { res(queryError); });
	}
	updateUser(user, res) {
		if (user) {
			if (user.id) {
				this.getUserById(user.id, (getUserByIdErr, getUserByIdRes) => {
					if (getUserByIdErr) res(getUserByIdErr);
					else {
						if(!getUserByIdRes) {
							res('User Does Not Exist');
						} else {
							let query = `UPDATE user SET `;
							if (user.password) query += `password = '${user.password}' `;
                            if (user.firstname) query += `firstname = '${user.firstname}' `;
                            if (user.lastname) query += `lastname = '${user.lastname}' `;
                            if (user.email) query += `email = '${user.email}' `;
                            query += 'WHERE id = user.id';
                            this.query(query, this.timeout).then((res) => {
                            	res(null, res);
							}).catch((error) => { res(error); });
						}
					}
				});
			} else {
				res('No User id Provided');
			}
		} else {
			res('No User Object Provided');
		}
	}
    upsertUser(user, res) {
        if (user) {
            if (user.id) {
                this.getUserById(user.id, (getUserByIdErr, getUserByIdRes) => {
                    if (getUserByIdErr) res(getUserByIdErr);
                    else {
                        if(!getUserByIdRes) {
                            res('User Does Not Exist');
                        } else {
                            let query = `UPDATE user SET password = '${user.password}' firstname = '${user.firstname}' lastname = '${user.lastname}' ` +
										`email = '${user.email}' WHERE id = user.id`;
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else {
                res('No User id Provided');
            }
        } else {
            res('No User Object Provided');
        }
    }
    deleteUser(user, res) {
		if (user) {
			if (typeof user === 'number' || user.id) {
				const userId = typeof user === 'number' ? user : user.id;
				const query = `DELETE FROM user WHERE id = ${userId}`;
				this.query(query, this.timeout).then((queryResult) => {
					res(null, queryResult);
				}).catch((error) => { res(error); });
			} else {
				res('No User id Provided');
			}
        }
		 else {
            res('No User Provided');
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