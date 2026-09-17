import React from 'react';
import { ShoppingBag, Search, User, LogOut, ShieldCheck, PackageCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenOrders,
  showAdminView,
  setShowAdminView
}) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#" className="brand-logo" onClick={() => setShowAdminView(false)}>
          <div className="brand-icon">
            <ShoppingBag size={20} />
          </div>
          <span>Ecomars</span>
        </a>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products, brands, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="nav-actions">
          {user && user.role === 'admin' && (
            <button
              className={`btn-secondary ${showAdminView ? 'active' : ''}`}
              onClick={() => setShowAdminView(!showAdminView)}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 0.95rem' }}
            >
              <LayoutDashboard size={16} />
              <span>{showAdminView ? 'Store Catalog' : 'Admin Panel'}</span>
            </button>
          )}

          {user && user.role === 'user' && (
            <button
              className="btn-secondary"
              onClick={onOpenOrders}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 0.95rem' }}
            >
              <PackageCheck size={16} />
              <span>My Orders</span>
            </button>
          )}

          <button className="btn-icon" onClick={onOpenCart} title="View Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>

          {user ? (
            <div className="user-profile-btn">
              {user.role === 'admin' ? <ShieldCheck size={16} style={{ color: 'var(--primary)' }} /> : <User size={16} />}
              <span>{user.name}</span>
              <span className={`role-tag ${user.role}`}>{user.role}</span>
              <button
                onClick={logout}
                title="Sign Out"
                style={{ marginLeft: '0.4rem', color: 'var(--text-muted)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onOpenAuth} style={{ borderRadius: 'var(--radius-full)' }}>
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
