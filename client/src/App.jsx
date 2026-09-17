import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import ProductFormModal from './components/ProductFormModal';
import UserOrdersModal from './components/UserOrdersModal';
import NotificationToast from './components/NotificationToast';
import { useAuth } from './context/AuthContext';
import { RefreshCw, PackageX } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen'];

export default function App() {
  const { user, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Drawers state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomars_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showAdminView, setShowAdminView] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('ecomars_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch products from Express Backend API
  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    if (sortBy) params.append('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        addToast('Could not load products. Please start the backend.', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  // Cart operations
  const handleAddToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...product, quantity: qty }];
    });
    addToast(`Added "${product.title}" to cart!`);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    addToast('Item removed from cart', 'info');
  };

  // Admin delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      addToast('Product deleted from catalog', 'info');
      fetchProducts();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsProductFormOpen(true);
  };

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductFormOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        showAdminView={showAdminView}
        setShowAdminView={setShowAdminView}
      />

      <main className="main-content">
        {showAdminView && user && user.role === 'admin' ? (
          <AdminPanel
            products={products}
            onRefreshProducts={fetchProducts}
            onOpenAddProduct={handleOpenAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onToast={addToast}
          />
        ) : (
          <>
            <HeroBanner onExploreClick={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} />

            <div id="catalog-section" className="filter-bar">
              <div className="category-pills">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Featured & Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={32} className="spin" style={{ marginBottom: '0.8rem', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontWeight: '600' }}>Loading products catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <PackageX size={48} style={{ opacity: 0.3, marginBottom: '0.8rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  No matching products found
                </h3>
                <p style={{ fontSize: '0.9rem' }}>Try clearing your search query or choosing another category.</p>
              </div>
            ) : (
              <div className="product-grid">
                {products.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={handleAddToCart}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Drawers */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={() => {
          setCart([]);
          addToast('Order placed successfully!', 'success');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessToast={(msg) => addToast(msg, 'success')}
      />

      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        productToEdit={productToEdit}
        onSaveSuccess={(msg) => {
          addToast(msg, 'success');
          fetchProducts();
        }}
      />

      <UserOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <NotificationToast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
