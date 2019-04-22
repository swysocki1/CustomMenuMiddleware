const Controller = require('./controller');
class AuthenticationController extends Controller {
    constructor(app, errorHandler, authentication) {
        super(app, errorHandler, '/authenticate');
        this.authentication = authentication;
    }
    loadRoutes() {
        this.router.post('/', (req, res) => {
            try {
                console.log('authenticate');
                this.authentication.authenticate(req.body.username, req.body.password, (authErr, authRes) => {
                    if (authRes) delete authRes.password;
                    if (authErr) {
                        if (authErr === 'INVALID LOGIN')
                            this.errorHandler.invalidLogin(authErr, req, res);
                        else
                            this.errorHandler.internalServerError(authErr, req, res);
                    } else {
                        res.json(authRes);
                    }
                });
            } catch(error) {
                this.errorHandler.catchAllError(error, req, res);
            }
        });
    }
}
module.exports = AuthenticationController;