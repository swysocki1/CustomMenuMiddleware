const Controller = require('./controller');
class MenuSectionController extends Controller {
    constructor(app, errorHandler, menuSectionManager, foodAddOnManager) {
        super(app, errorHandler, '/menu-section');
        this.menuSectionManager = menuSectionManager;
        this.foodAddOnManager = foodAddOnManager;
    }
    loadRoutes() {
        this.router.get('/:id', (req, res) => {
            try {
                this.menuSectionManager.getMenuSectionById(req.params.id, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/create', (req, res) => {
            try {
                this.menuSectionManager.createMenuSection(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/update', (req, res) => {
            try {
                this.menuSectionManager.updateMenuSection(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/upsert', (req, res) => {
            try {
                this.menuSectionManager.upsertMenuSection(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/delete', (req, res) => {
            try {
                this.menuSectionManager.deleteMenuSection(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
    }
}
module.exports = MenuSectionController;