import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Space, Typography, Empty, Spin, Progress, Tooltip } from 'antd';
import {
  MedicineBoxOutlined,
  EyeOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import moment from 'moment';

const { Text, Title } = Typography;

const PatientTreatmentPlans = ({ patientId }) => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      fetchPlans();
    }
  }, [patientId]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPatientTreatmentPlans(patientId);
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: 'blue',
      in_progress: 'orange',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const text = {
      planned: 'مخطط',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغى',
    };
    return text[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      planned: <ClockCircleOutlined />,
      in_progress: <WarningOutlined />,
      completed: <CheckCircleOutlined />,
      cancelled: <ClockCircleOutlined />,
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  return (
    <Card
      title={
        <Space>
          <MedicineBoxOutlined />
          <span>خطط العلاج</span>
        </Space>
      }
      extra={
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => navigate('/treatment-plans')}
        >
          إضافة خطة
        </Button>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : plans.length === 0 ? (
        <Empty description="لا توجد خطط علاج" />
      ) : (
        <List
          dataSource={plans}
          renderItem={(plan) => (
            <List.Item
              actions={[
                <Tooltip title="عرض التفاصيل">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate('/treatment-plans')}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={getStatusIcon(plan.status)}
                title={
                  <Space>
                    <Text strong>{plan.title}</Text>
                    <Tag color={getStatusColor(plan.status)}>
                      {getStatusText(plan.status)}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div>
                      <Text type="secondary">التكلفة: </Text>
                      <Text strong>{plan.totalCost?.toLocaleString()} ريال</Text>
                    </div>
                    {plan.startDate && (
                      <div>
                        <Text type="secondary">
                          تاريخ البدء: {moment(plan.startDate).format('YYYY-MM-DD')}
                        </Text>
                      </div>
                    )}
                    {plan.phases && plan.phases.length > 0 && (
                      <div>
                        <Text type="secondary">عدد المراحل: {plan.phases.length}</Text>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default PatientTreatmentPlans;
