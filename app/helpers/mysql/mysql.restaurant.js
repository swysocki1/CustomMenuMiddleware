const MysqlConnector = require('./mysql.connector');

class MysqlRestaurant extends MysqlConnector {
    getRestaurantsByName(name, res) {
        const query = `SELECT * from resturant where name like '%${name}%'`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createResturant(resturant, res) {
        const query = `Insert into resturant (name, description) values ('${resturant.name}', '${resturant.description}')`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getResturantByName(resturant.name, (getResturantErr, resturantRes) => {
                res(getResturantErr, resturantRes);
            });
        }).catch(queryError => { res(queryError); });
    }
    getResturantByName(name, res) {
        this.getRestaurantsByName(name, (queryError, restaurants) => {
            if (queryError) {
                res(queryError);
            } else if (restaurants && restaurants.length > 0) {
                res(null, restaurants[0]);
            } else {
                res('No Restaurants Found');
            }
        })
    }
    getRestaurantById(id, res) {
        const query = `SELECT * from restaurant where id=${id}`;
        this.query(query, this.timeout).then( (restaurants) => {
            if (restaurants && restaurants.length > 0)
                res(null, restaurants[0]);
            else
                res(null, null);
        }).catch(queryError => { res(queryError); });
    }
    updateRestaurant(restaurant, res) {
        if (restaurant) {
            if (restaurant.id) {
                this.getRestaurantById(restaurant.id, (getRestaurantByIdErr, getRestaurantByIdRes) => {
                    if (getRestaurantByIdErr) res(getRestaurantByIdErr);
                    else {
                        if(!getRestaurantByIdRes) {
                            res('Restaurant Does Not Exist');
                        } else {
                            let query = `UPDATE restaurant SET `;
                            if (restaurant.name) query += `name = '${restaurant.name}' `;
                            if (restaurant.description) query += `description = '${restaurant.description}' `;
                            query += 'WHERE id = restaurant.id';
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else {
                res('No Restaurant id Provided');
            }
        } else {
            res('No Restaurant Object Provided');
        }
    }
    upsertRestaurant(restaurant, res) {
        if (restaurant) {
            if (restaurant.id) {
                this.getRestaurantById(restaurant.id, (getRestaurantByIdErr, getRestaurantByIdRes) => {
                    if (getRestaurantByIdErr) res(getRestaurantByIdErr);
                    else {
                        if(!getRestaurantByIdRes) {
                            res('Restaurant Does Not Exist');
                        } else {
                            let query = `UPDATE restaurant SET name = '${restaurant.name}' description = '${restaurant.description}' WHERE id = restaurant.id`;
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else {
                res('No Restaurant id Provided');
            }
        } else {
            res('No Restaurant Object Provided');
        }
    }
    deleteRestaurant(restaurant, res) {
        if (restaurant) {
            if (typeof restaurant === 'number' || restaurant.id) {
                const restaurantId = typeof restaurant === 'number' ? restaurant : restaurant.id;
                const query = `DELETE FROM restaurant WHERE id = ${restaurantId}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else {
                res('No Restaurant id Provided');
            }
        }
        else {
            res('No Restaurant Provided');
        }
    }
}
module.exports = MysqlRestaurant;