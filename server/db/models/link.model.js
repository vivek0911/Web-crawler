const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  link: String,
  visited: Boolean,
},
  {
    timestamps: true,
    toObject: { virtuals: true },
  });

module.exports = mongoose.model('Link', linkSchema);
