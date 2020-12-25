import React,{useState} from 'react';
import { Form, Input, Row, Col, Button, message } from 'antd';
import axios from 'axios';


function UpdateAccountCredentialsForm(props) {

   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields(async (err, values) => {
         if (err)
            return
         await props.onUpdate(values);
         props.form.setFieldsValue({ password: '' });
         props.form.setFieldsValue({ confirm_password: '' });

      });
   }

   const compareToFirstPassword = (rule, value, callback) => {
      const form = props.form;
      if (value && value !== form.getFieldValue('password')) {
         callback('Two passwords that you enter is inconsistent!');
      }
      else if (form.getFieldValue('password') && !value) {
         callback('Please confirm your password');
      }
      else {
         callback();
      }
   }


   const validateToNextPassword = (rule, value, callback) => {
      // const form = props.form;
      // if (value) {
      // //   form.validateFields(['confirm_password'], { force: true });
      // }
      callback();
   }

   const validateUsername = async (rule, value, callback) => {
      // const form = props.form;
      if (value)
         await axios.post(`users/${value}/validate`)
            .then((response) => {
               if (response.status === 200) {
                  if (!response.data.isValid && response.data.username !== props.account.username)
                     callback('Username already taken!');
                  else
                     callback();
               }
            })
            .catch((err) => {
               console.log(err);
               message.error('Internal server error!');
            });
      else
         callback();

   }

   
      const { account } = props;

      return (
         <React.Fragment>
            <Form layout="vertical" onSubmit={handleSubmit}>
               <Row gutter={8}>
                  <Col span={24}>
                     <Form.Item label="Username" initialValue={account.username || ''} name="username" rules={[{ required: true, message: 'Username is required.' }, { validator: validateUsername }]} >

                        <Input />

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="New Password" name="username" rules={[{ required: true, message: 'password is required.' }, { validator: validateToNextPassword }]}>

                        <Input.Password />

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="Confirm New Password" name="confirm_password" rules={[{ required: true, message: 'Please confirm your password' }, { validator: validateToNextPassword }]}>

                        <Input.Password />

                     </Form.Item>
                  </Col>
               </Row>
               <Button htmlType="submit">Update</Button>
            </Form>
         </React.Fragment>
      );
   
}

export default UpdateAccountCredentialsForm;