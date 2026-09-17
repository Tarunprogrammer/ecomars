import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Edit2, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel({
  products,
  onRefreshProducts,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToast
}) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchOrders = () => {
    setLoadingOrders(true);
    fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order status');

      onToast(`Order ${orderId} status set to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Admin Management Control Center</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Manage store catalog, product inventory pricing, and customer order fulfillment.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddProduct}>
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Inventory ({products.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Customer Orders Management
        </button>
      </div>

      {activeTab === 'products' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{p.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="pill-btn" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>${p.price.toFixed(2)}</td>
                  <td>{p.stock} units</td>
                  <td>⭐ {p.rating ? p.rating.toFixed(1) : '4.5'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn-icon" onClick={() => onEditProduct(p)} title="Edit" style={{ width: '32px', height: '32px' }}>
                        <Edit2 size={14} style={{ color: 'var(--primary)' }} />
                      </button>
                      <button className="btn-icon" onClick={() => onDeleteProduct(p.id)} title="Delete" style={{ width: '32px', height: '32px' }}>
                        <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn-secondary" onClick={fetchOrders} style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
              <RefreshCw size={14} /> Refresh Orders
            </button>
          </div>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading customer orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No orders placed yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Total</th>
                    <th>Items</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(ord => (
                    <tr key={ord.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '800' }}>{ord.id}</td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{ord.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ord.customerEmail}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem', maxWidth: '180px' }}>{ord.shippingAddress}</td>
                      <td style={{ fontWeight: '800', color: 'var(--primary)' }}>${ord.totalAmount.toFixed(2)}</td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {ord.items.map((i, idx) => (
                          <div key={idx}>{i.quantity}x {i.title}</div>
                        ))}
                      </td>
                      <td>
                        <select
                          className="sort-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.82rem', fontWeight: '700' }}
                          value={ord.status || 'Pending'}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
