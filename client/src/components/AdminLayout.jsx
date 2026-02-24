import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
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
          <span className="admin-sidebar-title">Panel Admin</span>
        </div>
        <nav className="admin-sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Usuarios / Socios
          </NavLink>
          <NavLink to="/admin/maestros" className={({ isActive }) => (isActive ? 'active' : '')}>
            Maestros
          </NavLink>
          <NavLink to="/admin/clases" className={({ isActive }) => (isActive ? 'active' : '')}>
            Clases
          </NavLink>
          <NavLink to="/admin/agenda" className={({ isActive }) => (isActive ? 'active' : '')}>
            Agenda escuelas
          </NavLink>
          <NavLink to="/admin/reportes" className={({ isActive }) => (isActive ? 'active' : '')}>
            Reportes
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

export default AdminLayout;
