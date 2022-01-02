const { body, validationResult } = require('express-validator');
let Device = require('../models/device');
let Category = require('../models/category');
let Model = require('../models/model');
let async = require('async');

const conditions = [
    'Fair',
    'New',
    'Good',
    'Mint',
];

exports.index = function (req, res) {
    res.render('index');
};

exports.device_list = function (req, res) {
    Device.find({}, 'name description img_link')
        .sort({ name: 1 })
        .exec(function (err, device_list) {
            if (err) { return next(err); }
            res.render('devices', { title: 'All Devices', device_list: device_list });
        });
};

exports.device_detail = function (req, res, next) {
    async.parallel({
        device: function (callback) {
            Device.findById(req.params.id)
                .populate('category')
                .populate({
                    path: 'model',
                    populate: {
                        path: 'brand',
                    }
                })
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results.device) { // No results.
            let err = new Error('Device not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('device_detail', { name: results.device.name, device: results.device });
    });
};

// Display device create form on GET.
exports.device_create_get = function (req, res, next) {
    async.parallel({
        categories: function (callback) {
            Category.find(callback);
        },
        models: function (callback) {
            Model.find(callback).populate('brand');
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('device_form', { title: 'Create Device', conditions, categories: results.categories, models: results.models });
    });
};

// Handle device create on POST.
exports.device_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'Number in stock must be greater than 0').trim().isNumeric().escape(),
    body('category', 'Category must not be empty').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be greater than 0').trim().isLength({ min: 1 }).escape(),
    body('model', 'Model must not be empty').trim().isLength({ min: 1 }).escape(),
    body('condition', 'Condition must not be empty').trim().isLength({ min: 1 }).escape(),
    body('img_link', 'Image link must not be empty').trim().isLength({ min: 1 }).isURL().withMessage('Must be a URL'), //no escape

    (req, res, next) => {

        const errors = validationResult(req);

        let device = new Device(
            {
                name: req.body.name,
                description: req.body.description,
                number_in_stock: req.body.number_in_stock,
                category: req.body.category,
                price: req.body.price,
                model: req.body.model,
                condition: req.body.condition,
                img_link: req.body.img_link,
            });

        if (!errors.isEmpty()) {
            async.parallel({
                categories: function (callback) {
                    Category.find(callback);
                },
                models: function (callback) {
                    Model.find(callback).populate('brand');
                },
            }, function (err, results) {
                if (err) { return next(err); }
                res.render('device_form', { title: 'Create Device', device, conditions, categories: results.categories, models: results.models, errors: errors.array() });
            });
            return;
        }
        else {
            device.save(function (err) {
                if (err) { return next(err); }
                res.redirect(device.url);
            });
        }
    }
];

exports.device_delete_get = function (req, res, next) {
    Device.findById(req.params.id)
        .exec((err, device) => {
            if (err) { return next(err); }
            if (!device) {
                res.redirect('/devices');
            }
            res.render('device_delete', { title: 'Delete device', device });
        });
};

exports.device_delete_post = function (req, res) {
    Device.findById(req.params.id)
        .exec((err, device) => {
            if (err) { return next(err); }
            if (!device) { // No results.
                res.render('device_delete', { title: 'Delete device', device });
            } else {
                Device.findByIdAndRemove(req.params.id, function deleteInstance(err) {
                    if (err) { return next(err); }
                    res.redirect('/devices');
                });
            }
        });
};

exports.device_update_get = function (req, res, next) {
    async.parallel({
        device: function (callback) {
            Device.findById(req.params.id)
                .populate('category')
                .populate('model')
                .exec(callback);
        },
        categories: function (callback) {
            Category.find(callback);
        },
        models: function (callback) {
            Model.find(callback).populate('brand');
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results) { // No results.
            var err = new Error('Device not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('device_form', { title: 'Update Device', device: results.device, conditions, categories: results.categories, models: results.models });
    });
};

exports.device_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'Number in stock must be greater than 0').trim().isNumeric().escape(),
    body('category', 'Category must not be empty').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be greater than 0').trim().isLength({ min: 1 }).escape(),
    body('model', 'Model must not be empty').trim().isLength({ min: 1 }).escape(),
    body('condition', 'Condition must not be empty').trim().isLength({ min: 1 }).escape(),
    body('img_link', 'Image link must not be empty').trim().isLength({ min: 1 }).isURL().withMessage('Must be a URL'), //no escape

    (req, res, next) => {

        const errors = validationResult(req);
        let device = new Device(
            {
                name: req.body.name,
                description: req.body.description,
                number_in_stock: req.body.number_in_stock,
                category: req.body.category,
                price: req.body.price,
                model: req.body.model,
                condition: req.body.condition,
                img_link: req.body.img_link,
                _id: req.params.id, //required, else new object will be created
            });

        if (!errors.isEmpty()) {// There are errors. Render form again with sanitized values/error messages.
            async.parallel({
                categories: function (callback) {
                    Category.find(callback);
                },
                models: function (callback) {
                    Model.find(callback).populate('brand');
                },
            }, function (err, results) {
                if (err) { return next(err); }
                res.render('device_form', { title: 'Update Device', device, conditions, categories: results.categories, models: results.models, errors: errors.array() });
            });
            return;
        }
        else {// Data from form is valid. Update the record.
            Device.findByIdAndUpdate(req.params.id, device, {}, (err, result) => { // (id, obj to update w/, options (obj - empty), callback)
                if (err) { return next(err); }
                res.redirect(result.url);
            });
        }
    }
];