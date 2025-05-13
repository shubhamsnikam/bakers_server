const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
<<<<<<< HEAD
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
  barcode: { 
    type: String
  },
  expiryDate: { 
    type: Date 
  },
  manufacturingDate: { 
    type: Date
   }
=======
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
     min: 0,
  },
  weight: {
    type: String,
    default: '',
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
>>>>>>> 32361c8 (new)
}, { timestamps: true });

// Auto-generate barcode based on _id after save
productSchema.post('save', async function(doc, next) {
  if (!doc.barcode) {
    doc.barcode = doc._id.toString();
    await doc.save();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
