import React,{useState} from 'react';
import { Modal, Form, InputNumber, Row, Col, Button } from 'antd';
// import moment from 'moment';

function PayInstallmentModal(props) {

      const [state, setState] = useState({
         visible: false
      });



      const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         values.current_balance_before = parseInt(props.currentBalance);
         props.onPay(props.treatmentId, values);
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

   const checkBalance = (rule, value, callback) => {
      const { currentBalance } = props;;
      if ((value > currentBalance) || (value < 1 && currentBalance))
         callback('Cannot be lower or greater than current balance');
      else
         callback();
   }

     
      return (
         <React.Fragment>
            <a disabled={props.disabled} onClick={showModal} target="_blank" rel="noopener noreferrer">Pay Installment</a>
            <Modal
               visible={state.visible}
               title="Pay Installment"
               okText="Pay"
               onCancel={hideModal}
               onOk={handleSubmit}
            >
               <Form layout="vertical" onSubmit={handleSubmit}>
                  <Row gutter={8}>
                     <Col span={24}>
                        <Form.Item label="Amount Paid" name="amount_paid" rules={[{ required: true, message: 'Amount Paid is required' }]}>
                          
                              <InputNumber style={{ width: '100%' }} min={1} />
                           
                        </Form.Item>
                     </Col>
                     {/* <Col span={12}>
                        <Form.Item label="Date Paid">
                           {getFieldDecorator('date_paid', {
                              rules: [{ required: true, message: 'Date Paid is required.' }],
                           })(
                           <DatePicker disabledDate={(current) => current && current > moment()} format="MMMM DD, YYYY" style={{width: '100%'}} />
                           )}
                        </Form.Item>
                     </Col> */}
                  </Row>
                  <Button hidden htmlType="submit"></Button>
               </Form>
            </Modal>
         </React.Fragment>
      );
   
}

export default PayInstallmentModal;