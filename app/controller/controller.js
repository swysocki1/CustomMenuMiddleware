const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

class Controller {
    constructor(app, errorHandler, route) {
        this.router = express.Router();
        this.errorHandler = errorHandler;
        this.loadRoutes();
        route = route ? route : '/';
        console.log('Loading Route ' + route);
        app.use(`${route}`, this.router);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer : true}));
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authentication");
            next();
        });
    }
    loadRoutes() {
        this.router.get('/ping', (req, res) => {
            console.log('ping');
            res.json({message: 'success'});
        });
    }
}
module.exports = Controller;