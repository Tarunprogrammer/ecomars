import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: 'guest' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  paymentMethod: { type: String, default: 'Credit Card' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
