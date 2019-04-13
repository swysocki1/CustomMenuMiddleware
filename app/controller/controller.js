const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

class Controller {
    constructor(app, errorHandler, route) {
        this.router = express.Router();
        this.errorHandler = errorHandler;
        this.loadRoutes();
        route = route ? route : '/';
        app.use(`${route}`, this.router);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer : true}));
        console.log('Loaded Route ' + route);
    }
    loadRoutes() {
        this.router.get('/ping', (req, res) => {
            console.log('ping');
            res.json({message: 'success'});
        });
    }
}
module.exports = Controller;