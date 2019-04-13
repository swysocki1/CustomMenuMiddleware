class MenuManager {
    constructor(mysqlMenu) {
        this.mysqlMenu = mysqlMenu;
    }
    createMenu(menu, res) {
        if (menu) {
            const missingFields = [];
            if (!menu.name) {
                missingFields.add('Name');
            }
            if (!menu.description) {
                missingFields.add('Description');
            }
            if (missingFields.length > 0) {
                res(`No ${missingFields.join(', ')} Provided`)
            } else {
                Promise.all([this.menuExists(menu)]).then(() => {
                    this.mysqlMenu.createMenu(menu, (queryError, queryRes) => {
                        res(queryError, queryRes);
                    });
                }).catch((error) => { res(error); });
            }
        } else {
            res('Menu Body is Empty');
        }
    }
    updateMenu(menu, res) {
        if (menu) {
            if (menu.id) {
                this.mysqlMenu.updateMenu(menu, (updateMenuErr, updateMenuRes) => {
                    if (updateMenuErr) res(updateMenuErr);
                    else {
                        this.mysqlMenu.getMenuById(menu.id, (getMenuErr, getMenuRes) => {
                            res(getMenuErr, getMenuRes);
                        });
                    }
                });
            } else this.createMenu(menu, res);
        } else res('No Menu Provided');
    }
    upsertMenu(menu, res) {
        if (menu) {
            if (menu.id) {
                this.mysqlMenu.upsertMenu(menu, (updateMenuErr, updateMenuRes) => {
                    if (updateMenuErr) res(updateMenuErr);
                    else {
                        console.log('Update User Response', updateMenuRes);
                        this.mysqlMenu.getMenuById(menu.id, (getMenuErr, getMenuRes) => {
                            res(getMenuErr, getMenuRes);
                        });
                    }
                });
            } else {
                this.createMenu(menu, res);
            }
        } else res('No Menu Provided');
    }
    deleteMenu(menu, res) {
        if (menu) {
            if (menu.id) {
                this.mysqlMenu.deleteMenu(menu, (deleteMenuErr, deleteMenuRes) => {
                    res(deleteMenuErr, deleteMenuRes);
                });
            } else {
                this.createMenu(menu, res);
            }
        } else res('No Menu Provided');
    }
    menuExists(menu) {
        return new Promise((resolve, reject) => {
            this.mysqlMenu.getMenuById(menu, (err, queryRes) => {
                if (err) reject(err);
                else if(!queryRes) reject('Menu Does Not Exist!');
                else resolve(queryRes);
            });
        });
    }
}
module.exports = MenuManager;