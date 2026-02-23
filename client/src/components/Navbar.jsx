import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/Logo.jpg" alt="Tirùa Logo" className="logo-image" />
          <span className="logo-text">Tirùa</span>
        </Link>
        
        <ul className="navbar-menu">
          <li><Link to="/">INICIO</Link></li>
          <li><Link to="/el-taller">EL TALLER</Link></li>
          <li><Link to="/clases">CLASES</Link></li>
          <li><Link to="/escuelas">ESCUELAS</Link></li>
          {isAuthenticated && user?.rol === 'socio' && (
            <li><Link to="/socios">SOCIOS</Link></li>
          )}
          {isAuthenticated && user?.rol === 'maestro' && (
            <li><Link to="/maestro">MIS CLASES</Link></li>
          )}
          <li><Link to="/contacto">CONTACTO</Link></li>
          {isAuthenticated ? (
            <li className="navbar-user">
              <span className="user-name">{user?.nombre}</span>
              <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
            </li>
          ) : (
            <li><Link to="/login" className="btn-login">INICIAR SESIÓN</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;



