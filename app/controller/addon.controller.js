const Controller = require('./controller');
class FoodController extends Controller {
    constructor(app, errorHandler, foodAddOnManager) {
        super(app, errorHandler, '/addOn');
        this.foodAddOnManager = foodAddOnManager;
    }
    loadRoutes() {
        this.router.get('/:id', (req, res) => {
            try {
                this.foodManager.getFoodAddOnById(req.params.id, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/create', (req, res) => {
            try {
                this.foodAddOnManager.createFoodAddOn(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/update', (req, res) => {
            try {
                this.foodAddOnManager.updateFoodAddOn(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/upsert', (req, res) => {
            try {
                this.foodAddOnManager.upsertFoodAddOn(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/delete', (req, res) => {
            try {
                this.foodAddOnManager.deleteFoodAddOn(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
    }
}
module.exports = FoodController;