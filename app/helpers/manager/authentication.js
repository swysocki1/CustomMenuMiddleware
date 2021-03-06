class Authentication {
	constructor(mysqlUser) {
        this.mysqlUser = mysqlUser;
	}
	authenticate(username, password, res) {
	    console.log('getUsersByUsername');
		this.mysqlUser.getUsersByUsername(username, (mysqlErr, mysqlResult) => {
			if (mysqlErr) res(mysqlErr);
			else {
				let user;
                mysqlResult.forEach(usr => {
                    if (!user && usr.password === password)
                        user = usr;
                });
                if (user)
                	res(null, user);
                else
                	res('INVALID LOGIN');
            }
		});
	}
	getUserById(user, res) {
	    if (user) {
	        this.mysqlUser.getUserById(user, (err, result) => {
	            res(err, result);
            });
        } else res('User Id Not Provided');
    }
    createUser(user, res) {
		if (user) {
            const missingFields = [];
            if (!user.username) {
                missingFields.add('Username');
            }
            if (!user.password) {
                missingFields.add('Password');
            }
            if (!user.email) {
                missingFields.add('Email');
            }
            if (missingFields.length > 0) {
                res(`No ${missingFields.join(', ')} Provided`)
            } else {
                this.mysqlUser.getUsersByUsername(user.username, (getUserErr, users) => {
                    if (getUserErr) res(getUserErr);
                    else {
                        if (users && users.length > 0) {
                            res('Username Already Exists');
                        } else {
                            this.mysqlUser.createUser(user, (createUserError, userObj) => {
                                if (createUserError) res(createUserError);
                                else {
                                	res(null, userObj);
                                }
							});
                        }
                    }
                });
            }
        } else {
			res('User Body is Empty');
		}
	}
	updateUser(user, res) {
        if (user) {
            if (user.id) {
                this.mysqlUser.updateUser(user, (updateUserErr, updateUserRes) => {
                    if (updateUserErr) res(updateUserErr);
                    else {
                        console.log('Update User Response', updateUserRes);
                        this.mysqlUser.getUserById(user.id, (getUserErr, getUserRes) => {
                           res(getUserErr, getUserRes);
                        });
                    }
                });
            } else {
                this.createUser(user, res);
            }
        } else res('No User Provided');
	}
    upsertUser(user, res) {
        if (user) {
            if (user.id) {
                this.mysqlUser.upsertUser(user, (updateUserErr, updateUserRes) => {
                    if (updateUserErr) res(updateUserErr);
                    else {
                        console.log('Update User Response', updateUserRes);
                        this.mysqlUser.getUserById(user.id, (getUserErr, getUserRes) => {
                            res(getUserErr, getUserRes);
                        });
                    }
                });
            } else {
                this.createUser(user, res);
            }
        } else res('No User Provided');
    }
	deleteUser(user, res) {
        if (user) {
            if (user.id) {
                this.mysqlUser.deleteUser(user, (deleteUserErr, deleteUserRes) => {
                    res(deleteUserErr, deleteUserRes);
                });
            } else {
                this.createUser(user, res);
            }
        } else res('No User Provided');
	}
	userExists(user) {
        return new Promise((resolve, reject) => {
            if (user && user.id) {
                this.mysqlUser.getUserById(user.id, (err, queryRes) => {
                    if (err) reject(err);
                    else if (!queryRes) reject('User Does Not Exist!');
                    else resolve(queryRes);
                });
            } else {
                resolve();
            }
        });
    }
}
module.exports = Authentication;