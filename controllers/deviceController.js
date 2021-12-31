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
]

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
        res.render('device_form', { title: 'Create Device', conditions, categories: results.categories, models: results.models });
    });
};

// Handle device create on POST.
exports.device_create_post = [
    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'Number in stock must be greater than 0').trim().isNumeric().escape(),
    body('category', 'Category must not be empty').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be greater than 0').trim().isLength({ min: 1 }).escape(),
    body('model', 'Model must not be empty').trim().isLength({ min: 1 }).escape(),
    body('condition', 'Condition must not be empty').trim().isLength({ min: 1 }).escape(),
    body('img_link', 'Image link must not be empty').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
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
            // There are errors. Render form again with sanitized values/error messages.
            console.log('errordetected', device)

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
            // Data from form is valid. Save.
            device.save(function (err) {
                if (err) { return next(err); }
                console.log('success')
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
            console.log(device);
            res.render('device_delete', { title: 'Delete device', device });
        });
};

// Handle device delete on POST.
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

// Display device update form on GET.
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
        console.log(results, 'sdfsdfsdfsdfs results sdfsfdsdf')
        res.render('device_form', { title: 'Update Device', device: results.device, conditions, categories: results.categories, models: results.models });
    });
};

// Display book update form on GET.
exports.book_update_get = function (req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        authors: function (callback) {
            Author.find(callback);
        },
        genres: function (callback) {
            Genre.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.book == null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected genres as checked.
        for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
            for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
                if (results.genres[all_g_iter]._id.toString() === results.book.genre[book_g_iter]._id.toString()) {
                    results.genres[all_g_iter].checked = 'true';
                }
            }
        }
        res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
    });

};

// Handle device update on POST.
exports.device_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: device update POST');
};

// Handle book update on POST.
// exports.book_update_post = [

//     // Convert the genre to an array
//     (req, res, next) => {
//         if (!(req.body.genre instanceof Array)) {
//             if (typeof req.body.genre === 'undefined')
//                 req.body.genre = [];
//             else
//                 req.body.genre = new Array(req.body.genre);
//         }
//         next();
//     },

//     // Validate and sanitise fields.
//     body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
//     body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
//     body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
//     body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
//     body('genre.*').escape(),

//     // Process request after validation and sanitization.
//     (req, res, next) => {

//         // Extract the validation errors from a request.
//         const errors = validationResult(req);

//         // Create a Book object with escaped/trimmed data and old id.
//         var book = new Book(
//             {
//                 title: req.body.title,
//                 author: req.body.author,
//                 summary: req.body.summary,
//                 isbn: req.body.isbn,
//                 genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
//                 _id: req.params.id //This is required, or a new ID will be assigned!
//             });

//         if (!errors.isEmpty()) {
//             // There are errors. Render form again with sanitized values/error messages.

//             // Get all authors and genres for form.
//             async.parallel({
//                 authors: function (callback) {
//                     Author.find(callback);
//                 },
//                 genres: function (callback) {
//                     Genre.find(callback);
//                 },
//             }, function (err, results) {
//                 if (err) { return next(err); }

//                 // Mark our selected genres as checked.
//                 for (let i = 0; i < results.genres.length; i++) {
//                     if (book.genre.indexOf(results.genres[i]._id) > -1) {
//                         results.genres[i].checked = 'true';
//                     }
//                 }
//                 res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
//             });
//             return;
//         }
//         else {
//             // Data from form is valid. Update the record.
//             Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
//                 if (err) { return next(err); }
//                 // Successful - redirect to book detail page.
//                 res.redirect(thebook.url);
//             });
//         }
//     }
// ];