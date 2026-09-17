import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSaveSuccess }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    image: '',
    description: '',
    stock: 15,
    rating: 4.8
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setForm({
        title: productToEdit.title || '',
        price: productToEdit.price || '',
        category: productToEdit.category || 'Electronics',
        image: productToEdit.image || '',
        description: productToEdit.description || '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 15,
        rating: productToEdit.rating || 4.8
      });
    } else {
      setForm({
        title: '',
        price: '',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        description: '',
        stock: 15,
        rating: 4.8
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image) {
      setError('Title, price, and image URL are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isEdit = Boolean(productToEdit);
      const url = isEdit ? `/api/products/${productToEdit.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Operation failed.');

      onSaveSuccess(isEdit ? 'Product updated successfully!' : 'New product added successfully!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{productToEdit ? 'Edit Product Details' : 'Add New Product to Catalog'}</h3>
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div style={{ background: 'var(--danger-subtle)', color: 'var(--danger)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '600' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                required
                placeholder="149.99"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Accessories">Accessories</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <input
              type="url"
              className="form-input"
              required
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input
                type="number"
                className="form-input"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                max="5"
                className="form-input"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief product highlights and specifications..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
            {productToEdit ? <Save size={18} /> : <Plus size={18} />}
            <span>{loading ? 'Saving...' : productToEdit ? 'Update Product' : 'Add Product'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
