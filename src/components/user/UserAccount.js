import React from 'react';
import { Tabs, Row, Col} from 'antd';
import { Link } from 'react-router-dom';
import UpdateAccountForm from './UpdateAccountForm';
import UpdateAccountCredentialsForm from './UpdateAccountCredentialsForm';
import { ArrowLeftOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;


function UserAccount(props) {

   // const [state, setState] = useState({
   //    account: {}
   // });

   // componentDidMount() {
   //    getUserAccount(props.id);
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


   // const handleUpdate = (values) => {

   //    const hide = message.loading('Updating Account...', 0);
   //    if (values.birthday)
   //       values.birthday = values.birthday.format('YYYY-MM-DD');


   //    axios.patch(`users/${state.account.id}/update`, values)
   //       .then((response) => {
   //          if (response.status === 200) {
   //             hide();
   //             message.success('Account Updated Successfully');
   //          }
   //       })
   //       .catch((err) => {
   //          console.log(err);
   //          hide();
   //          message.error('Something went wrong! Please, try again.');
   //       });

   // }

   return (
      <>
         <Row style={{ marginBottom: 21 }}>
            <Col align="left">
               <Link to="/useraccounts"> <ArrowLeftOutlined /> Back to User Accounts</Link>
            </Col>
         </Row>
         <Tabs tabPosition="left" defaultActiveKey="1">
            <TabPane tab="Personal Info" key="1">
               <UpdateAccountForm />
               {/* <UpdateAccountForm onUpdate={handleUpdate} account={state.account} /> */}
            </TabPane>
            <TabPane tab="Account Credentials" key="2">
               <UpdateAccountCredentialsForm />
               {/* <UpdateAccountCredentialsForm onUpdate={handleUpdate} account={state.account} /> */}
            </TabPane>
         </Tabs>
      </>
   );


}

export default UserAccount;