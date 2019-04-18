class RestaurantManager {
    constructor(mysqlRestaurant, authentication, menuManager) {
        this.mysqlRestaurant = mysqlRestaurant;
        this.authentication = authentication;
        this.menuManager = menuManager;
    }
    getRestaurantById(id, res) {
        if (id) {
            this.mysqlRestaurant.getRestaurantById(id, (getRestaurantErr, restaurant) => {
                if (getRestaurantErr) res(getRestaurantErr);
                else {
                    if (restaurant) {
                        this.menuManager.getMenuByRestaurantId(restaurant.id, (err, menus) => {
                            if (err) res(err);
                            else {
                                restaurant.menus = menus;
                                res(err, restaurant);
                            }
                        })
                    } else res('Menu was not found');
                }
            });
        } else res('Menu Id was not provided');
    }
    createRestaurant(restaurant, res) {
        if (restaurant) {
            const missingFields = [];
            if (!restaurant.name) {
                missingFields.add('Name');
            }
            if (!restaurant.description) {
                missingFields.add('Description');
            }
            if (missingFields.length > 0) {
                res(`No ${missingFields.join(', ')} Provided`)
            } else {
                Promise.all([this.restaurantExists(restaurant)]).then(() => {
                    this.mysqlRestaurant.createRestaurant(restaurant, (queryError, queryRes) => {
                        res(queryError, queryRes);
                    });
                }).catch((error) => { res(error); });
            }
        } else {
            res('Restaurant Body is Empty');
        }
    }
    updateRestaurant(restaurant, res) {
        if (restaurant) {
            if (restaurant.id) {
                this.mysqlRestaurant.updateRestaurant(restaurant, (updateRestaurantErr, updateRestaurantRes) => {
                    if (updateRestaurantErr) res(updateRestaurantErr);
                    else {
                        this.mysqlRestaurant.getRestaurantById(restaurant.id, (getRestaurantErr, getRestaurantRes) => {
                            res(getRestaurantErr, getRestaurantRes);
                        });
                    }
                });
            } else this.createRestaurant(restaurant, res);
        } else res('No Restaurant Provided');
    }
    upsertRestaurant(restaurant, res) {
        if (restaurant) {
            if (restaurant.id) {
                this.mysqlRestaurant.upsertRestaurant(restaurant, (updateRestaurantErr, updateRestaurantRes) => {
                    if (updateRestaurantErr) res(updateRestaurantErr);
                    else {
                        console.log('Update User Response', updateRestaurantRes);
                        this.mysqlRestaurant.getRestaurantById(restaurant.id, (getRestaurantErr, getRestaurantRes) => {
                            res(getRestaurantErr, getRestaurantRes);
                        });
                    }
                });
            } else {
                this.createRestaurant(restaurant, res);
            }
        } else res('No Restaurant Provided');
    }
    deleteRestaurant(restaurant, res) {
        if (restaurant) {
            if (restaurant.id) {
                this.mysqlRestaurant.deleteRestaurant(restaurant, (deleteRestaurantErr, deleteRestaurantRes) => {
                    res(deleteRestaurantErr, deleteRestaurantRes);
                });
            } else {
                this.createRestaurant(restaurant, res);
            }
        } else res('No Restaurant Provided');
    }
    getRestaurantOwnersByRestaurant(restaurant, res) {
        this.mysqlRestaurant.getRestaurantById(restaurant, (getRestaurantErr, getRestaurantRes) => {
            if (getRestaurantErr) res(getRestaurantErr);
            else if (!getRestaurantRes) res('Restaurant Does Not Exist!');
            else {
                this.mysqlRestaurant.getRestaurantOwnersByRestaurant(restaurant, (getOwnersErr, getOwnersRes) => {
                    res(getOwnersErr, getOwnersRes);
                });
            }
        });
    }
    getOwnedRestaurantsByOwner(user, res) {
        Promise.all([this.authentication.userExists(user)]).then(() => {
            this.mysqlRestaurant.getOwnedRestaurantsByOwner(user, (getOwnersErr, getOwnersRes) => {
                res(getOwnersErr, getOwnersRes);
            });
        }).catch((error) => { res(error); });
    }
    addRestaurantOwner(restaurant, user, res) {
        Promise.all([this.restaurantExists(restaurant), this.authentication.userExists(owner), this.alreadyOwner(restaurant, user)]).then(() => {
            this.mysqlRestaurant.addRestaurantOwner(restaurant, user, (err, queryRes) => {
                res(err, queryRes);
            });
        }).catch((error) => { res(error); });
    }
    removeRestaurantOwner(restaurant, user, res) {
        Promise.all([this.restaurantExists(restaurant), this.authentication.userExists(owner), this.alreadyOwner(restaurant, user)]).then(() => {
            this.mysqlRestaurant.removeRestaurantOwner(restaurant, user, (err, queryRes) => {
                res(err, queryRes);
            });
        }).catch((error) => {
            res(error);
        });
    }
    restaurantExists(restaurant) {
        return new Promise((resolve, reject) => {
            this.mysqlRestaurant.getRestaurantById(restaurant, (err, queryRes) => {
                if (err) reject(err);
                else if(!queryRes) reject('Restaurant Does Not Exist!');
                else resolve(queryRes);
            });
        });
    }
    alreadyOwner(restaurant, user) {
        return new Promise((resolve, reject) => {
            this.getRestaurantOwnersByRestaurant(restaurant, (err, owners) => {
                if (err) reject(err);
                else if (!owners || owners.length < 1) resolve(owners);
                else {
                    let ownerExists = false;
                    owners.forEach((owner) => {
                        if (owner && owner.id === user.id) ownerExists = true;
                    });
                    if(ownerExists) reject('Owner Already Exists');
                    else resolve();
                }
            });
        });
    }
}
module.exports = RestaurantManager;