const { body, validationResult } = require('express-validator');
let Device = require('../models/device');
let Category = require('../models/category');
let Model = require('../models/model');
let async = require('async');

exports.index = function (req, res) {
    res.render('index');
};

exports.device_list = function (req, res) {
    Device.find({}, 'name description img_link')
        .sort({ name: 1 })
        .exec(function (err, device_list) {
            if (err) { return next(err); }
            res.render('devices', { name: 'Devices', device_list: device_list });
        });
};

// Display detail page for a specific device.
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
        if (results.device === undefined) { // No results.
            let err = new Error('Device not found');
            err.status = 404;
            return next(err);
        }
        console.log(results);
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
        console.log(results);
        res.render('device_form', { title: 'Create Device', categories: results.categories, models: results.models });
    });
};

// Handle device create on POST.
exports.device_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: device create POST');
};

// Display device delete form on GET.
exports.device_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: device delete GET');
};

// Handle device delete on POST.
exports.device_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: device delete POST');
};

// Display device update form on GET.
exports.device_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: device update GET');
};

// Handle device update on POST.
exports.device_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: device update POST');
};