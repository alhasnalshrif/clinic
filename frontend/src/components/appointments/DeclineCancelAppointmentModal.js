import React,{useState} from 'react';
import { Modal, Form, Row, Col, Button, Input } from 'antd';
// import moment from 'moment';



function DeclineCancelAppointmentModal(props) {

      const [state, setState] = useState({
         visible: false
      });


      const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         props.onDeclineCancel({
            id: props.appointment.id,
            date_time: props.appointment.date_time,
            name: props.appointment.name,
            contact_number: props.appointment.contact_number,
            type: props.type,
            reasonMessage: values.message
         });
         hideModal();
      });
   }

   const showModal = () => {
      setState({ visible: true });
   }

   const hideModal = () => {
      setState({ visible: false });
      props.form.resetFields();
   }


      const title = props.type === 'decline' ? 'Appointment Decline Reason SMS' : 'Appointment Cancellation Reason SMS';
      const buttonText = props.type === 'decline' ? 'Decline Appointment' : 'Cancel Appointment';
      return (
         <React.Fragment>
            <a disabled={props.disabled} onClick={showModal} target="_blank" rel="noopener noreferrer">{buttonText}</a>

            <Modal
               visible={state.visible}
               title={title}
               okText="Send"
               onCancel={hideModal}
               onOk={handleSubmit}
            >
               <Form layout="vertical" onSubmit={handleSubmit}>
                  <Row gutter={8}>
                     <Col span={24}>
                        <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Message is required' }]} >

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

export default DeclineCancelAppointmentModal;