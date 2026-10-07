import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Package, 
  ShoppingCart, 
  ArrowLeft, 
  LogOut, 
  Store,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Customer';
  const role = localStorage.getItem('role') || 'Customer';
  const hasToken = !!localStorage.getItem('token');
  const { totalCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          type="button"
          onClick={() => navigate('/customer-store')} 
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '0.5rem', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </button>
        <h1 style={{ fontSize: '1.85rem', margin: 0 }}>Customer Account Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
          Manage your personal details and account access
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.25rem 0' }}>{username}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="badge badge-completed">
                  <CheckCircle2 size={12} />
                  <span>Active Customer</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid var(--border)', 
            paddingTop: '1.25rem',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.85rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Username</span>
              <span style={{ fontWeight: 600 }}>{username}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Security Level</span>
              <span style={{ fontWeight: 600 }}>Standard Customer</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Session Security</span>
              <span style={{ color: 'var(--success-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} />
                <span>JWT Authenticated</span>
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.75rem' }}>
            <button 
              className="btn btn-danger" 
              style={{ width: '100%' }}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Log Out of OpsFlow</span>
            </button>
          </div>
        </div>

        {/* Quick Links & Shortcuts */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Store Shortcuts</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              onClick={() => navigate('/customer-store')}
            >
              <Store size={18} color="var(--primary)" />
              <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Browse Storefront</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Discover available merchandise</div>
              </div>
            </button>

            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart size={18} color="#06b6d4" />
              <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Shopping Bag ({totalCount})</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Review items ready for checkout</div>
              </div>
            </button>

            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              onClick={() => navigate('/customer-orders')}
            >
              <Package size={18} color="#10b981" />
              <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Order History</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Track packages and past purchases</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}