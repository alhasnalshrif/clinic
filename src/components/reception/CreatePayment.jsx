import React, { useState, useEffect } from 'react';
import { message, Form, Input, Row, Col, InputNumber, Select, Button, Divider, Typography, Space, Card } from 'antd';
import { 
   PlusCircleFilled, 
   DollarOutlined, 
   UserOutlined, 
   CreditCardOutlined,
   FileTextOutlined 
} from '@ant-design/icons';

import { connect } from "react-redux";
import { apiService } from "../../services/api";

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

function CreatePayment(props) {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const [totalAmount, setTotalAmount] = useState(0);

   const handleAmountChange = (value) => {
      setTotalAmount(value || 0);
   };

   const onFinish = async (values) => {
      try {
         setLoading(true);
         
         const paymentData = {
            patient_id: values.patient,
            amount: values.amount,
            payment_method: values.payment_method,
            description: values.description,
            notes: values.notes,
            status: 'completed'
         };

         message.success('تم إنشاء الفاتورة بنجاح');
         form.resetFields();
         setTotalAmount(0);
      } catch (error) {
         console.error('Payment creation error:', error);
         message.error('حدث خطأ أثناء إنشاء الفاتورة');
      } finally {
         setLoading(false);
      }
   };

   const patients = Array.isArray(props.patient) ? props.patient : [];

   return (
      <div style={{ maxWidth: 800 }}>
         {/* Payment Summary Card */}
         <Card 
            style={{ 
               marginBottom: 24,
               background: 'linear-gradient(135deg, var(--success-color) 0%, var(--info-color) 100%)',
               border: 'none'
            }}
         >
            <Row align="middle" justify="space-between">
               <Col>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                     المبلغ الإجمالي
                  </Text>
               </Col>
               <Col>
                  <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                     {totalAmount.toFixed(2)} ر.س
                  </Title>
               </Col>
            </Row>
         </Card>

         <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
         >
            <Row gutter={16}>
               <Col xs={24} sm={12}>
                  <Form.Item
                     label={
                        <span style={{ fontWeight: 500 }}>
                           <UserOutlined style={{ marginLeft: 8 }} />
                           اسم المريض
                        </span>
                     }
                     name="patient"
                     rules={[{ required: true, message: 'يرجى اختيار المريض' }]}
                  >
                     <Select
                        showSearch
                        placeholder="اختر المريض"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        size="large"
                     >
                        {patients.map(p => (
                           <Option key={p.id} value={p.id}>{p.name}</Option>
                        ))}
                     </Select>
                  </Form.Item>
               </Col>

               <Col xs={24} sm={12}>
                  <Form.Item
                     label={
                        <span style={{ fontWeight: 500 }}>
                           <DollarOutlined style={{ marginLeft: 8 }} />
                           المبلغ (ر.س)
                        </span>
                     }
                     name="amount"
                     rules={[
                        { required: true, message: 'يرجى إدخال المبلغ' },
                        { type: 'number', min: 0, message: 'يجب أن يكون المبلغ أكبر من صفر' }
                     ]}
                  >
                     <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.00"
                        min={0}
                        precision={2}
                        size="large"
                        onChange={handleAmountChange}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                     />
                  </Form.Item>
               </Col>

               <Col xs={24} sm={12}>
                  <Form.Item
                     label={
                        <span style={{ fontWeight: 500 }}>
                           <CreditCardOutlined style={{ marginLeft: 8 }} />
                           طريقة الدفع
                        </span>
                     }
                     name="payment_method"
                     rules={[{ required: true, message: 'يرجى اختيار طريقة الدفع' }]}
                  >
                     <Select placeholder="اختر طريقة الدفع" size="large">
                        <Option value="cash">نقداً</Option>
                        <Option value="card">بطاقة ائتمان</Option>
                        <Option value="transfer">تحويل بنكي</Option>
                        <Option value="insurance">تأمين</Option>
                     </Select>
                  </Form.Item>
               </Col>

               <Col xs={24} sm={12}>
                  <Form.Item
                     label={
                        <span style={{ fontWeight: 500 }}>
                           <FileTextOutlined style={{ marginLeft: 8 }} />
                           وصف الخدمة
                        </span>
                     }
                     name="description"
                     rules={[{ required: true, message: 'يرجى إدخال وصف الخدمة' }]}
                  >
                     <Input 
                        placeholder="مثال: علاج جذور، تنظيف أسنان..." 
                        size="large"
                     />
                  </Form.Item>
               </Col>

               <Col span={24}>
                  <Form.Item
                     label={
                        <span style={{ fontWeight: 500 }}>
                           ملاحظات إضافية
                        </span>
                     }
                     name="notes"
                  >
                     <TextArea
                        rows={3}
                        placeholder="أي ملاحظات أو تفاصيل إضافية عن الدفعة..."
                        maxLength={500}
                        showCount
                     />
                  </Form.Item>
               </Col>
            </Row>

            <Divider />

            <Form.Item style={{ marginBottom: 0 }}>
               <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button 
                     size="large"
                     onClick={() => {
                        form.resetFields();
                        setTotalAmount(0);
                     }}
                  >
                     إلغاء
                  </Button>
                  <Button 
                     type="primary" 
                     htmlType="submit" 
                     icon={<PlusCircleFilled />}
                     size="large"
                     loading={loading}
                     style={{ 
                        minWidth: 160,
                        height: 48,
                        fontSize: 16,
                        fontWeight: 500
                     }}
                  >
                     إنشاء فاتورة
                  </Button>
               </Space>
            </Form.Item>
         </Form>
      </div>
   );
}

const mapStateToProps = state => {
   return {
      patient: state.patient.patients,
   };
};

export default connect(mapStateToProps)(CreatePayment);
