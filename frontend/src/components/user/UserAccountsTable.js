import React, { useState } from 'react';
import { Table, Button, Row, Col, message, Typography, Popconfirm, Input } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateAccountModal from './CreateAccountModal';
import { SolutionOutlined, DeleteFilled } from '@ant-design/icons';

const { Search } = Input;
const { Title, Text } = Typography;

function UserAccountsTable(props) {
   const [state, setState] = useState({
      loading: false,
      searchInput: '',
      users: []
   });



   // componentDidMount() {
   //    getUsers();
   // }

   const getUsers = (searchValue) => {
      setState({ loading: true });


      if (searchValue) {
         const hide = message.loading('Searching...', 0);
         axios.get('users/', {
            params: { search: searchValue }
         })
            .then((response) => {
               setState({ users: response.data.users, loading: false });
               setTimeout(() => {
                  setState({ loading: false });
                  message.info(`${response.data.users.length} user(s) found`);
                  hide();
               }, 500);
            })
            .catch((err) => {
               console.log(err);
            });
      }

      else {
         axios.get('users/')
            .then((response) => {
               setState({ users: response.data.users, loading: false });
               setTimeout(() => {
                  setState({ loading: false });
               }, 500);
            })
            .catch((err) => {
               console.log(err);
            });
      }

   }

   const handleCreate = (values) => {
      const hide = message.loading('Creating New Account...', 0);
      values.birthday = values.birthday.format('YYYY-MM-DD');
      axios.post('users/create', values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Account Created Successfully');
               getUsers();
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });
   }

   const handleDelete = (id) => {
      const hide = message.loading('Deleting Acccount...', 0);
      axios.delete(`users/${id}/delete`)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Account deleted successfully');
               getUsers();
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });
   }


   const handleSearchErased = (e) => {
      const { value } = e.target;
      if (value === '')
         getUsers(value);
   }


   const columns = [
      {
         title: <Text strong>Account Username</Text>,
         dataIndex: 'username',
         render: (text, record) => {
            return record.username;
         }
      },
      {
         title: <Text strong>Name</Text>,
         dataIndex: 'name',
         render: (text, record) => {
            return record.name;
         }
      },
      {
         title: <Text strong>Role</Text>,
         dataIndex: 'role',
         render: (text, record) => {
            return record.role === 'dentist' ? 'Dentist' : record.role === 'dentalaide' ? 'Dental Aide' : 'Patient';
         }
      },
      {
         title: <Text strong>Actions</Text>,
         dataIndex: 'actions',
         render: (text, record) => (
            <>
               <Link to={`/useraccounts/${record.id}`}>
                  <Button style={{ marginRight: 8 }} type="primary"><SolutionOutlined />View User Account</Button>
               </Link>
               <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
                  <Button type="danger"><DeleteFilled />Delete User Account</Button>
               </Popconfirm>
            </>
         )
      }
   ];


   return (
      <>
         <Row type="flex" align="left">
            <Col span={24}>
               <Title level={4} style={{ margin: 0 }}>USER ACCOUNTS</Title>
            </Col>
            <Col align="right" span={24}>
               <CreateAccountModal onCreate={handleCreate} />
            </Col>
         </Row>
         <Row style={{ marginTop: 8 }}>
            <Col span={24}>
               <Search
                  style={{ width: '100%', zIndex: -999 }}
                  placeholder="search user account by name or username"
                  enterButton
                  onSearch={(value) => getUsers(value)}
                  onChange={handleSearchErased}
               />
            </Col>
         </Row>
         <Table
            style={{ marginTop: 8 }}
            size="medium"
            columns={columns}
            dataSource={state.users}
            scroll={{ x: 300 }}
            loading={state.loading}
            rowKey={(record) => record.id}
            pagination={
               {
                  showSizeChanger: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
                  defaultCurrent: 1,
                  pageSize: 8,
                  onChange: (page, pageSize) => {
                     getUsers();

                  }
               }
            }
         />
      </>
   );


}

export default UserAccountsTable;