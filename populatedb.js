#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Device = require('./models/device')
var Brand = require('./models/brand')
var Category = require('./models/category')
var Model = require('./models/model')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var devices = [];
var brands = [];
var categories = [];
var models = [];

function deviceCreate(name, description, number_in_stock, category, price, brand, condition, cb) {
  let deviceDetail = {
    name: name,
    description: description,
    number_in_stock: number_in_stock,
    category: category,
    price: price,
    condition: condition,
  }

  if (brand !== false) {
    deviceDetail.brand = brand;
  }

  let device = new Device(deviceDetail);
  device.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Device: ${device}`);
    devices.push(device);
    cb(null, device);
  })
}

function brandCreate(name, model, cb) {
  let brand = new Brand({ name: name, model: model });
  brand.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Brand: ${brand}`);
    brands.push(brand);
    cb(null, brand);
  });
}

function modelCreate(name, cb) {
  let model = new Model({ name: name });
  model.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Model: ' + model);
    models.push(model);
    cb(null, model);
  });
}

function categoryCreate(name, cb) {
  let category = new Category({ name: name });
  console.log('calling category')
  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function createBrandModelCategory(cb) {
  async.series([
    function (callback) {
      modelCreate('A2482', callback); //iphone 13
    },
    function (callback) {
      modelCreate('A2483', callback); //iphone 13 pro
    },
    function (callback) {
      modelCreate('A2483', callback); //iphone 13 pro max
    },
    function (callback) {
      brandCreate('Apple', models[0], callback);
    },
    function (callback) {
      brandCreate('Apple', models[1], callback);
    },
    function (callback) {
      brandCreate('Apple', models[2], callback);
    },
    function (callback) {
      categoryCreate('Phone', callback);
    },
    function (callback) {
      categoryCreate('Tablet', callback);
    },
    function (callback) {
      categoryCreate('Laptop', callback);
    },
  ],
    // optional callback
    cb);
}


function createDevice(cb) {
  async.parallel([
    function (callback) {
      deviceCreate('IPhone 13', 'Silver, 256GB Storage, Verizon, 80% Battery', 1, categories[0], 499.99, models[0], 'Fair', callback);
    },
    //name, description, number_in_stock, category, price, brand, condition
    function (callback) {
      deviceCreate('IPhone 13 Pro', 'Rose Gold, 512GB Storage, Unlocked, Great Battery Life', 2, categories[0], 799.99, models[1], 'Good', callback);
    },
    function (callback) {
      deviceCreate('IPhone 13 Pro Max', 'Steel Gray, 512GB Storage, T-Mobile, 90% Battery', 3, categories[0], 1199.99, models[2], 'Mint', callback);
    },
  ],
    // optional callback
    cb);
}

async.series([
  createBrandModelCategory,
  createDevice,
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log(`Success. Devices created: ${devices}`);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });