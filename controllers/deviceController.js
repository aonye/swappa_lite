let Device = require('../models/device');

exports.index = function (req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all devices.
exports.device_list = function (req, res) {
    res.send('NOT IMPLEMENTED: device list');
};

// Display detail page for a specific device.
exports.device_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: device detail: ' + req.params.id);
};

// Display device create form on GET.
exports.device_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: device create GET');
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