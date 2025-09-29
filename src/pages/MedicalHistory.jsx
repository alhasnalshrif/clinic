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

   // Mock patient data
   useEffect(() => {
      const mockPatients = [
         {
            id: 1,
            personalInfo: {
               name: 'أحمد محمد علي',
               age: 35,
               gender: 'male',
               phone: '0501234567',
               email: 'ahmed@email.com',
               address: 'الرياض، المملكة العربية السعودية',
               emergencyContact: 'فاطمة أحمد - 0509876543',
               maritalStatus: 'married'
            },
            medicalHistory: {
               chronicDiseases: ['diabetes', 'hypertension'],
               allergies: ['penicillin', 'nuts'],
               currentMedications: ['metformin', 'lisinopril'],
               previousSurgeries: ['appendectomy'],
               familyHistory: ['heart_disease', 'diabetes'],
               smokingHistory: 'former',
               alcoholConsumption: 'no'
            },
            dentalHistory: {
               lastVisit: '2023-12-15',
               chiefComplaint: 'ألم في الضرس العلوي الأيمن',
               previousTreatments: ['root_canal', 'cleaning'],
               oralHygiene: 'good',
               brushingFrequency: 'twice_daily',
               flossing: 'sometimes',
               mouthwash: 'yes'
            },
            createdDate: '2024-01-10',
            lastUpdated: '2024-01-15'
         },
         {
            id: 2,
            personalInfo: {
               name: 'سارة أحمد',
               age: 28,
               gender: 'female',
               phone: '0507654321',
               email: 'sara@email.com',
               address: 'جدة، المملكة العربية السعودية',
               emergencyContact: 'محمد أحمد - 0501111222',
               maritalStatus: 'single'
            },
            medicalHistory: {
               chronicDiseases: [],
               allergies: ['latex'],
               currentMedications: [],
               previousSurgeries: [],
               familyHistory: ['diabetes'],
               smokingHistory: 'never',
               alcoholConsumption: 'no'
            },
            dentalHistory: {
               lastVisit: '2024-01-05',
               chiefComplaint: 'تنظيف دوري',
               previousTreatments: ['cleaning', 'whitening'],
               oralHygiene: 'excellent',
               brushingFrequency: 'twice_daily',
               flossing: 'daily',
               mouthwash: 'yes'
            },
            createdDate: '2024-01-05',
            lastUpdated: '2024-01-10'
         }
      ];
      setPatients(mockPatients);
   }, []);

   const chronicDiseaseOptions = [
      { label: 'السكري', value: 'diabetes' },
      { label: 'ارتفاع ضغط الدم', value: 'hypertension' },
      { label: 'أمراض القلب', value: 'heart_disease' },
      { label: 'الربو', value: 'asthma' },
      { label: 'التهاب المفاصل', value: 'arthritis' },
      { label: 'هشاشة العظام', value: 'osteoporosis' },
      { label: 'أمراض الكلى', value: 'kidney_disease' },
      { label: 'أمراض الكبد', value: 'liver_disease' }
   ];

   const allergyOptions = [
      { label: 'البنسلين', value: 'penicillin' },
      { label: 'اللاتكس', value: 'latex' },
      { label: 'المكسرات', value: 'nuts' },
      { label: 'الأسبرين', value: 'aspirin' },
      { label: 'اليود', value: 'iodine' },
      { label: 'المأكولات البحرية', value: 'seafood' }
   ];

   const treatmentOptions = [
      { label: 'علاج جذور', value: 'root_canal' },
      { label: 'تنظيف أسنان', value: 'cleaning' },
      { label: 'حشوات', value: 'fillings' },
      { label: 'تبييض', value: 'whitening' },
      { label: 'تقويم', value: 'orthodontics' },
      { label: 'زراعة', value: 'implants' },
      { label: 'تركيبات', value: 'prosthetics' },
      { label: 'جراحة', value: 'surgery' }
   ];

   const columns = [
      {
         title: 'اسم المريض',
         key: 'name',
         render: (_, record) => (
            <Space direction="vertical" size={0}>
               <Text strong>{record.personalInfo.name}</Text>
               <Text type="secondary" style={{ fontSize: '12px' }}>
                  {record.personalInfo.age} سنة - {record.personalInfo.gender === 'male' ? 'ذكر' : 'أنثى'}
               </Text>
            </Space>
         ),
      },
      {
         title: 'رقم الهاتف',
         dataIndex: ['personalInfo', 'phone'],
         key: 'phone',
      },
      {
         title: 'آخر زيارة',
         key: 'lastVisit',
         render: (_, record) => 
            record.dentalHistory.lastVisit ? 
            moment(record.dentalHistory.lastVisit).format('DD/MM/YYYY') : 
            'لا توجد زيارات'
      },
      {
         title: 'الشكوى الرئيسية',
         dataIndex: ['dentalHistory', 'chiefComplaint'],
         key: 'chiefComplaint',
         render: (text) => text || 'غير محدد'
      },
      {
         title: 'الحالات المزمنة',
         key: 'chronicDiseases',
         render: (_, record) => (
            <Space wrap>
               {record.medicalHistory.chronicDiseases.length > 0 ? 
                  record.medicalHistory.chronicDiseases.slice(0, 2).map(disease => (
                     <Tag key={disease} color="orange" style={{ borderRadius: '12px' }}>
                        {chronicDiseaseOptions.find(opt => opt.value === disease)?.label || disease}
                     </Tag>
                  )) :
                  <Text type="secondary">لا توجد</Text>
               }
               {record.medicalHistory.chronicDiseases.length > 2 && (
                  <Tag color="blue">+{record.medicalHistory.chronicDiseases.length - 2}</Tag>
               )}
            </Space>
         )
      },
      {
         title: 'الحساسية',
         key: 'allergies',
         render: (_, record) => (
            <Space wrap>
               {record.medicalHistory.allergies.length > 0 ? 
                  record.medicalHistory.allergies.slice(0, 2).map(allergy => (
                     <Tag key={allergy} color="red" style={{ borderRadius: '12px' }}>
                        {allergyOptions.find(opt => opt.value === allergy)?.label || allergy}
                     </Tag>
                  )) :
                  <Text type="secondary">لا توجد</Text>
               }
               {record.medicalHistory.allergies.length > 2 && (
                  <Tag color="blue">+{record.medicalHistory.allergies.length - 2}</Tag>
               )}
            </Space>
         )
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
            </Space>
         ),
      },
   ];

   const handleAdd = () => {
      setSelectedPatient(null);
      setViewMode(false);
      form.resetFields();
      setIsModalVisible(true);
   };

   const handleEdit = (patient) => {
      setSelectedPatient(patient);
      setViewMode(false);
      form.setFieldsValue({
         ...patient.personalInfo,
         ...patient.medicalHistory,
         ...patient.dentalHistory,
         lastVisit: patient.dentalHistory.lastVisit ? moment(patient.dentalHistory.lastVisit) : null
      });
      setIsModalVisible(true);
   };

   const handleView = (patient) => {
      setSelectedPatient(patient);
      setViewMode(true);
      form.setFieldsValue({
         ...patient.personalInfo,
         ...patient.medicalHistory,
         ...patient.dentalHistory,
         lastVisit: patient.dentalHistory.lastVisit ? moment(patient.dentalHistory.lastVisit) : null
      });
      setIsModalVisible(true);
   };

   const handleSubmit = async (values) => {
      try {
         setLoading(true);
         
         const patientData = {
            id: selectedPatient ? selectedPatient.id : Date.now(),
            personalInfo: {
               name: values.name,
               age: values.age,
               gender: values.gender,
               phone: values.phone,
               email: values.email,
               address: values.address,
               emergencyContact: values.emergencyContact,
               maritalStatus: values.maritalStatus
            },
            medicalHistory: {
               chronicDiseases: values.chronicDiseases || [],
               allergies: values.allergies || [],
               currentMedications: values.currentMedications || [],
               previousSurgeries: values.previousSurgeries || [],
               familyHistory: values.familyHistory || [],
               smokingHistory: values.smokingHistory,
               alcoholConsumption: values.alcoholConsumption
            },
            dentalHistory: {
               lastVisit: values.lastVisit ? values.lastVisit.format('YYYY-MM-DD') : null,
               chiefComplaint: values.chiefComplaint,
               previousTreatments: values.previousTreatments || [],
               oralHygiene: values.oralHygiene,
               brushingFrequency: values.brushingFrequency,
               flossing: values.flossing,
               mouthwash: values.mouthwash
            },
            createdDate: selectedPatient ? selectedPatient.createdDate : moment().format('YYYY-MM-DD'),
            lastUpdated: moment().format('YYYY-MM-DD')
         };

         if (selectedPatient) {
            setPatients(prev => 
               prev.map(patient => patient.id === selectedPatient.id ? patientData : patient)
            );
            message.success('تم تحديث التاريخ الطبي بنجاح');
         } else {
            setPatients(prev => [...prev, patientData]);
            message.success('تم إضافة التاريخ الطبي بنجاح');
         }

         setIsModalVisible(false);
         form.resetFields();
      } catch (error) {
         message.error('حدث خطأ أثناء حفظ البيانات');
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
                     <FileTextOutlined style={{ marginLeft: 12 }} />
                     التاريخ الطبي للمرضى
                  </Title>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                     إدارة وتتبع التاريخ الطبي الشامل للمرضى
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
                     إضافة مريض جديد
                  </Button>
               </Col>
            </Row>
         </Card>

         <Card className="clinic-card" style={{ padding: '24px' }}>
            <Table
               columns={columns}
               dataSource={patients || []}
               rowKey="id"
               loading={loading}
               locale={{
                  emptyText: (
                     <Empty
                        description={
                           <div className="empty-state">
                              <FileTextOutlined className="empty-state-icon" />
                              <div className="empty-state-title">لا يوجد مرضى مسجلين</div>
                              <div className="empty-state-description">
                                 ابدأ بإضافة أول مريض وتاريخه الطبي
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
                     `${range[0]}-${range[1]} من أصل ${total} مريض`
               }}
            />
         </Card>

         <Modal
            title={
               viewMode ? 
               `التاريخ الطبي - ${selectedPatient?.personalInfo.name}` :
               selectedPatient ? 'تعديل التاريخ الطبي' : 'إضافة مريض جديد'
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={viewMode ? [
               <Button key="close" onClick={() => setIsModalVisible(false)}>
                  إغلاق
               </Button>
            ] : null}
            width={1000}
         >
            <Form
               form={form}
               layout="vertical"
               onFinish={handleSubmit}
               style={{ marginTop: 20 }}
               disabled={viewMode}
            >
               {/* Personal Information */}
               <Card size="small" title="المعلومات الشخصية" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                     <Col span={8}>
                        <Form.Item
                           name="name"
                           label="الاسم الكامل"
                           rules={[{ required: true, message: 'يرجى إدخال الاسم الكامل' }]}
                        >
                           <Input prefix={<UserOutlined />} placeholder="الاسم الكامل" />
                        </Form.Item>
                     </Col>
                     <Col span={4}>
                        <Form.Item
                           name="age"
                           label="العمر"
                           rules={[{ required: true, message: 'يرجى إدخال العمر' }]}
                        >
                           <Input type="number" placeholder="العمر" />
                        </Form.Item>
                     </Col>
                     <Col span={4}>
                        <Form.Item
                           name="gender"
                           label="الجنس"
                           rules={[{ required: true, message: 'يرجى اختيار الجنس' }]}
                        >
                           <Select placeholder="الجنس">
                              <Option value="male">ذكر</Option>
                              <Option value="female">أنثى</Option>
                           </Select>
                        </Form.Item>
                     </Col>
                     <Col span={8}>
                        <Form.Item
                           name="maritalStatus"
                           label="الحالة الاجتماعية"
                        >
                           <Select placeholder="الحالة الاجتماعية">
                              <Option value="single">أعزب</Option>
                              <Option value="married">متزوج</Option>
                              <Option value="divorced">مطلق</Option>
                              <Option value="widowed">أرمل</Option>
                           </Select>
                        </Form.Item>
                     </Col>
                     <Col span={8}>
                        <Form.Item
                           name="phone"
                           label="رقم الهاتف"
                           rules={[{ required: true, message: 'يرجى إدخال رقم الهاتف' }]}
                        >
                           <Input prefix={<PhoneOutlined />} placeholder="05xxxxxxxx" />
                        </Form.Item>
                     </Col>
                     <Col span={8}>
                        <Form.Item
                           name="email"
                           label="البريد الإلكتروني"
                           rules={[{ type: 'email', message: 'يرجى إدخال بريد إلكتروني صحيح' }]}
                        >
                           <Input prefix={<MailOutlined />} placeholder="email@example.com" />
                        </Form.Item>
                     </Col>
                     <Col span={8}>
                        <Form.Item
                           name="emergencyContact"
                           label="جهة الاتصال في حالات الطوارئ"
                        >
                           <Input placeholder="الاسم - رقم الهاتف" />
                        </Form.Item>
                     </Col>
                     <Col span={24}>
                        <Form.Item
                           name="address"
                           label="العنوان"
                        >
                           <TextArea rows={2} placeholder="العنوان الكامل" />
                        </Form.Item>
                     </Col>
                  </Row>
               </Card>

               {/* Medical History */}
               <Card size="small" title="التاريخ الطبي" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                     <Col span={12}>
                        <Form.Item
                           name="chronicDiseases"
                           label="الأمراض المزمنة"
                        >
                           <Checkbox.Group options={chronicDiseaseOptions} />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item
                           name="allergies"
                           label="الحساسية"
                        >
                           <Checkbox.Group options={allergyOptions} />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item
                           name="currentMedications"
                           label="الأدوية الحالية"
                        >
                           <Select
                              mode="tags"
                              placeholder="أدخل أسماء الأدوية"
                              style={{ width: '100%' }}
                           />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item
                           name="previousSurgeries"
                           label="العمليات الجراحية السابقة"
                        >
                           <Select
                              mode="tags"
                              placeholder="أدخل أسماء العمليات"
                              style={{ width: '100%' }}
                           />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item
                           name="familyHistory"
                           label="التاريخ العائلي"
                        >
                           <Checkbox.Group options={chronicDiseaseOptions} />
                        </Form.Item>
                     </Col>
                     <Col span={6}>
                        <Form.Item
                           name="smokingHistory"
                           label="تاريخ التدخين"
                        >
                           <Radio.Group>
                              <Radio value="never">لا يدخن</Radio>
                              <Radio value="current">يدخن حالياً</Radio>
                              <Radio value="former">أقلع عن التدخين</Radio>
                           </Radio.Group>
                        </Form.Item>
                     </Col>
                     <Col span={6}>
                        <Form.Item
                           name="alcoholConsumption"
                           label="استهلاك الكحول"
                        >
                           <Radio.Group>
                              <Radio value="no">لا</Radio>
                              <Radio value="occasionally">أحياناً</Radio>
                              <Radio value="regularly">بانتظام</Radio>
                           </Radio.Group>
                        </Form.Item>
                     </Col>
                  </Row>
               </Card>

               {/* Dental History */}
               <Card size="small" title="التاريخ السني" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                     <Col span={8}>
                        <Form.Item
                           name="lastVisit"
                           label="آخر زيارة للطبيب"
                        >
                           <DatePicker 
                              style={{ width: '100%' }}
                              placeholder="اختر التاريخ"
                              format="DD/MM/YYYY"
                           />
                        </Form.Item>
                     </Col>
                     <Col span={16}>
                        <Form.Item
                           name="chiefComplaint"
                           label="الشكوى الرئيسية"
                        >
                           <Input placeholder="وصف الشكوى الرئيسية" />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item
                           name="previousTreatments"
                           label="العلاجات السابقة"
                        >
                           <Checkbox.Group options={treatmentOptions} />
                        </Form.Item>
                     </Col>
                     <Col span={6}>
                        <Form.Item
                           name="oralHygiene"
                           label="مستوى نظافة الفم"
                        >
                           <Select placeholder="اختر المستوى">
                              <Option value="poor">ضعيف</Option>
                              <Option value="fair">متوسط</Option>
                              <Option value="good">جيد</Option>
                              <Option value="excellent">ممتاز</Option>
                           </Select>
                        </Form.Item>
                     </Col>
                     <Col span={6}>
                        <Form.Item
                           name="brushingFrequency"
                           label="تكرار تفريش الأسنان"
                        >
                           <Select placeholder="اختر التكرار">
                              <Option value="never">أبداً</Option>
                              <Option value="rarely">نادراً</Option>
                              <Option value="once_daily">مرة يومياً</Option>
                              <Option value="twice_daily">مرتين يومياً</Option>
                              <Option value="after_meals">بعد كل وجبة</Option>
                           </Select>
                        </Form.Item>
                     </Col>
                     <Col span={6}>
                        <Form.Item
                           name="flossing"
                           label="استخدام خيط الأسنان"
                        >
                           <Radio.Group>
                              <Radio value="never">أبداً</Radio>
                              <Radio value="sometimes">أحياناً</Radio>
                              <Radio value="daily">يومياً</Radio>
                           </Radio.Group>
                        </Form.Item>
                     </Col>
                     <Col span={6}>
                        <Form.Item
                           name="mouthwash"
                           label="استخدام غسول الفم"
                        >
                           <Radio.Group>
                              <Radio value="yes">نعم</Radio>
                              <Radio value="no">لا</Radio>
                           </Radio.Group>
                        </Form.Item>
                     </Col>
                  </Row>
               </Card>

               {!viewMode && (
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
                           {selectedPatient ? 'تحديث' : 'إضافة'}
                        </Button>
                     </Space>
                  </Row>
               )}
            </Form>
         </Modal>
      </Content>
   );
};

export default MedicalHistory;