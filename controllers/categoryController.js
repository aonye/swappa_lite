const { body, validationResult } = require("express-validator");
let Device = require('../models/device');
let Category = require('../models/category');
let async = require('async');

// Display list of all categorys.
exports.category_list = function (req, res) {
    Category.find()
        .exec(function (err, category_list) {
            if (err) { return next(err); }
            res.render('categories', { title: 'Category List', category_list });
        });
};

// Display detail page for a specific category.
exports.category_detail = function (req, res, next) {
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id)
                .exec(callback);
        },
        device_category: function (callback) {
            Device.find({ 'category': req.params.id })
                .populate('category')
                .exec(callback);
        }
    }, function (err, results) {
        console.log(results);
        if (err) { return next(err); }
        if (!results) { // Does not exist
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category_detail', { title: results.category.name, category: results.category, devices: results.device_category });
    });
};

// Display category create form on GET.
exports.category_create_get = function (req, res) {
    res.render('category_form', { title: 'Create Category' });
};

// Handle category create on POST.
exports.category_create_post = [
    // Validate and santize the name field.
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data.
        var category = new Category(
            { name: req.body.name }
        );

        if (!errors.isEmpty()) { // There are errors. Render the form again with sanitized values/error messages.
            res.render('category_form', { title: 'Create Category', category, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if same name already exists.
            Category.findOne({ 'name': req.body.name })
                .exec(function (err, found) {
                    if (err) { return next(err); }

                    if (found) {
                        // Exists, redirect to its detail page.
                        res.redirect(found.url);
                    }
                    else {
                        category.save((err) => {
                            if (err) { return next(err); }
                            // Saved. Redirect to detail page.
                            res.redirect(category.url);
                        });

                    }

                });
        }
    }
];

// Display category delete form on GET.
exports.category_delete_get = function (req, res, next) { //If there are any devices that use any of the categories, do not allow deletion
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id)
                .exec(callback)
        },
        category_devices: function (callback) {
            Device.find({ 'category': req.params.id })
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results.category) { // No results.
            res.redirect('/devices');
        }
        res.render('category_delete', { title: 'Delete Category', category: results.category, category_devices: results.category_devices });
    });
};

// Handle category delete on POST.
exports.category_delete_post = function (req, res, next) {
    async.parallel({
        category: function (callback) {
            Category.findById(req.body.categoryid)
                .exec(callback)
        },
        category_devices: function (callback) {
            Device.find({ 'category': req.body.categoryid })
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.category_devices.length > 0) { //Device(s) persist
            res.render('category_delete', { title: 'Delete Category', category: results.category, category_devices: results.category_devices });
            return;
        }
        else {// Okay to delete. Redirect after
            Category.findByIdAndRemove(req.body.categoryid, (err) => {
                if (err) { return next(err); }
                res.redirect('/categories');
            })
        }
    });
};

// Display category update form on GET.
exports.category_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: category update GET');
};

// Handle category update on POST.
exports.category_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: category update POST');
};