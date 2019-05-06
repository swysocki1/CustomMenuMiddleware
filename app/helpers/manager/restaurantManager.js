class RestaurantManager {
    constructor(mysqlRestaurant, authentication, menuManager) {
        this.mysqlRestaurant = mysqlRestaurant;
        this.authentication = authentication;
        this.menuManager = menuManager;
    }
    getAllRestaurants(res) {
        this.mysqlRestaurant.getAllRestaurants((getRestaurantsErr, restaurants) => {
            if (getRestaurantsErr) res(getRestaurantsErr);
            else {
                if (restaurants && restaurants.length > 0) {

                    Promise.all(restaurants.map((restaurant) => {
                        return new Promise((resolve, reject) => {
                            this.menuManager.getMenuByRestaurantId(restaurant.id, (err, menus) => {
                                if (err) reject(err);
                                else {
                                    restaurant.menus = menus;
                                    resolve();
                                }
                            });
                        });
                    })).then(() => {
                        res(null, this.groupOwners(restaurants));
                    }).catch((error) => { res(error); });
                }
            }
        });
    }
    getRestaurantById(id, res) {
        if (id) {
            this.mysqlRestaurant.getRestaurantById(id, (getRestaurantErr, restaurant) => {
                if (getRestaurantErr) res(getRestaurantErr);
                else {
                    if (restaurant) {
                        this.getRestaurantOwnersByRestaurant(restaurant, (getOwnersErr, owners) => {
                            if (getOwnersErr) res(getOwnersErr);
                            else {
                                restaurant.owners = owners;
                                this.menuManager.getMenuByRestaurantId(restaurant.id, (err, menus) => {
                                    if (err) res(err);
                                    else {
                                        restaurant.menus = menus;
                                        res(err, restaurant);
                                    }
                                });
                            }
                        });


                    } else res('Menu was not found');
                }
            });
        } else res('Menu Id was not provided');
    }
    createRestaurant(restaurant, res) {
        if (restaurant) {
            const missingFields = [];
            if (!restaurant.name) {
                missingFields.push('Name');
            }
            if (!restaurant.description) {
                missingFields.push('Description');
            }
            if (!restaurant.owners) {
                missingFields.push('Owner');
            }
            if (missingFields.length > 0) {
                res(`No ${missingFields.join(', ')} Provided`)
            } else {
                if (!restaurant.menus) {
                    restaurant.menus = [];
                }
                Promise.all([this.restaurantExists(restaurant)]).then(() => {
                    this.mysqlRestaurant.createRestaurant(restaurant, (queryError, newRestaurant) => {
                        if (queryError) res(queryError);
                        else {
                            newRestaurant.owners = restaurant.owners;
                            newRestaurant.menus = restaurant.menus;
                            restaurant = newRestaurant;
                            Promise.all(restaurant.owners.map(owner => {
                                return new Promise((resolve, reject) => {
                                   if (owner) {
                                       this.addRestaurantOwner(newRestaurant.id, owner, (addOwnerErr, addOwnerRes) => {
                                        if (addOwnerErr) reject(addOwnerErr);
                                        else resolve(addOwnerRes);
                                       });
                                   } else {
                                       resolve();
                                   }
                                });
                            })).then(() => {
                                Promise.all(restaurant.menus.map(menu => {
                                    return new Promise((resolve, reject) => {
                                        if (menu) {
                                            this.menuManager.createMenu(newRestaurant.id, menu, (createMenuErr, createMenuRes) => {
                                                if (createMenuErr) reject(createMenuErr);
                                                else {
                                                    menu = createMenuRes;
                                                    resolve(createMenuRes);
                                                }
                                            });
                                        } else {
                                            resolve();
                                        }
                                    });
                                })).then(() => {
                                    res(null, restaurant);
                                }).catch(error => { res(error); });
                            }).catch(error => { res(error); });
                        }
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
                    if (deleteRestaurantErr) res(deleteRestaurantErr);
                    else {
                        Promise.all(restaurant.menus.map(menu => {
                            return new Promise((resolve, reject) => {
                                this.menuManager.deleteMenu(menu, (deleteMenuErr, deleteMenuRes) => {
                                    if (deleteMenuErr) reject(deleteMenuErr);
                                    else resolve(deleteMenuRes);
                                });
                            });
                        })).then(() => {
                            res(null, deleteRestaurantRes);
                        }).catch(error => { res(error); });
                    }
                });
            } else {
                this.createRestaurant(restaurant, res);
            }
        } else res('No Restaurant Provided');
    }
    getRestaurantOwnersByRestaurant(restaurant, res) {
        this.mysqlRestaurant.getRestaurantById(restaurant.id, (getRestaurantErr, getRestaurantRes) => {
            if (getRestaurantErr) res(getRestaurantErr);
            else if (!getRestaurantRes) res('Restaurant Does Not Exist!');
            else {
                restaurant = getRestaurantRes;
                this.mysqlRestaurant.getRestaurantOwnersByRestaurant(restaurant.id, (getOwnersErr, getOwnersRes) => {
                    res(getOwnersErr, getOwnersRes);
                });
            }
        });
    }
    getOwnedRestaurantsByOwner(user, res) {
        Promise.all([this.authentication.userExists(user)]).then(() => {
            this.mysqlRestaurant.getOwnedRestaurantsByOwner(user.id, (getOwnersErr, restaurants) => {
                if (getOwnersErr) res(getOwnersErr);
                if (restaurants && restaurants.length > 0) {
                    Promise.all(restaurants.map((restaurant) => {
                        return new Promise((resolve, reject) => {
                            this.menuManager.getMenuByRestaurantId(restaurant.id, (err, menus) => {
                                if (err) reject(err);
                                else {
                                    restaurant.menus = menus;
                                    resolve();
                                }
                            });
                        });
                    })).then(() => {
                        Promise.all(restaurants.map((restaurant) => {
                            return new Promise((resolve, reject) => {
                                console.log(restaurant.owner);
                                this.authentication.getUserById(restaurant.owner, (err, owner) => {
                                    if (err) reject(err);
                                    else {
                                        restaurant.owner = owner;
                                        resolve(restaurant);
                                    }
                                });
                            });
                        })).then(() => { res(null, this.groupOwners(restaurants)); } )
                            .catch((error) => { res(error); });
                    }).catch((error) => { res(error); });
                }
            });
        }).catch((error) => { res(error); });
    }
    addRestaurantOwner(restaurant, user, res) {
        Promise.all([this.restaurantExists(restaurant), this.authentication.userExists(user), this.alreadyOwner(restaurant, user)]).then(() => {
            this.mysqlRestaurant.addRestaurantOwner(restaurant, user, (err, queryRes) => {
                res(err, queryRes);
            });
        }).catch((error) => { res(error); });
    }
    removeRestaurantOwner(restaurant, user, res) {
        Promise.all([this.restaurantExists(restaurant), this.authentication.userExists(user), !this.alreadyOwner(restaurant, user)]).then(() => {
            this.mysqlRestaurant.removeRestaurantOwner(restaurant, user, (err, queryRes) => {
                res(err, queryRes);
            });
        }).catch((error) => {
            res(error);
        });
    }
    restaurantExists(restaurant) {
        return new Promise((resolve, reject) => {
            if (restaurant && restaurant.id) {
                this.mysqlRestaurant.getRestaurantById(restaurant.id, (err, queryRes) => {
                    if (err) reject(err);
                    else if (!queryRes) reject('Restaurant Does Not Exist!');
                    else resolve(queryRes);
                });
            } else {
                resolve();
            }
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
    groupOwners(restaurants) {
        if (restaurants && restaurants.length > 0) {
            let r = [];
            restaurants.forEach(restaurant => {
               if (r.some(rest => rest.id === restaurant.id)) {
                   r.find(rest => rest.id === restaurant.id).owners.push(restaurant.owner);
               } else {
                   restaurant.owners = [restaurant.owner];
                   delete restaurant.owner;
                   r.push(restaurant);
               }
            });
            restaurants = r;
        }
        return restaurants;
    }
}
module.exports = RestaurantManager;