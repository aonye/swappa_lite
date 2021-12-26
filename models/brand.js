var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BrandSchema = new Schema(
    {
        name: { type: String, required: true },
    }
);

BrandSchema
    .virtual('url')
    .get(function () {
        return '/brand/' + this._id;
    });

module.exports = mongoose.model('Brand', BrandSchema);