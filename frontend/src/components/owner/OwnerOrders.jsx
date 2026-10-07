import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  User, 
  Package, 
  RefreshCw, 
  Search, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';
import { ordersApi } from '../../api';

function formatDateTime(dtStr) {
  if (!dtStr) return 'Recently placed';
  try {
    const d = new Date(dtStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Recently placed';
  }
}

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PENDING, COMPLETED
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll();
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setMessage('');
    } catch (err) {
      setMessage('Error connecting to backend or fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await ordersApi.updateStatus(id, newStatus);
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      await fetchOrders();
    } catch (err) {
      setMessage('Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const customer = (order.customerUsername || '').toLowerCase();
    const matchesSearch = customer.includes(searchQuery.toLowerCase()) || String(order.id).includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return order.status === statusFilter;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
  const totalVolume = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', margin: '0 0 0.25rem 0' }}>Order Fulfillment Center</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.925rem' }}>
            Monitor incoming customer purchases and update dispatch status
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={fetchOrders}
            title="Refresh Orders"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => navigate('/owner-dashboard')}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Inquiries</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>{totalOrders}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Awaiting Fulfillment</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning-text)', marginTop: '0.2rem' }}>{pendingOrders}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Orders</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.2rem' }}>{completedOrders}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Order Volume</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>${totalVolume.toFixed(2)}</div>
        </div>
      </div>

      {message && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem',
        marginBottom: '1.5rem' 
      }}>
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by customer name or order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All ({totalOrders})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Pending ({pendingOrders})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('COMPLETED')}
          >
            Completed ({completedOrders})
          </button>
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ClipboardList size={32} />
          </div>
          <h3>{searchQuery ? 'No matching orders found' : 'No customer orders yet'}</h3>
          <p>
            {searchQuery 
              ? 'Try modifying your search term or status filter above.' 
              : 'Customer purchases will appear here as soon as orders are placed.'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Order ID</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total Value</th>
                <th>Fulfillment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const items = Array.isArray(order.orderedItems) ? order.orderedItems : [];
                const totalPrice = Number(order.totalPrice ?? 0);
                const isCompleted = order.status === 'COMPLETED';

                return (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                        #{order.id}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {formatDateTime(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {(order.customerUsername || 'C').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{order.customerUsername}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '300px' }}>
                        {items.map((item, idx) => (
                          <div 
                            key={idx}
                            style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.825rem',
                              background: 'var(--bg-subtle)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <Package size={12} color="var(--primary)" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        ${totalPrice.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      {isCompleted ? (
                        <span className="badge badge-completed">
                          <CheckCircle2 size={12} />
                          <span>Fulfilled</span>
                        </span>
                      ) : (
                        <span className="badge badge-pending">
                          <Clock size={12} />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {!isCompleted ? (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                          disabled={updatingId === order.id}
                        >
                          <CheckCircle2 size={14} />
                          <span>{updatingId === order.id ? 'Updating...' : 'Mark Completed'}</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                          Delivered
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}