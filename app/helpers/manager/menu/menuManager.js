class MenuManager {
    constructor(mysqlMenu, menuSectionManager) {
        this.mysqlMenu = mysqlMenu;
        this.menuSectionManager = menuSectionManager;
    }
    // getMenuById(id, res) {
    //     if (id) {
    //         this.mysqlMenu.getMenuById(id, (err, menu) => {
    //             res(err, result);
    //         });
    //     } else res('Menu Id Not Provided');
    // }

    getMenuById(menuId, res) {
        if (menuId) {
            this.mysqlMenu.getMenuById(menuId, (getMenuErr, menu) => {
                if (getMenuErr) res(getMenuErr);
                else {
                    if (menu) {
                        this.menuSectionManager.getMenuSectionsByMenuId(menu.id, (err, menuSections) => {
                            if (err) res(err);
                            else {
                                menu.sections = menuSections;
                                res(err, menu);
                            }
                        })
                    } else res('Menu was not found');
                }
            });
        } else res('Menu Id was not provided');
    }
    getMenuByRestaurantId(restaurantId, res) {
        if (restaurantId) {
            this.mysqlMenu.getMenuSectionsByRestaurantIdId(restaurantId, (getMenuErr, menus) => {
                if (getMenuErr) res(getMenuErr);
                else {
                    Promise.all(menus.map((menu) => {
                        return new Promise((resolve, reject) => {
                            this.menuSectionManager.getMenuSectionsByMenuId(menu.id, (err, res) => {
                                if (err) reject(err);
                                else {
                                    menu.sections=res;
                                    resolve();
                                }
                            });
                        });
                    })).then(() => {
                        res(null, menus);
                    }).catch((error) => { res(error); });
                }
            });
        } else res('Restaurant Id was not provided');
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
                Promise.all([this.menuExists(menu.id)]).then(() => {
                    this.mysqlMenu.createMenu(menu, (queryError, newMenu) => {
                        if (queryError) res(queryError);
                        newMenu.sections = menu.sections;
                        menu = newMenu;
                        if (menu.sections && menu.sections.length > 0) {
                            Promise.all(menu.sections.map(menuSection => {
                                return new Promise((resolve, reject) => {
                                    menuSection.menu = menu.id;
                                    this.menuSectionManager.createMenuSection(menuSection, (createMenuSectionErr, newMenuSection) => {
                                        if (createMenuSectionErr) reject(createMenuSectionErr);
                                        else {
                                            menuSection = newMenuSection;
                                            resolve(menuSection);
                                        }
                                    });
                                });
                            })).then((menuSections) => {
                                menu.sections = menuSections;
                                res(null, menu);
                            }).catch((error) => { res(error); });
                        } else {
                            menu.sections = [];
                            res(queryError, menu);
                        }
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
            if (menu && menu.id) {
                this.mysqlMenu.getMenuById(menu.id, (err, queryRes) => {
                    if (err) reject(err);
                    else resolve(queryRes);
                });
            } else {
                resolve();
            }
        });
    }
}
module.exports = MenuManager;