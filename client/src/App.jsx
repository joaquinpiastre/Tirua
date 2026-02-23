import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ElTaller from './pages/ElTaller';
import Clases from './pages/Clases';
import Escuelas from './pages/Escuelas';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import Socios from './pages/Socios';
import Admin from './pages/Admin';
import AdminMaestros from './pages/AdminMaestros';
import AdminClases from './pages/AdminClases';
import Reportes from './pages/Reportes';
import Maestro from './pages/Maestro';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import MaestroRoute from './components/MaestroRoute';
import './App.css';

function AdminRedirect() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');
  if (loading || !user) return null;
  if (user.rol === 'admin' && !isAdminArea && location.pathname !== '/login') {
    return <Navigate to="/admin" replace />;
  }
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      <AdminRedirect />
      {!isAdminArea && <Navbar />}
      <main className={isAdminArea ? 'main-content admin-full' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/el-taller" element={<ElTaller />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/escuelas" element={<Escuelas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/maestro" element={<MaestroRoute><Maestro /></MaestroRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Admin />} />
            <Route path="maestros" element={<AdminMaestros />} />
            <Route path="clases" element={<AdminClases />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>
          <Route path="/reportes" element={<Navigate to="/admin/reportes" replace />} />
        </Routes>
      </main>
      {!isAdminArea && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

