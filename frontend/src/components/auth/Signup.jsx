import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, UserPlus, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await authApi.signup(username, password, role);
      const data = await response.text();
      
      if (response.ok) {
        setIsError(false);
        setMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200); 
      } else {
        setIsError(true);
        setMessage(data || 'Signup failed. Please try a different username.');
      }
    } catch (err) {
      console.error('Signup connection error:', err);
      setIsError(true);
      setMessage('Error connecting to backend server. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '2rem auto' }}>
      <div className="card card-hoverable" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)'
            }}
          >
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Join OpsFlow to start shopping and tracking your orders
          </p>
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

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Choose Username</label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
              />
              <input
                id="username"
                type="text"
                placeholder="e.g. john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Choose Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
              />
              <input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label>Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`btn ${role === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '0.65rem' }}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('STAFF')}
                className={`btn ${role === 'STAFF' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '0.65rem' }}
              >
                Staff / Team
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
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}