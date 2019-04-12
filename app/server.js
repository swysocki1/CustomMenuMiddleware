// lib/app.js
const express = require('express');
const cors = require('cors');
// import apiRouter = require('./api');
const ErrorHandler = require('./helpers/errorHandler');
const Authentication = require('./helpers/authentication');
const MysqlConnector = require('./helpers/mysql.connector');

const mysql = new MysqlConnector();
const authentication = new Authentication(mysql);
const errorHandler = new ErrorHandler(mysql);
// Create a new express application instance
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/ping', (req, res) => {
    console.log('ping');
   res.json(process.env);
});
app.post('/authenticate', (req, res) => {
	try {
	    console.log('authenticate');
		authentication.authenticate(req.body.username, req.body.password, (authErr, authRes) => {
			if (authErr) {
				if (authErr === 'INVALID LOGIN')
					errorHandler.invalidLogin(authErr, req, res);
				else
					errorHandler.internalServerError(authErr, req, res);
			} else {
				res.json(authRes);
			}
		});
	} catch(error) {
		errorHandler.internalServerError(error, req, res);
	}
});
app.post('/user/create', (req, res) => {
    try {
        authentication.createUser(req.body, (reqErr, reqRes) => {
            if (reqErr) {
                if (reqErr === 'INVALID LOGIN')
                    errorHandler.invalidLogin(reqErr, req, res);
                else
                    errorHandler.internalServerError(reqErr, req, res);
            } else {
                res.json(reqRes);
            }
        });
    } catch(error) {
        errorHandler.internalServerError(error, req, res);
    }
});
app.post('/user/update', (req, res) => {
    try {
        authentication.updateUser(req.body, (reqErr, reqRes) => {
            if (reqErr) errorHandler.internalServerError(reqErr, req, res);
            else res.json(reqRes);
        });
    } catch(error) {
        errorHandler.internalServerError(error, req, res);
    }
});
app.post('/user/upsert', (req, res) => {
    try {
        authentication.upsertUser(req.body, (reqErr, reqRes) => {
            if (reqErr) errorHandler.internalServerError(reqErr, req, res);
            else res.json(reqRes);
        });
    } catch(error) {
        errorHandler.internalServerError(error, req, res);
    }
});
app.post('/user/delete', (req, res) => {
    try {
        authentication.deleteUser(req.body, (reqErr, reqRes) => {
            if (reqErr) errorHandler.internalServerError(reqErr, req, res);
            else res.json(reqRes);
        });
    } catch(error) {
        errorHandler.internalServerError(error, req, res);
    }
});

// app.use('/v1/api', apiRouter);
app.use(errorHandler.notFound);
app.use(errorHandler.catchAllError);


module.exports = app;

