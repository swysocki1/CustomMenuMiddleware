class FoodAddOnManager {
    constructor(mysqlFoodAddOn) {
        this.mysqlFoodAddOn = mysqlFoodAddOn;
    }
    getFoodAddOnByFoodId(foodId, res) {
        if (foodId) {
            this.mysqlFoodAddOn.getFoodAddOnByFoodId(foodId, (getFoodAddOnErr, foodAddOns) => {
                res(getFoodAddOnErr, foodAddOns);
            });
        } else res('Menu Id was not provided');
    }
    createFoodAddOn(foodAddOn, res) {
        if (foodAddOn) {
            const missingFields = [];
            if (!foodAddOn.name) {
                missingFields.add('Name');
            }
            if (!foodAddOn.description) {
                missingFields.add('Description');
            }
            if (missingFields.length > 0) {
                res(`No ${missingFields.join(', ')} Provided`)
            } else {
                Promise.all([this.foodAddOnExists(foodAddOn)]).then(() => {
                    this.mysqlFoodAddOn.createFoodAddOn(foodAddOn, (queryError, queryRes) => {
                        res(queryError, queryRes);
                    });
                }).catch((error) => { res(error); });
            }
        } else {
            res('FoodAddOn Body is Empty');
        }
    }
    updateFoodAddOn(foodAddOn, res) {
        if (foodAddOn) {
            if (foodAddOn.id) {
                this.mysqlFoodAddOn.updateFoodAddOn(foodAddOn, (updateFoodAddOnErr, updateFoodAddOnRes) => {
                    if (updateFoodAddOnErr) res(updateFoodAddOnErr);
                    else {
                        this.mysqlFoodAddOn.getFoodAddOnById(foodAddOn.id, (getFoodAddOnErr, getFoodAddOnRes) => {
                            res(getFoodAddOnErr, getFoodAddOnRes);
                        });
                    }
                });
            } else this.createFoodAddOn(foodAddOn, res);
        } else res('No FoodAddOn Provided');
    }
    upsertFoodAddOn(foodAddOn, res) {
        if (foodAddOn) {
            if (foodAddOn.id) {
                this.mysqlFoodAddOn.upsertFoodAddOn(foodAddOn, (updateFoodAddOnErr, updateFoodAddOnRes) => {
                    if (updateFoodAddOnErr) res(updateFoodAddOnErr);
                    else {
                        console.log('Update User Response', updateFoodAddOnRes);
                        this.mysqlFoodAddOn.getFoodAddOnById(foodAddOn.id, (getFoodAddOnErr, getFoodAddOnRes) => {
                            res(getFoodAddOnErr, getFoodAddOnRes);
                        });
                    }
                });
            } else {
                this.createFoodAddOn(foodAddOn, res);
            }
        } else res('No FoodAddOn Provided');
    }
    deleteFoodAddOn(foodAddOn, res) {
        if (foodAddOn) {
            if (foodAddOn.id) {
                this.mysqlFoodAddOn.deleteFoodAddOn(foodAddOn, (deleteFoodAddOnErr, deleteFoodAddOnRes) => {
                    res(deleteFoodAddOnErr, deleteFoodAddOnRes);
                });
            } else {
                this.createFoodAddOn(foodAddOn, res);
            }
        } else res('No FoodAddOn Provided');
    }
    foodAddOnExists(foodAddOn) {
        return new Promise((resolve, reject) => {
            if (foodAddOn && foodAddOn.id) {
                this.mysqlFoodAddOn.getFoodAddOnById(foodAddOn.id, (err, queryRes) => {
                    if (err) reject(err);
                    else resolve(queryRes);
                });
            } else resolve();
        });
    }
}
module.exports = FoodAddOnManager;