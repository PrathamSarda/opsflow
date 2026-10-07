import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import OwnerDashboard from './components/owner/OwnerDashboard';
import AddProduct from './components/owner/AddProduct';
import OwnerInventory from './components/owner/OwnerInventory';
import CustomerStore from './components/customer/CustomerStore';
import Cart from './components/customer/cart';
import OwnerOrders from './components/owner/OwnerOrders';
import CustomerOrders from './components/customer/CustomerOrders';
import CustomerProfile from './components/customer/CustomerProfile';

function RootRedirect() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role === 'owner_success') {
    return <Navigate to="/owner-dashboard" replace />;
  }
  return <Navigate to="/customer-store" replace />;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* Owner Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRole="owner">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner-dashboard"
                element={
                  <ProtectedRoute allowedRole="owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute allowedRole="owner">
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner-inventory"
                element={
                  <ProtectedRoute allowedRole="owner">
                    <OwnerInventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner-orders"
                element={
                  <ProtectedRoute allowedRole="owner">
                    <OwnerOrders />
                  </ProtectedRoute>
                }
              />

              {/* Customer Protected Routes */}
              <Route
                path="/customer-store"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <CustomerStore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-orders"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <CustomerOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-profile"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <CustomerProfile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;