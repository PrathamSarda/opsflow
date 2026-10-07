import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Boxes, 
  Store, 
  ShoppingCart, 
  Package, 
  PlusCircle, 
  User, 
  LogOut, 
  LayoutDashboard,
  ClipboardList
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username') || 'User';
  const { totalCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isOwner = role === 'owner_success';
  const isCustomer = role === 'customer_success' || (!isOwner && role);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link 
          to={isOwner ? '/owner-dashboard' : isCustomer ? '/customer-store' : '/login'} 
          className="navbar-brand"
        >
          <div className="brand-icon-wrapper">
            <Boxes size={22} strokeWidth={2.5} />
          </div>
          <span className="brand-text">OpsFlow</span>
        </Link>

        {!isAuthPage && (
          <nav className="navbar-links">
            {isOwner ? (
              <>
                <Link 
                  to="/owner-dashboard" 
                  className={`nav-link ${location.pathname === '/owner-dashboard' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/owner-inventory" 
                  className={`nav-link ${location.pathname === '/owner-inventory' ? 'active' : ''}`}
                >
                  <Boxes size={18} />
                  <span>Inventory</span>
                </Link>
                <Link 
                  to="/owner-orders" 
                  className={`nav-link ${location.pathname === '/owner-orders' ? 'active' : ''}`}
                >
                  <ClipboardList size={18} />
                  <span>Orders</span>
                </Link>
                <Link 
                  to="/add-product" 
                  className={`nav-link ${location.pathname === '/add-product' ? 'active' : ''}`}
                >
                  <PlusCircle size={18} />
                  <span>Add Product</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/customer-store" 
                  className={`nav-link ${location.pathname === '/customer-store' ? 'active' : ''}`}
                >
                  <Store size={18} />
                  <span>Store</span>
                </Link>
                <Link 
                  to="/cart" 
                  className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
                >
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {totalCount > 0 && (
                    <span className="nav-badge-pill">{totalCount}</span>
                  )}
                </Link>
                <Link 
                  to="/customer-orders" 
                  className={`nav-link ${location.pathname === '/customer-orders' ? 'active' : ''}`}
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </Link>
                <Link 
                  to="/customer-profile" 
                  className={`nav-link ${location.pathname === '/customer-profile' ? 'active' : ''}`}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              </>
            )}

            <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.5rem' }} />

            <div className="nav-user-pill">
              <div className="nav-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <span>{username}</span>
              <span className={`badge ${isOwner ? 'badge-primary' : 'badge-completed'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                {isOwner ? 'Owner' : 'Customer'}
              </span>
            </div>

            <button 
              onClick={handleLogout} 
              className="btn btn-ghost btn-sm"
              title="Logout"
              style={{ color: 'var(--danger)', padding: '0.45rem 0.75rem' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </nav>
        )}

        {isAuthPage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {location.pathname === '/login' ? "Don't have an account?" : "Already registered?"}
            </span>
            <Link 
              to={location.pathname === '/login' ? '/signup' : '/login'}
              className="btn btn-secondary btn-sm"
            >
              {location.pathname === '/login' ? 'Create Account' : 'Sign In'}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
