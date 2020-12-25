import React, { useState } from 'react';
import { Button, Modal, Icon, Row, Col, Divider, Tooltip } from 'antd';
import DescriptionItem from './DescriptionItem';
import moment from 'moment';



function ViewAccountModal(props) {

   const [state, setState] = useState({
      visible: false
   });



   const showModal = () => {
      setState({ visible: true });
   }

   const hideModal = () => {
      setState({ visible: false });
   }

   const { account } = props;
   return (
      <React.Fragment>
         <Tooltip title="View Account">
            <Button onClick={showModal} type="primary"><Icon type="profile" /></Button>
         </Tooltip>
         <Modal
            title={<h2>Account Info</h2>}
            visible={state.visible}
            okButtonProps={{ style: { display: 'none' } }}
            cancelText={<React.Fragment><Icon type="close" />Close</React.Fragment>}
            onCancel={hideModal}
            width="100%"
            style={{ maxWidth: '650px' }}

         >
            <Divider orientation="left">Personal</Divider>
            <Row>
               <Col span={12}>
                  <DescriptionItem title="Name" content={account.name} />
               </Col>
               <Col span={8}>
                  <DescriptionItem title="Role" content={account.role === 'dentist' ? 'Dentist' : 'Dental Aide'} />
               </Col>
            </Row>
            <Row>
               <Col span={12}>
                  <DescriptionItem title="Address" content={account.address} />
               </Col>
               <Col span={12}>
                  <DescriptionItem title="Birthday" content={moment(account.birthday).format('MMMM DD, YYYY')} />
               </Col>
            </Row>
            <Divider orientation="left">Credentials</Divider>
            <Row>
               <Col>
                  <DescriptionItem title="Username" content={account.username} />
               </Col>

            </Row>
            <Row>
               <Col>
                  <DescriptionItem title="Password" content={account.password} />
               </Col>
            </Row>
         </Modal>
      </React.Fragment>
   );

}




export default ViewAccountModal;