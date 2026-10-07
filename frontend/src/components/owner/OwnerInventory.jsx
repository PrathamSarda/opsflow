import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Search, 
  Boxes, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ImageIcon, 
  ArrowUpDown, 
  Filter 
} from 'lucide-react';
import { productsApi } from '../../api';

export default function OwnerInventory() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState('ALL'); // ALL, IN_STOCK, OUT_OF_STOCK
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll();
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setMessage('');
      } else {
        setIsError(true);
        setMessage('Failed to fetch product inventory.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await productsApi.delete(id);

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setIsError(false);
        setMessage(`Product "${name}" deleted successfully.`);
      } else {
        setIsError(true);
        setMessage('Failed to delete product from server.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Network error while deleting product.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (filterStock === 'IN_STOCK') return p.stockQuantity > 0;
    if (filterStock === 'OUT_OF_STOCK') return p.stockQuantity <= 0;
    return true;
  });

  const totalSKUs = products.length;
  const inStockCount = products.filter(p => p.stockQuantity > 0).length;
  const outOfStockCount = products.filter(p => p.stockQuantity <= 0).length;

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
          <h1 style={{ fontSize: '1.85rem', margin: '0 0 0.25rem 0' }}>Inventory Management</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.925rem' }}>
            Manage pricing, stock quantities, and product catalog items
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={fetchProducts}
            title="Refresh Inventory"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => navigate('/add-product')}
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI mini-strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Items</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>{totalSKUs}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Stock</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.2rem' }}>{inStockCount}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Out of Stock</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: outOfStockCount > 0 ? 'var(--danger-text)' : 'var(--text-muted)', marginTop: '0.2rem' }}>
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
          {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{message}</span>
        </div>
      )}

      {/* Search and Filters */}
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
            placeholder="Search by product name or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
          <button
            type="button"
            className={`btn btn-sm ${filterStock === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStock('ALL')}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStock === 'IN_STOCK' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStock('IN_STOCK')}
          >
            In Stock
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStock === 'OUT_OF_STOCK' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStock('OUT_OF_STOCK')}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Inventory Table or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Boxes size={32} />
          </div>
          <h3>{searchQuery ? 'No matching products found' : 'No products in inventory'}</h3>
          <p>
            {searchQuery 
              ? 'Try modifying your search term or stock filter above.'
              : 'Add your first product with pricing and images to start accepting customer orders.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/add-product')}>
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Media</th>
                <th>Product Details</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ 
                          width: '52px', 
                          height: '52px', 
                          objectFit: 'cover', 
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          boxShadow: 'var(--shadow-sm)'
                        }} 
                      />
                    ) : (
                      <div style={{ 
                        width: '52px', 
                        height: '52px', 
                        background: 'var(--bg-subtle)', 
                        borderRadius: 'var(--radius-md)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--text-light)',
                        border: '1px solid var(--border)'
                      }}>
                        <ImageIcon size={22} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.825rem', 
                      color: 'var(--text-muted)', 
                      maxWidth: '380px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {product.description || 'No description provided'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    {product.stockQuantity > 0 ? (
                      <span className="badge badge-instock">
                        <CheckCircle2 size={12} />
                        <span>{product.stockQuantity} in stock</span>
                      </span>
                    ) : (
                      <span className="badge badge-outstock">
                        <AlertCircle size={12} />
                        <span>Out of stock</span>
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      style={{ color: 'var(--danger-text)', borderColor: 'var(--danger-border)' }}
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                      <span>{deletingId === product.id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}