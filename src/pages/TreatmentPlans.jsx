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
  Steps,
  Empty,
  Spin,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { apiService } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const TreatmentPlans = () => {
  const [loading, setLoading] = useState(false);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    fetchTreatmentPlans();
    fetchPatients();
  }, []);

  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTreatmentPlans();
      setTreatmentPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      message.error('فشل في تحميل خطط العلاج');
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

  const showModal = (plan = null) => {
    if (plan) {
      form.setFieldsValue({
        ...plan,
        startDate: plan.startDate ? moment(plan.startDate) : null,
        endDate: plan.endDate ? moment(plan.endDate) : null,
      });
      setPhases(plan.phases || []);
      setSelectedPlan(plan);
    } else {
      form.resetFields();
      setPhases([]);
      setSelectedPlan(null);
    }
    setIsModalVisible(true);
  };

  const handleViewPlan = async (planId) => {
    try {
      setLoading(true);
      const response = await apiService.getTreatmentPlan(planId);
      setSelectedPlan(response.data);
      setIsViewModalVisible(true);
    } catch (error) {
      console.error('Error fetching plan details:', error);
      message.error('فشل في تحميل تفاصيل الخطة');
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
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        phases: phases,
      };

      if (selectedPlan) {
        await apiService.updateTreatmentPlan(selectedPlan.id, planData);
        message.success('تم تحديث خطة العلاج بنجاح');
      } else {
        await apiService.createTreatmentPlan(planData);
        message.success('تم إنشاء خطة العلاج بنجاح');
      }

      setIsModalVisible(false);
      fetchTreatmentPlans();
    } catch (error) {
      console.error('Error saving treatment plan:', error);
      message.error('فشل في حفظ خطة العلاج');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiService.deleteTreatmentPlan(id);
      message.success('تم حذف خطة العلاج بنجاح');
      fetchTreatmentPlans();
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      message.error('فشل في حذف خطة العلاج');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await apiService.updateTreatmentPlanStatus(id, {
        status,
        completionDate: status === 'completed' ? moment().format('YYYY-MM-DD') : null,
      });
      message.success('تم تحديث حالة الخطة');
      fetchTreatmentPlans();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('فشل في تحديث الحالة');
    }
  };

  const addPhase = () => {
    setPhases([
      ...phases,
      {
        title: '',
        description: '',
        cost: 0,
        estimatedDuration: '',
      },
    ]);
  };

  const updatePhase = (index, field, value) => {
    const newPhases = [...phases];
    newPhases[index][field] = value;
    setPhases(newPhases);
  };

  const removePhase = (index) => {
    setPhases(phases.filter((_, i) => i !== index));
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

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'green',
      medium: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority] || 'default';
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
      title: 'الأولوية',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'urgent' ? 'عاجل' : priority === 'high' ? 'عالي' : priority === 'medium' ? 'متوسط' : 'منخفض'}
        </Tag>
      ),
    },
    {
      title: 'التكلفة الإجمالية',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost) => `${cost?.toLocaleString() || 0} ريال`,
    },
    {
      title: 'تاريخ البدء',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => (date ? moment(date).format('YYYY-MM-DD') : '-'),
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
          <Select
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 120 }}
            size="small"
          >
            <Option value="planned">مخطط</Option>
            <Option value="in_progress">قيد التنفيذ</Option>
            <Option value="completed">مكتمل</Option>
            <Option value="cancelled">ملغى</Option>
          </Select>
        </Space>
      ),
    },
  ];

  const stats = {
    total: treatmentPlans.length,
    planned: treatmentPlans.filter((p) => p.status === 'planned').length,
    inProgress: treatmentPlans.filter((p) => p.status === 'in_progress').length,
    completed: treatmentPlans.filter((p) => p.status === 'completed').length,
  };

  return (
    <Content style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>
              <MedicineBoxOutlined /> خطط العلاج
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              size="large"
            >
              إضافة خطة علاج جديدة
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
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="مخطط"
              value={stats.planned}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="قيد التنفيذ"
              value={stats.inProgress}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="مكتمل"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={treatmentPlans}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty description="لا توجد خطط علاج">
                <Button type="primary" onClick={() => showModal()}>
                  إضافة خطة علاج
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={selectedPlan ? 'تعديل خطة العلاج' : 'إضافة خطة علاج جديدة'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="doctorId"
                label="الطبيب"
                rules={[{ required: true, message: 'الرجاء إدخال معرف الطبيب' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="معرف الطبيب" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="عنوان الخطة"
            rules={[{ required: true, message: 'الرجاء إدخال عنوان الخطة' }]}
          >
            <Input placeholder="مثال: خطة علاج شاملة للأسنان" />
          </Form.Item>

          <Form.Item name="description" label="الوصف">
            <TextArea rows={3} placeholder="وصف تفصيلي للخطة العلاجية" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="priority" label="الأولوية" initialValue="medium">
                <Select>
                  <Option value="low">منخفض</Option>
                  <Option value="medium">متوسط</Option>
                  <Option value="high">عالي</Option>
                  <Option value="urgent">عاجل</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="totalCost" label="التكلفة الإجمالية">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="0"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estimatedDuration" label="المدة المتوقعة">
                <Input placeholder="مثال: 6 أشهر" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="تاريخ البدء">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="تاريخ الانتهاء المتوقع">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="ملاحظات">
            <TextArea rows={2} placeholder="ملاحظات إضافية" />
          </Form.Item>

          <Divider>المراحل العلاجية</Divider>

          {phases.map((phase, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 16 }}
              title={`المرحلة ${index + 1}`}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removePhase(index)}
                >
                  حذف
                </Button>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Input
                    placeholder="عنوان المرحلة"
                    value={phase.title}
                    onChange={(e) => updatePhase(index, 'title', e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                </Col>
                <Col span={6}>
                  <InputNumber
                    placeholder="التكلفة"
                    value={phase.cost}
                    onChange={(value) => updatePhase(index, 'cost', value)}
                    style={{ width: '100%', marginBottom: 8 }}
                    min={0}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    placeholder="المدة"
                    value={phase.estimatedDuration}
                    onChange={(e) => updatePhase(index, 'estimatedDuration', e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                </Col>
              </Row>
              <TextArea
                placeholder="وصف المرحلة"
                value={phase.description}
                onChange={(e) => updatePhase(index, 'description', e.target.value)}
                rows={2}
              />
            </Card>
          ))}

          <Button
            type="dashed"
            onClick={addPhase}
            block
            icon={<PlusOutlined />}
          >
            إضافة مرحلة
          </Button>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="تفاصيل خطة العلاج"
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
              <Col span={12}>
                <Text strong>الأولوية:</Text>{' '}
                <Tag color={getPriorityColor(selectedPlan.priority)}>
                  {selectedPlan.priority}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>التكلفة الإجمالية:</Text>{' '}
                {selectedPlan.totalCost?.toLocaleString()} ريال
              </Col>
            </Row>

            <Divider />

            <Title level={5}>الوصف:</Title>
            <Text>{selectedPlan.description || 'لا يوجد وصف'}</Text>

            {selectedPlan.phases && selectedPlan.phases.length > 0 && (
              <>
                <Divider />
                <Title level={5}>المراحل العلاجية:</Title>
                <Steps
                  direction="vertical"
                  current={-1}
                  items={selectedPlan.phases.map((phase, index) => ({
                    title: `${phase.title} (${phase.cost?.toLocaleString()} ريال)`,
                    description: phase.description,
                    status: phase.status === 'completed' ? 'finish' : phase.status === 'in_progress' ? 'process' : 'wait',
                  }))}
                />
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
    </Content>
  );
};

export default TreatmentPlans;
