import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../store/api/appApi.js';
import { setCredentials } from '../../store/slices/authSlice.js';
import '../login/LoginPage.scss';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const session = await register(values).unwrap();
      dispatch(setCredentials(session));
      messageApi.success('Регистрация выполнена');
      navigate('/', { replace: true });
    } catch (error) {
      messageApi.error(error?.error || error?.message || 'Не удалось зарегистрироваться');
    }
  };

  return (
    <main className="login-page">
      {contextHolder}
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>Регистрация</Title>
          <Text type="secondary">Создайте аккаунт для работы в системе</Text>
        </div>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item label="Логин" name="login" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input prefix={<UserOutlined />} placeholder="Введите логин" autoComplete="username" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 8, message: 'Минимум 8 символов' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Введите пароль" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Повторите пароль"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Повторите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue('password') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Повторите пароль" autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>Зарегистрироваться</Button>
          <Button type="link" block style={{ marginTop: 8, fontSize:'12px' }} onClick={() => navigate('/login')}>
            Уже есть аккаунт? Войти
          </Button>
        </Form>
      </Card>
      <Text className="login-copyright">© 2026 ЦРП. Все права защищены.</Text>
    </main>
  );
}
