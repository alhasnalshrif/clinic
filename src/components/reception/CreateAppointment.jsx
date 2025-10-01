import React, { useState, useEffect } from 'react';
import { message, Form, Input, Row, Col, DatePicker, Select, Button, Card, Typography } from 'antd';
import moment from 'moment';
import { PlusCircleFilled, CalendarOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';

import { connect } from "react-redux";
import { createABNT } from "../../redux";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

function CreateAppointment(props) {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);

   const disabledDate = (current) => {
      // Disable dates before today and Sundays
      return current && (current < moment().startOf('day') || moment(current).day() === 0);
   };

   const disabledDateTime = () => {
      return {
         disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23],
         disabledMinutes: () => [],
      };
   };

   const onFinish = async (values) => {
      try {
         setLoading(true);
         const formData = {
            patient: values.patient,
            reason: values.reason,
            doctor: values.doctor,
            date: values.date ? values.date.format('YYYY-MM-DD HH:mm:ss') : null,
            notes: values.notes
         };

         await props.createABNT(formData);
         message.success('تم إنشاء الموعد بنجاح');
         form.resetFields();
      } catch (error) {
         message.error('حدث خطأ أثناء إنشاء الموعد');
      } finally {
         setLoading(false);
      }
   };

   const patients = Array.isArray(props.patient) ? props.patient : [];

   return (
      <Form
         form={form}
         layout="vertical"
         onFinish={onFinish}
         style={{ maxWidth: 800 }}
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
                        <CalendarOutlined style={{ marginLeft: 8 }} />
                        التاريخ والوقت
                     </span>
                  }
                  name="date"
                  rules={[{ required: true, message: 'يرجى اختيار التاريخ والوقت' }]}
               >
                  <DatePicker
                     showTime={{
                        use12Hours: true,
                        format: 'h:mm A',
                        defaultValue: moment('09:00', 'HH:mm')
                     }}
                     format="DD/MM/YYYY h:mm A"
                     placeholder="اختر التاريخ والوقت"
                     disabledDate={disabledDate}
                     disabledTime={disabledDateTime}
                     style={{ width: '100%' }}
                     size="large"
                  />
               </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
               <Form.Item
                  label={
                     <span style={{ fontWeight: 500 }}>
                        <MedicineBoxOutlined style={{ marginLeft: 8 }} />
                        اسم الطبيب
                     </span>
                  }
                  name="doctor"
                  rules={[{ required: true, message: 'يرجى إدخال اسم الطبيب' }]}
               >
                  <Input 
                     placeholder="أدخل اسم الطبيب" 
                     size="large"
                  />
               </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
               <Form.Item
                  label={
                     <span style={{ fontWeight: 500 }}>
                        سبب الزيارة
                     </span>
                  }
                  name="reason"
                  rules={[{ required: true, message: 'يرجى إدخال سبب الزيارة' }]}
               >
                  <Input 
                     placeholder="مثال: فحص دوري، ألم في الأسنان..." 
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
                     placeholder="أي ملاحظات أو تفاصيل إضافية..."
                     maxLength={500}
                     showCount
                  />
               </Form.Item>
            </Col>
         </Row>

         <Form.Item style={{ marginBottom: 0 }}>
            <Button 
               type="primary" 
               htmlType="submit" 
               icon={<PlusCircleFilled />}
               size="large"
               loading={loading}
               block
               style={{ 
                  height: 48,
                  fontSize: 16,
                  fontWeight: 500
               }}
            >
               إنشاء موعد جديد
            </Button>
         </Form.Item>
      </Form>
   );
}

const mapStateToProps = state => {
   return {
      patient: state.patient.patients,
   };
};

export default connect(
   mapStateToProps,
   { createABNT }
)(CreateAppointment);
