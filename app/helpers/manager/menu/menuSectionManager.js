class MenuSectionManager {
    constructor(mysqlMenuSection) {
        this.mysqlMenuSection = mysqlMenuSection;
    }
    createMenuSection(menuSection, res) {
        if (menuSection) {
            const missingFields = [];
            if (!menuSection.name) {
                missingFields.add('Name');
            }
            if (!menuSection.description) {
                missingFields.add('Description');
            }
            if (missingFields.length > 0) {
                res(`No ${missingFields.join(', ')} Provided`)
            } else {
                Promise.all([this.menuSectionExists(menuSection)]).then(() => {
                    this.mysqlMenuSection.createMenuSection(menuSection, (queryError, queryRes) => {
                        res(queryError, queryRes);
                    });
                }).catch((error) => { res(error); });
            }
        } else {
            res('MenuSection Body is Empty');
        }
    }
    updateMenuSection(menuSection, res) {
        if (menuSection) {
            if (menuSection.id) {
                this.mysqlMenuSection.updateMenuSection(menuSection, (updateMenuSectionErr, updateMenuSectionRes) => {
                    if (updateMenuSectionErr) res(updateMenuSectionErr);
                    else {
                        this.mysqlMenuSection.getMenuSectionById(menuSection.id, (getMenuSectionErr, getMenuSectionRes) => {
                            res(getMenuSectionErr, getMenuSectionRes);
                        });
                    }
                });
            } else this.createMenuSection(menuSection, res);
        } else res('No MenuSection Provided');
    }
    upsertMenuSection(menuSection, res) {
        if (menuSection) {
            if (menuSection.id) {
                this.mysqlMenuSection.upsertMenuSection(menuSection, (updateMenuSectionErr, updateMenuSectionRes) => {
                    if (updateMenuSectionErr) res(updateMenuSectionErr);
                    else {
                        console.log('Update User Response', updateMenuSectionRes);
                        this.mysqlMenuSection.getMenuSectionById(menuSection.id, (getMenuSectionErr, getMenuSectionRes) => {
                            res(getMenuSectionErr, getMenuSectionRes);
                        });
                    }
                });
            } else {
                this.createMenuSection(menuSection, res);
            }
        } else res('No MenuSection Provided');
    }
    deleteMenuSection(menuSection, res) {
        if (menuSection) {
            if (menuSection.id) {
                this.mysqlMenuSection.deleteMenuSection(menuSection, (deleteMenuSectionErr, deleteMenuSectionRes) => {
                    res(deleteMenuSectionErr, deleteMenuSectionRes);
                });
            } else {
                this.createMenuSection(menuSection, res);
            }
        } else res('No MenuSection Provided');
    }
    menuSectionExists(menuSection) {
        return new Promise((resolve, reject) => {
            this.mysqlMenuSection.getMenuSectionById(menuSection, (err, queryRes) => {
                if (err) reject(err);
                else if(!queryRes) reject('MenuSection Does Not Exist!');
                else resolve(queryRes);
            });
        });
    }
}
module.exports = MenuSectionManager;