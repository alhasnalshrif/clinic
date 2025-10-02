import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
   Empty,
   Statistic,
   Timeline,
   Progress,
   Badge,
   Alert,
   Steps
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
   ClockCircleOutlined,
   HeartOutlined,
   WarningOutlined,
   SearchOutlined,
   FilterOutlined,
   ReloadOutlined,
   PlayCircleOutlined,
   PauseCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { apiService } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;
const { Step } = Steps;

const TreatmentPlanning = () => {
   const [treatmentPlans, setTreatmentPlans] = useState([]);
   const [filteredPlans, setFilteredPlans] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedPlan, setSelectedPlan] = useState(null);
   const [form] = Form.useForm();
   const [searchValue, setSearchValue] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [priorityFilter, setPriorityFilter] = useState('all');
   const [viewDetailsModal, setViewDetailsModal] = useState(false);

   // Fetch treatment plans from API
   useEffect(() => {
      fetchTreatmentPlans();
   }, []);

   const fetchTreatmentPlans = async () => {
      try {
         setLoading(true);
         const response = await apiService.getTreatments();
         setTreatmentPlans(response.data || []);
         setFilteredPlans(response.data || []);
      } catch (error) {
         console.error('Error fetching treatment plans:', error);
         message.error('فشل في تحميل خطط العلاج');
         setTreatmentPlans([]);
         setFilteredPlans([]);
      } finally {
         setLoading(false);
      }
   };

   const treatmentTypes = [
      'تنظيف وتبييض',
      'حشو تجميلي', 
      'علاج جذور',
      'تقويم أسنان',
      'زراعة أسنان',
      'تركيب تيجان',
      'قلع أسنان',
      'جراحة الفم'
   ];

   const priorities = [
      { value: 'high', label: 'عالي', color: 'red' },
      { value: 'medium', label: 'متوسط', color: 'orange' },
      { value: 'low', label: 'منخفض', color: 'green' }
   ];

   const statuses = [
      { value: 'planned', label: 'مخطط', color: 'blue' },
      { value: 'in_progress', label: 'قيد التنفيذ', color: 'orange' },
      { value: 'completed', label: 'مكتمل', color: 'green' },
      { value: 'paused', label: 'متوقف', color: 'red' },
      { value: 'cancelled', label: 'ملغى', color: 'gray' }
   ];

   // Filter plans based on search and filters
   const filterPlans = useCallback(() => {
      let filtered = [...treatmentPlans];

      if (searchValue) {
         filtered = filtered.filter(plan => 
            plan.patientName.toLowerCase().includes(searchValue.toLowerCase()) ||
            plan.treatmentType.toLowerCase().includes(searchValue.toLowerCase()) ||
            plan.patientId.includes(searchValue)
         );
      }

      if (statusFilter !== 'all') {
         filtered = filtered.filter(plan => plan.status === statusFilter);
      }

      if (priorityFilter !== 'all') {
         filtered = filtered.filter(plan => plan.priority === priorityFilter);
      }

      setFilteredPlans(filtered);
   }, [treatmentPlans, searchValue, statusFilter, priorityFilter]);

   useEffect(() => {
      filterPlans();
   }, [filterPlans]);

   // Calculate statistics
   const planStats = useMemo(() => {
      const total = treatmentPlans.length;
      const planned = treatmentPlans.filter(p => p.status === 'planned').length;
      const inProgress = treatmentPlans.filter(p => p.status === 'in_progress').length;
      const completed = treatmentPlans.filter(p => p.status === 'completed').length;
      const highPriority = treatmentPlans.filter(p => p.priority === 'high').length;
      const totalRevenue = treatmentPlans.reduce((sum, p) => sum + p.actualCost, 0);
      const estimatedRevenue = treatmentPlans.reduce((sum, p) => sum + p.estimatedCost, 0);

      return {
         total,
         planned,
         inProgress,
         completed,
         highPriority,
         totalRevenue,
         estimatedRevenue,
         completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
   }, [treatmentPlans]);

   const handleAdd = () => {
      setSelectedPlan(null);
      setIsModalVisible(true);
      form.resetFields();
   };

   const handleEdit = (plan) => {
      setSelectedPlan(plan);
      setIsModalVisible(true);
      form.setFieldsValue({
         ...plan,
         startDate: moment(plan.startDate),
         endDate: moment(plan.endDate)
      });
   };

   const handleViewDetails = (plan) => {
      setSelectedPlan(plan);
      setViewDetailsModal(true);
   };

   const handleSubmit = async (values) => {
      try {
         setLoading(true);
         const planData = {
            ...values,
            startDate: values.startDate.format('YYYY-MM-DD'),
            endDate: values.endDate.format('YYYY-MM-DD'),
            id: selectedPlan ? selectedPlan.id : Date.now(),
            createdDate: moment().format('YYYY-MM-DD'),
            progress: 0,
            actualCost: 0
         };

         if (selectedPlan) {
            const updatedPlans = treatmentPlans.map(p => 
               p.id === selectedPlan.id ? { ...p, ...planData } : p
            );
            setTreatmentPlans(updatedPlans);
            message.success('تم تحديث خطة العلاج بنجاح');
         } else {
            setTreatmentPlans([...treatmentPlans, planData]);
            message.success('تم إضافة خطة العلاج بنجاح');
         }

         setIsModalVisible(false);
      } catch (error) {
         message.error('حدث خطأ في حفظ خطة العلاج');
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = (id) => {
      Modal.confirm({
         title: 'تأكيد الحذف',
         content: 'هل أنت متأكد من حذف خطة العلاج هذه؟',
         onOk: () => {
            setTreatmentPlans(treatmentPlans.filter(p => p.id !== id));
            message.success('تم حذف خطة العلاج بنجاح');
         }
      });
   };

   const getStatusColor = (status) => {
      const statusObj = statuses.find(s => s.value === status);
      return statusObj ? statusObj.color : 'default';
   };

   const getPriorityColor = (priority) => {
      const priorityObj = priorities.find(p => p.value === priority);
      return priorityObj ? priorityObj.color : 'default';
   };

   const columns = [
      {
         title: <Text strong>المريض</Text>,
         dataIndex: 'patientName',
         key: 'patientName',
         render: (name, record) => (
            <Space direction="vertical" size="small">
               <Text strong>{name}</Text>
               <Text type="secondary" style={{ fontSize: '12px' }}>
                  {record.patientId} • {record.patientPhone}
               </Text>
            </Space>
         ),
      },
      {
         title: <Text strong>نوع العلاج</Text>,
         dataIndex: 'treatmentType',
         key: 'treatmentType',
         render: (type) => (
            <Tag icon={<MedicineBoxOutlined />} color="blue">
               {type}
            </Tag>
         ),
      },
      {
         title: <Text strong>الحالة</Text>,
         dataIndex: 'status',
         key: 'status',
         render: (status) => {
            const statusObj = statuses.find(s => s.value === status);
            return (
               <Tag color={statusObj.color}>
                  {statusObj.label}
               </Tag>
            );
         },
      },
      {
         title: <Text strong>الأولوية</Text>,
         dataIndex: 'priority',
         key: 'priority',
         render: (priority) => {
            const priorityObj = priorities.find(p => p.value === priority);
            return (
               <Tag color={priorityObj.color}>
                  {priorityObj.label}
               </Tag>
            );
         },
      },
      {
         title: <Text strong>التقدم</Text>,
         dataIndex: 'progress',
         key: 'progress',
         render: (progress) => (
            <Progress 
               percent={progress} 
               size="small" 
               strokeColor={progress === 100 ? 'var(--success-color)' : 'var(--primary-color)'}
            />
         ),
      },
      {
         title: <Text strong>التكلفة</Text>,
         key: 'cost',
         render: (_, record) => (
            <Space direction="vertical" size="small">
               <Text>{record.actualCost.toLocaleString()} ريال</Text>
               <Text type="secondary" style={{ fontSize: '12px' }}>
                  من {record.estimatedCost.toLocaleString()}
               </Text>
            </Space>
         ),
      },
      {
         title: <Text strong>الطبيب</Text>,
         dataIndex: 'dentist',
         key: 'dentist',
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
                     onClick={() => handleViewDetails(record)}
                     size="small"
                  />
               </Tooltip>
               <Tooltip title="تعديل">
                  <Button
                     type="text"
                     icon={<EditOutlined />}
                     onClick={() => handleEdit(record)}
                     size="small"
                  />
               </Tooltip>
               <Tooltip title="حذف">
                  <Button
                     type="text"
                     icon={<DeleteOutlined />}
                     onClick={() => handleDelete(record.id)}
                     size="small"
                     danger
                  />
               </Tooltip>
            </Space>
         ),
      },
   ];

   return (
      <Content style={{ padding: 'var(--spacing-6)' }}>
         {/* Header Section */}
         <Card className="clinic-card" style={{ 
            marginBottom: 'var(--spacing-6)', 
            background: 'linear-gradient(135deg, var(--info-color) 0%, var(--success-color) 100%)', 
            border: 'none',
            color: 'white'
         }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Space direction="vertical" size="small">
                     <Title level={2} style={{ margin: 0, color: 'white' }}>
                        <HeartOutlined style={{ marginLeft: 12 }} />
                        خطط العلاج
                     </Title>
                     <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)' }}>
                        إدارة وتتبع خطط علاج المرضى المتكاملة
                     </Text>
                  </Space>
               </Col>
               <Col>
                  <Space size="middle">
                     <Tooltip title="تحديث البيانات">
                        <Button 
                           icon={<ReloadOutlined />}
                           loading={loading}
                           size="large"
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           تحديث
                        </Button>
                     </Tooltip>
                     <Tooltip title="إضافة خطة علاج جديدة">
                        <Button 
                           type="default"
                           icon={<PlusOutlined />}
                           size="large"
                           onClick={handleAdd}
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           خطة جديدة
                        </Button>
                     </Tooltip>
                  </Space>
               </Col>
            </Row>
         </Card>

         {/* Statistics Cards */}
         <Row gutter={[24, 24]} style={{ marginBottom: 'var(--spacing-6)' }}>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>إجمالي الخطط</span>}
                     value={planStats.total}
                     prefix={<HeartOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>قيد التنفيذ</span>}
                     value={planStats.inProgress}
                     prefix={<PlayCircleOutlined style={{ color: 'var(--warning-color)' }} />}
                     valueStyle={{ color: 'var(--warning-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>أولوية عالية</span>}
                     value={planStats.highPriority}
                     prefix={
                        <Badge count={planStats.highPriority} size="small">
                           <WarningOutlined style={{ color: 'var(--error-color)' }} />
                        </Badge>
                     }
                     valueStyle={{ color: 'var(--error-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>الإيرادات المحققة</span>}
                     value={planStats.totalRevenue}
                     prefix={<DollarOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)', fontSize: '28px', fontWeight: 'bold' }}
                     suffix={<Text type="secondary" style={{ fontSize: '12px' }}>ريال</Text>}
                  />
               </Card>
            </Col>
         </Row>

         {/* Filters Section */}
         <Card className="clinic-card" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Row gutter={[16, 16]} align="middle">
               <Col xs={24} sm={8}>
                  <Search
                     placeholder="البحث في خطط العلاج (اسم المريض، نوع العلاج، رقم المريض)"
                     value={searchValue}
                     onChange={(e) => setSearchValue(e.target.value)}
                     allowClear
                  />
               </Col>
               <Col xs={24} sm={4}>
                  <Select
                     placeholder="الحالة"
                     value={statusFilter}
                     onChange={setStatusFilter}
                     style={{ width: '100%' }}
                  >
                     <Option value="all">جميع الحالات</Option>
                     {statuses.map(status => (
                        <Option key={status.value} value={status.value}>
                           {status.label}
                        </Option>
                     ))}
                  </Select>
               </Col>
               <Col xs={24} sm={4}>
                  <Select
                     placeholder="الأولوية"
                     value={priorityFilter}
                     onChange={setPriorityFilter}
                     style={{ width: '100%' }}
                  >
                     <Option value="all">جميع الأولويات</Option>
                     {priorities.map(priority => (
                        <Option key={priority.value} value={priority.value}>
                           {priority.label}
                        </Option>
                     ))}
                  </Select>
               </Col>
               <Col xs={24} sm={8}>
                  <Space>
                     <Button 
                        onClick={() => {
                           setSearchValue('');
                           setStatusFilter('all');
                           setPriorityFilter('all');
                        }}
                        disabled={!searchValue && statusFilter === 'all' && priorityFilter === 'all'}
                     >
                        مسح الفلاتر
                     </Button>
                     <Text type="secondary">
                        النتائج: {filteredPlans.length} من {treatmentPlans.length}
                     </Text>
                  </Space>
               </Col>
            </Row>
         </Card>

         {/* Main Content */}
         <Card className="clinic-card">
            <Table
               columns={columns}
               dataSource={filteredPlans}
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
                              <Button 
                                 type="primary" 
                                 icon={<PlusOutlined />} 
                                 style={{ marginTop: 16 }}
                                 onClick={handleAdd}
                              >
                                 إضافة خطة علاج
                              </Button>
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

         {/* Add/Edit Treatment Plan Modal */}
         <Modal
            title={
               <Space>
                  <HeartOutlined />
                  {selectedPlan ? 'تعديل خطة العلاج' : 'إضافة خطة علاج جديدة'}
               </Space>
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={900}
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
                        <Input prefix={<UserOutlined />} />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="patientId"
                        label="رقم المريض"
                        rules={[{ required: true, message: 'يرجى إدخال رقم المريض' }]}
                     >
                        <Input />
                     </Form.Item>
                  </Col>
               </Row>

               <Row gutter={16}>
                  <Col span={12}>
                     <Form.Item
                        name="treatmentType"
                        label="نوع العلاج"
                        rules={[{ required: true, message: 'يرجى اختيار نوع العلاج' }]}
                     >
                        <Select>
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
                        <Input />
                     </Form.Item>
                  </Col>
               </Row>

               <Form.Item
                  name="description"
                  label="وصف العلاج"
                  rules={[{ required: true, message: 'يرجى إدخال وصف العلاج' }]}
               >
                  <TextArea rows={3} />
               </Form.Item>

               <Row gutter={16}>
                  <Col span={8}>
                     <Form.Item
                        name="priority"
                        label="الأولوية"
                        rules={[{ required: true, message: 'يرجى اختيار الأولوية' }]}
                     >
                        <Select>
                           {priorities.map(priority => (
                              <Option key={priority.value} value={priority.value}>
                                 {priority.label}
                              </Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item
                        name="estimatedCost"
                        label="التكلفة المقدرة"
                        rules={[{ required: true, message: 'يرجى إدخال التكلفة' }]}
                     >
                        <InputNumber
                           style={{ width: '100%' }}
                           prefix="ريال"
                           min={0}
                        />
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item
                        name="estimatedDuration"
                        label="المدة المقدرة"
                        rules={[{ required: true, message: 'يرجى إدخال المدة' }]}
                     >
                        <Input />
                     </Form.Item>
                  </Col>
               </Row>

               <Row gutter={16}>
                  <Col span={12}>
                     <Form.Item
                        name="startDate"
                        label="تاريخ البداية"
                        rules={[{ required: true, message: 'يرجى اختيار تاريخ البداية' }]}
                     >
                        <DatePicker style={{ width: '100%' }} />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="endDate"
                        label="تاريخ النهاية المتوقع"
                        rules={[{ required: true, message: 'يرجى اختيار تاريخ النهاية' }]}
                     >
                        <DatePicker style={{ width: '100%' }} />
                     </Form.Item>
                  </Col>
               </Row>

               <Form.Item style={{ textAlign: 'center', marginTop: 'var(--spacing-6)' }}>
                  <Space size="middle">
                     <Button onClick={() => setIsModalVisible(false)}>
                        إلغاء
                     </Button>
                     <Button type="primary" htmlType="submit" loading={loading}>
                        {selectedPlan ? 'تحديث' : 'إضافة'}
                     </Button>
                  </Space>
               </Form.Item>
            </Form>
         </Modal>

         {/* Treatment Plan Details Modal */}
         <Modal
            title={
               <Space>
                  <EyeOutlined />
                  تفاصيل خطة العلاج
               </Space>
            }
            open={viewDetailsModal}
            onCancel={() => setViewDetailsModal(false)}
            footer={null}
            width={1000}
         >
            {selectedPlan && (
               <div>
                  <Row gutter={[16, 16]}>
                     <Col span={24}>
                        <Card size="small" style={{ background: 'var(--bg-secondary)' }}>
                           <Row gutter={16}>
                              <Col span={8}>
                                 <Text strong>المريض:</Text> {selectedPlan.patientName}
                              </Col>
                              <Col span={8}>
                                 <Text strong>نوع العلاج:</Text> {selectedPlan.treatmentType}
                              </Col>
                              <Col span={8}>
                                 <Text strong>الطبيب:</Text> {selectedPlan.dentist}
                              </Col>
                           </Row>
                        </Card>
                     </Col>
                  </Row>

                  <Row gutter={[24, 24]} style={{ marginTop: 'var(--spacing-4)' }}>
                     <Col span={12}>
                        <Card size="small">
                           <Title level={5}>تقدم العلاج</Title>
                           <Progress 
                              percent={selectedPlan.progress} 
                              strokeColor="var(--success-color)"
                              style={{ marginBottom: 16 }}
                           />
                           <Space direction="vertical" style={{ width: '100%' }}>
                              <Text>الحالة: <Tag color={getStatusColor(selectedPlan.status)}>
                                 {statuses.find(s => s.value === selectedPlan.status)?.label}
                              </Tag></Text>
                              <Text>الأولوية: <Tag color={getPriorityColor(selectedPlan.priority)}>
                                 {priorities.find(p => p.value === selectedPlan.priority)?.label}
                              </Tag></Text>
                           </Space>
                        </Card>
                     </Col>
                     <Col span={12}>
                        <Card size="small">
                           <Title level={5}>معلومات مالية</Title>
                           <Space direction="vertical" style={{ width: '100%' }}>
                              <Text>التكلفة المقدرة: <Text strong>{selectedPlan.estimatedCost.toLocaleString()} ريال</Text></Text>
                              <Text>التكلفة الفعلية: <Text strong style={{ color: 'var(--success-color)' }}>{selectedPlan.actualCost.toLocaleString()} ريال</Text></Text>
                              <Text>المتبقي: <Text strong style={{ color: 'var(--warning-color)' }}>
                                 {(selectedPlan.estimatedCost - selectedPlan.actualCost).toLocaleString()} ريال
                              </Text></Text>
                           </Space>
                        </Card>
                     </Col>
                  </Row>

                  <Card size="small" style={{ marginTop: 'var(--spacing-4)' }}>
                     <Title level={5}>الجلسات العلاجية</Title>
                     <Timeline>
                        {selectedPlan.sessions.map((session, index) => (
                           <Timeline.Item 
                              key={index}
                              color={
                                 session.status === 'completed' ? 'green' :
                                 session.status === 'in_progress' ? 'blue' : 'gray'
                              }
                           >
                              <Space direction="vertical" size="small">
                                 <Text strong>{session.procedure}</Text>
                                 <Space>
                                    <Text type="secondary">{moment(session.date).format('DD/MM/YYYY')}</Text>
                                    <Tag color={
                                       session.status === 'completed' ? 'green' :
                                       session.status === 'in_progress' ? 'blue' : 'orange'
                                    }>
                                       {session.status === 'completed' ? 'مكتمل' :
                                        session.status === 'in_progress' ? 'جاري' : 'مجدول'}
                                    </Tag>
                                    <Text>{session.cost} ريال</Text>
                                 </Space>
                              </Space>
                           </Timeline.Item>
                        ))}
                     </Timeline>
                  </Card>
               </div>
            )}
         </Modal>
      </Content>
   );
};

export default TreatmentPlanning;
