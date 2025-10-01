import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
   Table, 
   message, 
   Row, 
   Col, 
   Radio, 
   Input, 
   DatePicker, 
   Tag, 
   Typography, 
   Button, 
   Layout,
   Card,
   Statistic,
   Space,
   Modal,
   Form,
   Select,
   InputNumber,
   Tooltip,
   Empty,
   Alert,
   Badge,
   Divider,
   Progress
} from 'antd';
import {
   DollarOutlined,
   CreditCardOutlined,
   CalendarOutlined,
   UserOutlined,
   PrinterOutlined,
   EyeOutlined,
   PlusOutlined,
   SearchOutlined,
   FilterOutlined,
   ReloadOutlined,
   TrophyOutlined,
   WarningOutlined,
   CheckCircleOutlined,
   ClockCircleOutlined,
   DownloadOutlined,
   BankOutlined,
   WalletOutlined
} from '@ant-design/icons';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { getBILLS } from "../redux";
import { connect } from "react-redux";
import { apiService } from '../services/api';

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

function Payments(props) {
   const [state, setState] = useState({
      loading: false,
      paymentTransactions: [],
      search: '',
      selectedFilterBy: 'all',
      rangeDate: []
   });

   const [payment, setPayment] = useState([]);
   const [filteredPayments, setFilteredPayments] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedPayment, setSelectedPayment] = useState(null);
   const [form] = Form.useForm();
   const [viewDetailsModal, setViewDetailsModal] = useState(false);

   // Enhanced mock data for better demonstration
   const [mockPaymentData] = useState([
      {
         id: 1,
         patientName: 'أحمد محمد',
         patientId: 'P001',
         amount: 1500,
         paymentMethod: 'cash',
         status: 'completed',
         date: '2024-01-15',
         description: 'تنظيف وحشو تجميلي',
         invoiceNumber: 'INV-001',
         doctorName: 'د. سارة أحمد',
         remainingBalance: 0
      },
      {
         id: 2,
         patientName: 'فاطمة علي',
         patientId: 'P002',
         amount: 2500,
         paymentMethod: 'card',
         status: 'completed',
         date: '2024-01-14',
         description: 'علاج جذور وتاج',
         invoiceNumber: 'INV-002',
         doctorName: 'د. محمد حسن',
         remainingBalance: 500
      },
      {
         id: 3,
         patientName: 'سالم أحمد',
         patientId: 'P003',
         amount: 800,
         paymentMethod: 'transfer',
         status: 'pending',
         date: '2024-01-13',
         description: 'تقويم - دفعة أولى',
         invoiceNumber: 'INV-003',
         doctorName: 'د. عائشة السالم',
         remainingBalance: 3200
      },
      {
         id: 4,
         patientName: 'نورا خالد',
         patientId: 'P004',
         amount: 1200,
         paymentMethod: 'cash',
         status: 'refunded',
         date: '2024-01-12',
         description: 'زراعة سن - ملغاة',
         invoiceNumber: 'INV-004',
         doctorName: 'د. أحمد الزهراني',
         remainingBalance: 0
      }
   ]);

   useEffect(() => {
      getPaymentsTable();
   }, []);

   const getPaymentsTable = async () => {
      try {
         setState(prev => ({ ...prev, loading: true }));
         
         // Try to get from Redux first
         await props.getBILLS();
         let paymentData = props.payment || [];
         
         // If no data from Redux, try API
         if (paymentData.length === 0) {
            try {
               const res = await apiService.getPayments();
               paymentData = res.data || [];
            } catch (apiError) {
               console.log('API not available, using mock data');
               paymentData = mockPaymentData;
            }
         }
         
         setPayment(paymentData);
         setFilteredPayments(paymentData);
         message.success('تم تحميل بيانات المدفوعات بنجاح');
      } catch (error) {
         console.error('Error fetching payments:', error);
         // Fallback to mock data
         setPayment(mockPaymentData);
         setFilteredPayments(mockPaymentData);
         message.warning('تم تحميل البيانات التجريبية');
      } finally {
         setState(prev => ({ ...prev, loading: false }));
      }
   };

   // Filter payments based on search and filters
   const filterPayments = useCallback(() => {
      let filtered = [...payment];

      // Search filter
      if (state.search) {
         filtered = filtered.filter(p => 
            p.patientName?.toLowerCase().includes(state.search.toLowerCase()) ||
            p.patientId?.includes(state.search) ||
            p.invoiceNumber?.includes(state.search) ||
            p.description?.toLowerCase().includes(state.search.toLowerCase())
         );
      }

      // Status filter
      if (state.selectedFilterBy !== 'all') {
         filtered = filtered.filter(p => p.status === state.selectedFilterBy);
      }

      // Date range filter
      if (state.rangeDate && state.rangeDate.length === 2) {
         const [startDate, endDate] = state.rangeDate;
         filtered = filtered.filter(p => {
            const paymentDate = moment(p.date);
            return paymentDate.isBetween(startDate, endDate, 'day', '[]');
         });
      }

      setFilteredPayments(filtered);
   }, [payment, state.search, state.selectedFilterBy, state.rangeDate]);

   useEffect(() => {
      filterPayments();
   }, [filterPayments]);

   // Calculate payment statistics
   const paymentStats = useMemo(() => {
      const total = payment.reduce((sum, p) => sum + p.amount, 0);
      const completed = payment.filter(p => p.status === 'completed');
      const pending = payment.filter(p => p.status === 'pending');
      const refunded = payment.filter(p => p.status === 'refunded');
      const today = moment().format('YYYY-MM-DD');
      const todayPayments = payment.filter(p => p.date === today);
      const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalBalance = payment.reduce((sum, p) => sum + (p.remainingBalance || 0), 0);

      return {
         totalRevenue: total,
         completedPayments: completed.length,
         pendingPayments: pending.length,
         refundedAmount: refunded.reduce((sum, p) => sum + p.amount, 0),
         todayRevenue: todayTotal,
         totalBalance,
         avgPayment: payment.length > 0 ? Math.round(total / payment.length) : 0
      };
   }, [payment]);

   const handleSearch = (value) => {
      setState(prev => ({ ...prev, search: value }));
   };

   const handleFilterChange = (e) => {
      setState(prev => ({ ...prev, selectedFilterBy: e.target.value }));
   };

   const handleDateRangeChange = (dates) => {
      setState(prev => ({ ...prev, rangeDate: dates }));
   };

   const handleAddPayment = () => {
      setSelectedPayment(null);
      setIsModalVisible(true);
      form.resetFields();
   };

   const handleViewPayment = (payment) => {
      setSelectedPayment(payment);
      setViewDetailsModal(true);
   };

   const handlePrintInvoice = (payment) => {
      const doc = new jsPDF();
      
      // Add Arabic font support (you might need to add Arabic font)
      doc.setFontSize(16);
      doc.text('Invoice / فاتورة', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${payment.invoiceNumber}`, 20, 40);
      doc.text(`Date: ${moment(payment.date).format('DD/MM/YYYY')}`, 20, 50);
      doc.text(`Patient: ${payment.patientName}`, 20, 60);
      doc.text(`Amount: ${payment.amount.toLocaleString()} SAR`, 20, 70);
      doc.text(`Description: ${payment.description}`, 20, 80);
      doc.text(`Doctor: ${payment.doctorName}`, 20, 90);
      doc.text(`Payment Method: ${getPaymentMethodLabel(payment.paymentMethod)}`, 20, 100);
      
      doc.save(`invoice-${payment.invoiceNumber}.pdf`);
      message.success('تم تحميل الفاتورة بنجاح');
   };

   const handleSubmitPayment = async (values) => {
      try {
         setState(prev => ({ ...prev, loading: true }));
         
         const paymentData = {
            ...values,
            id: Date.now(),
            date: values.date.format('YYYY-MM-DD'),
            invoiceNumber: `INV-${String(Date.now()).slice(-6)}`,
            status: 'completed'
         };

         setPayment([...payment, paymentData]);
         message.success('تم إضافة الدفعة بنجاح');
         setIsModalVisible(false);
         form.resetFields();
      } catch (error) {
         message.error('حدث خطأ في إضافة الدفعة');
      } finally {
         setState(prev => ({ ...prev, loading: false }));
      }
   };

   const getStatusColor = (status) => {
      const colors = {
         'completed': 'green',
         'pending': 'orange',
         'refunded': 'red',
         'cancelled': 'gray'
      };
      return colors[status] || 'default';
   };

   const getStatusLabel = (status) => {
      const labels = {
         'completed': 'مكتمل',
         'pending': 'معلق',
         'refunded': 'مسترد',
         'cancelled': 'ملغى'
      };
      return labels[status] || status;
   };

   const getPaymentMethodIcon = (method) => {
      const icons = {
         'cash': <WalletOutlined style={{ color: 'var(--success-color)' }} />,
         'card': <CreditCardOutlined style={{ color: 'var(--primary-color)' }} />,
         'transfer': <BankOutlined style={{ color: 'var(--info-color)' }} />
      };
      return icons[method] || <DollarOutlined />;
   };

   const getPaymentMethodLabel = (method) => {
      const labels = {
         'cash': 'نقدي',
         'card': 'بطاقة ائتمان',
         'transfer': 'حوالة بنكية'
      };
      return labels[method] || method;
   };

   const columns = [
      {
         title: <Text strong>رقم الفاتورة</Text>,
         dataIndex: 'invoiceNumber',
         key: 'invoiceNumber',
         render: (invoiceNumber) => (
            <Text strong style={{ color: 'var(--primary-color)' }}>
               {invoiceNumber}
            </Text>
         ),
      },
      {
         title: <Text strong>المريض</Text>,
         dataIndex: 'patientName',
         key: 'patientName',
         render: (name, record) => (
            <Space direction="vertical" size="small">
               <Text strong>{name}</Text>
               <Text type="secondary" style={{ fontSize: '12px' }}>
                  {record.patientId}
               </Text>
            </Space>
         ),
      },
      {
         title: <Text strong>المبلغ</Text>,
         dataIndex: 'amount',
         key: 'amount',
         render: (amount) => (
            <Text strong style={{ color: 'var(--success-color)', fontSize: '16px' }}>
               {amount.toLocaleString()} ريال
            </Text>
         ),
         sorter: (a, b) => a.amount - b.amount,
      },
      {
         title: <Text strong>طريقة الدفع</Text>,
         dataIndex: 'paymentMethod',
         key: 'paymentMethod',
         render: (method) => (
            <Space>
               {getPaymentMethodIcon(method)}
               <Text>{getPaymentMethodLabel(method)}</Text>
            </Space>
         ),
      },
      {
         title: <Text strong>الحالة</Text>,
         dataIndex: 'status',
         key: 'status',
         render: (status) => (
            <Tag color={getStatusColor(status)}>
               {getStatusLabel(status)}
            </Tag>
         ),
         filters: [
            { text: 'مكتمل', value: 'completed' },
            { text: 'معلق', value: 'pending' },
            { text: 'مسترد', value: 'refunded' },
         ],
         onFilter: (value, record) => record.status === value,
      },
      {
         title: <Text strong>التاريخ</Text>,
         dataIndex: 'date',
         key: 'date',
         render: (date) => moment(date).format('DD/MM/YYYY'),
         sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      },
      {
         title: <Text strong>الرصيد المتبقي</Text>,
         dataIndex: 'remainingBalance',
         key: 'remainingBalance',
         render: (balance) => (
            <Text style={{ 
               color: balance > 0 ? 'var(--warning-color)' : 'var(--success-color)',
               fontWeight: 'bold'
            }}>
               {balance > 0 ? `${balance.toLocaleString()} ريال` : 'مسدد بالكامل'}
            </Text>
         ),
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
                     onClick={() => handleViewPayment(record)}
                     size="small"
                  />
               </Tooltip>
               <Tooltip title="طباعة الفاتورة">
                  <Button
                     type="text"
                     icon={<PrinterOutlined />}
                     onClick={() => handlePrintInvoice(record)}
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
            background: 'linear-gradient(135deg, var(--success-color) 0%, var(--warning-color) 100%)', 
            border: 'none',
            color: 'white'
         }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Space direction="vertical" size="small">
                     <Title level={2} style={{ margin: 0, color: 'white' }}>
                        <DollarOutlined style={{ marginLeft: 12 }} />
                        إدارة المدفوعات
                     </Title>
                     <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)' }}>
                        تتبع وإدارة جميع المدفوعات والفواتير المالية
                     </Text>
                  </Space>
               </Col>
               <Col>
                  <Space size="middle">
                     <Tooltip title="تحديث البيانات">
                        <Button 
                           icon={<ReloadOutlined />}
                           loading={state.loading}
                           onClick={getPaymentsTable}
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
                     <Tooltip title="إضافة دفعة جديدة">
                        <Button 
                           type="default"
                           icon={<PlusOutlined />}
                           size="large"
                           onClick={handleAddPayment}
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           دفعة جديدة
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
                     title={<span style={{ color: 'var(--text-secondary)' }}>إجمالي الإيرادات</span>}
                     value={paymentStats.totalRevenue}
                     prefix={<TrophyOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)', fontSize: '28px', fontWeight: 'bold' }}
                     suffix={<Text type="secondary" style={{ fontSize: '14px' }}>ريال</Text>}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>إيرادات اليوم</span>}
                     value={paymentStats.todayRevenue}
                     prefix={<CalendarOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '28px', fontWeight: 'bold' }}
                     suffix={<Text type="secondary" style={{ fontSize: '14px' }}>ريال</Text>}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>مدفوعات معلقة</span>}
                     value={paymentStats.pendingPayments}
                     prefix={
                        <Badge count={paymentStats.pendingPayments} size="small">
                           <ClockCircleOutlined style={{ color: 'var(--warning-color)' }} />
                        </Badge>
                     }
                     valueStyle={{ color: 'var(--warning-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>أرصدة متبقية</span>}
                     value={paymentStats.totalBalance}
                     prefix={<WarningOutlined style={{ color: 'var(--error-color)' }} />}
                     valueStyle={{ color: 'var(--error-color)', fontSize: '28px', fontWeight: 'bold' }}
                     suffix={<Text type="secondary" style={{ fontSize: '14px' }}>ريال</Text>}
                  />
               </Card>
            </Col>
         </Row>

         {/* Filters Section */}
         <Card className="clinic-card" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Row gutter={[16, 16]} align="middle">
               <Col xs={24} sm={8}>
                  <Search
                     placeholder="البحث في المدفوعات (اسم المريض، رقم الفاتورة، الوصف)"
                     value={state.search}
                     onChange={(e) => handleSearch(e.target.value)}
                     allowClear
                     prefix={<SearchOutlined />}
                  />
               </Col>
               <Col xs={24} sm={6}>
                  <Radio.Group
                     value={state.selectedFilterBy}
                     onChange={handleFilterChange}
                     buttonStyle="solid"
                  >
                     <Radio.Button value="all">الكل</Radio.Button>
                     <Radio.Button value="completed">مكتمل</Radio.Button>
                     <Radio.Button value="pending">معلق</Radio.Button>
                     <Radio.Button value="refunded">مسترد</Radio.Button>
                  </Radio.Group>
               </Col>
               <Col xs={24} sm={6}>
                  <RangePicker
                     value={state.rangeDate}
                     onChange={handleDateRangeChange}
                     placeholder={['من تاريخ', 'إلى تاريخ']}
                     style={{ width: '100%' }}
                     format="DD/MM/YYYY"
                  />
               </Col>
               <Col xs={24} sm={4}>
                  <Space>
                     <Button 
                        onClick={() => setState(prev => ({
                           ...prev,
                           search: '',
                           selectedFilterBy: 'all',
                           rangeDate: []
                        }))}
                        disabled={!state.search && state.selectedFilterBy === 'all' && state.rangeDate.length === 0}
                     >
                        مسح الفلاتر
                     </Button>
                  </Space>
               </Col>
            </Row>
         </Card>

         {/* Main Content */}
         <Card className="clinic-card">
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
               <Space size="middle">
                  <Text type="secondary">
                     النتائج: {filteredPayments.length} من {payment.length} دفعة
                  </Text>
                  <Divider type="vertical" />
                  <Text type="secondary">
                     إجمالي المبلغ المعروض: {filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ريال
                  </Text>
               </Space>
            </div>
            
            <Table
               columns={columns}
               dataSource={filteredPayments}
               rowKey="id"
               loading={state.loading}
               locale={{
                  emptyText: (
                     <Empty
                        description={
                           <div className="empty-state">
                              <DollarOutlined className="empty-state-icon" />
                              <div className="empty-state-title">لا توجد مدفوعات</div>
                              <div className="empty-state-description">
                                 {state.search || state.selectedFilterBy !== 'all' || state.rangeDate.length > 0
                                    ? 'لا توجد مدفوعات تطابق معايير البحث'
                                    : 'لم يتم تسجيل أي مدفوعات حتى الآن'}
                              </div>
                              {(!state.search && state.selectedFilterBy === 'all' && state.rangeDate.length === 0) && (
                                 <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />} 
                                    style={{ marginTop: 16 }}
                                    onClick={handleAddPayment}
                                 >
                                    إضافة دفعة جديدة
                                 </Button>
                              )}
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
                     `${range[0]}-${range[1]} من أصل ${total} دفعة`
               }}
               scroll={{ x: 1200 }}
            />
         </Card>

         {/* Add Payment Modal */}
         <Modal
            title={
               <Space>
                  <PlusOutlined />
                  إضافة دفعة جديدة
               </Space>
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={700}
         >
            <Form
               form={form}
               layout="vertical"
               onFinish={handleSubmitPayment}
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
                        name="amount"
                        label="المبلغ"
                        rules={[{ required: true, message: 'يرجى إدخال المبلغ' }]}
                     >
                        <InputNumber
                           style={{ width: '100%' }}
                           prefix="ريال"
                           min={0}
                           formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                           parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="paymentMethod"
                        label="طريقة الدفع"
                        rules={[{ required: true, message: 'يرجى اختيار طريقة الدفع' }]}
                     >
                        <Select>
                           <Option value="cash">
                              <Space>
                                 <WalletOutlined />
                                 نقدي
                              </Space>
                           </Option>
                           <Option value="card">
                              <Space>
                                 <CreditCardOutlined />
                                 بطاقة ائتمان
                              </Space>
                           </Option>
                           <Option value="transfer">
                              <Space>
                                 <BankOutlined />
                                 حوالة بنكية
                              </Space>
                           </Option>
                        </Select>
                     </Form.Item>
                  </Col>
               </Row>

               <Form.Item
                  name="description"
                  label="وصف الخدمة"
                  rules={[{ required: true, message: 'يرجى إدخال وصف الخدمة' }]}
               >
                  <Input.TextArea rows={2} />
               </Form.Item>

               <Row gutter={16}>
                  <Col span={12}>
                     <Form.Item
                        name="date"
                        label="تاريخ الدفع"
                        rules={[{ required: true, message: 'يرجى اختيار التاريخ' }]}
                        initialValue={moment()}
                     >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item
                        name="doctorName"
                        label="الطبيب المعالج"
                        rules={[{ required: true, message: 'يرجى إدخال اسم الطبيب' }]}
                     >
                        <Input />
                     </Form.Item>
                  </Col>
               </Row>

               <Form.Item
                  name="remainingBalance"
                  label="الرصيد المتبقي (اختياري)"
               >
                  <InputNumber
                     style={{ width: '100%' }}
                     prefix="ريال"
                     min={0}
                     placeholder="0"
                  />
               </Form.Item>

               <Form.Item style={{ textAlign: 'center', marginTop: 'var(--spacing-6)' }}>
                  <Space size="middle">
                     <Button onClick={() => setIsModalVisible(false)}>
                        إلغاء
                     </Button>
                     <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={state.loading}
                        icon={<PlusOutlined />}
                     >
                        إضافة الدفعة
                     </Button>
                  </Space>
               </Form.Item>
            </Form>
         </Modal>

         {/* Payment Details Modal */}
         <Modal
            title={
               <Space>
                  <EyeOutlined />
                  تفاصيل الدفعة
               </Space>
            }
            open={viewDetailsModal}
            onCancel={() => setViewDetailsModal(false)}
            footer={null}
            width={600}
         >
            {selectedPayment && (
               <div>
                  <Card size="small" style={{ background: 'var(--bg-secondary)', marginBottom: 16 }}>
                     <Row gutter={[16, 16]}>
                        <Col span={12}>
                           <Text strong>رقم الفاتورة:</Text> {selectedPayment.invoiceNumber}
                        </Col>
                        <Col span={12}>
                           <Text strong>المريض:</Text> {selectedPayment.patientName}
                        </Col>
                        <Col span={12}>
                           <Text strong>المبلغ:</Text> 
                           <Text style={{ color: 'var(--success-color)', fontWeight: 'bold', marginLeft: 8 }}>
                              {selectedPayment.amount.toLocaleString()} ريال
                           </Text>
                        </Col>
                        <Col span={12}>
                           <Text strong>التاريخ:</Text> {moment(selectedPayment.date).format('DD/MM/YYYY')}
                        </Col>
                        <Col span={12}>
                           <Text strong>طريقة الدفع:</Text>
                           <Space style={{ marginLeft: 8 }}>
                              {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                              {getPaymentMethodLabel(selectedPayment.paymentMethod)}
                           </Space>
                        </Col>
                        <Col span={12}>
                           <Text strong>الحالة:</Text>
                           <Tag color={getStatusColor(selectedPayment.status)} style={{ marginLeft: 8 }}>
                              {getStatusLabel(selectedPayment.status)}
                           </Tag>
                        </Col>
                     </Row>
                  </Card>

                  <Card size="small">
                     <Text strong>وصف الخدمة:</Text>
                     <div style={{ marginTop: 8, padding: 12, background: 'var(--bg-secondary)', borderRadius: 6 }}>
                        {selectedPayment.description}
                     </div>
                  </Card>

                  {selectedPayment.remainingBalance > 0 && (
                     <Alert
                        message="رصيد متبقي"
                        description={
                           <Text>
                              يوجد رصيد متبقي بمبلغ <Text strong style={{ color: 'var(--warning-color)' }}>
                                 {selectedPayment.remainingBalance.toLocaleString()} ريال
                              </Text>
                           </Text>
                        }
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                     />
                  )}

                  <div style={{ textAlign: 'center', marginTop: 20 }}>
                     <Button 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        onClick={() => handlePrintInvoice(selectedPayment)}
                     >
                        تحميل الفاتورة
                     </Button>
                  </div>
               </div>
            )}
         </Modal>
      </Content>
   );
}

const mapStateToProps = state => {
   return {
      payment: state.payment?.payments || []
   };
};

export default connect(
   mapStateToProps,
   { getBILLS }
)(Payments);
