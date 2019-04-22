const MysqlConnector = require('./mysql.connector');

class MysqlFoodAddOn extends MysqlConnector {
    getFoodAddOnsByName(food, foodAddOn, res) {
        let query = `SELECT * from foodAddOn where name like '%${foodAddOn}%'`;
        if (food) query += ` AND food=${food}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getFoodAddOnByFoodId(food, res) {
        const query = `SELECT * from addons ao JOIN food_addon fao ON ao.id=fao.addon where fao.food=${food}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes);
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createFoodAddOn(food, foodAddOn, res) {
        const query = `insert into foodAddOn (food, name, img_src, description) values (${food}, '${foodAddOn.name}', '${foodAddOn.imgSrc}',  '${foodAddOn.description}');`;
        this.query(query, this.timeout).then( (queryRes) => {
            this.getFoodAddOnByName(food, foodAddOn.name, (getFoodErr, foodRes) => {
                res(getFoodErr, foodRes);
            });
        }).catch(queryError => { res(queryError); });
    }
    getFoodAddOnByName(name, res) {
        this.getFoodAddOnsByName(name, (queryError, foodAddOns) => {
            if (queryError) res(queryError);
            else if (foodAddOns && foodAddOns.length > 0) res(null, foodAddOns[0]);
            else res('No FoodAddOns Found');
        })
    }
    getFoodAddOnById(id, res) {
        const query = `SELECT * from foodAddOn where id=${id}`;
        this.query(query, this.timeout).then( (foodAddOns) => {
            if (foodAddOns && foodAddOns.length > 0)
                res(null, foodAddOns[0]);
            else
                res(null, null);
        }).catch(queryError => { res(queryError); });
    }
    updateFoodAddOn(foodAddOn, res) {
        if (foodAddOn) {
            if (foodAddOn.id) {
                this.getFoodAddOnById(foodAddOn.id, (getFoodAddOnByIdErr, getFoodAddOnByIdRes) => {
                    if (getFoodAddOnByIdErr) res(getFoodAddOnByIdErr);
                    else {
                        if(!getFoodAddOnByIdRes) {
                            res('FoodAddOn Does Not Exist');
                        } else {
                            let query = `UPDATE foodAddOn SET `;
                            if (foodAddOn.name) query += `name = '${foodAddOn.name}' `;
                            if (foodAddOn.description) query += `description = '${foodAddOn.description}' `;
                            if (foodAddOn.imgSrc) query += `img_src = '${foodAddOn.imgSrc}' `;
                            query += 'WHERE id = foodAddOn.id';
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No FoodAddOn id Provided');
        } else res('No FoodAddOn Object Provided');
    }
    upsertFoodAddOn(foodAddOn, res) {
        if (foodAddOn) {
            if (foodAddOn.id) {
                this.getFoodAddOnById(foodAddOn.id, (getFoodAddOnByIdErr, getFoodAddOnByIdRes) => {
                    if (getFoodAddOnByIdErr) res(getFoodAddOnByIdErr);
                    else {
                        if(!getFoodAddOnByIdRes) {
                            res('FoodAddOn Does Not Exist');
                        } else {
                            let query = `UPDATE foodAddOn SET name = '${foodAddOn.name}' description = '${foodAddOn.description}'` +
                             ` imgSrc = '${foodAddOn.imgSrc}' WHERE id = ${foodAddOn.id}`;
                            this.query(query, this.timeout).then((res) => {
                                res(null, res);
                            }).catch((error) => { res(error); });
                        }
                    }
                });
            } else res('No FoodAddOn id Provided');
        } else res('No FoodAddOn Object Provided');
    }
    deleteFoodAddOn(foodAddOn, res) {
        if (foodAddOn) {
            if (typeof foodAddOn === 'number' || foodAddOn.id) {
                const foodAddOnId = typeof foodAddOn === 'number' ? foodAddOn : foodAddOn.id;
                const query = `DELETE FROM foodAddOn WHERE id = ${foodAddOnId}`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No FoodAddOn id Provided');
        }
        else { res('No FoodAddOn Provided'); }
    }
}
module.exports = MysqlFoodAddOn;