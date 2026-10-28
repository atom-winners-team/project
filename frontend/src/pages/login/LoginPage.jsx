
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/appApi.js';
import { setCredentials } from '../../store/slices/authSlice.js';
import './LoginPage.scss';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const session = await login(values).unwrap();
      dispatch(setCredentials(session));
      navigate(location.state?.from?.pathname || '/', { replace: true });
      messageApi.success('Вход выполнен');
    } catch (error) {
      messageApi.error(error?.error || error?.message || 'Не удалось войти');
    }
  };

  return (
    <main className="login-page">
      {contextHolder}
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>С возвращением!</Title>
          <Text type="secondary">Войдите в свой аккаунт, чтобы продолжить</Text>
        </div>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item label="Логин" name="login" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input prefix={<UserOutlined />} placeholder="Введите логин" autoComplete="username" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 8, message: 'Минимум 8 символов' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Введите пароль" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>Войти</Button>
          <Button style={{fontSize:'12px'}} type="link" block onClick={() => navigate('/register')}>
            Нет аккаунта? Зарегистрироваться
          </Button>
        </Form>
      </Card>
      <Text className="login-copyright">© 2026 ЦРП. Все права защищены.</Text>
    </main>
  );
}
