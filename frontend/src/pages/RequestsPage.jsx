import { Button, Card, Tag, Typography } from 'antd';
import DataTable from '../components/DataTable.jsx';
import { useGetRequestsQuery } from '../store/api/appApi.js';

const { Title } = Typography;
const statuses = ['Новая', 'В работе', 'Выполнена'];

const columns = [
  { title: 'Номер', dataIndex: 'number', width: 95, ellipsis: true, sorter: (a, b) => a.number.localeCompare(b.number) },
  { title: 'Оборудование', dataIndex: 'equipment', width: 110, ellipsis: true },
  { title: 'Тип заявки', dataIndex: 'type', ellipsis: true, filters: ['Плановое обслуживание', 'Неисправность датчика', 'Осмотр конструкции'].map((value) => ({ text: value, value })), onFilter: (value, record) => record.type === value },
  { title: 'Дата', dataIndex: 'date', width: 100, ellipsis: true },
  { title: 'Статус', dataIndex: 'status', width: 105, filters: statuses.map((value) => ({ text: value, value })), onFilter: (value, record) => record.status === value, render: (status) => <Tag color={{ Новая: 'blue', 'В работе': 'gold', Выполнена: 'green' }[status]}>{status}</Tag> },
  { title: '', key: 'action', width: 72, render: () => <Button type="link" size="small" style={{ padding: 0 }}>Открыть</Button> },
];

export default function RequestsPage() {
  const { data = [], isLoading } = useGetRequestsQuery();
  return (
    <div style={{ width: '100%' }}>
      <Title level={4} style={{ margin: '0 40px 12px' }}>Заявки</Title>
      <Card size="small" styles={{ body: { padding: 12 } }}><DataTable columns={columns} dataSource={data} loading={isLoading} searchPlaceholder="Поиск заявок..." /></Card>
    </div>
  );
}
