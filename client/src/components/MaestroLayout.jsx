import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const MaestroLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-title">Panel Profe</span>
        </div>
        <nav className="admin-sidebar-nav">
          <NavLink to="/maestro" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Mis clases
          </NavLink>
          <NavLink to="/maestro/agenda" className={({ isActive }) => (isActive ? 'active' : '')}>
            Agenda escuelas
          </NavLink>
          <NavLink to="/maestro/alumnos" className={({ isActive }) => (isActive ? 'active' : '')}>
            Alumnos
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <span className="admin-user-name">{user?.nombre} {user?.apellido}</span>
          <button type="button" onClick={handleLogout} className="admin-btn-logout">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="admin-layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default MaestroLayout;

