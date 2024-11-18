const mongoose = require('mongoose');


const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: [String],
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  writters: {
    type: [String],
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const List = mongoose.model('List', listSchema);

module.exports = List;