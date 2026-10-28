import { Card, Tag, Typography } from 'antd';
import DataTable from '../components/DataTable.jsx';
import { useGetEquipmentQuery } from '../store/api/appApi.js';

const { Title } = Typography;

const columns = [
  { title: 'Оборудование', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: 'Модель', dataIndex: 'model' },
  { title: 'Площадка', dataIndex: 'location' },
  { title: 'Мощность', dataIndex: 'power' },
  { title: 'Статус', dataIndex: 'status', filters: [{ text: 'В работе', value: 'В работе' }, { text: 'На обслуживании', value: 'На обслуживании' }], onFilter: (value, record) => record.status === value, render: (status) => <Tag color={status === 'В работе' ? 'green' : 'orange'}>{status}</Tag> },
];

export default function EquipmentPage() {
  const { data = [], isLoading } = useGetEquipmentQuery();
  return (
    <section>
      <div style={{ width: '100%' }}>
        <Title level={4} style={{ margin: '0 40px 12px' }}>Оборудование</Title>
        <Card size="small" styles={{ body: { padding: 12 } }}><DataTable columns={columns} dataSource={data} loading={isLoading} searchPlaceholder="Поиск оборудования..." /></Card>
      </div>
    </section>
  );
}
