const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
     type: String, 
    required: true 
  },
  quantity: {
     type: Number, 
     required: true 
    },
  price: {
     type: Number, 
     required: true
     },
  expiryDate: { 
    type: Date
   },
  manufacturingDate: {
     type: Date
    },
  barcode: { 
    type: String, 
    unique: true
   },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
