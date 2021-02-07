import React, { useState } from 'react';
import { Layout, Tabs, Typography, message } from 'antd';
import UpdateAccountForm from '../components/user/UpdateAccountForm';
import UpdateAccountCredentialsForm from '../components/user/UpdateAccountCredentialsForm';
import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

function UserAccountSettings(props) {
   const [state, setState] = useState({
      account: {}
   });


   // componentDidMount() {
   //    getUserAccount(props.user.id);
   // }

   // const getUserAccount = (id) => {
   //    axios.get(`users/${id}`)
   //       .then((response) => {
   //          if (response.status === 200)
   //             setState({ account: response.data.user });
   //       })
   //       .catch((err) => {
   //          console.log(err);
   //          message.error('Something went wrong! Please, try again.');
   //       });
   // }


   const handleUpdate = (values) => {

      const hide = message.loading('Updating Account...', 0);
      if (values.birthday)
         values.birthday = values.birthday.format('YYYY-MM-DD');
      values.role = state.account.role;

      axios.patch(`users/${state.account.id}/update`, values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Account Updated Successfully');
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });

   }

   console.log(state.account);
   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <Title level={4}>ACCOUNT SETTINGS</Title>
         <Tabs tabPosition="top" defaultActiveKey="1">
            <TabPane tab="Personal Info" key="1">
               <UpdateAccountForm onUpdate={handleUpdate} account={state.account} />
            </TabPane>
            <TabPane tab="Account Credentials" key="2">
               <UpdateAccountCredentialsForm onUpdate={handleUpdate} account={state.account} />
            </TabPane>
         </Tabs>
      </Content>
   );
}


export default UserAccountSettings;

