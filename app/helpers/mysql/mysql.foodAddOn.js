const MysqlConnector = require('./mysql.connector');

class MysqlFoodAddOn extends MysqlConnector {
    getFoodAddOnsByName(food, foodAddOn, res) {
        let query = `SELECT ao.*, fao.food, fao.addon from addons ao JOIN food_addon fao ON ao.id=fao.addon ao.name like '%${foodAddOn}%'`;
        if (food) query += ` AND food=${food}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    getFoodAddOnByFoodId(food, res) {
        const query = `SELECT ao.*, fao.food, fao.addon from addons ao JOIN food_addon fao ON ao.id=fao.addon where fao.food=${food}`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (queryRes && queryRes.length > 0)
                res(null, queryRes.map(item => {return {... item}; }));
            else
                res(null, []);
        }).catch(queryError => { res(queryError); });
    }
    createFoodAddOn(foodAddOn, res) {
        if (!foodAddOn.name) foodAddOn.name='';
        if (!foodAddOn.imgSrc) foodAddOn.imgSrc='';
        if (!foodAddOn.description) foodAddOn.description='';
        const query = `insert into addons (name, img_src, price, description) values ('${foodAddOn.name}', '${foodAddOn.imgSrc}',  ${foodAddOn.price}, '${foodAddOn.description}');`;
        this.query(query, this.timeout).then( (queryRes) => {
            if (!foodAddOn.food) {
                this.getFoodAddOnById(queryRes.insertId, (createFoodAddOnErr, queryFoodAddon) => {
                   res(createFoodAddOnErr, queryFoodAddon);
                });
            } else {
                this.addFoodAddOnRelation(foodAddOn.food, queryRes.insertId, (relErr, relRes) => {
                    this.getFoodAddOnById(queryRes.insertId, (createFoodAddOnErr, queryFoodAddon) => {
                        queryFoodAddon.food = foodAddOn.food;
                        res(createFoodAddOnErr, queryFoodAddon);
                    });
                });
            }
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
        const query = `SELECT ao.*, fao.food, fao.addon from addons ao JOIN food_addon fao ON ao.id=fao.addon where ao.id=${id}`;
        this.query(query, this.timeout).then( (foodAddOns) => {
            if (foodAddOns && foodAddOns.length > 0)
                res(null, {... foodAddOns[0]});
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
                            this.createFoodAddOn(foodAddOn, (createErr, result) => {
                               res(createErr, result);
                            });
                        } else {
                            const update = [];
                            let query = `UPDATE addons SET `;
                            if (foodAddOn.name) update.push(`name = '${foodAddOn.name}'`);
                            if (foodAddOn.description) update.push(`description = '${foodAddOn.description}'`);
                            if (foodAddOn.imgSrc) update.push(`img_src = '${foodAddOn.imgSrc}'`);
                            if (update.length > 0) {
                                query = query + ` ${update.join(', ')} WHERE id = ${foodAddOn.id}`;
                                this.query(query, this.timeout).then((result) => {
                                    res(null, result);
                                }).catch((error) => {
                                    res(error);
                                });
                            } else res(null, null);
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
                            let query = `UPDATE addOns SET name = '${foodAddOn.name}' description = '${foodAddOn.description}'` +
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
    addFoodAddOnRelation(food, addOn, res) {
        if (food) {
            if (addOn) {
                const query = `insert into food_addon (food, addon) values ('${food}', '${addOn}')`;
                this.query(query, this.timeout).then((queryResult) => {
                    res(null, queryResult);
                }).catch((error) => { res(error); });
            } else res('No Food Provided In Relation');
        }
        else { res('No AddOn Provided In Relation'); }
    }
}
module.exports = MysqlFoodAddOn;