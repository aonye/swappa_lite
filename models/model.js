var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ModelSchema = new Schema(
    {
        name: { type: String, required: true, maxlength: 30 },
    }
);

ModelSchema
    .virtual('url')
    .get(function () {
        return '/model/' + this._id;
    });

module.exports = mongoose.model('Model', ModelSchema);