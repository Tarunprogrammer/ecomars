import React, { useState } from 'react';
import { X, Star, Plus, Minus, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {product.category}
          </span>
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', lineHeight: '1.3' }}>
              {product.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <Star className="star-icon" />
              <span style={{ fontWeight: '700' }}>{product.rating || '4.5'}</span>
              <span style={{ color: 'var(--text-light)' }}>• {product.stock} items available</span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              {product.description}
            </p>

            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              ${product.price.toFixed(2)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Quantity:</span>
              <div className="cart-qty-control" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.2rem 0.5rem' }}>
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={14} />
                </button>
                <span style={{ width: '24px', textAlign: 'center', fontWeight: '700' }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={handleAdd} style={{ width: '100%', padding: '0.75rem' }}>
              <ShoppingBag size={18} />
              <span>Add to Cart — ${(product.price * qty).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
