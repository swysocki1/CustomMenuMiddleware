const Controller = require('./controller');
class FoodController extends Controller {
    constructor(app, errorHandler, foodManager, foodAddOnManager) {
        super(app, errorHandler, '/food');
        this.foodManager = foodManager;
        this.foodAddOnManager = foodAddOnManager;
    }
    loadRoutes() {
        this.router.get('/:id', (req, res) => {
            try {
                this.foodManager.getFoodById(req.params.id, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/create', (req, res) => {
            try {
                this.foodManager.createFood(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/update', (req, res) => {
            try {
                this.foodManager.updateFood(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/upsert', (req, res) => {
            try {
                this.foodManager.upsertFood(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/delete', (req, res) => {
            try {
                this.foodManager.deleteFood(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
    }
}
module.exports = FoodController;