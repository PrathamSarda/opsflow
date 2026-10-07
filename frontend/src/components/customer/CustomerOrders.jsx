import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  RefreshCw, 
  AlertCircle,
  Truck,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import { ordersApi } from '../../api';
import { formatINR } from '../../utils/currency';

function formatDateTime(dtStr) {
  if (!dtStr) return 'Recently placed';
  try {
    const d = new Date(dtStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Recently placed';
  }
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'customer';

  const fetchCustomerOrders = () => {
    setLoading(true);
    ordersApi.getByCustomer(username)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch orders');
      })
      .then((data) => {
        setOrders(data);
        setMessage('');
      })
      .catch(() => {
        setMessage('Error connecting to backend or loading orders.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [username]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

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
            <span>Back to Store</span>
          </button>
          <h1 style={{ fontSize: '1.85rem', margin: 0 }}>My Purchases & Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
            Track active delivery status and review your past orders
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={fetchCustomerOrders}
            title="Refresh order history"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => navigate('/customer-store')}
          >
            <span>Shop Store</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.2rem' }}>{totalOrders}</div>
        </div>
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Transit / Pending</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--warning-text)', marginTop: '0.2rem' }}>{pendingOrders}</div>
        </div>
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Delivered</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.2rem' }}>{completedOrders}</div>
        </div>
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lifetime Spend</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>{formatINR(totalSpent)}</div>
        </div>
      </div>

      {message && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 0', color: 'var(--text-muted)' }}>
          Retrieving your order records...
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={32} />
          </div>
          <h3>You haven't placed any orders yet</h3>
          <p>
            When you complete an order from the store, full tracking and status updates will be displayed here.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/customer-store')}
          >
            <span>Explore Products</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const items = Array.isArray(order.orderedItems) ? order.orderedItems : [];
            const isCompleted = order.status === 'COMPLETED';

            return (
              <div key={order.id} className="card card-hoverable" style={{ padding: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <Package size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                        Order #{order.id}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Purchased by {order.customerUsername || username} • {formatDateTime(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Amount</span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                        {formatINR(order.totalPrice)}
                      </span>
                    </div>

                    <div>
                      {isCompleted ? (
                        <span className="badge badge-completed" style={{ padding: '0.45rem 0.85rem' }}>
                          <CheckCircle2 size={14} />
                          <span>Fulfilled & Delivered</span>
                        </span>
                      ) : (
                        <span className="badge badge-pending" style={{ padding: '0.45rem 0.85rem' }}>
                          <Clock size={14} />
                          <span>Processing Order</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Container */}
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Items Included
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {items.map((item, idx) => (
                      <span 
                        key={idx}
                        style={{
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Timeline Indicator */}
                <div style={{ 
                  marginTop: '1.25rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.825rem',
                  color: 'var(--text-muted)'
                }}>
                  <Truck size={16} color="var(--primary)" />
                  <span>
                    {isCompleted 
                      ? 'Package has arrived. Order complete!' 
                      : 'OpsFlow warehouse is preparing your package for shipping.'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}