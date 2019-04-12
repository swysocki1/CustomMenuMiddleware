// lib/app.js
const express = require('express');
const cors = require('cors');
// import apiRouter = require('./api');
const ErrorHandler = require('./helpers/errorHandler');
const Authentication = require('./helpers/authentication');
// const MysqlConnector = require('./helpers/mysql/mysql.connector');
const MysqlUser = require('./helpers/mysql/mysql.user');
class Server {
    constructor() {
        this.mysqlUser = new MysqlUser();
        this.authentication = new Authentication(this.mysqlUser);
        this.errorHandler = new ErrorHandler(this.mysqlUser);
        this.app = express();
        this.startServer();
        this.loadRoutes();
    }
    startServer() {
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }
    loadRoutes() {
        this.app.get('/ping', (req, res) => {
            console.log('ping');
            res.json(process.env);
        });
        this.app.post('/authenticate', (req, res) => {
            try {
                console.log('authenticate');
                this.authentication.authenticate(req.body.username, req.body.password, (authErr, authRes) => {
                    if (authErr) {
                        if (authErr === 'INVALID LOGIN')
                            this.errorHandler.invalidLogin(authErr, req, res);
                        else
                            this.errorHandler.internalServerError(authErr, req, res);
                    } else {
                        res.json(authRes);
                    }
                });
            } catch(error) {
                this.errorHandler.internalServerError(error, req, res);
            }
        });
        this.app.post('/user/create', (req, res) => {
            try {
                this.authentication.createUser(req.body, (reqErr, reqRes) => {
                    if (reqErr) {
                        if (reqErr === 'INVALID LOGIN')
                            this.errorHandler.invalidLogin(reqErr, req, res);
                        else
                            this.errorHandler.internalServerError(reqErr, req, res);
                    } else {
                        res.json(reqRes);
                    }
                });
            } catch(error) {
                this.errorHandler.internalServerError(error, req, res);
            }
        });
        this.app.post('/user/update', (req, res) => {
            try {
                this.authentication.updateUser(req.body, (reqErr, reqRes) => {
                    if (reqErr) this.errorHandler.internalServerError(reqErr, req, res);
                    else res.json(reqRes);
                });
            } catch(error) {
                this.errorHandler.internalServerError(error, req, res);
            }
        });
        this.app.post('/user/upsert', (req, res) => {
            try {
                this.authentication.upsertUser(req.body, (reqErr, reqRes) => {
                    if (reqErr) this.errorHandler.internalServerError(reqErr, req, res);
                    else res.json(reqRes);
                });
            } catch(error) {
                this.errorHandler.internalServerError(error, req, res);
            }
        });
        this.app.post('/user/delete', (req, res) => {
            try {
                this.authentication.deleteUser(req.body, (reqErr, reqRes) => {
                    if (reqErr) this.errorHandler.internalServerError(reqErr, req, res);
                    else res.json(reqRes);
                });
            } catch(error) {
                this.errorHandler.internalServerError(error, req, res);
            }
        });
        // app.use('/v1/api', apiRouter);
        this.app.use(this.errorHandler.notFound);
        this.app.use(this.errorHandler.catchAllError);
    }
}

module.exports = new Server().app;

