import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
   Layout,
   Card,
   Form,
   Input,
   Select,
   Checkbox,
   Radio,
   DatePicker,
   Row,
   Col,
   Typography,
   Button,
   Space,
   Divider,
   message,
   Table,
   Modal,
   Tag,
   Empty,
   Tooltip,
   Alert,
   Statistic,
   Timeline,
   Badge,
   Tabs,
   List,
   Avatar,
   Progress
} from 'antd';
import {
   UserOutlined,
   PhoneOutlined,
   MailOutlined,
   CalendarOutlined,
   MedicineBoxOutlined,
   HeartOutlined,
   ExclamationCircleOutlined,
   PlusOutlined,
   EditOutlined,
   EyeOutlined,
   FileTextOutlined,
   SearchOutlined,
   FilterOutlined,
   HistoryOutlined,
   SafetyOutlined,
   WarningOutlined,
   CheckCircleOutlined,
   ReloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { apiService } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

const MedicalHistory = () => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const [patients, setPatients] = useState([]);
   const [selectedPatient, setSelectedPatient] = useState(null);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [viewMode, setViewMode] = useState(false);
   const [searchValue, setSearchValue] = useState('');
   const [medicalRecords, setMedicalRecords] = useState([]);
   const [activeTab, setActiveTab] = useState('overview');

   // Mock medical history data - in real app this would come from API
   const [mockMedicalData] = useState([
      {
         id: 1,
         patientId: 1,
         patientName: 'John Doe',
         date: '2024-01-15',
         type: 'تاريخ مرضي',
         description: 'ارتفاع ضغط الدم، حساسية من البنسلين',
         severity: 'متوسط',
         status: 'نشط',
         doctor: 'د. سارة أحمد'
      },
      {
         id: 2,
         patientId: 2,
         patientName: 'Jane Smith',
         date: '2024-01-10',
         type: 'عملية جراحية',
         description: 'استئصال ضرس العقل',
         severity: 'منخفض',
         status: 'مكتمل',
         doctor: 'د. محمد علي'
      },
      {
         id: 3,
         patientId: 1,
         patientName: 'John Doe',
         date: '2024-01-05',
         type: 'حساسية',
         description: 'حساسية شديدة من المكسرات',
         severity: 'عالي',
         status: 'نشط',
         doctor: 'د. فاطمة خالد'
      }
   ]);

   const fetchPatients = useCallback(async () => {
      try {
         setLoading(true);
         const response = await apiService.getPatients();
         setPatients(response.data || []);
         message.success('تم تحميل قائمة المرضى بنجاح');
      } catch (error) {
         console.error('Error fetching patients:', error);
         message.error('فشل في تحميل قائمة المرضى');
         setPatients([]);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchPatients();
   }, [fetchPatients]);

   const handlePatientSelect = (patientId) => {
      const patient = patients.find(p => p.id === parseInt(patientId));
      setSelectedPatient(patient);
      // Filter medical records for selected patient
      const patientRecords = mockMedicalData.filter(record => record.patientId === parseInt(patientId));
      setMedicalRecords(patientRecords);
   };

   const handleAddMedicalRecord = () => {
      if (!selectedPatient) {
         message.warning('يرجى اختيار مريض أولاً');
         return;
      }
      setViewMode(false);
      setIsModalVisible(true);
      form.resetFields();
   };

   const handleViewRecord = (record) => {
      setViewMode(true);
      setIsModalVisible(true);
      form.setFieldsValue({
         ...record,
         date: moment(record.date)
      });
   };

   const handleSubmit = async (values) => {
      try {
         setLoading(true);
         console.log('Medical record data:', {
            ...values,
            patientId: selectedPatient.id,
            patientName: selectedPatient.name,
            date: values.date.format('YYYY-MM-DD')
         });
         message.success('تم حفظ السجل الطبي بنجاح');
         setIsModalVisible(false);
         form.resetFields();
      } catch (error) {
         message.error('حدث خطأ في حفظ السجل الطبي');
      } finally {
         setLoading(false);
      }
   };

   const filteredPatients = useMemo(() => {
      if (!searchValue) return patients;
      return patients.filter(patient => 
         patient.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
         patient.phone?.includes(searchValue)
      );
   }, [patients, searchValue]);

   const medicalStats = useMemo(() => {
      const total = mockMedicalData.length;
      const active = mockMedicalData.filter(record => record.status === 'نشط').length;
      const high = mockMedicalData.filter(record => record.severity === 'عالي').length;
      const recent = mockMedicalData.filter(record => 
         moment().diff(moment(record.date), 'days') <= 30
      ).length;

      return { total, active, high, recent };
   }, [mockMedicalData]);

   const getSeverityColor = (severity) => {
      const colors = {
         'عالي': 'red',
         'متوسط': 'orange', 
         'منخفض': 'green'
      };
      return colors[severity] || 'default';
   };

   const getStatusColor = (status) => {
      const colors = {
         'نشط': 'green',
         'مكتمل': 'blue',
         'متابعة': 'orange'
      };
      return colors[status] || 'default';
   };

   const columns = [
      {
         title: <Text strong>التاريخ</Text>,
         dataIndex: 'date',
         key: 'date',
         render: (date) => moment(date).format('DD/MM/YYYY'),
         sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      },
      {
         title: <Text strong>نوع السجل</Text>,
         dataIndex: 'type',
         key: 'type',
         render: (type) => (
            <Tag icon={<MedicineBoxOutlined />} color="blue">
               {type}
            </Tag>
         ),
      },
      {
         title: <Text strong>الوصف</Text>,
         dataIndex: 'description',
         key: 'description',
         ellipsis: { showTitle: false },
         render: (description) => (
            <Tooltip title={description}>
               <Text>{description}</Text>
            </Tooltip>
         ),
      },
      {
         title: <Text strong>الخطورة</Text>,
         dataIndex: 'severity',
         key: 'severity',
         render: (severity) => (
            <Tag color={getSeverityColor(severity)}>
               {severity}
            </Tag>
         ),
      },
      {
         title: <Text strong>الحالة</Text>,
         dataIndex: 'status',
         key: 'status',
         render: (status) => (
            <Tag color={getStatusColor(status)}>
               {status}
            </Tag>
         ),
      },
      {
         title: <Text strong>الطبيب</Text>,
         dataIndex: 'doctor',
         key: 'doctor',
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
                     onClick={() => handleViewRecord(record)}
                     size="small"
                  />
               </Tooltip>
               <Tooltip title="تعديل">
                  <Button
                     type="text"
                     icon={<EditOutlined />}
                     onClick={() => handleViewRecord(record)}
                     size="small"
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
            background: 'linear-gradient(135deg, var(--success-color) 0%, var(--info-color) 100%)', 
            border: 'none',
            color: 'white'
         }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Space direction="vertical" size="small">
                     <Title level={2} style={{ margin: 0, color: 'white' }}>
                        <HistoryOutlined style={{ marginLeft: 12 }} />
                        السجلات الطبية
                     </Title>
                     <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)' }}>
                        إدارة وتتبع التاريخ الطبي لجميع المرضى
                     </Text>
                  </Space>
               </Col>
               <Col>
                  <Space size="middle">
                     <Tooltip title="تحديث البيانات">
                        <Button 
                           icon={<ReloadOutlined />}
                           loading={loading}
                           onClick={fetchPatients}
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
                     <Tooltip title="إضافة سجل طبي جديد">
                        <Button 
                           type="default"
                           icon={<PlusOutlined />}
                           size="large"
                           onClick={handleAddMedicalRecord}
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           سجل جديد
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
                     title={<span style={{ color: 'var(--text-secondary)' }}>إجمالي السجلات</span>}
                     value={medicalStats.total}
                     prefix={<FileTextOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>السجلات النشطة</span>}
                     value={medicalStats.active}
                     prefix={<CheckCircleOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>حالات حرجة</span>}
                     value={medicalStats.high}
                     prefix={
                        <Badge count={medicalStats.high} size="small">
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
                     title={<span style={{ color: 'var(--text-secondary)' }}>سجلات حديثة</span>}
                     value={medicalStats.recent}
                     prefix={<CalendarOutlined style={{ color: 'var(--info-color)' }} />}
                     valueStyle={{ color: 'var(--info-color)', fontSize: '28px', fontWeight: 'bold' }}
                     suffix={<Text type="secondary" style={{ fontSize: '12px' }}>(آخر 30 يوم)</Text>}
                  />
               </Card>
            </Col>
         </Row>

         <Row gutter={[24, 24]}>
            {/* Patient Selection */}
            <Col xs={24} lg={8}>
               <Card className="clinic-card" style={{ height: 'fit-content' }}>
                  <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>
                     🔍 اختيار المريض
                  </Title>
                  
                  <Search
                     placeholder="البحث في قائمة المرضى"
                     value={searchValue}
                     onChange={(e) => setSearchValue(e.target.value)}
                     style={{ marginBottom: 'var(--spacing-4)' }}
                     allowClear
                  />

                  <Select
                     placeholder="اختر مريض لعرض سجله الطبي"
                     style={{ width: '100%', marginBottom: 'var(--spacing-4)' }}
                     onChange={handlePatientSelect}
                     value={selectedPatient?.id}
                     showSearch
                     filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                     }
                  >
                     {filteredPatients.map(patient => (
                        <Option key={patient.id} value={patient.id}>
                           <Space>
                              <UserOutlined />
                              {patient.name}
                              <Text type="secondary">({patient.phone})</Text>
                           </Space>
                        </Option>
                     ))}
                  </Select>

                  {selectedPatient && (
                     <Card size="small" style={{ background: 'var(--bg-secondary)' }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                           <Text><UserOutlined /> <strong>{selectedPatient.name}</strong></Text>
                           <Text><PhoneOutlined /> {selectedPatient.phone}</Text>
                           <Text><CalendarOutlined /> العمر: {selectedPatient.age} سنة</Text>
                           <Text><HeartOutlined /> فصيلة الدم: {selectedPatient.bloodgroup}</Text>
                        </Space>
                     </Card>
                  )}
               </Card>
            </Col>

            {/* Medical Records Display */}
            <Col xs={24} lg={16}>
               <Card className="clinic-card">
                  {selectedPatient ? (
                     <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
                        <Tabs.TabPane 
                           tab={
                              <span>
                                 <FileTextOutlined />
                                 السجلات الطبية
                                 <Badge count={medicalRecords.length} size="small" style={{ marginRight: 8 }} />
                              </span>
                           } 
                           key="records"
                        >
                           {medicalRecords.length > 0 ? (
                              <Table
                                 columns={columns}
                                 dataSource={medicalRecords}
                                 rowKey="id"
                                 size="small"
                                 pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showTotal: (total, range) => 
                                       `${range[0]}-${range[1]} من أصل ${total} سجل`
                                 }}
                              />
                           ) : (
                              <Empty
                                 description={
                                    <div className="empty-state">
                                       <MedicineBoxOutlined className="empty-state-icon" />
                                       <div className="empty-state-title">لا توجد سجلات طبية</div>
                                       <div className="empty-state-description">
                                          لا توجد سجلات طبية مسجلة لهذا المريض
                                       </div>
                                       <Button 
                                          type="primary" 
                                          icon={<PlusOutlined />} 
                                          style={{ marginTop: 16 }}
                                          onClick={handleAddMedicalRecord}
                                       >
                                          إضافة سجل طبي
                                       </Button>
                                    </div>
                                 }
                              />
                           )}
                        </Tabs.TabPane>
                        
                        <Tabs.TabPane 
                           tab={
                              <span>
                                 <HistoryOutlined />
                                 الخط الزمني
                              </span>
                           } 
                           key="timeline"
                        >
                           <Timeline>
                              {medicalRecords.map(record => (
                                 <Timeline.Item 
                                    key={record.id}
                                    color={getSeverityColor(record.severity)}
                                    dot={<MedicineBoxOutlined />}
                                 >
                                    <Card size="small">
                                       <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                          <Text strong>{record.type}</Text>
                                          <Text>{record.description}</Text>
                                          <Space>
                                             <Text type="secondary">{moment(record.date).format('DD/MM/YYYY')}</Text>
                                             <Tag color={getSeverityColor(record.severity)}>{record.severity}</Tag>
                                             <Text type="secondary">د. {record.doctor}</Text>
                                          </Space>
                                       </Space>
                                    </Card>
                                 </Timeline.Item>
                              ))}
                           </Timeline>
                        </Tabs.TabPane>
                     </Tabs>
                  ) : (
                     <Empty
                        description={
                           <div className="empty-state">
                              <UserOutlined className="empty-state-icon" />
                              <div className="empty-state-title">اختر مريض</div>
                              <div className="empty-state-description">
                                 يرجى اختيار مريض من القائمة لعرض سجله الطبي
                              </div>
                           </div>
                        }
                     />
                  )}
               </Card>
            </Col>
         </Row>

         {/* Add/Edit Medical Record Modal */}
         <Modal
            title={
               <Space>
                  <MedicineBoxOutlined />
                  {viewMode ? 'عرض السجل الطبي' : 'إضافة سجل طبي جديد'}
               </Space>
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={800}
         >
            <Form
               form={form}
               layout="vertical"
               onFinish={handleSubmit}
               disabled={viewMode}
            >
               <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                     <Form.Item
                        name="type"
                        label="نوع السجل"
                        rules={[{ required: true, message: 'يرجى اختيار نوع السجل' }]}
                     >
                        <Select placeholder="اختر نوع السجل">
                           <Option value="تاريخ مرضي">تاريخ مرضي</Option>
                           <Option value="عملية جراحية">عملية جراحية</Option>
                           <Option value="حساسية">حساسية</Option>
                           <Option value="أدوية">أدوية</Option>
                           <Option value="فحص">فحص</Option>
                        </Select>
                     </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                     <Form.Item
                        name="date"
                        label="التاريخ"
                        rules={[{ required: true, message: 'يرجى اختيار التاريخ' }]}
                     >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                     </Form.Item>
                  </Col>
               </Row>

               <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                     <Form.Item
                        name="severity"
                        label="درجة الخطورة"
                        rules={[{ required: true, message: 'يرجى اختيار درجة الخطورة' }]}
                     >
                        <Select placeholder="اختر درجة الخطورة">
                           <Option value="منخفض">منخفض</Option>
                           <Option value="متوسط">متوسط</Option>
                           <Option value="عالي">عالي</Option>
                        </Select>
                     </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                     <Form.Item
                        name="status"
                        label="الحالة"
                        rules={[{ required: true, message: 'يرجى اختيار الحالة' }]}
                     >
                        <Select placeholder="اختر الحالة">
                           <Option value="نشط">نشط</Option>
                           <Option value="مكتمل">مكتمل</Option>
                           <Option value="متابعة">متابعة</Option>
                        </Select>
                     </Form.Item>
                  </Col>
               </Row>

               <Form.Item
                  name="description"
                  label="الوصف"
                  rules={[{ required: true, message: 'يرجى إدخال الوصف' }]}
               >
                  <TextArea 
                     rows={4} 
                     placeholder="وصف تفصيلي للحالة الطبية أو الإجراء"
                     maxLength={500}
                     showCount
                  />
               </Form.Item>

               <Form.Item
                  name="doctor"
                  label="الطبيب المعالج"
                  rules={[{ required: true, message: 'يرجى إدخال اسم الطبيب' }]}
               >
                  <Input placeholder="اسم الطبيب المعالج" />
               </Form.Item>

               {!viewMode && (
                  <Form.Item style={{ textAlign: 'center', marginTop: 'var(--spacing-6)' }}>
                     <Space size="middle">
                        <Button onClick={() => setIsModalVisible(false)}>
                           إلغاء
                        </Button>
                        <Button 
                           type="primary" 
                           htmlType="submit" 
                           loading={loading}
                           icon={<MedicineBoxOutlined />}
                        >
                           حفظ السجل
                        </Button>
                     </Space>
                  </Form.Item>
               )}
            </Form>
         </Modal>
      </Content>
   );
};

export default MedicalHistory;
