import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined,
  FireTwoTone,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice.js';
import { ROLE_LABELS, USER_ROLES } from '../auth/roles.js';
import cl from './classes.module.scss';

const { Header, Sider, Content } = Layout;

const navigation = [
  { key: '/', icon: <DashboardOutlined />, label: 'Главная' },
  { key: '/equipment', icon: <DeploymentUnitOutlined />, label: 'Оборудование' },
  { key: '/requests', icon: <FileTextOutlined />, label: 'Заявки' },
  {
    key: '/users',
    icon: <TeamOutlined />,
    label: 'Пользователи',
    roles: [USER_ROLES.duty, USER_ROLES.director],
  },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const visibleNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login', { replace: true });
  };

  return (
    <Layout className={cl.app_layout}>
      <Sider breakpoint="lg" collapsedWidth="0" className={cl.sidebar} width={240}>
        <div className={cl.brand}><FireTwoTone/>  ЦРП</div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          items={visibleNavigation}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className={cl.appHeader}>
          <span style={{ marginRight: 12 }}>{ROLE_LABELS[role] || 'Пользователь'}</span>
          <Button icon={<LogoutOutlined />} size="small" onClick={handleLogout}>Выйти</Button>
        </Header>
        <Content className={cl.pageContent}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
