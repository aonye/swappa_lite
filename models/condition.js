var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ConditionSchema = new Schema(
    {
        name: { type: String, required: true },
    }
);

// Virtual for book's URL
// BrandSchema
//     .virtual('url')
//     .get(function () {
//         return '/Device/' + this._id;
//     });

//Export model
module.exports = mongoose.model('Condition', ConditionSchema);