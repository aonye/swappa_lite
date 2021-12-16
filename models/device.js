var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeviceSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
        condition: { type: Schema.Types.ObjectId, ref: 'Condition', required: true },
        carriers: { type: Schema.Types.ObjectId, ref: 'Carriers', required: true },
    }
);

// Virtual for book's URL
DeviceSchema
    .virtual('url')
    .get(function () {
        return '/Device/' + this._id;
    });

//Export model
module.exports = mongoose.model('Device', DeviceSchema);