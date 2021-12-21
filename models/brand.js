var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BrandSchema = new Schema(
    {
        name: { type: String, required: true },
        model: { type: Schema.Types.ObjectId, ref: 'Model', required: true },
    }
);

BrandSchema
    .virtual('url')
    .get(function () {
        return '/brand/' + this._id;
    });

module.exports = mongoose.model('Brand', BrandSchema);