import React from 'react';
import UserAccountsTable from '../components/user/UserAccountsTable';
import { Layout } from 'antd';
import UserAccount from '../components/user/UserAccount';

const { Content } = Layout;

function UserAccounts(props) {



   const { id: match } = props.match.params;
   if (match)
      return (
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <UserAccount id={match} />
         </Content>
      );
   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <UserAccountsTable />
      </Content>
   );

}

export default UserAccounts;