import React, { useState, useCallback } from "react";
import {
  Modal,
  message,
  Button,
  Table,
  Typography,
  Tag,
  Space,
  Tooltip,
  Empty
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from "moment";
import { apiService } from '../../services/api';

const { Text } = Typography;

function AppointmentsTable({ data = [], onRefresh }) {
  const [loading, setLoading] = useState(false);

  const handleConfirmAppointment = useCallback(async (record) => {
    const patientName = record.patient?.name || 'المريض';
    Modal.confirm({
      title: 'تأكيد الموعد',
      content: `هل أنت متأكد من تأكيد موعد ${patientName}؟`,
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.updateAppointment(record.id, { status: 'confirmed' });
          message.success('تم تأكيد الموعد بنجاح');
          onRefresh?.();
        } catch (error) {
          console.error('Error confirming appointment:', error);
          message.error('فشل في تأكيد الموعد');
        } finally {
          setLoading(false);
        }
      },
    });
  }, [onRefresh]);

  const handleCancelAppointment = useCallback(async (record) => {
    const patientName = record.patient?.name || 'المريض';
    Modal.confirm({
      title: 'إلغاء الموعد',
      content: `هل أنت متأكد من إلغاء موعد ${patientName}؟`,
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.cancelAppointment(record.id);
          message.success('تم إلغاء الموعد بنجاح');
          onRefresh?.();
        } catch (error) {
          console.error('Error canceling appointment:', error);
          message.error('فشل في إلغاء الموعد');
        } finally {
          setLoading(false);
        }
      },
    });
  }, [onRefresh]);

  const getStatusTag = (status) => {
    const statusConfig = {
      'pending': { color: 'orange', text: 'في الانتظار' },
      'confirmed': { color: 'green', text: 'مؤكد' },
      'completed': { color: 'blue', text: 'مكتمل' },
      'cancelled': { color: 'red', text: 'ملغى' },
      'في الانتظار': { color: 'orange', text: 'في الانتظار' },
    };
    
    const config = statusConfig[status] || { color: 'default', text: status || 'غير محدد' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: <Text strong>اسم المريض</Text>,
      dataIndex: 'patient',
      key: 'patient',
      render: (patient, record) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <UserOutlined style={{ color: 'var(--primary-color)' }} />
            <Text strong>{patient?.name || 'غير محدد'}</Text>
          </Space>
          {patient?.phone && (
            <Space size="small">
              <PhoneOutlined style={{ color: 'var(--text-secondary)' }} />
              <Text type="secondary">{patient.phone}</Text>
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: <Text strong>التاريخ والوقت</Text>,
      key: 'datetime',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <CalendarOutlined style={{ color: 'var(--info-color)' }} />
            <Text>{moment(record.date).format('DD/MM/YYYY')}</Text>
          </Space>
          <Space size="small">
            <ClockCircleOutlined style={{ color: 'var(--secondary-color)' }} />
            <Text>{record.time || '12:00 AM'}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: <Text strong>سبب الزيارة</Text>,
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => <Text>{reason || 'فحص عام'}</Text>,
    },
    {
      title: <Text strong>الحالة</Text>,
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'في الانتظار', value: 'pending' },
        { text: 'مؤكد', value: 'confirmed' },
        { text: 'مكتمل', value: 'completed' },
        { text: 'ملغى', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => getStatusTag(status),
    },
    {
      title: <Text strong>الإجراءات</Text>,
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="عرض التفاصيل">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => console.log('View details:', record)}
            />
          </Tooltip>
          <Tooltip title="طباعة">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              size="small"
              onClick={() => console.log('Print appointment:', record)}
            />
          </Tooltip>
          {record.status !== 'completed' && record.status !== 'cancelled' && (
            <Tooltip title="تأكيد الموعد">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                size="small"
                style={{ color: 'var(--success-color)' }}
                onClick={() => handleConfirmAppointment(record)}
                loading={loading}
              />
            </Tooltip>
          )}
          {record.status !== 'completed' && record.status !== 'cancelled' && (
            <Tooltip title="إلغاء الموعد">
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                size="small"
                style={{ color: 'var(--error-color)' }}
                onClick={() => handleCancelAppointment(record)}
                loading={loading}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="clinic-table-container">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="empty-state">
                  <CalendarOutlined className="empty-state-icon" />
                  <div className="empty-state-title">لا توجد مواعيد</div>
                  <div className="empty-state-description">
                    لم يتم العثور على أي مواعيد مجدولة
                  </div>
                </div>
              }
            />
          )
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} من أصل ${total} موعد`
        }}
        scroll={{ x: 800 }}
        size="small"
      />
    </div>
  );
}

export default AppointmentsTable;