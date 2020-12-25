import React,{useState} from 'react';
import { Table, Button, Row, Col, message, Typography, Input, Tag } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import CreateDentalRecordModal from '../dental/CreateDentalRecordModal'

const { Search } = Input;
const { Title, Paragraph, Text } = Typography;

function DentalRecordsTable(props) {

      const [state, setState] = useState({
         loading: false,
         patients: [],
         searchInput: '',      
      });

 

   // componentDidMount() {
   //    getPatients();
   // }

   const getPatients=(searchValue)=> {
      setState({ loading: true, search: searchValue });
      if (searchValue) {
         const hide = message.loading('Searching...', 0);
         axios.get('patients', {
            params: { search: searchValue }
         })
            .then((response) => {
               if (response.status === 200) {
                  hide();
                  setState({ patients: response.data.patients });
                  setTimeout(() => {
                     setState({ loading: false });
                     message.info(`${response.data.patients.length} Record(s) found`);
                  }, 500);
               }
            })
            .catch((err) => {
               console.log(err);
               hide();
               message.error('Something went wrong! Please, try again.');
            });

      }
      else {
         axios.get('patients/')
            .then((response) => {
               setState({ patients: response.data.patients, loading: false });
            })
            .catch((err) => {
               console.log(err);
            });
      }
   }

   const handleCreate = (values) => {
      const hide = message.loading('Creating New Dental Record...', 0);
      values.birthday = values.birthday.format('YYYY-MM-DD');
      axios.post('patients/create', values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('New Dental Record Created Successfully');
               getPatients();
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });
   }

   // when search button submits
   // handleSearch = (value) => {
   //    // getPatients(value);
   // }

   const handleSearchErased = (e) => {
      const { value } = e.target;
      if (value === '')
         getPatients(value);
   }


      const columns = [
         {
            title: <Text strong>Name</Text>,
            dataIndex: 'name',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.name.toLowerCase().substring(0, 2) < b.name.toLowerCase().substring(0, 2),
            render: (text, record) => {
               return record.name;
            }
         },
         {
            title: <Text strong>Last Visit</Text>,
            width: 200,
            dataIndex: 'last_visit',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => moment(a.last_visit).format('x') - moment(b.last_visit).format('x'),
            render: (text, record) => {
               const display = !record.last_visit ? (<Tag color="geekblue">New Record</Tag>) : moment(record.last_visit).format('MMMM, DD YYYY');
               return display;
            }
         },
         {
            title: <Text strong>Address</Text>,
            dataIndex: 'address',
            render: (text, record) => {
               return record.address;
            }
         },
         {
            title: <Text strong>Code</Text>,
            dataIndex: 'code',
            render: (text, record) => {
               return <Paragraph copyable={true} >{record.code}</Paragraph>;
            }
         },
         {
            title: <Text strong>Actions</Text>,
            dataIndex: 'actions',
            render: (text, record) => {
               return (
                  <Link to={`/dentalrecords/${record.code}`}>
                     <Button type="primary">View Dental Record</Button>
                  </Link>
               );
            }
         }
      ];


      return (
         <React.Fragment>
            <Title level={4} style={{ margin: 0 }}>DENTAL RECORDS</Title>
            <Row>
               <Col align="right" style={{ marginBottom: '8px' }}>
                  <CreateDentalRecordModal onCreate={handleCreate} />
               </Col>
               <Col span={24}>
                  <Search
                     style={{ width: '100%', zIndex: -999 }}
                     placeholder="search dental record by patient name"
                     enterButton
                     onSearch={(value) => getPatients(value)}
                     onChange={handleSearchErased}
                  />
               </Col>
            </Row>
            <Table
               size="medium"
               columns={columns}
               dataSource={state.patients}
               locale={{ emptyText: state.search === '' ? 'No Data' : 'No Record Found' }}
               scroll={{ x: 300 }}
               loading={state.loading}
               rowKey={(record) => record.id}

               pagination={
                  {
                     position: 'both',
                     showSizeChanger: true,
                     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} dental records`,
                     defaultCurrent: 1,
                     pageSize: 11,
                     onChange: (page, pageSize) => {

                     }
                  }
               }
            />
         </React.Fragment>
      );
   

}

export default DentalRecordsTable;

