const MysqlConnector = require('./mysql.connector');

class MysqlMenu extends MysqlConnector {
    getMenusByName(restaurant, menu, res) {
        let query = `SELECT * from menu where name like '%${menu}%'`;
        if (restaurant) query += ` AND restaurant=${restaurant}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getMenuSectionsByRestaurantIdId(restaurantId, res) {
        const query = `SELECT * from menu where restaurant=${restaurantId}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createMenu(restaurant, menu, res) {
        const query = `insert into menu (restaurant, name, description) values (${restaurant}, '${menu.name}', '${menu.description}');`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getMenuByName(restaurant, menu.name, (getRestaurantErr, restaurantRes) => {
                res(getRestaurantErr, restaurantRes);
            });
        }).catch(queryError => { res(queryError); });
    }
    getMenuByName(name, res) {
        this.getMenusByName(name, (queryError, menus) => {
            if (queryError) res(queryError);
            else if (menus && menus.length > 0) res(null, menus[0]);
            else res('No Menus Found');
        })
    }
    getMenuById(id, res) {
        const query = `SELECT * from menu where id=${id}`;
        this.query(query, this.timeout).then( (menus) => {
            if (menus && menus.length > 0)
                res(null, menus[0]);
            else
                res(null, null);
        }).catch(queryError => { res(queryError); });
    }
    updateMenu(menu, res) {
        if (menu) {
            if (menu.id) {
                this.getMenuById(menu.id, (getMenuByIdErr, getMenuByIdRes) => {
                    if (getMenuByIdErr) res(getMenuByIdErr);
                    else {
                        if(!getMenuByIdRes) {
                            res('Menu Does Not Exist');
                        } else {
                            let query = `UPDATE menu SET `;
                            if (menu.name) query += `name = '${menu.name}' `;
                            if (menu.description) query += `description = '${menu.description}' `;
                            query += 'WHERE id = menu.id';
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No Menu id Provided');
        } else res('No Menu Object Provided');
    }
    upsertMenu(menu, res) {
        if (menu) {
            if (menu.id) {
                this.getMenuById(menu.id, (getMenuByIdErr, getMenuByIdRes) => {
                    if (getMenuByIdErr) res(getMenuByIdErr);
                    else {
                        if(!getMenuByIdRes) {
                            res('Menu Does Not Exist');
                        } else {
                            let query = `UPDATE menu SET name = '${menu.name}' description = '${menu.description}' WHERE id = ${menu.id}`;
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No Menu id Provided');
        } else res('No Menu Object Provided');
    }
    deleteMenu(menu, res) {
        if (menu) {
            if (typeof menu === 'number' || menu.id) {
                const menuId = typeof menu === 'number' ? menu : menu.id;
                const query = `DELETE FROM menu WHERE id = ${menuId}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No Menu id Provided');
        }
        else { res('No Menu Provided'); }
    }
}
module.exports = MysqlMenu;