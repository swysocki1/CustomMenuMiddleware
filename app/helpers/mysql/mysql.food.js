const MysqlConnector = require('./mysql.connector');

class MysqlFood extends MysqlConnector {
    getFoodsByName(menuSection, food, res) {
        let query = `SELECT * from food where name like '%${food}%'`;
        if (menuSection) query += ` AND menuSection=${menuSection}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getFoodByMenuSectionId(menuSection, res) {
        const query = `SELECT * from food f JOIN food_in_section fis ON f.id=fis.food where fis.section=${menuSection}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createFood(food, res) {
        if (!food.name) food.name = null;
        if (!food.description) food.description = null;
        if (!food.imgSrc) food.imgSrc = '';
        const query = `insert into food (name, img_src, price, description) values ('${food.name}', '${food.imgSrc}', ${food.price}, '${food.description}');`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getFoodById(queryRes.insertId, (createFoodErr, createFoodResaurantRes) => {
                if (createFoodErr) res(createFoodErr);
                else {
                    // res(getRestaurantErr, restaurantRes);
                    this.addMenuSectionRelation(food.menuSection, queryRes.insertId, (relErr, relRes) => {
                        createFoodResaurantRes.menuSection = food.menuSection;
                        res(relErr, {... createFoodResaurantRes});
                    });
                }
            });
        }).catch(queryError => { res(queryError); });
    }
    getFoodById(id, res) {
        const query = `SELECT * from food where id=${id}`;
        this.query(query, this.timeout).then( (foods) => {
            if (foods && foods.length > 0)
                res(null, {... foods[0]});
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    updateFood(food, res) {
        if (food) {
            if (food.id) {
                this.getFoodById(food.id, (getFoodErr, getFoodRes) => {
                    if (getFoodErr) res(getFoodErr);
                    else {
                        if (!getFoodRes) {
                            this.createFood(food, (createErr, createRes) => {
                                res(createErr, createRes);
                            });
                        } else {
                            let query = `UPDATE food SET `;
                            const updates = [];
                            if (food.name) updates.push(`name = '${food.name}'`);
                            if (food.description) updates.push(`description = '${food.description}'`);
                            if (food.imgSrc) updates.push(`img_src = '${food.imgSrc}'`);
                            if (updates.length > 0) {
                                query = query + `${updates.join(', ')} WHERE id = ${food.id}`;
                                this.query(query, this.timeout).then((result) => {
                                    res(null, result);
                                }).catch((error) => {
                                    res(error);
                                });
                            } else {
                                res(null, null);
                            }
                        }
                    }
                });
            } else res('No Food id Provided');
        } else res('No Food Object Provided');
    }
    upsertFood(food, res) {
        if (food) {
            if (food.id) {
                this.getFoodById(food.id, (getFoodByIdErr, getFoodByIdRes) => {
                    if (getFoodByIdErr) res(getFoodByIdErr);
                    else {
                        if(!getFoodByIdRes) {
                            res('Food Does Not Exist');
                        } else {
                            let query = `UPDATE food SET name = '${food.name}' description = '${food.description}' img_src = '${food.imgSrc}' WHERE id = ${food.id}`;
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No Food id Provided');
        } else res('No Food Object Provided');
    }
    deleteFood(food, res) {
        if (food) {
            if (typeof food === 'number' || food.id) {
                const foodId = typeof food === 'number' ? food : food.id;
                const query = `DELETE FROM food WHERE id = ${foodId}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No Food id Provided');
        }
        else { res('No Food Provided'); }
    }
    addMenuSectionRelation(menuSection, food, res) {
        if (menuSection) {
            if (food) {
                const query = `INSERT INTO food_in_section (section, food) values ('${menuSection}', '${food}')`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No Food Provided In Relation');
        }
        else { res('No MenuSection Provided In Relation'); }
    }
}
module.exports = MysqlFood;