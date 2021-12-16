var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ModelSchema = new Schema(
    {
        name: { type: String, required: true },
    }
);

// Virtual for book's URL
ModelSchema
    .virtual('url')
    .get(function () {
        return '/Device/' + this._id;
    });

//Export model
module.exports = mongoose.model('Model', ModelSchema);