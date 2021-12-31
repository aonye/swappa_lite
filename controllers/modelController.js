let Model = require('../models/model');

// Display list of all model.
exports.model_list = function (req, res) {
    res.send('NOT IMPLEMENTED: model list');
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
            console.log(model);
            res.render('model_detail', { model });
        });
};

// Display model create form on GET.
exports.model_create_get = function (req, res, next) {
    res.send('NOT IMPLEMENTED: model create GET');
};

// Handle model create on POST.
exports.model_create_post = function (req, res, next) {
    res.send('NOT IMPLEMENTED: model create POST');
};

// Display model delete form on GET.
exports.model_delete_get = function (req, res, next) {
    res.send('NOT IMPLEMENTED: model delete GET');
};

// Handle model delete on POST.
exports.model_delete_post = function (req, res, next) {
    res.send('NOT IMPLEMENTED: model delete POST');
};

// Display model update form on GET.
exports.model_update_get = function (req, res, next) {
    res.send('NOT IMPLEMENTED: model update GET');
};

// Handle model update on POST.
exports.model_update_post = function (req, res, next) {
    res.send('NOT IMPLEMENTED: model update POST');
};