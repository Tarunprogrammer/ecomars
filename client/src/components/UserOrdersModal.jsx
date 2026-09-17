import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserOrdersModal({ isOpen, onClose }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      fetch('/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    if (status === 'Delivered') return <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}><CheckCircle2 size={15} /> Delivered</span>;
    if (status === 'Shipped') return <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}><Truck size={15} /> Shipped</span>;
    return <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}><Clock size={15} /> {status || 'Pending'}</span>;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={22} style={{ color: 'var(--primary)' }} />
            <h3 className="modal-title">My Personal Orders</h3>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading order history...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Package size={42} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: '700', fontSize: '1rem' }}>No orders found yet</p>
              <p style={{ fontSize: '0.85rem' }}>Place your first order from our shop catalog!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', background: 'var(--bg-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--bg-subtle)' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.95rem' }}>{order.id}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginLeft: '0.6rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    {order.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span>{it.quantity}x {it.title}</span>
                        <span style={{ fontWeight: '600' }}>${(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping to: <strong>{order.shippingAddress}</strong></span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)' }}>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
