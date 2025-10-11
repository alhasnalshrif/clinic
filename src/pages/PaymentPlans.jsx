import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Tooltip,
  Badge,
  Statistic,
  Progress,
  Empty,
  Spin,
  Popconfirm,
  Timeline,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  CreditCardOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { apiService } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PaymentPlans = () => {
  const [loading, setLoading] = useState(false);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [form] = Form.useForm();
  const [payForm] = Form.useForm();

  useEffect(() => {
    fetchPaymentPlans();
    fetchPatients();
    fetchTreatmentPlans();
  }, []);

  const fetchPaymentPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPaymentPlans();
      setPaymentPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      message.error('فشل في تحميل خطط الدفع');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchTreatmentPlans = async () => {
    try {
      const response = await apiService.getTreatmentPlans();
      setTreatmentPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
    }
  };

  const showModal = (plan = null) => {
    if (plan) {
      form.setFieldsValue({
        ...plan,
        startDate: plan.startDate ? moment(plan.startDate) : null,
      });
      setSelectedPlan(plan);
    } else {
      form.resetFields();
      setSelectedPlan(null);
    }
    setIsModalVisible(true);
  };

  const handleViewPlan = async (planId) => {
    try {
      setLoading(true);
      const response = await apiService.getPaymentPlan(planId);
      setSelectedPlan(response.data);
      setIsViewModalVisible(true);
    } catch (error) {
      console.error('Error fetching plan details:', error);
      message.error('فشل في تحميل تفاصيل خطة الدفع');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const planData = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
      };

      if (selectedPlan) {
        await apiService.updatePaymentPlan(selectedPlan.id, planData);
        message.success('تم تحديث خطة الدفع بنجاح');
      } else {
        await apiService.createPaymentPlan(planData);
        message.success('تم إنشاء خطة الدفع بنجاح');
      }

      setIsModalVisible(false);
      fetchPaymentPlans();
    } catch (error) {
      console.error('Error saving payment plan:', error);
      message.error('فشل في حفظ خطة الدفع');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiService.deletePaymentPlan(id);
      message.success('تم حذف خطة الدفع بنجاح');
      fetchPaymentPlans();
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      message.error('فشل في حذف خطة الدفع');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPlan = async (id) => {
    try {
      await apiService.cancelPaymentPlan(id);
      message.success('تم إلغاء خطة الدفع');
      fetchPaymentPlans();
    } catch (error) {
      console.error('Error cancelling plan:', error);
      message.error('فشل في إلغاء الخطة');
    }
  };

  const showPayModal = (plan, installment) => {
    setSelectedPlan(plan);
    setSelectedInstallment(installment);
    payForm.setFieldsValue({
      amount: installment.amount - (installment.paidAmount || 0),
      paidDate: moment(),
    });
    setIsPayModalVisible(true);
  };

  const handlePayInstallment = async () => {
    try {
      const values = await payForm.validateFields();
      setLoading(true);

      await apiService.payInstallment(selectedPlan.id, selectedInstallment.id, {
        amount: values.amount,
        paidDate: values.paidDate.format('YYYY-MM-DD'),
        notes: values.notes,
      });

      message.success('تم دفع القسط بنجاح');
      setIsPayModalVisible(false);
      handleViewPlan(selectedPlan.id);
      fetchPaymentPlans();
    } catch (error) {
      console.error('Error paying installment:', error);
      message.error('فشل في دفع القسط');
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

  const getInstallmentStatusColor = (status) => {
    const colors = {
      pending: 'default',
      paid: 'green',
      overdue: 'red',
      partial: 'orange',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'رقم الخطة',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'المريض',
      dataIndex: 'patientId',
      key: 'patientId',
      render: (patientId) => {
        const patient = patients.find((p) => p.id === patientId);
        return patient ? patient.name : patientId;
      },
    },
    {
      title: 'العنوان',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'المبلغ الإجمالي',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount?.toLocaleString() || 0} ريال`,
    },
    {
      title: 'المدفوع',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount) => `${amount?.toLocaleString() || 0} ريال`,
    },
    {
      title: 'المتبقي',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      render: (amount) => `${amount?.toLocaleString() || 0} ريال`,
    },
    {
      title: 'التقدم',
      key: 'progress',
      render: (_, record) => {
        const percentage = Math.round((record.paidAmount / record.totalAmount) * 100);
        return <Progress percent={percentage} size="small" />;
      },
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="عرض التفاصيل">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewPlan(record.id)}
            />
          </Tooltip>
          <Tooltip title="تعديل">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Popconfirm
              title="هل أنت متأكد من إلغاء هذه الخطة؟"
              onConfirm={() => handleCancelPlan(record.id)}
              okText="نعم"
              cancelText="لا"
            >
              <Tooltip title="إلغاء">
                <Button type="text" icon={<CloseCircleOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
          <Popconfirm
            title="هل أنت متأكد من حذف هذه الخطة؟"
            onConfirm={() => handleDelete(record.id)}
            okText="نعم"
            cancelText="لا"
          >
            <Tooltip title="حذف">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    total: paymentPlans.length,
    active: paymentPlans.filter((p) => p.status === 'active').length,
    completed: paymentPlans.filter((p) => p.status === 'completed').length,
    totalAmount: paymentPlans.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
    paidAmount: paymentPlans.reduce((sum, p) => sum + (p.paidAmount || 0), 0),
  };

  return (
    <Content style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>
              <CreditCardOutlined /> خطط الدفع
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              size="large"
            >
              إضافة خطة دفع جديدة
            </Button>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="إجمالي الخطط"
              value={stats.total}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="نشط"
              value={stats.active}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="إجمالي المبالغ"
              value={stats.totalAmount}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="ريال"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="المبالغ المدفوعة"
              value={stats.paidAmount}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              suffix="ريال"
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={paymentPlans}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty description="لا توجد خطط دفع">
                <Button type="primary" onClick={() => showModal()}>
                  إضافة خطة دفع
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={selectedPlan ? 'تعديل خطة الدفع' : 'إضافة خطة دفع جديدة'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="patientId"
            label="المريض"
            rules={[{ required: true, message: 'الرجاء اختيار المريض' }]}
          >
            <Select
              showSearch
              placeholder="اختر المريض"
              optionFilterProp="children"
            >
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="treatmentPlanId" label="خطة العلاج (اختياري)">
            <Select
              showSearch
              placeholder="اختر خطة العلاج"
              optionFilterProp="children"
              allowClear
            >
              {treatmentPlans.map((plan) => (
                <Option key={plan.id} value={plan.id}>
                  {plan.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="عنوان الخطة"
            rules={[{ required: true, message: 'الرجاء إدخال عنوان الخطة' }]}
          >
            <Input placeholder="مثال: خطة دفع لعلاج الأسنان" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalAmount"
                label="المبلغ الإجمالي"
                rules={[{ required: true, message: 'الرجاء إدخال المبلغ' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="0"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numberOfInstallments"
                label="عدد الأقساط"
                rules={[{ required: true, message: 'الرجاء إدخال عدد الأقساط' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="6"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="تاريخ البدء"
                rules={[{ required: true, message: 'الرجاء اختيار تاريخ البدء' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="installmentFrequency"
                label="تكرار الأقساط"
                initialValue="monthly"
                rules={[{ required: true, message: 'الرجاء اختيار التكرار' }]}
              >
                <Select>
                  <Option value="weekly">أسبوعي</Option>
                  <Option value="biweekly">كل أسبوعين</Option>
                  <Option value="monthly">شهري</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="ملاحظات">
            <TextArea rows={3} placeholder="ملاحظات إضافية" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="تفاصيل خطة الدفع"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            إغلاق
          </Button>,
        ]}
        width={800}
      >
        {selectedPlan && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>المريض:</Text>{' '}
                {patients.find((p) => p.id === selectedPlan.patientId)?.name || selectedPlan.patientId}
              </Col>
              <Col span={12}>
                <Text strong>الحالة:</Text>{' '}
                <Tag color={getStatusColor(selectedPlan.status)}>
                  {getStatusText(selectedPlan.status)}
                </Tag>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Text strong>المبلغ الإجمالي:</Text>{' '}
                {selectedPlan.totalAmount?.toLocaleString()} ريال
              </Col>
              <Col span={8}>
                <Text strong>المدفوع:</Text>{' '}
                {selectedPlan.paidAmount?.toLocaleString()} ريال
              </Col>
              <Col span={8}>
                <Text strong>المتبقي:</Text>{' '}
                {selectedPlan.remainingAmount?.toLocaleString()} ريال
              </Col>
            </Row>

            <Progress
              percent={Math.round((selectedPlan.paidAmount / selectedPlan.totalAmount) * 100)}
              status="active"
              style={{ marginBottom: 16 }}
            />

            {selectedPlan.installments && selectedPlan.installments.length > 0 && (
              <>
                <Divider />
                <Title level={5}>الأقساط:</Title>
                <Timeline>
                  {selectedPlan.installments.map((installment) => (
                    <Timeline.Item
                      key={installment.id}
                      color={
                        installment.status === 'paid'
                          ? 'green'
                          : installment.status === 'overdue'
                          ? 'red'
                          : 'blue'
                      }
                    >
                      <Row gutter={16} align="middle">
                        <Col span={12}>
                          <Text strong>القسط #{installment.installmentNumber}</Text>
                          <br />
                          <Text type="secondary">
                            المبلغ: {installment.amount?.toLocaleString()} ريال
                          </Text>
                          <br />
                          <Text type="secondary">
                            موعد الاستحقاق: {moment(installment.dueDate).format('YYYY-MM-DD')}
                          </Text>
                        </Col>
                        <Col span={8}>
                          <Tag color={getInstallmentStatusColor(installment.status)}>
                            {installment.status === 'paid' ? 'مدفوع' : 
                             installment.status === 'partial' ? 'دفع جزئي' :
                             installment.status === 'overdue' ? 'متأخر' : 'معلق'}
                          </Tag>
                          {installment.paidDate && (
                            <div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                تاريخ الدفع: {moment(installment.paidDate).format('YYYY-MM-DD')}
                              </Text>
                            </div>
                          )}
                        </Col>
                        <Col span={4}>
                          {installment.status !== 'paid' && selectedPlan.status === 'active' && (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => showPayModal(selectedPlan, installment)}
                            >
                              دفع
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </>
            )}

            {selectedPlan.notes && (
              <>
                <Divider />
                <Title level={5}>ملاحظات:</Title>
                <Text>{selectedPlan.notes}</Text>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Pay Installment Modal */}
      <Modal
        title="دفع القسط"
        open={isPayModalVisible}
        onOk={handlePayInstallment}
        onCancel={() => setIsPayModalVisible(false)}
        okText="تأكيد الدفع"
        cancelText="إلغاء"
      >
        <Form form={payForm} layout="vertical">
          <Form.Item
            name="amount"
            label="المبلغ المدفوع"
            rules={[{ required: true, message: 'الرجاء إدخال المبلغ' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="paidDate"
            label="تاريخ الدفع"
            rules={[{ required: true, message: 'الرجاء اختيار التاريخ' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="notes" label="ملاحظات">
            <TextArea rows={3} placeholder="ملاحظات إضافية" />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default PaymentPlans;
