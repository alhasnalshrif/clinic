import React from 'react';
import { Form, Input, Button } from 'antd';

function UpdateContactForm(props) {

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

   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         console.log(values);
         props.onUpdateContactNumber(values);
      });
   }

   return (
      <Form onSubmit={handleSubmit}>
         <Form.Item style={{ marginBottom: 0 }} initialValue={props.contactNumber} label="Contact Number" name="contact_number" rules={[{ validator: validateContactNumber }]}>
            <Input style={{ width: '75%' }} />
         </Form.Item>
         <Button htmlType="submit" style={{ textAlign: 'right' }}>Update Contact</Button>
      </Form>
   );

}
// );


export default UpdateContactForm;