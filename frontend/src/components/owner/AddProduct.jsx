import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowLeft, 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  AlertCircle,
  PackageCheck,
  DollarSign,
  Layers
} from 'lucide-react';
import { productsApi } from '../../api';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stockQuantity', stockQuantity);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await productsApi.add(formData);

      if (response.ok) {
        setIsError(false);
        setMessage('Product created and published to storefront successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setStockQuantity('');
        removeImage();
      } else {
        setIsError(true);
        setMessage('Failed to create product. Please verify fields and backend status.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
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
            onClick={() => navigate('/owner-inventory')} 
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '0.5rem', paddingLeft: 0 }}
          >
            <ArrowLeft size={16} />
            <span>Back to Inventory</span>
          </button>
          <h1 style={{ fontSize: '1.85rem', margin: 0 }}>Create New Product</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
            List a new product item in the OpsFlow catalog
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/owner-inventory')} 
            className="btn btn-secondary"
          >
            View All Products
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
          {isError ? (
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          )}
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleAddProduct}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.75rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Product Details */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Product Details</h3>
            
            <div className="form-group">
              <label htmlFor="pname">Product Name *</label>
              <input
                id="pname"
                type="text"
                placeholder="e.g. Ergonomic Mechanical Keyboard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pdesc">Description *</label>
              <textarea
                id="pdesc"
                placeholder="Highlight key specs, features, and dimensions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="pprice">Price ($) *</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign 
                    size={16} 
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
                  />
                  <input
                    id="pprice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="29.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pstock">Stock Quantity *</label>
                <div style={{ position: 'relative' }}>
                  <Layers 
                    size={16} 
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
                  />
                  <input
                    id="pstock"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Media Upload */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Product Visual Media</h3>
            
            <div 
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: 'var(--bg-subtle)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg, .jpeg, .png, .webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxHeight: '220px',
                      maxWidth: '100%',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'contain',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      background: 'var(--danger)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <UploadCloud size={26} />
                  </div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Upload Product Photo</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                    Click or drag & drop JPG, PNG or WebP image
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <ImageIcon size={16} />
                    <span>Choose File</span>
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <span>Publishing Product...</span>
                ) : (
                  <>
                    <PackageCheck size={20} />
                    <span>Publish Product to Store</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}