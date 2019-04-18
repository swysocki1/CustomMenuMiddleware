const MysqlConnector = require('./mysql.connector');

class MysqlMenuSection extends MysqlConnector {
    getMenuSectionsByName(menu, menuSection, res) {
        let query = `SELECT * from menu_section where name like '%${menuSection}%'`;
        if (menu) query += ` AND menu=${menu}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getMenuSectionsById(menu, res) {
        const query = `SELECT * from menu_section where id=${menu}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getMenuSectionsByMenuId(menu, res) {
        const query = `SELECT * from menu_section where menu=${menu}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createMenuSection(menu, menuSection, res) {
        const query = `insert into menu_section (menu, name, description, display_order) values (${menu}, '${menuSection.name}', '${menuSection.description}', '${menuSection.displayOrder}');`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getMenuSectionByName(manu, menuSection.name, (getMenuErr, menuRes) => {
                res(getMenuErr, menuRes);
            });
        }).catch(queryError => { res(queryError); });
    }
    getMenuSectionByName(name, res) {
        this.getMenuSectionsByName(name, (queryError, menuSections) => {
            if (queryError) res(queryError);
            else if (menuSections && menuSections.length > 0) res(null, menuSections[0]);
            else res('No MenuSections Found');
        })
    }
    getMenuSectionById(id, res) {
        const query = `SELECT * from menu_section where id=${id}`;
        this.query(query, this.timeout).then( (menuSections) => {
            if (menuSections && menuSections.length > 0)
                res(null, menuSections[0]);
            else
                res(null, null);
        }).catch(queryError => { res(queryError); });
    }
    updateMenuSection(menuSection, res) {
        if (menuSection) {
            if (menuSection.id) {
                this.getMenuSectionById(menuSection.id, (getMenuSectionByIdErr, getMenuSectionByIdRes) => {
                    if (getMenuSectionByIdErr) res(getMenuSectionByIdErr);
                    else {
                        if(!getMenuSectionByIdRes) {
                            res('MenuSection Does Not Exist');
                        } else {
                            let query = `UPDATE menu_section SET `;
                            if (menuSection.name) query += `name = '${menuSection.name}' `;
                            if (menuSection.description) query += `description = '${menuSection.description}' `;
                            if (menuSection.displayOrder) query += `display_order = '${menuSection.displayOrder}' `;
                            query += 'WHERE id = menuSection.id';
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No MenuSection id Provided');
        } else res('No MenuSection Object Provided');
    }
    upsertMenuSection(menuSection, res) {
        if (menuSection) {
            if (menuSection.id) {
                this.getMenuSectionById(menuSection.id, (getMenuSectionByIdErr, getMenuSectionByIdRes) => {
                    if (getMenuSectionByIdErr) res(getMenuSectionByIdErr);
                    else {
                        if(!getMenuSectionByIdRes) {
                            res('MenuSection Does Not Exist');
                        } else {
                            let query = `UPDATE menu_section SET name = '${menuSection.name}' description = '${menuSection.description}'` +
                                ` display_order = '${menuSection.displayOrder}' WHERE id = ${menuSection.id}`;
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No MenuSection id Provided');
        } else res('No MenuSection Object Provided');
    }
    deleteMenuSection(menuSection, res) {
        if (menuSection) {
            if (typeof menuSection === 'number' || menuSection.id) {
                const menuSectionId = typeof menuSection === 'number' ? menuSection : menuSection.id;
                const query = `DELETE FROM menu_section WHERE id = ${menuSectionId}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No MenuSection id Provided');
        }
        else { res('No MenuSection Provided'); }
    }
}
module.exports = MysqlMenuSection;