var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BrandSchema = new Schema(
    {
        name: { type: String, required: true },
        model: { type: Schema.Types.ObjectId, ref: 'Model', required: true },
    }
);

// Virtual for book's URL
BrandSchema
    .virtual('url')
    .get(function () {
        return '/Device/' + this._id;
    });

//Export model
module.exports = mongoose.model('Brand', BrandSchema);