import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ElTaller from './pages/ElTaller';
import Clases from './pages/Clases';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import Socios from './pages/Socios';
import Admin from './pages/Admin';
import Reportes from './pages/Reportes';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/el-taller" element={<ElTaller />} />
              <Route path="/clases" element={<Clases />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/socios" element={<Socios />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route
                path="/reportes"
                element={
                  <AdminRoute>
                    <Reportes />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

