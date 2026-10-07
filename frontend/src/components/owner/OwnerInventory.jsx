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
  Pencil,
  Save,
  X,
  UploadCloud
} from 'lucide-react';
import { productsApi } from '../../api';
import { formatINR } from '../../utils/currency';

export default function OwnerInventory() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState('ALL'); // ALL, IN_STOCK, OUT_OF_STOCK
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  const [editingUnitSizeId, setEditingUnitSizeId] = useState(null);
  const [unitSizeInput, setUnitSizeInput] = useState('');
  const [savingStockId, setSavingStockId] = useState(null);
  const [editingNameId, setEditingNameId] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [savingNameId, setSavingNameId] = useState(null);
  const [savingPhotoId, setSavingPhotoId] = useState(null);
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

  const handleUpdateUnitSize = async (product) => {
    const unitSize = unitSizeInput.trim();
    if (unitSize.length > 50) {
      setIsError(true);
      setMessage('Product quantity or size must be 50 characters or fewer.');
      return;
    }

    setSavingStockId(product.id);
    try {
      const response = await productsApi.update(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        unitSize,
        imageUrl: product.imageUrl,
      });

      if (response.ok) {
        setProducts(prev => prev.map(item => (
          item.id === product.id ? { ...item, unitSize } : item
        )));
        setEditingUnitSizeId(null);
        setIsError(false);
        setMessage(`Product quantity or size for "${product.name}" updated.`);
      } else {
        setIsError(true);
        setMessage(`Failed to update product quantity or size for "${product.name}".`);
      }
    } catch (err) {
      console.error('Error updating product quantity or size', err);
      setIsError(true);
      setMessage('Network error while updating product quantity or size.');
    } finally {
      setSavingStockId(null);
    }
  };

  const handleUpdateName = async (product) => {
    const name = nameInput.trim();
    if (!name) {
      setIsError(true);
      setMessage('Product name cannot be empty.');
      return;
    }

    setSavingNameId(product.id);
    try {
      const response = await productsApi.update(product.id, {
        name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        unitSize: product.unitSize,
        imageUrl: product.imageUrl,
      });

      if (response.ok) {
        setProducts(prev => prev.map(item => (
          item.id === product.id ? { ...item, name } : item
        )));
        setEditingNameId(null);
        setIsError(false);
        setMessage(`Product name updated to "${name}".`);
      } else {
        setIsError(true);
        setMessage(`Failed to update the name for "${product.name}".`);
      }
    } catch (err) {
      console.error('Error updating product name', err);
      setIsError(true);
      setMessage('Network error while updating product name.');
    } finally {
      setSavingNameId(null);
    }
  };

  const handleUpdatePhoto = async (product, event) => {
    const fileInput = event.currentTarget;
    const image = fileInput.files?.[0];
    if (!image) return;

    if (!image.type.startsWith('image/')) {
      setIsError(true);
      setMessage('Please choose a valid image file.');
      fileInput.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setSavingPhotoId(product.id);
    try {
      const response = await productsApi.updateImage(product.id, formData);
      if (!response.ok) {
        setIsError(true);
        setMessage(`Failed to update the photo for "${product.name}".`);
        return;
      }

      const updatedProduct = await response.json();
      setProducts(prev => prev.map(item => (
        item.id === product.id ? { ...item, imageUrl: updatedProduct.imageUrl } : item
      )));
      setIsError(false);
      setMessage(`Photo for "${product.name}" updated successfully.`);
    } catch (err) {
      console.error('Error updating product photo', err);
      setIsError(true);
      setMessage('Network error while updating product photo.');
    } finally {
      setSavingPhotoId(null);
      fileInput.value = '';
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

  const handleUpdateStock = async (product) => {
    const quantity = Number(stockInput);
    if (stockInput.trim() === '' || !Number.isInteger(quantity) || quantity < 0) {
      setIsError(true);
      setMessage('Stock quantity must be a whole number greater than or equal to zero.');
      return;
    }

    setSavingStockId(product.id);
    try {
      const response = await productsApi.update(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: quantity,
        unitSize: product.unitSize,
        imageUrl: product.imageUrl,
      });

      if (response.ok) {
        setProducts(prev => prev.map(item => (
          item.id === product.id ? { ...item, stockQuantity: quantity } : item
        )));
        setEditingStockId(null);
        setIsError(false);
        setMessage(`Stock quantity for "${product.name}" updated to ${quantity}.`);
      } else {
        setIsError(true);
        setMessage(`Failed to update stock quantity for "${product.name}".`);
      }
    } catch (err) {
      console.error('Error updating product stock', err);
      setIsError(true);
      setMessage('Network error while updating stock quantity.');
    } finally {
      setSavingStockId(null);
    }
  };

  const handleUpdatePrice = async (product) => {
    const price = Number(priceInput);
    if (priceInput.trim() === '' || !Number.isFinite(price) || price <= 0) {
      setIsError(true);
      setMessage('Price must be a number greater than zero.');
      return;
    }

    setSavingStockId(product.id);
    try {
      const response = await productsApi.update(product.id, {
        name: product.name,
        description: product.description,
        price,
        stockQuantity: product.stockQuantity,
        unitSize: product.unitSize,
        imageUrl: product.imageUrl,
      });

      if (response.ok) {
        setProducts(prev => prev.map(item => (
          item.id === product.id ? { ...item, price } : item
        )));
        setEditingPriceId(null);
        setIsError(false);
        setMessage(`Price for "${product.name}" updated to ${formatINR(price)}.`);
      } else {
        setIsError(true);
        setMessage(`Failed to update price for "${product.name}".`);
      }
    } catch (err) {
      console.error('Error updating product price', err);
      setIsError(true);
      setMessage('Network error while updating price.');
    } finally {
      setSavingStockId(null);
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
                <th>Product Quantity / Size</th>
                <th>Stock Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: '52px',
                            height: '52px',
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
                      <label
                        className="btn btn-secondary btn-sm"
                        style={{ cursor: savingPhotoId === product.id ? 'wait' : 'pointer', padding: '0.25rem 0.4rem' }}
                      >
                        <UploadCloud size={13} />
                        <span>{savingPhotoId === product.id ? 'Uploading...' : 'Edit Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          aria-label={`Edit photo for ${product.name}`}
                          onChange={(event) => handleUpdatePhoto(product, event)}
                          disabled={savingPhotoId === product.id}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </td>
                  <td>
                    {editingNameId === product.id && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          maxLength={255}
                          aria-label={`Product name for ${product.name}`}
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateName(product);
                            if (e.key === 'Escape') setEditingNameId(null);
                          }}
                          style={{ width: '220px' }}
                          disabled={savingNameId === product.id}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateName(product)}
                          disabled={savingNameId === product.id}
                          aria-label={`Save product name for ${product.name}`}
                        >
                          <Save size={14} />
                          <span>{savingNameId === product.id ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingNameId(null)}
                          disabled={savingNameId === product.id}
                          aria-label={`Cancel product name edit for ${product.name}`}
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                    {editingNameId !== product.id && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--text-main)' }}>
                          {product.name}
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingStockId(null);
                            setEditingPriceId(null);
                            setEditingUnitSizeId(null);
                            setEditingNameId(product.id);
                            setNameInput(product.name);
                            setMessage('');
                          }}
                          disabled={savingNameId === product.id}
                          aria-label={`Edit product name for ${product.name}`}
                        >
                          <Pencil size={14} />
                          <span>Edit Name</span>
                        </button>
                      </div>
                    )}
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
                    {editingPriceId === product.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          aria-label={`Price for ${product.name}`}
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdatePrice(product);
                            if (e.key === 'Escape') setEditingPriceId(null);
                          }}
                          style={{ width: '100px' }}
                          disabled={savingStockId === product.id}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdatePrice(product)}
                          disabled={savingStockId === product.id}
                          aria-label={`Save price for ${product.name}`}
                        >
                          <Save size={14} />
                          <span>{savingStockId === product.id ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingPriceId(null)}
                          disabled={savingStockId === product.id}
                          aria-label={`Cancel price edit for ${product.name}`}
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                          {formatINR(product.price)}
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingStockId(null);
                            setEditingUnitSizeId(null);
                            setEditingPriceId(product.id);
                            setPriceInput(String(product.price));
                            setMessage('');
                          }}
                          disabled={savingStockId === product.id}
                          aria-label={`Edit price for ${product.name}`}
                        >
                          <Pencil size={14} />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingUnitSizeId === product.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          maxLength={50}
                          aria-label={`Product quantity or size for ${product.name}`}
                          placeholder="e.g. 500gm, 1kg"
                          value={unitSizeInput}
                          onChange={(e) => setUnitSizeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateUnitSize(product);
                            if (e.key === 'Escape') setEditingUnitSizeId(null);
                          }}
                          style={{ width: '140px' }}
                          disabled={savingStockId === product.id}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateUnitSize(product)}
                          disabled={savingStockId === product.id}
                          aria-label={`Save product quantity or size for ${product.name}`}
                        >
                          <Save size={14} />
                          <span>{savingStockId === product.id ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingUnitSizeId(null)}
                          disabled={savingStockId === product.id}
                          aria-label={`Cancel product quantity or size edit for ${product.name}`}
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ color: product.unitSize ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {product.unitSize || 'Not specified'}
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingStockId(null);
                            setEditingPriceId(null);
                            setEditingUnitSizeId(product.id);
                            setUnitSizeInput(product.unitSize || '');
                            setMessage('');
                          }}
                          disabled={savingStockId === product.id}
                          aria-label={`Edit product quantity or size for ${product.name}`}
                        >
                          <Pencil size={14} />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingStockId === product.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          aria-label={`Stock quantity for ${product.name}`}
                          value={stockInput}
                          onChange={(e) => setStockInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateStock(product);
                            if (e.key === 'Escape') setEditingStockId(null);
                          }}
                          style={{ width: '90px' }}
                          disabled={savingStockId === product.id}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateStock(product)}
                          disabled={savingStockId === product.id}
                          aria-label={`Save stock quantity for ${product.name}`}
                        >
                          <Save size={14} />
                          <span>{savingStockId === product.id ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingStockId(null)}
                          disabled={savingStockId === product.id}
                          aria-label={`Cancel stock edit for ${product.name}`}
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingPriceId(null);
                            setEditingUnitSizeId(null);
                            setEditingStockId(product.id);
                            setStockInput(String(product.stockQuantity));
                            setMessage('');
                          }}
                          disabled={savingStockId === product.id}
                          aria-label={`Edit stock quantity for ${product.name}`}
                        >
                          <Pencil size={14} />
                          <span>Edit</span>
                        </button>
                      </div>
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