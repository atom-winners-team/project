import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  message,
} from 'antd';
import DataTable from '../components/DataTable.jsx';
import { hasRole, USER_ROLES } from '../auth/roles.js';
import {
  useAssignRequestMutation,
  useChangeRequestStatusMutation,
  useCreateRequestMutation,
  useGetEquipmentQuery,
  useGetRequestQuery,
  useGetRequestsQuery,
  useGetUsersQuery,
  useUpdateRequestMutation,
} from '../store/api/appApi.js';

const { Title } = Typography;

const statusOptions = [
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'waiting_parts', label: 'Ожидает детали' },
  { value: 'done', label: 'Выполнена' },
  { value: 'rejected', label: 'Отклонена' },
];

const typeOptions = [
  { value: 'inspection', label: 'Осмотр' },
  { value: 'repair', label: 'Ремонт' },
];

const errorText = (error, fallback) => error?.error || error?.message || fallback;

export default function RequestsPage() {
  const role = useSelector((state) => state.auth.user?.role);
  const canManageRequests = hasRole(role, USER_ROLES.duty, USER_ROLES.director);
  const canAssignRequests = canManageRequests;
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data: requests = [], isLoading, error } = useGetRequestsQuery();
  const { data: equipment = [] } = useGetEquipmentQuery();
  const { data: users = [] } = useGetUsersQuery(undefined, {
    skip: !canAssignRequests,
  });
  const { currentData: editingRequest, isFetching: isRequestLoading } =
    useGetRequestQuery({ id: editingId }, { skip: editingId === null });

  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();
  const [assignRequest] = useAssignRequestMutation();
  const [changeRequestStatus] = useChangeRequestStatusMutation();

  useEffect(() => {
    if (editingRequest) {
      editForm.setFieldsValue({
        type: editingRequest.typeValue,
        equipment_ref_id: editingRequest.equipment_ref_id,
        description: editingRequest.description,
      });
    }
  }, [editForm, editingRequest]);

  const equipmentNames = new Map(equipment.map((item) => [item.id, item.name]));
  const requestColumns = [
    { title: 'Номер', dataIndex: 'number', width: 110, ellipsis: true },
    {
      title: 'Оборудование',
      dataIndex: 'equipmentRefId',
      render: (id) => (id ? equipmentNames.get(id) || `ID ${id}` : '—'),
    },
    { title: 'Тип', dataIndex: 'type', width: 100 },
    { title: 'Описание', dataIndex: 'description', ellipsis: true, render: (value) => value || '—' },
    { title: 'Дата', dataIndex: 'date', width: 105 },
    {
      title: 'Статус',
      dataIndex: 'statusValue',
      width: 175,
      render: (status, request) => (
        <Select
          size="small"
          value={status}
          options={statusOptions}
          style={{ width: '100%' }}
          onChange={async (value) => {
            try {
              await changeRequestStatus({ id: request.id, status: value }).unwrap();
            } catch (mutationError) {
              messageApi.error(errorText(mutationError, 'Не удалось изменить статус'));
            }
          }}
        />
      ),
    },
    ...(canAssignRequests ? [{
      title: 'Исполнитель',
      dataIndex: 'assigneeId',
      width: 180,
      render: (assigneeId, request) => (
        <Select
          size="small"
          allowClear
          placeholder="Не назначен"
          value={assigneeId ?? undefined}
          options={users
            .filter((user) => user.roleValue === USER_ROLES.engineer)
            .map((user) => ({ value: user.id, label: user.name }))}
          style={{ width: '100%' }}
          onChange={async (value) => {
            try {
              await assignRequest({ id: request.id, assigneeId: value ?? null }).unwrap();
            } catch (mutationError) {
              messageApi.error(errorText(mutationError, 'Не удалось назначить исполнителя'));
            }
          }}
        />
      ),
    }] : []),
    ...(canManageRequests ? [{
      title: '',
      key: 'actions',
      width: 90,
      render: (_, request) => (
        <Button type="link" onClick={() => setEditingId(request.id)}>
          Изменить
        </Button>
      ),
    }] : []),
  ];

  const submitCreate = async (values) => {
    try {
      await createRequest({
        ...values,
        equipment_ref_id: values.equipment_ref_id ?? null,
      }).unwrap();
      form.resetFields();
      setCreateOpen(false);
      messageApi.success('Заявка создана');
    } catch (mutationError) {
      messageApi.error(errorText(mutationError, 'Не удалось создать заявку'));
    }
  };

  const submitUpdate = async (values) => {
    try {
      await updateRequest({
        id: editingId,
        data: {
          ...values,
          equipment_ref_id: values.equipment_ref_id ?? null,
        },
      }).unwrap();
      setEditingId(null);
      messageApi.success('Заявка обновлена');
    } catch (mutationError) {
      messageApi.error(errorText(mutationError, 'Не удалось изменить заявку'));
    }
  };

  const equipmentOptions = equipment
    .filter((item) => !item.isContextOnly)
    .map((item) => ({ value: item.id, label: `${item.name} (ID ${item.id})` }));

  return (
    <section>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Title level={4} style={{ margin: 0 }}>Заявки</Title>
        {canManageRequests && (
          <Button type="primary" onClick={() => setCreateOpen(true)}>Создать заявку</Button>
        )}
      </div>
      {error && <Alert type="error" showIcon message={errorText(error, 'Не удалось загрузить заявки')} style={{ marginBottom: 12 }} />}
      <Card size="small" styles={{ body: { padding: 12 } }}>
        <DataTable
          columns={requestColumns}
          dataSource={requests}
          loading={isLoading}
          searchPlaceholder="Поиск заявок..."
        />
      </Card>

      {canManageRequests && <Modal
        title="Новая заявка"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submitCreate}>
          <Form.Item name="type" label="Тип заявки" rules={[{ required: true, message: 'Выберите тип' }]}>
            <Select options={typeOptions} placeholder="Выберите тип" />
          </Form.Item>
          <Form.Item name="equipment_ref_id" label="Оборудование">
            <Select allowClear showSearch optionFilterProp="label" options={equipmentOptions} placeholder="Выберите оборудование" />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>}

      {canManageRequests && <Modal
        title="Изменить заявку"
        open={editingId !== null}
        onCancel={() => setEditingId(null)}
        onOk={() => editForm.submit()}
        confirmLoading={isUpdating || isRequestLoading}
        destroyOnHidden
      >
        {editingRequest && (
          <Form form={editForm} layout="vertical" onFinish={submitUpdate}>
            <Form.Item name="type" label="Тип заявки" rules={[{ required: true, message: 'Выберите тип' }]}>
              <Select options={typeOptions} />
            </Form.Item>
            <Form.Item name="equipment_ref_id" label="Оборудование">
              <Select allowClear showSearch optionFilterProp="label" options={equipmentOptions} />
            </Form.Item>
            <Form.Item name="description" label="Описание">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>}
    </section>
  );
}
