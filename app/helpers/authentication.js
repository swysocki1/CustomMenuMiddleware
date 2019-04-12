class Authentication {
	constructor(mysql) {
        this.mysql = mysql;
	}
	authenticate(username, password, res) {
	    console.log('getUsersByUsername');
		this.mysql.getUsersByUsername(username, (mysqlErr, mysqlResult) => {
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
                this.mysql.getUsersByUsername(username, (getUserErr, users) => {
                    if (getUserErr) res(getUserErr);
                    else {
                        if (users && users.length > 0) {
                            res('Username Already Exists');
                        } else {
                            this.mysql.createUser(user, (createUserError, userObj) => {
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
                this.mysql.updateUser(user, (updateUserErr, updateUserRes) => {
                    if (updateUserErr) res(updateUserErr);
                    else {
                        console.log('Update User Response', updateUserRes);
                        this.mysql.getUserById(user.id, (getUserErr, getUserRes) => {
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
                this.mysql.upsertUser(user, (updateUserErr, updateUserRes) => {
                    if (updateUserErr) res(updateUserErr);
                    else {
                        console.log('Update User Response', updateUserRes);
                        this.mysql.getUserById(user.id, (getUserErr, getUserRes) => {
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
                this.mysql.deleteUser(user, (deleteUserErr, deleteUserRes) => {
                    res(deleteUserErr, deleteUserRes);
                });
            } else {
                this.createUser(user, res);
            }
        } else res('No User Provided');
	}
}
module.exports = Authentication;