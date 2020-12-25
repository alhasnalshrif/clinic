import React,{useState} from 'react';
import { message, Form, Input, Row, Col, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import axios from 'axios';
const { Option } = Select;


   function UpdateAccountForm(props) {

      const [state, setState] = useState({
         selectedRole: ''
      });


   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         props.onUpdate(values);
      });
   }

   const validateEmailFormat = (email) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
   }

   const validateEmail = async (rule, value, callback) => {
      const form = props.form;
      if (validateEmailFormat(value)) {
         if (value) {
            await axios.post(`users/${value}/validateEmail`)
               .then((response) => {
                  if (response.status === 200) {
                     if (!response.data.isValid && response.data.email !== props.account.emailaddress)
                        callback('Email Address already used!');
                     else
                        callback();
                  }
               })
               .catch((err) => {
                  console.log(err);
                  message.error('Internal server error!');
               });
         }
      }
      else if (!validateEmailFormat(value) && value !== '') {
         callback('Invalid Email Address format')
      }
      callback();
   }

   const handleSelectRoleChange = (value) => {
      setState({ selectedRole: value });
   }

      const { account } = props;

      const roleSelect = account.role === 'patient' ? (
         <Select disabled>
            <Option value="dentalaide">Dental Aide</Option>
            <Option value="dentist">Dentist</Option>
         </Select>
      ) : (
            <Select onChange={handleSelectRoleChange}>
               <Option value="dentalaide">Dental Aide</Option>
               <Option value="dentist">Dentist</Option>
            </Select>
         );
      return (
         <React.Fragment>
            <Form layout="vertical" onSubmit={handleSubmit}>
               <Row gutter={8}>
                  <Col span={12}>
                     <Form.Item label="Name" initialValue={account.name || ''} name="name" rules={[{ required: true, message: 'Name is required.' }]} >

                        <Input />

                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Address" initialValue={account.name || ''} name="name" rules={[{ required: true, message: 'name is required.' }]}>

                        <Input />

                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={8}>
                  <Col span={12}>
                     <Form.Item label="Birthday" initialValue={account.birthday || ''} name="birthday" rules={[{ required: true, message: 'Birthday is required.' }]}>

                        <DatePicker disabledDate={(current) => current && current > moment()} format="MMMM DD, YYYY" style={{ width: '100%' }} />

                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     {
                        account.role === 'patient' ? (
                           <Form.Item label="Email Address" initialValue={account.emailaddress || ''} name="emailaddress" rules={[{ required: true, message: 'Email Address is required.' }, { validator: validateEmail }]}>

                              <Input />

                           </Form.Item>
                        )
                           : (
                              <Form.Item label="Role" initialValue={account.role || ''} name="role" rules={[{ required: true, message: 'Role is required.' }]}>
                                
                                    roleSelect
                                
                              </Form.Item>
                           )
                     }
                  </Col>

                  {(account.role === 'dentist' && state.selectedRole !== 'dentalaide') || state.selectedRole === 'dentist' ? (
                     <Col span={24}>
                        <Form.Item label="Email Address" initialValue={account.emailaddress || ''} name="emailaddress" rules={[{ required: true, message: 'Email Address  is required.' }]}>
                           
                              <Input />
                          
                        </Form.Item>
                     </Col>
                  ) : null}


               </Row>
               <Button htmlType="submit">Update</Button>
            </Form>

         </React.Fragment>
      );
   
}


export default UpdateAccountForm;