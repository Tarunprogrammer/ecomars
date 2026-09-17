import React from 'react';
import { Star, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, onQuickView, onAddToCart, onEditProduct, onDeleteProduct }) {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="product-card">
      <div className="card-img-wrapper">
        <img src={product.image} alt={product.title} className="card-img" />
        <span className="card-category-badge">{product.category}</span>

        {isAdmin && (
          <div className="admin-card-actions">
            <button
              className="btn-icon"
              style={{ background: 'rgba(255,255,255,0.9)', width: '32px', height: '32px' }}
              onClick={(e) => { e.stopPropagation(); onEditProduct(product); }}
              title="Edit Product"
            >
              <Edit2 size={14} style={{ color: 'var(--primary)' }} />
            </button>
            <button
              className="btn-icon"
              style={{ background: 'rgba(255,255,255,0.9)', width: '32px', height: '32px' }}
              onClick={(e) => { e.stopPropagation(); onDeleteProduct(product.id); }}
              title="Delete Product"
            >
              <Trash2 size={14} style={{ color: 'var(--danger)' }} />
            </button>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{product.title}</h3>

        <div className="card-rating">
          <Star className="star-icon" />
          <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
          <span style={{ color: 'var(--text-light)', marginLeft: '0.2rem' }}>({product.stock} in stock)</span>
        </div>

        <div className="card-footer">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className="btn-icon"
              onClick={() => onQuickView(product)}
              title="Quick View"
              style={{ width: '36px', height: '36px' }}
            >
              <Eye size={16} />
            </button>
            <button
              className="btn-primary"
              onClick={() => onAddToCart(product)}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', borderRadius: 'var(--radius-md)' }}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
