const MysqlConnector = require('./mysql.connector');

class MysqlFood extends MysqlConnector {
    getFoodsByName(restaurant, food, res) {
        let query = `SELECT * from food where name like '%${food}%'`;
        if (restaurant) query += ` AND restaurant=${restaurant}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createFood(restaurant, food, res) {
        const query = `insert into food (restaurant, name, description) values (${restaurant}, '${food.name}', '${food.description}');`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getFoodByName(restaurant, food.name, (getRestaurantErr, restaurantRes) => {
                res(getRestaurantErr, restaurantRes);
            });
        }).catch(queryError => { res(queryError); });
    }
    getFoodByName(name, res) {
        this.getFoodsByName(name, (queryError, foods) => {
            if (queryError) res(queryError);
            else if (foods && foods.length > 0) res(null, foods[0]);
            else res('No Foods Found');
        })
    }
    getFoodById(id, res) {
        const query = `SELECT * from food where id=${id}`;
        this.query(query, this.timeout).then( (foods) => {
            if (foods && foods.length > 0)
                res(null, foods[0]);
            else
                res(null, null);
        }).catch(queryError => { res(queryError); });
    }
    updateFood(food, res) {
        if (food) {
            if (food.id) {
                this.getFoodById(food.id, (getFoodByIdErr, getFoodByIdRes) => {
                    if (getFoodByIdErr) res(getFoodByIdErr);
                    else {
                        if(!getFoodByIdRes) {
                            res('Food Does Not Exist');
                        } else {
                            let query = `UPDATE food SET `;
                            if (food.name) query += `name = '${food.name}' `;
                            if (food.description) query += `description = '${food.description}' `;
                            query += 'WHERE id = food.id';
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
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
                            let query = `UPDATE food SET name = '${food.name}' description = '${food.description}' WHERE id = ${food.id}`;
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
}
module.exports = MysqlFood;