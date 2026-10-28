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
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice.js';
import cl from './classes.module.scss';

const { Header, Sider, Content } = Layout;

const navigation = [
  { key: '/', icon: <DashboardOutlined />, label: 'Главная' },
  { key: '/equipment', icon: <DeploymentUnitOutlined />, label: 'Оборудование' },
  { key: '/requests', icon: <FileTextOutlined />, label: 'Заявки' },
  { key: '/users', icon: <TeamOutlined />, label: 'Пользователи' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
          items={navigation}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className={cl.appHeader}>
          <Button icon={<LogoutOutlined />} size="small" onClick={handleLogout}>Выйти</Button>
        </Header>
        <Content className={cl.pageContent}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
