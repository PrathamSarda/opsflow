import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Boxes,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ordersApi } from '../../api';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'Customer';

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    const orderData = {
      customerUsername: username,
      totalPrice: Number(totalPrice.toFixed(2)),
      orderedItems: cartItems.map(item => `${item.name} (x${item.quantity})`)
    };

    try {
      const response = await ordersApi.checkout(orderData);

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Order successfully placed! Our team is preparing your items.');
        clearCart();
      } else {
        setMessage('Checkout failed. Please verify connection and try again.');
      }
    } catch (err) {
      setMessage('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ maxWidth: '580px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3.5rem 2rem' }}>
          <div 
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: 'var(--success-light)', 
              color: 'var(--success)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
            }}
          >
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
            Thank you for your purchase. Your order has been placed into the OpsFlow fulfillment queue.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/customer-store')}
            >
              Continue Shopping
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/customer-orders')}
            >
              <span>Track Orders</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <button 
            type="button"
            onClick={() => navigate('/customer-store')} 
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '0.5rem', paddingLeft: 0 }}
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </button>
          <h1 style={{ fontSize: '1.85rem', margin: 0 }}>Shopping Bag</h1>
        </div>

        {cartItems.length > 0 && (
          <button 
            type="button" 
            className="btn btn-ghost btn-sm"
            onClick={clearCart}
            style={{ color: 'var(--danger-text)' }}
          >
            <Trash2 size={16} />
            <span>Clear Bag</span>
          </button>
        )}
      </div>

      {message && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingCart size={32} />
          </div>
          <h3>Your shopping bag is empty</h3>
          <p>
            Explore our curated selection of quality items and hardware to begin building your order.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/customer-store')}
          >
            <span>Browse Catalog</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Items List */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
              Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ 
                    width: '68px', 
                    height: '68px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-subtle)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)'
                  }}>
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Boxes size={24} color="var(--text-light)" />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ${Number(item.price).toFixed(2)} each
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.5rem' }}
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.5rem' }}
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-light)', 
                        cursor: 'pointer',
                        padding: '0.2rem',
                        marginTop: '0.25rem'
                      }}
                      title="Remove Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Checkout Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                <span>Standard Delivery</span>
                <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                <span>Customer Account</span>
                <span style={{ fontWeight: 600 }}>{username}</span>
              </div>

              <div style={{ 
                borderTop: '1px solid var(--border)', 
                paddingTop: '1rem', 
                marginTop: '0.5rem',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'baseline' 
              }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Confirm Checkout</span>
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <ShieldCheck size={14} color="var(--success)" />
              <span>Encrypted secure transaction</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}