const Controller = require('./controller');
class MenuController extends Controller {
    constructor(app, errorHandler, menuManager) {
        super(app, errorHandler, '/menu');
        this.menuManager = menuManager;
    }
    loadRoutes() {
        this.router.get('/:id', (req, res) => {
            try {
                this.menuManager.getMenuById(req.params.id, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/create', (req, res) => {
            try {
                this.menuManager.createMenu(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/update', (req, res) => {
            try {
                this.menuManager.updateMenu(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/upsert', (req, res) => {
            try {
                this.menuManager.upsertMenu(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
        this.router.post('/delete', (req, res) => {
            try {
                this.menuManager.deleteMenu(req.body, (reqErr, reqRes) => {
                    this.errorHandler.genericResponse(reqErr, reqRes, req, res);
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
    }
}
module.exports = MenuController;