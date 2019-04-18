// lib/app.js
const express = require('express');
const cors = require('cors');

const ErrorHandler = require('./helpers/errorHandler');
const Authentication = require('./helpers/manager/authentication');
const RestaurantManager = require('./helpers/manager/restaurantManager');
const MenuManager = require('./helpers/manager/menu/menuManager');
const MenuSectionManager = require('./helpers/manager/menu/menuSectionManager');
const FoodManager = require('./helpers/manager/menu/foodManager');
const FoodAddOnManager = require('./helpers/manager/menu/foodAddOnManager');

const MysqlUser = require('./helpers/mysql/mysql.user');
const MysqlRestaurant = require('./helpers/mysql/mysql.restaurant');
const MysqlMenu = require('./helpers/mysql/mysql.menu');
const MysqlMenuSection = require('./helpers/mysql/mysql.menuSection');
const MysqlFood = require('./helpers/mysql/mysql.food');
const MysqlFoodAddOn = require('./helpers/mysql/mysql.foodAddOn');
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
        this.mysqlFoodAddOn = new MysqlFoodAddOn();
        this.authentication = new Authentication(this.mysqlUser);
        this.foodAddOnManager = new FoodAddOnManager(this.mysqlFoodAddOn);
        this.foodManager = new FoodManager(this.mysqlFood, this.foodAddOnManager);
        this.menuSectionManager = new MenuSectionManager(this.mysqlMenuSection, this.foodAddOnManager, this.foodManager);
        this.menuManager = new MenuManager(this.mysqlMenu, this.menuSectionManager);
        this.restaurantManager = new RestaurantManager(this.mysqlRestaurant, this.authentication, this.menuManager);
        this.errorHandler = new ErrorHandler([this.mysqlUser, this.mysqlRestaurant, this.mysqlMenu, this.mysqlMenuSection, this.mysqlFood, this.mysqlFoodAddOn]);
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
        new MenuSectionController(this.app, this.errorHandler, this.menuSectionManager, this.foodAddOnManager);
        new FoodController(this.app, this.errorHandler, this.foodManager, this.foodAddOnManager);

        // app.use('/v1/api', apiRouter);
        this.app.use(this.errorHandler.notFound);
        this.app.use(this.errorHandler.catchAllError);
    }
}

module.exports = new Server().app;

