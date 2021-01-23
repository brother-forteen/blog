let mongoose = require('mongoose');
let category = require('../schemas/category');

module.exports = mongoose.model('Category', category);