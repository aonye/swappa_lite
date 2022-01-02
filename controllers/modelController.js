const { body, validationResult } = require('express-validator');
let async = require('async');
let Model = require('../models/model');
let Brand = require('../models/brand');
let Device = require('../models/device');

// Display list of all models.
exports.model_list = function (req, res, next) {
    let err = new Error();
    err.status = 404;
    return next(err);
};

// Display detail page for a specific model.
exports.model_detail = function (req, res, next) {
    Model.findById(req.params.id)
        .populate('brand')
        .exec((err, model) => {
            if (err) { return next(err); }
            if (!model) { // No results.
                let err = new Error('Model not found');
                err.status = 404;
                return next(err);
            }
            res.render('model_detail', { model });
        });
};

// Display model create form on GET.
exports.model_create_get = function (req, res, next) {
    Brand.find()
        .exec((err, brands) => {
            if (err) { return next(err); }
            res.render('model_form', { title: 'Create Model', brands });
        });
};

// Handle model create on POST.
exports.model_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('brand', 'You must select a valid brand.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        let model = new Model(
            {
                name: req.body.name,
                brand: req.body.brand,
            });

        if (!errors.isEmpty()) { // There are errors. Render form again with sanitized values/error messages.

            Brand.find()
                .exec((err, brands) => {
                    if (err) { return next(err); }
                    res.render('model_form', { title: 'Create Model', model, brands, errors: errors.array() });
                });
            return;
        }
        else {// Data from form is valid.
            Model.findOne({ 'name': req.body.name, 'brand': req.body.brand })
                .exec((err, found) => {
                    if (err) { return next(err); }
                    if (found) {
                        // Exists, redirect to its detail page.
                        res.redirect(found.url);
                    }
                    else {
                        model.save((err) => {
                            if (err) { return next(err); }
                            res.redirect(model.url);
                        });
                    }
                });
        }
    }
];

// Display model delete form on GET.
exports.model_delete_get = function (req, res, next) { //Disallow deletion if any device uses model
    async.parallel({
        model: function (callback) {
            Model.findById(req.params.id)
                .exec(callback);
        },
        model_devices: function (callback) {
            Device.find({ 'model': req.params.id })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results.model) { // No results.
            res.redirect('/brands'); //brands dependency of model, design decision to not show all models
        }
        res.render('model_delete', { title: 'Delete Model', model: results.model, model_devices: results.model_devices });
    });
};

// Handle model delete on POST.
exports.model_delete_post = function (req, res, next) {
    Model.findById(req.params.id)
        .exec((err, model) => {
            if (err) { return next(err); }
            if (!model) { // No results.
                res.render('model_delete', { title: 'Delete Model', model });
            } else {
                Model.findByIdAndRemove(req.params.id, (err) => {
                    if (err) { return next(err); }
                    res.redirect('/brands'); //brands dependency of model, design decision to not show all models
                });
            }
        });
};

// Display model update form on GET.
exports.model_update_get = async function (req, res) {
    const model = await Model.findById(req.params.id).orFail(() => Error('Model not found'));
    const brands = await Brand.find().orFail(() => Error('Brand not found'));
    res.render('model_form', { title: 'Update Model', model, brands });
};

// Handle model update on POST.
exports.model_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('brand', 'You must select a valid brand.').trim().isLength({ min: 1 }).escape(),

    async (req, res, next) => {

        const errors = validationResult(req);

        let model = new Model(
            {
                name: req.body.name,
                brand: req.body.brand,
                _id: req.params.id,
            });

        if (!errors.isEmpty()) { // There are errors. Render form again with sanitized values/error messages.
            const brands = await Brand.find().orFail(() => Error('Brand not found'));
            res.render('model_form', { title: 'Update Model', model, brands, errors: errors.array() });
            return;
        }
        else {// Data from form is valid.
            Model.findOne({ 'name': req.body.name, 'brand': req.body.brand })
                .exec((err, found) => {
                    if (err) { return next(err); }
                    if (found) {
                        // Exists, redirect to its detail page.
                        res.redirect(found.url);
                    }
                    else {
                        Model.findByIdAndUpdate(req.params.id, model, {}, (err, result) => { // (id, obj to update w/, options (obj - empty), callback)
                            if (err) { return next(err); }
                            res.redirect(result.url);
                        });
                    }
                });
        }
    }
];