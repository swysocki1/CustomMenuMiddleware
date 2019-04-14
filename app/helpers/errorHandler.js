class ErrorHandler {
	constructor(mysqlList) {
	    this.mysqlList = mysqlList;
    }
    genericResponse(err, data, req, res, next) {
        if (err) this.internalServerError(err, req, res);
        else res.json(data);
    }
    invalidLogin(err, req, res, next) {
	    console.error(err);
	    this.disconnectMysql().then(() => {
            res.status(404);
            res.json({status: 'error',  message: 'Invalid Username and/or Password' });
        });
    }
    notFound(err, req, res, next) {
        console.error(err);
        this.disconnectMysql().then(() => {
            res.status(404);
            res.json({status: 'error', message: 'NOT FOUND'});
        });
    }
    internalServerError(err, req, res, next) {
        console.error(err);
        this.disconnectMysql().then(() => {
            if (err.message) {
                res.status(400);
                res.json({status: 'error', message: err.message});
            } else this.catchAllError(err, req, res, next);
        });
    }
    catchAllError(err, req, res, next) {
        console.error(err);
        this.disconnectMysql().then(() => {
            res.status(500);
            res.json({status: 'error', message: 'Something Mysterious Happened?'});
        });
    }
    disconnectMysql() {
	    return new Promise.all(this.mysqlList.map(async mysql => {
	        mysql.disconnect((message, error) => {
	            if (error) reject(error);
	            else resolve(message);
            });
        }));
    }
}
module.exports = ErrorHandler;