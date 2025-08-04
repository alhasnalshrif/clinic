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
   Row, 
   Col, 
   Typography, 
   Space, 
   Tag, 
   Divider,
   InputNumber,
   message,
   Tooltip,
   Empty
} from 'antd';
import { 
   PlusOutlined, 
   EditOutlined, 
   DeleteOutlined, 
   EyeOutlined,
   MedicineBoxOutlined,
   UserOutlined,
   CalendarOutlined,
   DollarOutlined,
   CheckCircleOutlined,
   ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TreatmentPlanning = () => {
   const [treatmentPlans, setTreatmentPlans] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedPlan, setSelectedPlan] = useState(null);
   const [form] = Form.useForm();

   // Mock data for demonstration
   useEffect(() => {
      const mockPlans = [
         {
            id: 1,
            patientName: 'أحمد محمد',
            patientId: 'P001',
            treatmentType: 'تنظيف وتقويم',
            description: 'تنظيف شامل للأسنان مع تركيب تقويم',
            estimatedCost: 2500,
            estimatedDuration: '6 أشهر',
            status: 'planned',
            createdDate: '2024-01-15',
            startDate: '2024-02-01',
            dentist: 'د. سارة أحمد',
            priority: 'medium',
            teeth: ['11', '12', '21', '22'],
            sessions: [
               { date: '2024-02-01', procedure: 'فحص أولي', status: 'completed' },
               { date: '2024-02-15', procedure: 'تنظيف', status: 'completed' },
               { date: '2024-03-01', procedure: 'تركيب التقويم', status: 'scheduled' }
            ]
         },
         {
            id: 2,
            patientName: 'فاطمة علي',
            patientId: 'P002',
            treatmentType: 'حشو وعلاج جذور',
            description: 'علاج جذور للضرس العلوي الأيمن وحشو تجميلي',
            estimatedCost: 1800,
            estimatedDuration: '3 أسابيع',
            status: 'in_progress',
            createdDate: '2024-01-10',
            startDate: '2024-01-20',
            dentist: 'د. محمد حسن',
            priority: 'high',
            teeth: ['16'],
            sessions: [
               { date: '2024-01-20', procedure: 'فحص وتشخيص', status: 'completed' },
               { date: '2024-01-27', procedure: 'علاج الجذور - جلسة 1', status: 'completed' },
               { date: '2024-02-03', procedure: 'علاج الجذور - جلسة 2', status: 'in_progress' }
            ]
         }
      ];
      setTreatmentPlans(mockPlans);
   }, []);

   const treatmentTypes = [
      'تنظيف وتبييض',
      'حشو تجميلي',
      'علاج جذور',
      'تقويم أسنان',
      'زراعة أسنان',
      'تركيبات ثابتة',
      'تركيبات متحركة',
      'جراحة فموية',
      'علاج لثة',
      'طب أسنان الأطفال'
   ];

   const priorityColors = {
      low: '#52c41a',
      medium: '#faad14',
      high: '#ff4d4f'
   };

   const statusColors = {
      planned: '#1890ff',
      in_progress: '#faad14',
      completed: '#52c41a',
      cancelled: '#ff4d4f'
   };

   const statusLabels = {
      planned: 'مخطط',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي'
   };

   const priorityLabels = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية'
   };

   const columns = [
      {
         title: 'المريض',
         key: 'patient',
         render: (_, record) => (
            <Space direction="vertical" size={0}>
               <Text strong>{record.patientName}</Text>
               <Text type="secondary" style={{ fontSize: '12px' }}>
                  ID: {record.patientId}
               </Text>
            </Space>
         ),
      },
      {
         title: 'نوع العلاج',
         dataIndex: 'treatmentType',
         key: 'treatmentType',
         render: (text) => (
            <Tag color="blue" style={{ borderRadius: '12px' }}>
               {text}
            </Tag>
         )
      },
      {
         title: 'التكلفة المقدرة',
         dataIndex: 'estimatedCost',
         key: 'estimatedCost',
         render: (cost) => (
            <Text strong style={{ color: 'var(--success-color)' }}>
               {cost?.toLocaleString()} ر.س
            </Text>
         )
      },
      {
         title: 'المدة المقدرة',
         dataIndex: 'estimatedDuration',
         key: 'estimatedDuration',
      },
      {
         title: 'الأولوية',
         dataIndex: 'priority',
         key: 'priority',
         render: (priority) => (
            <Tag color={priorityColors[priority]} style={{ borderRadius: '12px' }}>
               {priorityLabels[priority]}
            </Tag>
         )
      },
      {
         title: 'الحالة',
         dataIndex: 'status',
         key: 'status',
         render: (status) => (
            <Tag color={statusColors[status]} style={{ borderRadius: '12px' }}>
               {statusLabels[status]}
            </Tag>
         )
      },
      {
         title: 'تاريخ البداية',
         dataIndex: 'startDate',
         key: 'startDate',
         render: (date) => moment(date).format('DD/MM/YYYY')
      },
      {
         title: 'الطبيب',
         dataIndex: 'dentist',
         key: 'dentist',
      },
      {
         title: 'الإجراءات',
         key: 'actions',
         render: (_, record) => (
            <Space>
               <Tooltip title="عرض التفاصيل">
                  <Button 
                     icon={<EyeOutlined />} 
                     size="small"
                     onClick={() => handleView(record)}
                  />
               </Tooltip>
               <Tooltip title="تعديل">
                  <Button 
                     icon={<EditOutlined />} 
                     size="small"
                     onClick={() => handleEdit(record)}
                  />
               </Tooltip>
               <Tooltip title="حذف">
                  <Button 
                     icon={<DeleteOutlined />} 
                     size="small" 
                     danger
                     onClick={() => handleDelete(record.id)}
                  />
               </Tooltip>
            </Space>
         ),
      },
   ];

   const handleAdd = () => {
      setSelectedPlan(null);
      form.resetFields();
      setIsModalVisible(true);
   };

   const handleEdit = (plan) => {
      setSelectedPlan(plan);
      form.setFieldsValue({
         ...plan,
         startDate: moment(plan.startDate),
      });
      setIsModalVisible(true);
   };

   const handleView = (plan) => {
      Modal.info({
         title: `خطة علاج - ${plan.patientName}`,
         width: 800,
         content: (
            <div style={{ marginTop: 20 }}>
               <Row gutter={[16, 16]}>
                  <Col span={12}>
                     <Text strong>المريض: </Text>
                     <Text>{plan.patientName} ({plan.patientId})</Text>
                  </Col>
                  <Col span={12}>
                     <Text strong>نوع العلاج: </Text>
                     <Text>{plan.treatmentType}</Text>
                  </Col>
                  <Col span={12}>
                     <Text strong>التكلفة المقدرة: </Text>
                     <Text>{plan.estimatedCost?.toLocaleString()} ر.س</Text>
                  </Col>
                  <Col span={12}>
                     <Text strong>المدة المقدرة: </Text>
                     <Text>{plan.estimatedDuration}</Text>
                  </Col>
                  <Col span={24}>
                     <Text strong>الوصف: </Text>
                     <Text>{plan.description}</Text>
                  </Col>
                  <Col span={24}>
                     <Text strong>الأسنان المشمولة: </Text>
                     <Space>
                        {plan.teeth?.map(tooth => (
                           <Tag key={tooth} color="blue">{tooth}</Tag>
                        ))}
                     </Space>
                  </Col>
                  <Col span={24}>
                     <Divider orientation="left">الجلسات</Divider>
                     {plan.sessions?.map((session, index) => (
                        <div key={index} style={{ marginBottom: 8 }}>
                           <Tag color={session.status === 'completed' ? 'green' : session.status === 'in_progress' ? 'orange' : 'blue'}>
                              {moment(session.date).format('DD/MM/YYYY')} - {session.procedure}
                           </Tag>
                        </div>
                     ))}
                  </Col>
               </Row>
            </div>
         ),
      });
   };

   const handleDelete = (id) => {
      Modal.confirm({
         title: 'تأكيد الحذف',
         content: 'هل أنت متأكد من حذف خطة العلاج هذه؟',
         onOk: () => {
            setTreatmentPlans(prev => prev.filter(plan => plan.id !== id));
            message.success('تم حذف خطة العلاج بنجاح');
         }
      });
   };

   const handleSubmit = async (values) => {
      try {
         setLoading(true);
         const planData = {
            ...values,
            startDate: values.startDate.format('YYYY-MM-DD'),
            id: selectedPlan ? selectedPlan.id : Date.now(),
            createdDate: selectedPlan ? selectedPlan.createdDate : moment().format('YYYY-MM-DD'),
         };

         if (selectedPlan) {
            setTreatmentPlans(prev => 
               prev.map(plan => plan.id === selectedPlan.id ? planData : plan)
            );
            message.success('تم تحديث خطة العلاج بنجاح');
         } else {
            setTreatmentPlans(prev => [...prev, planData]);
            message.success('تم إضافة خطة العلاج بنجاح');
         }

         setIsModalVisible(false);
         form.resetFields();
      } catch (error) {
         message.error('حدث خطأ أثناء حفظ خطة العلاج');
      } finally {
         setLoading(false);
      }
   };

   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         <Card className="clinic-card" style={{ marginBottom: 24, padding: '24px' }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Title level={2} style={{ margin: 0, color: 'var(--text-primary)' }}>
                     <MedicineBoxOutlined style={{ marginLeft: 12 }} />
                     خطط العلاج
                  </Title>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                     إدارة وتتبع خطط علاج المرضى
                  </Text>
               </Col>
               <Col>
                  <Button 
                     type="primary" 
                     icon={<PlusOutlined />} 
                     className="clinic-btn-primary"
                     size="large"
                     onClick={handleAdd}
                  >
                     إضافة خطة علاج جديدة
                  </Button>
               </Col>
            </Row>
         </Card>

         <Card className="clinic-card" style={{ padding: '24px' }}>
            <Table
               columns={columns}
               dataSource={treatmentPlans}
               rowKey="id"
               loading={loading}
               locale={{
                  emptyText: (
                     <Empty
                        description={
                           <div className="empty-state">
                              <MedicineBoxOutlined className="empty-state-icon" />
                              <div className="empty-state-title">لا توجد خطط علاج</div>
                              <div className="empty-state-description">
                                 ابدأ بإضافة خطة علاج جديدة للمرضى
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
                     `${range[0]}-${range[1]} من أصل ${total} خطة علاج`
               }}
            />
         </Card>

         <Modal
            title={selectedPlan ? 'تعديل خطة العلاج' : 'إضافة خطة علاج جديدة'}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={800}
         >
            <Form
               form={form}
               layout="vertical"
               onFinish={handleSubmit}
               style={{ marginTop: 20 }}
            >
               <Row gutter={16}>
                  <Col span={12}>
                     <Form.Item
                        name="patientName"
                        label="اسم المريض"
                        rules={[{ required: true, message: 'يرجى إدخال اسم المريض' }]}
                     >
                        <Input prefix={<UserOutlined />} placeholder="اسم المريض" />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="patientId"
                        label="رقم المريض"
                        rules={[{ required: true, message: 'يرجى إدخال رقم المريض' }]}
                     >
                        <Input placeholder="P001" />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="treatmentType"
                        label="نوع العلاج"
                        rules={[{ required: true, message: 'يرجى اختيار نوع العلاج' }]}
                     >
                        <Select placeholder="اختر نوع العلاج">
                           {treatmentTypes.map(type => (
                              <Option key={type} value={type}>{type}</Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="dentist"
                        label="الطبيب المعالج"
                        rules={[{ required: true, message: 'يرجى إدخال اسم الطبيب' }]}
                     >
                        <Input placeholder="د. محمد أحمد" />
                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item
                        name="description"
                        label="وصف العلاج"
                        rules={[{ required: true, message: 'يرجى إدخال وصف العلاج' }]}
                     >
                        <TextArea rows={3} placeholder="وصف تفصيلي للعلاج المطلوب" />
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item
                        name="estimatedCost"
                        label="التكلفة المقدرة (ر.س)"
                        rules={[{ required: true, message: 'يرجى إدخال التكلفة' }]}
                     >
                        <InputNumber
                           style={{ width: '100%' }}
                           prefix={<DollarOutlined />}
                           min={0}
                           placeholder="0"
                           formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item
                        name="estimatedDuration"
                        label="المدة المقدرة"
                        rules={[{ required: true, message: 'يرجى إدخال المدة المقدرة' }]}
                     >
                        <Input placeholder="3 أسابيع" />
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item
                        name="startDate"
                        label="تاريخ البداية"
                        rules={[{ required: true, message: 'يرجى اختيار تاريخ البداية' }]}
                     >
                        <DatePicker 
                           style={{ width: '100%' }}
                           placeholder="اختر التاريخ"
                           format="DD/MM/YYYY"
                        />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="priority"
                        label="الأولوية"
                        rules={[{ required: true, message: 'يرجى اختيار الأولوية' }]}
                     >
                        <Select placeholder="اختر الأولوية">
                           <Option value="low">منخفضة</Option>
                           <Option value="medium">متوسطة</Option>
                           <Option value="high">عالية</Option>
                        </Select>
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="status"
                        label="الحالة"
                        rules={[{ required: true, message: 'يرجى اختيار الحالة' }]}
                     >
                        <Select placeholder="اختر الحالة">
                           <Option value="planned">مخطط</Option>
                           <Option value="in_progress">قيد التنفيذ</Option>
                           <Option value="completed">مكتمل</Option>
                           <Option value="cancelled">ملغي</Option>
                        </Select>
                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item
                        name="teeth"
                        label="الأسنان المشمولة"
                     >
                        <Select
                           mode="tags"
                           placeholder="أدخل أرقام الأسنان (مثل: 11, 12, 21)"
                           style={{ width: '100%' }}
                        />
                     </Form.Item>
                  </Col>
               </Row>

               <Row justify="end" style={{ marginTop: 24 }}>
                  <Space>
                     <Button onClick={() => setIsModalVisible(false)}>
                        إلغاء
                     </Button>
                     <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        className="clinic-btn-primary"
                     >
                        {selectedPlan ? 'تحديث' : 'إضافة'}
                     </Button>
                  </Space>
               </Row>
            </Form>
         </Modal>
      </Content>
   );
};

export default TreatmentPlanning;