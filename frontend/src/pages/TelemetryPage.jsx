import { Card, Tag, Typography } from 'antd';
import DataTable from '../components/DataTable.jsx';
import { useGetTelemetryQuery } from '../store/api/appApi.js';

const { Title } = Typography;
const columns = [
  { title: 'Время', dataIndex: 'time', width: 125, ellipsis: true },
  { title: 'Оборудование', dataIndex: 'equipment', width: 115, ellipsis: true },
  { title: 'Сигнал', dataIndex: 'signal', ellipsis: true },
  { title: 'Значение', dataIndex: 'value', width: 90, ellipsis: true },
  { title: 'Уровень', dataIndex: 'level', width: 120, render: (level) => <Tag color={{ Информация: 'default', Предупреждение: 'gold', Критическое: 'red' }[level]}>{level}</Tag> },
];

export default function TelemetryPage() {
  const { data = [], isLoading } = useGetTelemetryQuery();
  return (
    <div style={{ width: '100%' }}>
      <Title level={4} style={{ margin: '0 0 12px' }}>Телеметрия</Title>
      <Card size="small" styles={{ body: { padding: 12 } }}>
        <DataTable columns={columns} dataSource={data} loading={isLoading} searchPlaceholder="Поиск телеметрии..." />
      </Card>
    </div>
  );
}
