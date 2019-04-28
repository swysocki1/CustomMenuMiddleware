class FoodManager {
    constructor(mysqlFood, foodAddOnManager) {
        this.mysqlFood = mysqlFood;
        this.foodAddOnManager = foodAddOnManager;
    }
    getFoodById(id, res) {
        if (id) {
            this.mysqlFood.getFoodById(id, (getFoodErr, food) => {
                if (getFoodErr) res(getFoodErr);
                else {
                    this.foodAddOnManager.getFoodAddOnByFoodId(food.id, (err, addon) => {
                        if (err) res(err);
                        else {
                            food.addOns=addon;
                            res(null, food)
                        }
                    });
                }
            });
        } else res('Food Id was not provided');
    }
    getFoodByMenuSectionId(menuSectionId, res) {
        if (menuSectionId) {
            this.mysqlFood.getFoodByMenuSectionId(menuSectionId, (getFoodErr, foods) => {
                if (getFoodErr) res(getFoodErr);
                else {
                    Promise.all(foods.map((food) => {
                        return new Promise((resolve, reject) => {
                            this.foodAddOnManager.getFoodAddOnByFoodId(food.id, (err, res) => {
                                if (err) reject(err);
                                else {
                                    food.addOns=res;
                                    resolve();
                                }
                            });
                        });
                    })).then(() => {
                        res(null, foods);
                    }).catch((error) => { res(error); });
                }
            });
        } else res('Menu Id was not provided');
    }
    createFood(food, res) {
        if (food) {
            const missingFields = [];
            if (!food.name) {
                missingFields.add('Name');
            }
            if (!food.description) {
                missingFields.add('Description');
            }
            if (missingFields.length > 0) {
                res(`No ${missingFields.join(', ')} Provided`)
            } else {
                Promise.all([this.foodExists(food)]).then(() => {
                    this.mysqlFood.createFood(food, (queryError, newFood) => {
                        if (queryError) res(queryError);
                        else {
                            newFood.foodAddOns = food.foodAddOns;
                            food = newFood;
                            if (food.foodAddOns && food.foodAddOns.length > 0) {
                                Promise.all(food.foodAddOns.map(foodAddOn => {
                                    foodAddOn.food = food.id;
                                    return new Promise((resolve, reject) => {
                                        this.foodAddOnManager.createFoodAddOn(foodAddOn, (createFoodAddOnErr, newFoodAddOn) => {
                                            if (createFoodAddOnErr) reject(createFoodAddOnErr);
                                            else {
                                                foodAddOn = newFoodAddOn;
                                                resolve(foodAddOn);
                                            }
                                        });
                                    });
                                })).then((foodAddOns) => {
                                    food.foodAddOns = foodAddOns;
                                    res(null, food);
                                }).catch((error) => {
                                    res(error);
                                });
                            } else {
                                food.foodAddOns = [];
                                res(queryError, food);
                            }
                        }
                    });
                }).catch((error) => { res(error); });
            }
        } else {
            res('Food Body is Empty');
        }
    }
    updateFood(food, res) {
        if (food) {
            if (food.id) {
                this.mysqlFood.updateFood(food, (updateFoodErr, updateFoodRes) => {
                    if (updateFoodErr) res(updateFoodErr);
                    else {
                        this.mysqlFood.getFoodById(food.id, (getFoodErr, getFoodRes) => {
                            // res(getFoodErr, getFoodRes);

                            getFoodRes.foodAddOns = food.foodAddOns;
                            food = getFoodRes;
                            if (food.foodAddOns && food.foodAddOns.length > 0) {
                                Promise.all(food.foodAddOns.map(foodAddOn => {
                                    foodAddOn.food = food.id;
                                    return new Promise((resolve, reject) => {
                                        this.foodAddOnManager.updateFoodAddOn(foodAddOn, (createFoodAddOnErr, newFoodAddOn) => {
                                            if (createFoodAddOnErr) reject(createFoodAddOnErr);
                                            else {
                                                foodAddOn = newFoodAddOn;
                                                resolve(foodAddOn);
                                            }
                                        });
                                    });
                                })).then((foodAddOns) => {
                                    food.foodAddOns = foodAddOns;
                                    res(null, food);
                                }).catch((error) => {
                                    res(error);
                                });
                            } else {
                                food.foodAddOns = [];
                                res(getFoodErr, food);
                            }


                        });
                    }
                });
            } else this.createFood(food, res);
        } else res('No Food Provided');
    }
    upsertFood(food, res) {
        if (food) {
            if (food.id) {
                this.mysqlFood.upsertFood(food, (updateFoodErr, updateFoodRes) => {
                    if (updateFoodErr) res(updateFoodErr);
                    else {
                        console.log('Update User Response', updateFoodRes);
                        this.mysqlFood.getFoodById(food.id, (getFoodErr, getFoodRes) => {
                            res(getFoodErr, getFoodRes);
                        });
                    }
                });
            } else {
                this.createFood(food, res);
            }
        } else res('No Food Provided');
    }
    deleteFood(food, res) {
        if (food) {
            if (food.id) {
                this.mysqlFood.deleteFood(food, (deleteFoodErr, deleteFoodRes) => {
                    res(deleteFoodErr, deleteFoodRes);
                });
            } else {
                this.createFood(food, res);
            }
        } else res('No Food Provided');
    }
    foodExists(food) {
        return new Promise((resolve, reject) => {
            if (food && food.id) {
                this.mysqlFood.getFoodById(food.id, (err, queryRes) => {
                    if (err) reject(err);
                    else resolve(queryRes);
                });
            } else resolve();
        });
    }
}
module.exports = FoodManager;