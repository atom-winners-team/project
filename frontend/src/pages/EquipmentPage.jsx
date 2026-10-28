import { useState } from 'react';
import { Alert, Button, Card, Descriptions, Modal, Table, Typography } from 'antd';
import DataTable from '../components/DataTable.jsx';
import {
  useGetEquipmentByIdQuery,
  useGetEquipmentHistoryQuery,
  useGetEquipmentQuery,
  useGetUnmatchedEquipmentHistoryQuery,
} from '../store/api/appApi.js';

const { Title } = Typography;

const historyColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: 'ID загрузки', dataIndex: 'loadingIdKey', render: (value) => value || '—' },
  { title: 'Несопоставлено', dataIndex: 'isUnmatched', render: (value) => value ? 'Да' : 'Нет' },
];

export default function EquipmentPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [showUnmatched, setShowUnmatched] = useState(false);
  const { data = [], isLoading, error } = useGetEquipmentQuery();
  const { data: selectedEquipment, isFetching: isEquipmentLoading } =
    useGetEquipmentByIdQuery({ id: selectedId }, { skip: selectedId === null });
  const { data: history = [], isFetching: isHistoryLoading } =
    useGetEquipmentHistoryQuery({ id: selectedId }, { skip: selectedId === null });
  const {
    data: unmatchedHistory = [],
    isFetching: isUnmatchedLoading,
    error: unmatchedError,
  } = useGetUnmatchedEquipmentHistoryQuery(undefined, { skip: !showUnmatched });

  const columns = [
    { title: 'Оборудование', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'ID загрузки', dataIndex: 'loadingId', render: (value) => value || '—' },
    { title: 'Инвентарный номер', dataIndex: 'inventoryNumber' },
    { title: 'Типовой ОР', dataIndex: 'typicalRepair' },
    { title: 'Введено в эксплуатацию', dataIndex: 'commissionedAt' },
    {
      title: '',
      key: 'actions',
      render: (_, item) => (
        <Button type="link" onClick={() => setSelectedId(item.id)}>
          История
        </Button>
      ),
    },
  ];

  const unmatchedRows = unmatchedHistory.map((item) => ({ ...item, key: item.id }));

  return (
    <section>
      <Title level={4}>Оборудование</Title>
      {error && <Alert type="error" showIcon message={error.error || 'Не удалось загрузить оборудование'} style={{ marginBottom: 12 }} />}
      <Card size="small" styles={{ body: { padding: 12 } }}>
        <DataTable columns={columns} dataSource={data} loading={isLoading} searchPlaceholder="Поиск оборудования..." />
      </Card>

      <Card
        size="small"
        title="Несопоставленная история"
        style={{ marginTop: 16 }}
        extra={
          <Button onClick={() => setShowUnmatched((visible) => !visible)}>
            {showUnmatched ? 'Скрыть' : 'Показать'}
          </Button>
        }
      >
        {showUnmatched && (
          <>
            {unmatchedError && <Alert type="error" showIcon message={unmatchedError.error || 'Не удалось загрузить историю'} />}
            <Table
              rowKey="id"
              size="small"
              loading={isUnmatchedLoading}
              columns={historyColumns}
              dataSource={unmatchedRows}
              pagination={{ pageSize: 8, size: 'small' }}
            />
          </>
        )}
      </Card>

      <Modal
        title="Оборудование и история"
        open={selectedId !== null}
        onCancel={() => setSelectedId(null)}
        footer={null}
        width={760}
      >
        {isEquipmentLoading ? (
          <div>Загрузка...</div>
        ) : selectedEquipment ? (
          <>
            <Descriptions
              size="small"
              column={2}
              items={[
                { key: 'name', label: 'Наименование', children: selectedEquipment.name },
                { key: 'loadingId', label: 'ID загрузки', children: selectedEquipment.loadingId || '—' },
                { key: 'inventory', label: 'Инвентарный номер', children: selectedEquipment.inventoryNumber || '—' },
                { key: 'typicalRepair', label: 'Типовой ОР', children: selectedEquipment.typicalRepair || '—' },
                { key: 'commissioned', label: 'Дата ввода', children: selectedEquipment.commissionedAt || '—' },
                { key: 'manufactured', label: 'Дата выпуска', children: selectedEquipment.manufacturedAt || '—' },
              ]}
            />
            <Title level={5}>История</Title>
            <Table
              rowKey="id"
              size="small"
              loading={isHistoryLoading}
              columns={historyColumns}
              dataSource={history}
              pagination={{ pageSize: 5, size: 'small' }}
            />
          </>
        ) : (
          <Alert type="error" showIcon message="Не удалось загрузить оборудование" />
        )}
      </Modal>
    </section>
  );
}
