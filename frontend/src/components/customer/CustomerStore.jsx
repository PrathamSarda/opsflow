import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Package, 
  Check, 
  Plus, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Boxes,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { productsApi } from '../../api';
import { formatINR } from '../../utils/currency';

export default function CustomerStore() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockOnly, setStockOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState({});

  const { addToCart, totalCount, totalPrice } = useCart();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll();
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error connecting to backend', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);

    // Provide visual feedback on button
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1200);

    // Show temporary toast notification
    setToastMessage(`"${product.name}" added to your cart!`);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (stockOnly) return product.stockQuantity > 0;
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
            background: 'var(--surface-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--success-light)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Added to Cart</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{toastMessage}</div>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/cart')}
            style={{ marginLeft: '0.75rem' }}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Hero Storefront Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem',
          color: 'white',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 30px -10px rgba(49, 46, 129, 0.4)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            background: 'rgba(255, 255, 255, 0.12)', 
            backdropFilter: 'blur(8px)',
            padding: '0.3rem 0.75rem', 
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: '#e0e7ff'
          }}>
            <Sparkles size={14} color="#a5b4fc" />
            <span>Official OpsFlow Store Catalog</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'white', lineHeight: '1.15', marginBottom: '0.85rem' }}>
            Elevate Your Setup with Next-Gen Hardware
          </h1>
          <p style={{ color: '#c7d2fe', fontSize: '1.05rem', lineHeight: '1.5', margin: 0 }}>
            Explore verified merchandise, live real-time stock levels, and instant order fulfillment.
          </p>
        </div>
      </div>

      {/* Controls & Search */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search catalog products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${!stockOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStockOnly(false)}
          >
            All Products
          </button>
          <button
            type="button"
            className={`btn btn-sm ${stockOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStockOnly(true)}
          >
            In Stock Only
          </button>

          {totalCount > 0 && (
            <button 
              className="btn btn-success btn-sm"
              onClick={() => navigate('/cart')}
              style={{ marginLeft: '0.5rem' }}
            >
              <ShoppingCart size={16} />
              <span>Checkout ({formatINR(totalPrice)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Catalog Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading products catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Boxes size={32} />
          </div>
          <h3>{searchQuery ? 'No matching products' : 'Catalog is currently empty'}</h3>
          <p>
            {searchQuery 
              ? 'Try modifying your search criteria or toggling the stock filter.' 
              : 'Our store inventory is being restocked soon. Check back shortly!'}
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.75rem' 
        }}>
          {filteredProducts.map((product) => {
            const isAdded = addedIds[product.id];
            const inStock = product.stockQuantity > 0;

            return (
              <div 
                key={product.id} 
                className="card card-hoverable" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '1.25rem',
                  overflow: 'hidden'
                }}
              >
                {/* Product Image Area */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '210px', 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden',
                  background: 'var(--bg-subtle)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }} 
                    />
                  ) : (
                    <div style={{ color: 'var(--text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <Boxes size={36} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>No Image</span>
                    </div>
                  )}

                  {/* Stock Pill Badge */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    {inStock ? (
                      <span className="badge badge-instock" style={{ backdropFilter: 'blur(4px)', background: 'rgba(236, 253, 245, 0.95)' }}>
                        {product.stockQuantity} in stock
                      </span>
                    ) : (
                      <span className="badge badge-outstock" style={{ backdropFilter: 'blur(4px)', background: 'rgba(254, 242, 242, 0.95)' }}>
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                      {product.name}
                    </h3>
                    {product.unitSize && (
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                        {product.unitSize}
                      </div>
                    )}
                    <p style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.45', 
                      height: '42px', 
                      overflow: 'hidden', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical',
                      margin: '0 0 1rem 0'
                    }}>
                      {product.description || 'Premium quality merchandise.'}
                    </p>
                  </div>

                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'baseline', 
                      marginBottom: '1rem',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '0.75rem'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Price</span>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                        {formatINR(product.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`btn ${inStock ? (isAdded ? 'btn-success' : 'btn-primary') : 'btn-secondary'}`}
                      style={{ width: '100%' }}
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                    >
                      {isAdded ? (
                        <>
                          <Check size={18} />
                          <span>Added to Cart!</span>
                        </>
                      ) : inStock ? (
                        <>
                          <ShoppingCart size={18} />
                          <span>Add to Cart</span>
                        </>
                      ) : (
                        <span>Out of Stock</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}