let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DeviceSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        description: { type: String, required: true },
        number_in_stock: { type: Number, min: 1, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, //phone, tablet, laptop, custom, REQUIRED
        price: { type: Schema.Types.Decimal128, required: true },
        model: { type: Schema.Types.ObjectId, ref: 'Model' }, //not required
        condition: { type: String, required: true, enum: ['New', 'Good', 'Fair', 'Mint'], default: 'Fair' },
        img_link: { type: String, required: true },
    }
);

DeviceSchema
    .virtual('url')
    .get(function () {
        return '/device/' + this._id;
    });

module.exports = mongoose.model('Device', DeviceSchema);