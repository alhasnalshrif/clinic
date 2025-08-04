import React, { useState, useCallback, useMemo } from "react";
import {
  Modal,
  message,
  Button,
  Table,
  Row,
  Col,
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
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from "moment";
import { apiService } from '../../services/api';
import { formatDate, formatTime, isToday, isPast, getStatusConfig } from '../../utils/helpers';
import { APPOINTMENT_STATUS } from '../../utils/constants';

const { Text } = Typography;

function AppointmentsTable({ appointments = [], onRefresh }) {
  const [loading, setLoading] = useState(false);

  const handleConfirmAppointment = useCallback(async (record) => {
    Modal.confirm({
      title: 'تأكيد الموعد',
      content: `هل أنت متأكد من تأكيد موعد ${record.patient}؟`,
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.updateAppointment(record.id, { status: APPOINTMENT_STATUS.CONFIRMED });
          message.success('تم تأكيد الموعد بنجاح');
          onRefresh?.();
        } catch (error) {
          console.error('Error confirming appointment:', error);
          message.error('فشل في تأكيد الموعد');
        } finally {
          setLoading(false);
        }
      }
    });
  }, [onRefresh]);

  const handleCancelAppointment = useCallback(async (record) => {
    Modal.confirm({
      title: 'إلغاء الموعد',
      content: `هل أنت متأكد من إلغاء موعد ${record.patient}؟`,
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.updateAppointment(record.id, { status: APPOINTMENT_STATUS.CANCELLED });
          message.success('تم إلغاء الموعد بنجاح');
          onRefresh?.();
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          message.error('فشل في إلغاء الموعد');
        } finally {
          setLoading(false);
        }
      }
    });
  }, [onRefresh]);

  const handleViewAppointment = useCallback((record) => {
    Modal.info({
      title: `تفاصيل الموعد - ${record.patient}`,
      content: (
        <div style={{ marginTop: 20 }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>اسم المريض: </Text>
              <Text>{record.patient}</Text>
            </Col>
            <Col span={12}>
              <Text strong>التاريخ: </Text>
              <Text>{formatDate(record.date)}</Text>
            </Col>
            <Col span={12}>
              <Text strong>الوقت: </Text>
              <Text>{formatTime(record.date)}</Text>
            </Col>
            <Col span={12}>
              <Text strong>الحالة: </Text>
              <Text>{getStatusConfig(record.status).text}</Text>
            </Col>
            <Col span={24}>
              <Text strong>سبب الزيارة: </Text>
              <Text>{record.reason || 'فحص عام'}</Text>
            </Col>
          </Row>
        </div>
      ),
      width: 600,
    });
  }, []);

  const handleEditAppointment = useCallback((record) => {
    console.log('تعديل الموعد:', record);
    message.info('سيتم إضافة نافذة تعديل الموعد قريباً');
  }, []);

  const handlePrintAppointment = useCallback((record) => {
    console.log('طباعة الموعد:', record);
    message.info('سيتم طباعة تفاصيل الموعد');
  }, []);
  const columns = useMemo(() => [
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>اسم المريض</Text>,
      dataIndex: "patient",
      key: "patient",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: 'var(--text-primary)' }}>
            <UserOutlined style={{ marginLeft: 8, color: 'var(--primary-color)' }} />
            {record.patient || 'غير محدد'}
          </Text>
          {record.phone && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <PhoneOutlined style={{ marginLeft: 4 }} />
              {record.phone}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>التاريخ والوقت</Text>,
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        const date = formatDate(record.date);
        const time = formatTime(record.date);
        const isAppointmentToday = isToday(record.date);
        const isAppointmentPast = isPast(record.date);
        
        return (
          <Space direction="vertical" size={0}>
            <Text style={{ 
              color: isAppointmentToday ? 'var(--primary-color)' : isAppointmentPast ? 'var(--text-secondary)' : 'var(--text-primary)',
              fontWeight: isAppointmentToday ? 'bold' : 'normal'
            }}>
              <CalendarOutlined style={{ marginLeft: 8 }} />
              {date}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <ClockCircleOutlined style={{ marginLeft: 4 }} />
              {time}
            </Text>
          </Space>
        );
      },
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>سبب الزيارة</Text>,
      dataIndex: "reason",
      key: "reason",
      render: (text, record) => (
        <Text style={{ color: 'var(--text-primary)' }}>
          {record.reason || 'فحص عام'}
        </Text>
      ),
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>الحالة</Text>,
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "مؤكد", value: APPOINTMENT_STATUS.CONFIRMED },
        { text: "في الانتظار", value: APPOINTMENT_STATUS.PENDING },
        { text: "ملغي", value: APPOINTMENT_STATUS.CANCELLED },
        { text: "مكتمل", value: APPOINTMENT_STATUS.COMPLETED },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.status === value,
      render: (text, record) => {
        const config = getStatusConfig(record.status);
        
        return (
          <Tag 
            className={`status-badge ${config.className}`}
            color={config.color}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>الإجراءات</Text>,
      key: "actions",
      render: (text, record) => {
        const isAppointmentPast = isPast(record.date);
        
        return (
          <Space>
            <Tooltip title="عرض التفاصيل">
              <Button 
                icon={<EyeOutlined />} 
                size="small"
                onClick={() => handleViewAppointment(record)}
              />
            </Tooltip>
            
            {!isAppointmentPast && record.status !== APPOINTMENT_STATUS.CANCELLED && (
              <Tooltip title="تعديل الموعد">
                <Button 
                  icon={<EditOutlined />} 
                  size="small"
                  onClick={() => handleEditAppointment(record)}
                />
              </Tooltip>
            )}

            {record.status === APPOINTMENT_STATUS.PENDING && !isAppointmentPast && (
              <Tooltip title="تأكيد الموعد">
                <Button 
                  icon={<CheckCircleOutlined />} 
                  size="small"
                  type="primary"
                  className="clinic-btn-primary"
                  onClick={() => handleConfirmAppointment(record)}
                />
              </Tooltip>
            )}

            {!isAppointmentPast && record.status !== APPOINTMENT_STATUS.CANCELLED && (
              <Tooltip title="إلغاء الموعد">
                <Button 
                  icon={<CloseCircleOutlined />} 
                  size="small"
                  danger
                  onClick={() => handleCancelAppointment(record)}
                />
              </Tooltip>
            )}
            
            <Tooltip title="طباعة">
              <Button 
                icon={<PrinterOutlined />} 
                size="small"
                onClick={() => handlePrintAppointment(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ], [handleViewAppointment, handleEditAppointment, handleConfirmAppointment, handleCancelAppointment, handlePrintAppointment]);

  return (
    <div style={{ direction: 'rtl' }}>
      <Table
        dataSource={appointments}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.id || record.key}
        locale={{
          emptyText: (
            <Empty
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
            `${range[0]}-${range[1]} من أصل ${total} موعد`,
          position: ['bottomCenter']
        }}
        scroll={{ x: 800 }}
        size="middle"
        className="clinic-table"
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}

export default AppointmentsTable;
