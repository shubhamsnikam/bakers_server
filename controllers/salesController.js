const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.recordSale = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();
  
  try {
    const { customer, items } = req.body;

    if (!customer) {
      return res.status(400).json({ message: 'Customer is required.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one product item is required.' });
    }

    let totalAmount = 0;

    // Step 1: Validate and calculate the total amount
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for product ${product?.name}` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product?.name}` });
      }

      totalAmount += product.price * item.quantity;
    }

    // Step 2: Update the stock
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      
      // Update stock only if product exists
      if (product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } }).session(session);
      }
    }

    // Step 3: Save the sale record
    const sale = new Sale({ customer, items, totalAmount });
    const savedSale = await sale.save({ session });

    // Step 4: Commit the transaction if everything is successful
    await session.commitTransaction();

    // Return the saved sale response
    res.status(201).json(savedSale);

  } catch (err) {
    // Abort the transaction if something fails
    await session.abortTransaction();
    console.error('Error in recordSale:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    // End the session
    session.endSession();
  }
};
