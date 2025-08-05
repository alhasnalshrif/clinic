import React, { useState, useEffect } from 'react';
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
   Tooltip
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
   FileTextOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MedicalHistory = () => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const [patients, setPatients] = useState([]);
   const [selectedPatient, setSelectedPatient] = useState(null);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [viewMode, setViewMode] = useState(false);

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