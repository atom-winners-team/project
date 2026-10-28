import { Button, Card, Tag, Typography } from 'antd';
import DataTable from '../components/DataTable.jsx';
import { useGetUsersQuery } from '../store/api/appApi.js';

const { Title } = Typography;
const roles = ['Администратор', 'Инженер', 'Оператор'];

const columns = [
  { title: 'Имя', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Роль', dataIndex: 'role', filters: roles.map((value) => ({ text: value, value })), onFilter: (value, record) => record.role === value },
  { title: 'Статус', dataIndex: 'status', filters: [{ text: 'Активен', value: 'Активен' }, { text: 'Заблокирован', value: 'Заблокирован' }], onFilter: (value, record) => record.status === value, render: (status) => <Tag color={status === 'Активен' ? 'green' : 'red'}>{status}</Tag> },
  { title: 'Действие', key: 'action', render: () => <Button type="link">Изменить</Button> },
];

export default function UsersPage() {
  const { data = [], isLoading } = useGetUsersQuery();
  return (
    <div style={{ width: '100%' }}>
      <Title level={4} style={{ margin: '0 40px 12px' }}>Пользователи</Title>
      <Card size="small" styles={{ body: { padding: 12 } }}><DataTable columns={columns} dataSource={data} loading={isLoading} searchPlaceholder="Поиск пользователей..." /></Card>
    </div>
  );
}
