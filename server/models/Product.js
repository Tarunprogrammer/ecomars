import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  stock: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
