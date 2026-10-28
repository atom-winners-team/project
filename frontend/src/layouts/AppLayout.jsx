import { NavLink, Outlet } from 'react-router-dom';
import cl from './classes.module.scss'

const navigation = [
  { to: '/', label: 'Главная' },
  { to: '/equipment', label: 'Оборудование' },
  { to: '/requests', label: 'Заявки' },
  { to: '/telemetry', label: 'Телеметрия' },
  { to: '/users', label: 'Пользователи' },
];

export default function AppLayout() {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.assign('/login');
  };

  return (
    <div className={cl.app_layout}>
      <aside className={cl.sidebar}>
        <div className={cl.brand}>Rosatom</div>
        <nav>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => isActive ? `${cl.nav_link} ${cl.active}` : cl.nav_link}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={cl.mainContent}>
        <header className={cl.appHeader}>
          <span>Система управления ВЭУ</span>
          <button type="button" onClick={handleLogout}>Выйти</button>
        </header>
        <div className={cl.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
