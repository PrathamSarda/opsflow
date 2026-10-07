import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Boxes, 
  ClipboardList, 
  PlusCircle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { productsApi, ordersApi } from '../../api';
import { formatINR } from '../../utils/currency';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.allSettled([
          productsApi.getAll(),
          ordersApi.getAll()
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
          const prodData = await prodRes.value.json();
          setProducts(prodData);
        }
        if (orderRes.status === 'fulfilled' && orderRes.value.ok) {
          const orderData = await orderRes.value.json();
          setOrders(orderData);
        }
      } catch (e) {
        console.error('Error fetching dashboard statistics', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProducts = products.length;
  const outOfStockCount = products.filter(p => p.stockQuantity <= 0).length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Banner / Welcome */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem' 
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Operations Command Center</h1>
            <span className="badge badge-primary">Store Owner</span>
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Real-time overview of products, customer orders, and store inventory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/add-product')}
          >
            <PlusCircle size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Products</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Boxes size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {loading ? '...' : totalProducts}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.8rem', color: outOfStockCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }}>
            {outOfStockCount > 0 ? (
              <>
                <AlertTriangle size={14} />
                <span>{outOfStockCount} out of stock</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>All items in stock</span>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Orders</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--warning-light)', color: 'var(--warning-text)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {loading ? '...' : pendingOrders}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Awaiting fulfillment
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Fulfilled Orders</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--success-light)', color: 'var(--success-text)' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {loading ? '...' : completedOrders}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success-text)', marginTop: '0.35rem' }}>
            Successfully delivered
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Completed Revenue</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {loading ? '...' : formatINR(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            From fulfilled sales
          </div>
        </div>
      </div>

      {/* Feature Action Modules */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Operations Modules</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem' 
      }}>
        {/* Module 1: Inventory */}
        <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}>
              <Boxes size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Inventory Control</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Monitor stock levels, review catalog listings, update product images, and remove obsolete items in real-time.
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'space-between' }}
            onClick={() => navigate('/owner-inventory')}
          >
            <span>Manage Inventory</span>
            <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Module 2: Order Management */}
        <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}>
              <ClipboardList size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Order Fulfillment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Track customer checkouts, inspect item lists and totals, and mark orders as completed with one click.
            </p>
          </div>
          <button 
            className="btn btn-success" 
            style={{ width: '100%', justifyContent: 'space-between' }}
            onClick={() => navigate('/owner-orders')}
          >
            <span>Review Customer Orders</span>
            <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Module 3: Add Product */}
        <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}>
              <PlusCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Add New Merchandise</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Publish new items to the storefront with instant image upload preview, pricing, and initial inventory quantities.
            </p>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'space-between' }}
            onClick={() => navigate('/add-product')}
          >
            <span>Launch Product Creator</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}