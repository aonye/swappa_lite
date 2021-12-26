let async = require('async');
let Brand = require('../models/brand');
let Model = require('../models/model');

// Display list of all brands.
exports.brand_list = function (req, res) {
    Brand.find()
        .exec(function (err, brand_list) {
            if (err) { return next(err); }
            console.log(brand_list)
            res.render('brands', { title: 'Brand List', brand_list });
        });
};

// Display detail page for a specific brand.
exports.brand_detail = function (req, res, next) {
    async.parallel({
        brand: function (callback) {
            Brand.findById(req.params.id)
                .exec(callback);
        },
        brand_models: function (callback) {
            Model.find({ 'brand': req.params.id })
                .exec(callback);
        },

    }, function (err, results) {
        console.log(results);
        if (err) { return next(err); }
        if (results.brand === undefined) { // Model does not exist.
            var err = new Error('Model not found');
            err.status = 404;
            return next(err);
        }
        res.render('brand_detail', { title: 'Brand Details', brand: results.brand, brand_models: results.brand_models });
    });
};

// Display brand create form on GET.
exports.brand_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: brand create GET');
};

// Handle brand create on POST.
exports.brand_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: brand create POST');
};

// Display brand delete form on GET.
exports.brand_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: brand delete GET');
};

// Handle brand delete on POST.
exports.brand_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: brand delete POST');
};

// Display brand update form on GET.
exports.brand_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: brand update GET');
};

// Handle brand update on POST.
exports.brand_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: brand update POST');
};