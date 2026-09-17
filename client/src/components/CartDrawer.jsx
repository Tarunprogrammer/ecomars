import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Your Shopping Cart</h3>
            <span style={{ fontSize: '0.8rem', background: 'var(--bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.3rem' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Explore our catalog and add items to your cart.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  <div className="cart-qty-control">
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.88rem', fontWeight: '700', minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ color: 'var(--danger)', marginLeft: 'auto' }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn-primary"
              onClick={() => { onClose(); onProceedCheckout(); }}
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
