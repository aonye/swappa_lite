var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
    }
);

// Virtual for book's URL
CategorySchema
    .virtual('url')
    .get(function () {
        return '/Category/' + this._id;
    });

//Export model
module.exports = mongoose.model('Category', CategorySchema);