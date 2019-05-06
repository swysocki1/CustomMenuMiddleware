const MysqlConnector = require('./mysql.connector');

class MysqlMenuSection extends MysqlConnector {
    getMenuSectionsByName(menu, menuSection, res) {
        let query = `SELECT * from menu_section where name like '%${menuSection}%'`;
        if (menu) query += ` AND menu=${menu}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getMenuSectionsById(menu, res) {
        const query = `SELECT * from menu_section where id=${menu}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getMenuSectionsByMenuId(menu, res) {
        const query = `SELECT * from menu_section where menu=${menu}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createMenuSection(menuSection, res) {
        if (!menuSection.menu) menuSection.menu = null;
        if (!menuSection.name) menuSection.name = '';
        if (!menuSection.description) menuSection.description = '';
        if (!menuSection.displayOrder) menuSection.displayOrder = null;
        const query = `insert into menu_section (menu, name, description, display_order) values (${menuSection.menu}, '${menuSection.name}', '${menuSection.description}', ${menuSection.displayOrder});`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getMenuSectionById(queryRes.insertId, (getMenuErr, menuRes) => {
                res(getMenuErr, {... menuRes});
            });
        }).catch(queryError => { res(queryError); });
    }
    getMenuSectionById(id, res) {
        const query = `SELECT * from menu_section where id=${id}`;
        this.query(query, this.timeout).then( (menuSections) => {
            if (menuSections && menuSections.length > 0)
                res(null, {... menuSections[0]});
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
                            const update = [];
                            let query = `UPDATE menu_section SET `;
                            if (menuSection.name) update.push(`name = '${menuSection.name}'`);
                            if (menuSection.description) update.push(`description = '${menuSection.description}'`);
                            if (menuSection.displayOrder) update.push(`display_order = '${menuSection.displayOrder}'`);
                            query += update.join(', ') + ` WHERE id = ${menuSection.id}`;
                            this.query(query, this.timeout).then((queryResult) => {
                                res(null, queryResult);
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
                            this.query(query, this.timeout).then((queryResult) => {
                                res(null, queryResult);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No MenuSection id Provided');
        } else res('No MenuSection Object Provided');
    }
    deleteMenuSection(section, res) {
        if (section) {
            if (typeof section === 'number' || section.id) {
                const sectionId = typeof section === 'number' ? section : section.id;
                const query = `DELETE FROM menu_section WHERE id = ${sectionId}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No Food id Provided');
        }
        else { res('No Food Provided'); }
    }
}
module.exports = MysqlMenuSection;