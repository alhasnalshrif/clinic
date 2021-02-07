import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker, Select, Button } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;



function CreateDentalRecord(props) {
   const [form] = Form.useForm();



   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         props.onCreate(values);
      });
   }





   const validateContactNumber = (rule, value, callback) => {

      const myRegex = /^(09|\+639)\d{9}$/;

      if (!value)
         callback();
      else if (isNaN(parseInt(value)) || (myRegex.exec(value) == null && (value.length < 11 || value.length > 11))) {
         console.log(value.length);
         callback('Invalid Contact Number');
      }
      else
         callback();

   }


   return (
      <>


         <Form layout="vertical" onSubmit={handleSubmit}
            form={form}>
            <Row>
               <Col span={24}>
                  <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>

                     <Input />

                  </Form.Item>
               </Col>
            </Row>
            <Row gutter={8}>
               <Col span={12}>
                  <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Address is required' }]}>

                     <Input />

                  </Form.Item>
               </Col>
               <Col span={12}>
                  <Form.Item label="Birthday" name="birthday" rules={[{ required: true, message: 'Birthday is required' }]}>

                     <DatePicker disabledDate={(current) => current && current > moment()} format="MMMM DD, YYYY" style={{ width: '100%' }} />

                  </Form.Item>
               </Col>
            </Row>

            <Row gutter={8}>
               <Col span={12}>
                  <Form.Item label="Occupation" name="occupation" >

                     <Input />

                  </Form.Item>
               </Col>

               <Col span={12}>
                  <Form.Item label="Civil Status" name="civil_status">

                     <Select>
                        <Option value="single">Single</Option>
                        <Option value="married">Married</Option>
                        <Option value="widowed">Widowed</Option>
                        <Option value="separated">Separated</Option>
                     </Select>

                  </Form.Item>
               </Col>
            </Row>
            <Row>
               <Col span={24}>
                  <Form.Item label="Contact Number" name="contact_number" rules={[{ validator: validateContactNumber }]}>

                     <Input />

                  </Form.Item>
               </Col>
            </Row>
            <Button type="primary" htmlType="submit">
               <UsergroupAddOutlined />
                  Create New Dental Record
               </Button>
         </Form>

      </>
   );

}

export default CreateDentalRecord;