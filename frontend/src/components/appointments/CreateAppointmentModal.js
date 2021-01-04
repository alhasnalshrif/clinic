import React, { useState } from 'react';
import { message, Modal, Form, Input, Row, Col, DatePicker, Select, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PlusCircleFilled } from '@ant-design/icons';

const { Option } = Select;



function CreateAppointmentModal(props) {
   const [form] = Form.useForm();

   const [state, setState] = useState({
      visible: false,
      searchPatientInputData: []
   });



   const handleSearch = (value) => {
      // ajax stuff
      axios.get('patients', {
         params: { search: value }
      })
         .then((response) => {
            if (response.status === 200)
               setState({ searchPatientInputData: response.data.patients });
         })
         .catch((err) => {
            console.log(err);
            message.error('Something went wrong! Please, try again.');
         });
   }

   const handleSearchChange = (value) => {
      props.form.setFieldsValue({ patient_id: value });
   }


   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         props.onCreate(values);
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


   const disabledDateTime = () => {
      return {
         disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23],
      };
   }




   // const options = state.searchPatientInputData.map(d => <Option key={d.id}>{d.name}</Option>)

   return (
      <React.Fragment>
         <Button onClick={showModal} type="primary"><PlusCircleFilled />Create New Appointment</Button>
         <Modal
            visible={state.visible}
            title="Create a New Appointment"
            okText="Create"
            onCancel={hideModal}
            onOk={handleSubmit}
         >
            <Form layout="vertical" onSubmit={handleSubmit}
               form={form}>
               <Row gutter={8}>
                  <Col span={24}>
                     <Form.Item label="Date and Time" name="date_time" rules={[{ required: true, message: 'Date and Time is required.' }]} >


                        <DatePicker
                           disabledTime={disabledDateTime}
                           disabledDate={(current) => current && current < moment() || moment(current).day() === 0}
                           placeholder="Select date and time" style={{ width: '100%' }}
                           showTime={
                              {
                                 use12Hours: true, format: 'h:mm',
                                 defaultValue: moment('8:00', 'h:mm')
                              }
                           }
                           format="MMMM DD, YYYY h:mm A" />

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="Patient Name" name="patient_id" rules={[{ required: true, message: 'Patient name is required' }]}>

                        <Select
                           allowClear
                           showSearch
                           placeholder=""
                           defaultActiveFirstOption={false}
                           showArrow={false}
                           filterOption={false}
                           onSearch={handleSearch}
                           // onChange={handleChange}
                           notFoundContent={null}
                        >
                           {/* {options} */}
                        </Select>

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="Reason" name="reason" rules={[{ required: true, message: 'Reason is required.' }]}>

                        <Input />

                     </Form.Item>
                  </Col>
               </Row>
               <Button hidden htmlType="submit"></Button>
            </Form>
         </Modal>
      </React.Fragment>
   );

}

export default CreateAppointmentModal;