// lib/app.js
import express = require('express');
import cors = require('cors');
// import apiRouter = require('./api');
import errorHandler = require('./helpers/errorHandler');
// Create a new express application instance
const app: express.Application = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', async(req, res) => {
	const auth = require('./helpers/authentication');
	const a = new auth.Authentication();
	const result = await a.test();
	console.log(result);
	res.json({ message: 'Hello World!' });
});

// app.use('/v1/api', apiRouter);
app.use(errorHandler.notFound);
app.use(errorHandler.internalServerError);


module.exports = app;


/*
import * as path from 'path';
// import * as express from 'express';
import * as logger from 'morgan';
import expressHandler = require('express');
import * as bodyParser from 'body-parser';
import cors = require('cors');
import * as errorHandler from './helpers/errorHandler';

// Creates and configures an ExpressJS web server.
class App {
	
	// ref to Express instance
	public express: express.Application;
	
	//Run configuration methods on the Express instance.
	constructor() {
		this.express = expressHandler();
		this.middleware();
		this.routes();
	}
	
	// Configure Express middleware.
	private middleware(): void {
		// this.express.use(logger('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(cors());
	}
	
	// Configure API endpoints.
	private routes(): void {*/
/* This is just to get up and running, and to make sure what we've got is
 * working so far. This function will change when we start to add more
 * API endpoints */
/*
		let router = express.Router();
		// placeholder route handler
		router.get('/', (req, res, next) => {
			res.json({
				message: 'Hello World!'
			});
		});
		this.express.use('/', router);
		this.express.use(errorHandler.notFound);
		this.express.use(errorHandler.internalServerError);
	}
	
}

export default new App().express;
*/