import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onSuccessToast }) {
  const { signin, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(form.name, form.email, form.password, form.role);
        onSuccessToast('Account created and signed in successfully!');
      } else {
        await signin(form.email, form.password);
        onSuccessToast('Welcome back! Signed in successfully.');
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setIsSignUp(false);
    setForm({ ...form, email: 'admin@ecomars.com', password: 'admin123' });
  };

  const fillDemoUser = () => {
    setIsSignUp(false);
    setForm({ ...form, email: 'user@ecomars.com', password: 'user123' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="admin-tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
            <button
              type="button"
              className={`tab-btn ${!isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(false); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab-btn ${isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(true); setError(''); }}
            >
              Create Account
            </button>
          </div>
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

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="Sarah Connor"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="user@ecomars.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`pill-btn ${form.role === 'user' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'user' })}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.55rem' }}
                >
                  <UserIcon size={15} />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  className={`pill-btn ${form.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'admin' })}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.55rem' }}
                >
                  <Shield size={15} />
                  <span>Admin Manager</span>
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}>
            {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
          </button>

          {!isSignUp && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                1-Click Demo Login Shortcuts:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={fillDemoAdmin}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)' }}
                >
                  Fill Admin
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={fillDemoUser}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)' }}
                >
                  Fill Customer
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
