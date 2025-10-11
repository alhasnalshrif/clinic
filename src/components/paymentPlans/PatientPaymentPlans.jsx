import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Space, Typography, Empty, Spin, Progress, Tooltip } from 'antd';
import {
  CreditCardOutlined,
  EyeOutlined,
  PlusOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import moment from 'moment';

const { Text } = Typography;

const PatientPaymentPlans = ({ patientId }) => {
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
      const response = await apiService.getPatientPaymentPlans(patientId);
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'blue',
      completed: 'green',
      cancelled: 'red',
      overdue: 'orange',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const text = {
      active: 'نشط',
      completed: 'مكتمل',
      cancelled: 'ملغى',
      overdue: 'متأخر',
    };
    return text[status] || status;
  };

  return (
    <Card
      title={
        <Space>
          <CreditCardOutlined />
          <span>خطط الدفع</span>
        </Space>
      }
      extra={
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => navigate('/payment-plans')}
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
        <Empty description="لا توجد خطط دفع" />
      ) : (
        <List
          dataSource={plans}
          renderItem={(plan) => {
            const percentage = Math.round((plan.paidAmount / plan.totalAmount) * 100);
            return (
              <List.Item
                actions={[
                  <Tooltip title="عرض التفاصيل">
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => navigate('/payment-plans')}
                    />
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={<DollarOutlined style={{ fontSize: '24px' }} />}
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
                        <Text type="secondary">المبلغ الإجمالي: </Text>
                        <Text strong>{plan.totalAmount?.toLocaleString()} ريال</Text>
                      </div>
                      <div>
                        <Text type="secondary">المدفوع: </Text>
                        <Text style={{ color: '#52c41a' }}>
                          {plan.paidAmount?.toLocaleString()} ريال
                        </Text>
                        {' | '}
                        <Text type="secondary">المتبقي: </Text>
                        <Text style={{ color: '#fa8c16' }}>
                          {plan.remainingAmount?.toLocaleString()} ريال
                        </Text>
                      </div>
                      <Progress
                        percent={percentage}
                        size="small"
                        style={{ marginTop: '8px' }}
                      />
                      <div>
                        <Text type="secondary">
                          عدد الأقساط: {plan.numberOfInstallments}
                        </Text>
                        {plan.nextDueDate && (
                          <>
                            {' | '}
                            <Text type="secondary">
                              القسط التالي: {moment(plan.nextDueDate).format('YYYY-MM-DD')}
                            </Text>
                          </>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};

export default PatientPaymentPlans;
