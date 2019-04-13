class FoodManager {
    constructor(mysqlFood) {
        this.mysqlFood = mysqlFood;
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
                    this.mysqlFood.createFood(food, (queryError, queryRes) => {
                        res(queryError, queryRes);
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
                            res(getFoodErr, getFoodRes);
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
            this.mysqlFood.getFoodById(food, (err, queryRes) => {
                if (err) reject(err);
                else if(!queryRes) reject('Food Does Not Exist!');
                else resolve(queryRes);
            });
        });
    }
}
module.exports = FoodManager;