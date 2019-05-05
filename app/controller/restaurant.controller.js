const Controller = require('./controller');
class RestaurantController extends Controller {
    constructor(app, errorHandler, restaurantManager) {
        super(app, errorHandler, '/restaurant');
        this.restaurantManager = restaurantManager;
    }
    loadRoutes() {
        this.router.get('/', (req, res) => {
            try {
                this.restaurantManager.getAllRestaurants((reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.get('/byOwner/:id', (req, res) => {
            try {
                this.restaurantManager.getOwnedRestaurantsByOwner(req.params, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.get('/:id', (req, res) => {
            try {
                this.restaurantManager.getRestaurantById(req.params.id, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/create', (req, res) => {
            try {
                this.restaurantManager.createRestaurant(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/update', (req, res) => {
            try {
                this.restaurantManager.updateRestaurant(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/upsert', (req, res) => {
            try {
                this.restaurantManager.upsertRestaurant(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/delete', (req, res) => {
            try {
                this.restaurantManager.deleteRestaurant(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.get('/getOwnersByRestaurant/:restaurantId/owner/:ownerId', (req, res) => {
            try {
                this.restaurantManager.getRestaurantOwnersByRestaurant(req.params.restaurantId, req.params.ownerId, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.get('/getOwnedRestaurantsByOwner/:ownerId', (req, res) => {
            try {
                this.restaurantManager.getOwnedRestaurantsByOwner(req.params.ownerId, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.get('/addOwner/:restaurantId/owner/:ownerId', (req, res) => {
            try {
                this.restaurantManager.addRestaurantOwner(req.params.restaurantId, req.params.ownerId, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.get('/removeOwner/:restaurantId/owner/:ownerId', (req, res) => {
            try {
                this.restaurantManager.removeRestaurantOwner(req.params.restaurantId, req.params.ownerId, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
    }
}
module.exports = RestaurantController;