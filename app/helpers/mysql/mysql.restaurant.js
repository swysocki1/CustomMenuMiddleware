const MysqlConnector = require('./mysql.connector');

class MysqlRestaurant extends MysqlConnector {
    getAllRestaurants(res) {
        const query = `SELECT * from restaurant`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getRestaurantsByName(name, res) {
        const query = `SELECT * from restaurant where name like '%${name}%'`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createRestaurant(restaurant, res) {
        const query = `Insert into restaurant (name, description) values ('${restaurant.name}', '${restaurant.description}')`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getRestaurantByName(restaurant.name, (getRestaurantErr, restaurantRes) => {
                res(getRestaurantErr, {... restaurantRes});
            });
        }).catch(queryError => { res(queryError); });
    }
    getRestaurantByName(name, res) {
        this.getRestaurantsByName(name, (queryError, restaurants) => {
            if (queryError) res(queryError);
            else if (restaurants && restaurants.length > 0) res(null, {... restaurants[0]});
            else res('No Restaurants Found');
        })
    }
    getRestaurantById(id, res) {
        const query = `SELECT * from restaurant where id=${id}`;
        this.query(query, this.timeout).then( (restaurants) => {
            if (restaurants && restaurants.length > 0)
                res(null, {... restaurants[0]});
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
                            this.query(query, this.timeout).then((queryResult) => {
                                res(null, queryResult);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No Restaurant id Provided');
        } else res('No Restaurant Object Provided');
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
                            let query = `UPDATE restaurant SET name = '${restaurant.name}' description = '${restaurant.description}' WHERE id = ${restaurant.id}`;
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No Restaurant id Provided');
        } else res('No Restaurant Object Provided');
    }
    deleteRestaurant(restaurant, res) {
        if (restaurant) {
            if (typeof restaurant === 'number' || restaurant.id) {
                const restaurantId = typeof restaurant === 'number' ? restaurant : restaurant.id;
                const query = `DELETE FROM restaurant WHERE id = ${restaurantId}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No Restaurant id Provided');
        }
        else { res('No Restaurant Provided'); }
    }
    getRestaurantOwnersByRestaurant(restaurant, res) {
        console.log(restaurant);
        if (typeof restaurant === 'string')
            restaurant = parseInt(restaurant);
        if (typeof restaurant === 'number') {
            const query = `select r.restaurant, u.id as id, u.username, u.photoURL,` +
                ` u.firstname, u.lastname, u.email from restaurant_owner as r JOIN user u ON r.owner=u.id where r.restaurant=${restaurant}`;
            this.query(query, this.timeout).then((queryResult) => {
                res(null, queryResult.map(item => {return {... item}; }));
            }).catch((error) => { res(error); });
        } else res('No Restaurant Id Provided')
    }
    getOwnedRestaurantsByOwner(user, res) {
        if (typeof user === 'string')
            user = parseInt(user);
        if (typeof user === 'number') {
            const query = `select ro.owner, ro.restaurant, r.id, r.name, ` +
                `r.description from restaurant_owner as ro JOIN restaurant r ON ro.restaurant=r.id where ro.owner=${user}`;
            this.query(query, this.timeout).then((queryResult) => {
                res(null, queryResult.map(item => {return {... item}; }));
            }).catch((error) => { res(error); });
        } else res('No User Id Provided')
    }
    addRestaurantOwner(restaurant, user, res) {
        if (restaurant) {
            if (typeof restaurant === 'string')
                restaurant = parseInt(restaurant);
            if (user) {
                if (typeof user === 'string')
                    user = parseInt(user);
                const query = `Insert into restaurant_owner (owner, restaurant) values (${user},${restaurant})`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No User Id Provided')
        } else res('No Restaurant Id Provided')
    }
    removeRestaurantOwner(restaurant, user, res) {
        if (typeof restaurant === 'string')
            restaurant = parseInt(restaurant);
        if (typeof restaurant === 'number') {
            if (typeof user === 'string')
                user = parseInt(user);
            if (typeof user === 'number') {
                const query = `DELETE from restaurant_owner where owner=${user} AND restaurant=${restaurant}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No User Id Provided')
        } else res('No Restaurant Id Provided')
    }
    removeRestaurantOwnerByUser(restaurant, user, res) {
        if (typeof restaurant === 'string')
            restaurant = parseInt(restaurant);
        if (typeof restaurant === 'number') {
            if (typeof user === 'number') {
                if (typeof user === 'string')
                    user = parseInt(user);
                const query = `DELETE from restaurant_owner where owner=${user}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No User Id Provided')
        } else res('No Restaurant Id Provided')
    }
    removeRestaurantOwnerByRestaurant(restaurant, user, res) {
        if (typeof restaurant === 'string')
            restaurant = parseInt(restaurant);
        if (typeof restaurant === 'number') {
            if (typeof user === 'string')
                user = parseInt(user);
            if (typeof user === 'number') {
                const query = `DELETE from restaurant_owner where restaurant=${restaurant}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No User Id Provided')
        } else res('No Restaurant Id Provided')
    }
}
module.exports = MysqlRestaurant;