class ErrorHandler {
	constructor(mysql) {
	    this.mysql = mysql;
    }
    invalidLogin(err, req, res, next) {
	    console.error(err);
	    this.mysql.disconnect((message) => {
            res.status(404);
            res.json({status: 'error',  message: 'Invalid Username and/or Password' });
        });
    }
    notFound(err, req, res, next) {
        console.error(err);
        this.mysql.disconnect((message) => {
            res.status(404);
            res.json({status: 'error', message: 'NOT FOUND'});
        });
    }
    internalServerError(err, req, res, next) {
        console.error(err);
            this.mysql.disconnect((message) => {
                if (err.message) {
                    res.status(400);
                    res.json({status: 'error', message: err.message});
                } else this.catchAllError(err, req, res, next);
            });
    }
    catchAllError(err, req, res, next) {
        console.error(err);
        this.mysql.disconnect((message) => {
            res.status(500);
            res.json({status: 'error', message: 'Something Mysterious Happened?'});
        });
    }
}
module.exports = ErrorHandler;