import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ShoppingBag, AlertCircle } from 'lucide-react';
import { authApi } from '../../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authApi.login(username, password);
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', username);

        if (data.role === 'owner_success') {
          navigate('/owner-dashboard');
        } else {
          navigate('/customer-store');
        }
      } else {
        setMessage(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setMessage('Cannot connect to backend server. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'owner') {
      setUsername('owner');
      setPassword('admin123');
    } else {
      setUsername('alice');
      setPassword('password123');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div className="card card-hoverable" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Enter your credentials to access OpsFlow
          </p>
        </div>

        {/* Demo Quick-Fill Bar */}
        <div style={{
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            ⚡ Quick Demo Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('owner')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
            >
              <ShieldCheck size={14} color="#4f46e5" />
              <span>Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('customer')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
            >
              <ShoppingBag size={14} color="#10b981" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
              />
              <input
                id="username"
                type="text"
                placeholder="e.g. owner or alice"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '0.25rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginBottom: '1.25rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 700 }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}