// lib/app.js
const express = require('express');
const cors = require('cors');
// import apiRouter = require('./api');
const ErrorHandler = require('./helpers/errorHandler');
const Authentication = require('./helpers/manager/authentication');
const RestaurantManager = require('./helpers/manager/restaurantManager');
const MenuManager = require('./helpers/manager/menu/menuManager');
const MenuSectionManager = require('./helpers/manager/menu/menuSectionManager');
const FoodManager = require('./helpers/manager/menu/foodManager');
// const MysqlConnector = require('./helpers/mysql/mysql.connector');
const MysqlUser = require('./helpers/mysql/mysql.user');
const MysqlRestaurant = require('./helpers/mysql/mysql.restaurant');
const MysqlMenu = require('./helpers/mysql/mysql.menu');
const MysqlMenuSection = require('./helpers/mysql/mysql.menuSection');
const MysqlFood = require('./helpers/mysql/mysql.food');
const Controller = require('./controller/controller');
const AuthenticationController = require('./controller/authentication.controller');
const UserController = require('./controller/user.controller');
const RestaurantController = require('./controller/restaurant.controller');
const MenuController = require('./controller/menu.controller');
const MenuSectionController = require('./controller/menuSection.controller');
const FoodController = require('./controller/food.controller');

class Server {
    constructor() {
        this.mysqlUser = new MysqlUser();
        this.mysqlRestaurant = new MysqlRestaurant();
        this.mysqlMenu = new MysqlMenu();
        this.mysqlMenuSection = new MysqlMenuSection();
        this.mysqlFood = new MysqlFood();
        this.authentication = new Authentication(this.mysqlUser);
        this.restaurantManager = new RestaurantManager(this.mysqlRestaurant, this.authentication);
        this.menuManager = new MenuManager(this.mysqlMenu);
        this.menuSectionManager = new MenuSectionManager(this.mysqlMenuSection);
        this.foodManager = new FoodManager(this.mysqlFood);
        this.errorHandler = new ErrorHandler([this.mysqlUser, this.mysqlRestaurant, this.mysqlMenu, this.mysqlMenuSection, this.mysqlFood]);
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
        new Controller(this.app, this.errorHandler);
        new AuthenticationController(this.app, this.errorHandler, this.authentication);
        new UserController(this.app, this.errorHandler, this.authentication);
        new RestaurantController(this.app, this.errorHandler, this.restaurantManager);
        new MenuController(this.app, this.errorHandler, this.menuManager);
        new MenuSectionController(this.app, this.errorHandler, this.menuSectionManager);
        new FoodController(this.app, this.errorHandler, this.foodManager);

        // app.use('/v1/api', apiRouter);
        this.app.use(this.errorHandler.notFound);
        this.app.use(this.errorHandler.catchAllError);
    }
}

module.exports = new Server().app;

