import React, { useState } from 'react';
import { Modal, Form, Row, Col, Button, Input } from 'antd';



function SendCustomMessageModal(props) {
   const [form] = Form.useForm();

   const [state, setState] = useState({
      visible: false
   });


   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         props.sendCustomMessage(values.message);
         hideModal();
      });
   }

   const showModal = () => {
      setState({ visible: true });
   }

   const hideModal = () => {
      setState({ visible: false });
      form.resetFields();
   }


   return (
      <React.Fragment>
         <Button disabled={props.disabled} onClick={showModal} style={{ marginRight: 8 }} type="primary">Send Custom Message</Button>
         <Modal
            visible={state.visible}
            title="Send Custom Message"
            okText="Send"
            onCancel={hideModal}
            onOk={handleSubmit}
         >
            <Form layout="vertical" onSubmit={handleSubmit} form={form}>

               <Row gutter={8}>
                  <Col span={24}>
                     <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Message is required.' }]}>

                        <Input.TextArea autosize={{ minRows: 8, maxRows: 8 }} />

                     </Form.Item>
                  </Col>
               </Row>
               <Button hidden htmlType="submit"></Button>
            </Form>
         </Modal>
      </React.Fragment>
   );

}

export default SendCustomMessageModal;