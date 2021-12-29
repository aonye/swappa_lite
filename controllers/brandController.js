const { body, validationResult } = require('express-validator');
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
    res.render('brand_form', { title: 'Create Brand' });
};

// Handle brand create on POST.
exports.brand_create_post = [
    // Validate and santize the name field.
    body('name', 'Brand name required').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data.
        var brand = new Brand(
            { name: req.body.name }
        );

        if (!errors.isEmpty()) { // There are errors. Render the form again with sanitized values/error messages.
            res.render('brand_form', { title: 'Create Brand', brand, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if same name already exists.
            Brand.findOne({ 'name': req.body.name })
                .exec(function (err, found) {
                    if (err) { return next(err); }

                    if (found) {
                        // Exists, redirect to its detail page.
                        res.redirect(found.url);
                    }
                    else {
                        brand.save((err) => {
                            if (err) { return next(err); }
                            // Saved. Redirect to detail page.
                            res.redirect(brand.url);
                        });

                    }

                });
        }
    }
];


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