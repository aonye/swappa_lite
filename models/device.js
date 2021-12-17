let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let DeviceSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        description: { type: String, required: true },
        number_in_stock: { type: Number, min: 1, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, //phone, tablet, laptop, custom, REQUIRED
        price: { type: Schema.Types.Decimal128, required: true },
        number_in_stock: { type: String, required: true },
        brand: [{ type: Schema.Types.ObjectId, ref: 'Brand' }], //not required
        condition: { type: String, required: true, enum: ['New', 'Good', 'Fair', 'Mint'], default: 'Fair' },
    }
);

let Device = mongoose.model('Device', DeviceSchema);
var device = new Device({ price: "123123312" });
console.log(device.price, 'safsdfs');


// Virtual for book's URL
DeviceSchema
    .virtual('url')
    .get(function () {
        return '/Device/' + this._id;
    });

//Export model
//module.exports = mongoose.model('Device', DeviceSchema);