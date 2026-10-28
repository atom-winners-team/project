import { Card, Col, Row, Statistic, Typography } from 'antd';
import { DeploymentUnitOutlined, FileTextOutlined, WarningOutlined } from '@ant-design/icons';
import { useGetDashboardQuery } from '../../store/api/appApi.js';

const { Title } = Typography;

export default function DashboardPage() {
  const { data = { equipment: 0, activeRequests: 0, incidents: 0 }, isLoading } = useGetDashboardQuery();
  return (
    <section>
      <Title level={4} style={{ margin: '0 40px 12px' }}>Главная</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card loading={isLoading}><Statistic title="Оборудование" value={data.equipment} prefix={<DeploymentUnitOutlined />} /></Card>
        </Col>
        <Col xs={24} md={8}>
          <Card><Statistic title="Активные заявки" value={data.activeRequests} prefix={<FileTextOutlined />} /></Card>
        </Col>
        <Col xs={24} md={8}>
          <Card><Statistic title="Аварии" value={data.incidents} prefix={<WarningOutlined />} valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
      </Row>
    </section>
  );
}
