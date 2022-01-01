var express = require('express');
var router = express.Router();

// Require controller modules.
var device_controller = require('../controllers/deviceController');
var category_controller = require('../controllers/categoryController');
var brand_controller = require('../controllers/brandController');
var model_controller = require('../controllers/modelController');

/* GET home page. */
router.get('/', device_controller.index);

// GET request for creating a device. NOTE This must come before routes that display device (uses id).
router.get('/device/create', device_controller.device_create_get);

// POST request for creating device.
router.post('/device/create', device_controller.device_create_post);

// GET request to delete device.
router.get('/device/:id/delete', device_controller.device_delete_get);

// POST request to delete device.
router.post('/device/:id/delete', device_controller.device_delete_post);

// GET request to update device.
router.get('/device/:id/update', device_controller.device_update_get);

// POST request to update device.
router.post('/device/:id/update', device_controller.device_update_post);

// GET request for one device.
router.get('/device/:id', device_controller.device_detail);

// GET request for list of all device items.
router.get('/devices', device_controller.device_list);

// /// model ROUTES ///

// GET request for creating model. NOTE This must come before route for id (i.e. display model).
router.get('/model/create', model_controller.model_create_get);

// POST request for creating model.
router.post('/model/create', model_controller.model_create_post);

// GET request to delete model.
router.get('/model/:id/delete', model_controller.model_delete_get);

// POST request to delete model.
router.post('/model/:id/delete', model_controller.model_delete_post);

// GET request to update model.
router.get('/model/:id/update', model_controller.model_update_get);

// POST request to update model.
router.post('/model/:id/update', model_controller.model_update_post);

// GET request for one model.
router.get('/model/:id', model_controller.model_detail);

// GET request for list of all models. - Will not install
//router.get('/models', model_controller.model_list);

// /// category ROUTES ///

// // GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get('/category/create', category_controller.category_create_get);

//POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category.
router.get('/categories', category_controller.category_list);

/// brand ROUTES ///

// GET request for creating a brand. NOTE This must come before route that displays brand (uses id).
router.get('/brand/create', brand_controller.brand_create_get);

// POST request for creating brand.
router.post('/brand/create', brand_controller.brand_create_post);

// GET request to delete brand.
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// POST request to delete brand.
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// GET request to update brand.
router.get('/brand/:id/update', brand_controller.brand_update_get);

// POST request to update brand.
router.post('/brand/:id/update', brand_controller.brand_update_post);

// GET request for one brand.
router.get('/brand/:id', brand_controller.brand_detail);

// GET request for list of all brand.
router.get('/brands', brand_controller.brand_list);

module.exports = router;