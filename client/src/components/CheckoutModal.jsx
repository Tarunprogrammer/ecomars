import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal({ isOpen, onClose, cart, onOrderSuccess }) {
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    customerName: user ? user.name : '',
    customerEmail: user ? user.email : '',
    shippingAddress: '',
    paymentMethod: 'Credit Card'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.shippingAddress) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cart,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          shippingAddress: form.shippingAddress,
          paymentMethod: form.paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order.');

      setPlacedOrder(data.order);
      onOrderSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-box" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
          <CheckCircle size={54} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.4rem' }}>Order Confirmed!</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Thank you, <strong>{placedOrder.customerName}</strong>! Your order reference is:
          </p>
          <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {placedOrder.id}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We've sent a detailed confirmation to <strong>{placedOrder.customerEmail}</strong>.
          </p>
          <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Complete Checkout</h3>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                required
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Shipping Address *</label>
            <textarea
              className="form-input"
              rows={3}
              required
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              placeholder="Full street address, city, state, zip code..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`pill-btn ${form.paymentMethod === 'Credit Card' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, paymentMethod: 'Credit Card' })}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem' }}
              >
                <CreditCard size={16} />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                className={`pill-btn ${form.paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, paymentMethod: 'Cash on Delivery' })}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem' }}
              >
                <Truck size={16} />
                <span>Cash on Delivery</span>
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1.25rem 0' }}>
            <div className="summary-row">
              <span>Order Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.85rem' }}>
            <ShieldCheck size={18} />
            <span>{loading ? 'Processing Order...' : `Place Order — $${total.toFixed(2)}`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
