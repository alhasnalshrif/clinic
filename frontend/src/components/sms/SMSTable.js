import React,{useState} from 'react';
import { Table, Typography, Row, Col, Button, Input, DatePicker, Tag, message, Divider } from 'antd';
import moment from 'moment';
import axios from 'axios';
import SendCustomMessageModal from './SendCustomMessageModal';
import { ScheduleOutlined } from '@ant-design/icons';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;



function SMSTable(props) {

      const [state, setState] = useState({
         loading: false,
         searchInput: '',
         recipients: [],
         selectedRowKeys: [],
         lastVisitFilter: [],
         nextAppointmmentFilter: [],
         currentDataSource: [],
         customMessageButton: false,
         balanceNoticeButton: false,
         appointmentNoticeButton: false,
         disabledBalanceArr: [],
         disabledAppointmentArr: []      
      });

  

   // componentDidMount() {
   //    getRecipients();
   // }

   const getRecipients = (searchValue) => {
      setState({ loading: true, search: searchValue });
      if (searchValue) {
         const hide = message.loading('Searching...', 0);
         axios.get('sms/', {
            params: { search: searchValue }
         })
            .then((response) => {
               if (response.status === 200) {
                  hide();
                  setState({ recipients: response.data.recipients, currentDataSource: response.data.recipients });
                  setTimeout(() => {
                     setState({ loading: false });
                     message.info(`${response.data.recipients.length} Record(s) found`);
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
         axios.get('sms/')
            .then((response) => {
               setState({ recipients: response.data.recipients, currentDataSource: response.data.recipients, loading: false });
            })
            .catch((err) => {
               console.log(err);
            });
      }
   }

   const handleSendCustomMessage = (customMessage) => {
      const recipients = [];
      state.selectedRowKeys.forEach((id) => {
         const recipient = state.currentDataSource.find((obj) => obj.id === id);
         recipients.push(recipient);
      });

      const hide = message.loading(`Sending message to ${recipients.length} recipient(s)`, 0);
      axios.post('sms/sendCustomMessage', {
         message: customMessage,
         recipients
      })
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Message(s) Successfully Sent');
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });

   }

   const handleSendBalanceNotice = () => {
      const recipients = [];
      state.selectedRowKeys.forEach((id) => {
         const recipient = state.currentDataSource.find((obj) => obj.id === id);
         recipients.push(recipient);
      });

      const hide = message.loading(`Sending message to ${recipients.length} recipient(s)`, 0);
      axios.post('sms/sendBalanceNotice', {
         recipients
      })
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Message(s) Successfully Sent');
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });

   }

   const handleSendAppointmentNotice = () => {
      const recipients = [];
      state.selectedRowKeys.forEach((id) => {
         const recipient = state.currentDataSource.find((obj) => obj.id === id);
         recipients.push(recipient);
      });

      const hide = message.loading(`Sending message to ${recipients.length} recipient(s)`, 0);
      axios.post('sms/sendAppointmentNotice', {
         recipients
      })
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Message(s) Successfully Sent');
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
         getRecipients(value);
   }

   const lastVisitFilterProps = (dataIndex) => ({
      filterDropdown: ({
         setSelectedKeys, selectedKeys, confirm, clearFilters,
      }) => (
            <div style={{ padding: 8 }}>
               <RangePicker
                  value={state.lastVisitFilter}
                  onChange={(dates) => {
                     setState({ lastVisitFilter: dates ? dates : [] });
                     setSelectedKeys(dates ? [dates] : [])
                  }
                  }
                  disabledDate={(current) => current && current >= moment()} format="MMMM DD, YYYY" />
               <Row style={{ marginTop: 8 }}>
                  <Col align="right">
                     <Button
                        type="primary"
                        onClick={() => handleLastVisitFilter(selectedKeys, confirm)}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                     >
                        Filter
                  </Button>
                     <Button
                        onClick={() => handleLastVisitReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                     >
                        Reset
                  </Button>
                  </Col>
               </Row>
            </div>
         ),
      filterIcon: filtered => <ScheduleOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (filterValue, record, a) => {
         return moment(record[dataIndex]).isBetween(filterValue[0], filterValue[1]);
      },
   })

   const handleLastVisitFilter = (selectedKeys, confirm) => {
      confirm();
      setState({ lastVisitFilter: selectedKeys[0] });
   }

   const handleLastVisitReset = (clearFilters) => {
      clearFilters();
      setState({ lastVisitFilter: [] });
   }

   const nextAppointmentFilterProps = (dataIndex) => ({
      filterDropdown: ({
         setSelectedKeys, selectedKeys, confirm, clearFilters,
      }) => (
            <div style={{ padding: 8 }}>
               <RangePicker
                  value={state.nextAppointmmentFilter}
                  onChange={(dates) => {
                     setState({ nextAppointmmentFilter: dates ? dates : [] });
                     setSelectedKeys(dates ? [dates] : [])
                  }
                  }
                  disabledDate={(current) => current && current <= moment()} format="MMMM DD, YYYY" />
               <Row style={{ marginTop: 8 }}>
                  <Col align="right">
                     <Button
                        type="primary"
                        onClick={() => handleNextAppointmentFilter(selectedKeys, confirm)}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                     >
                        Filter
                  </Button>
                     <Button
                        onClick={() => handleNextAppointmentReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                     >
                        Reset
                  </Button>
                  </Col>
               </Row>
            </div>
         ),
      filterIcon: filtered => <ScheduleOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
         onFilter: (filterValue, record, a) => {
            return moment(record[dataIndex]).isBetween(filterValue[0], filterValue[1]);
         },
   })

const handleNextAppointmentFilter = (selectedKeys, confirm) => {
   confirm();
   setState({ nextAppointmmentFilter: selectedKeys[0] });
}

const handleNextAppointmentReset = (clearFilters) => {
   clearFilters();
   setState({ nextAppointmmentFilter: [] });
}

const onSelectChange = async (selectedRowKeys) => {
   await setState({ selectedRowKeys });
   updateButtons();
}

const onUnselectAll = async () => {
   await setState({ selectedRowKeys: [] });
   updateButtons();
}


// UPDATES THE APPROPRIATE BUTTONS TO BE ENABLED
// THE ALGORITHM IS QUITE A MESS :(
   const updateButtons = () => {

   state.disabledBalanceArr.forEach((element) => {
      const isExistArr = state.selectedRowKeys.filter((key) => key === element.id);
      if (isExistArr.length <= 0) {
         const newDisabledBalanceArr = [...state.disabledBalanceArr];
         for (var i = 0; i < newDisabledBalanceArr.length; i++) {
            if (newDisabledBalanceArr[i].id === element.id) {
               newDisabledBalanceArr.splice(i, 1);
            }
         }
         setState({
            disabledBalanceArr: newDisabledBalanceArr
         });
      }
   });

   state.disabledAppointmentArr.forEach((element) => {
      const isExistArr = state.selectedRowKeys.filter((key) => key === element.id);
      if (isExistArr.length <= 0) {
         const newDisabledAppointmentArr = [...state.disabledAppointmentArr];
         for (var i = 0; i < newDisabledAppointmentArr.length; i++) {
            if (newDisabledAppointmentArr[i].id === element.id) {
               newDisabledAppointmentArr.splice(i, 1);
            }
         }
         setState({
            disabledAppointmentArr: newDisabledAppointmentArr
         });
      }
   });


   if (state.selectedRowKeys.length === 0) {
      setState({
         customMessageButton: false,
         balanceNoticeButton: false,
         appointmentNoticeButton: false
      });
   }
   else {

      let balanceNoticeButton = false;
      let appointmentNoticeButton = false;

      state.selectedRowKeys.forEach((selectedRowKey) => {
         // CHECKPOINT April 14 5:01AM
         const obj = state.currentDataSource.find((element) => element.id === selectedRowKey);
         if (obj.total_balance > 0 && state.disabledBalanceArr.length <= 0)
            balanceNoticeButton = true;
         else if (obj.total_balance <= 0) {
            balanceNoticeButton = false;
            const newDisabledBalanceArr = [...state.disabledBalanceArr];
            const isExist = newDisabledBalanceArr.find((element) => element.id === selectedRowKey);
            if (!isExist)
               newDisabledBalanceArr.push(obj);
            setState({
               disabledBalanceArr: newDisabledBalanceArr
            });
         }

         if (obj.next_appointment && state.disabledAppointmentArr.length <= 0) {
            appointmentNoticeButton = true;
         }
         else if (!obj.next_appointment) {
            appointmentNoticeButton = false;
            const newDisabledAppointmentArr = [...state.disabledAppointmentArr];
            const isExist = newDisabledAppointmentArr.find((element) => element.id === selectedRowKey);
            if (!isExist)
               newDisabledAppointmentArr.push(obj);
            setState({
               disabledAppointmentArr: newDisabledAppointmentArr
            });
         }

      });

      setState({
         customMessageButton: true,
         balanceNoticeButton,
         appointmentNoticeButton
      });


   }

}


   const { selectedRowKeys } = state;

   const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      hideDefaultSelections: true,
      // onSelection: onSelection,
      getCheckboxProps: record => ({
         disabled: !record.contact_number, // Column configuration not to be checked
      }),
      selections: [
         {
            key: 'all',
            text: 'Select all',
            onSelect: async (changableRowKeys) => {
               let selectedRowKeys = [];
               state.currentDataSource.forEach((record) => {
                  if (record.contact_number)
                     selectedRowKeys.push(record.id);
               });
               await setState({ selectedRowKeys });
               updateButtons();
            },
         },
         {
            key: 'balance',
            text: 'Select has balance',
            onSelect: async (changableRowKeys) => {
               let selectedRowKeys = [];
               state.currentDataSource.forEach((record) => {
                  if (record.total_balance > 0 && record.contact_number)
                     selectedRowKeys.push(record.id);
               });
               await setState({ selectedRowKeys });
               updateButtons();
            },
         },
         {
            key: 'appointment',
            text: 'Select has appointment',
            onSelect: async (changableRowKeys) => {
               let selectedRowKeys = [];
               state.currentDataSource.forEach((record) => {
                  if (record.next_appointment && record.contact_number)
                     selectedRowKeys.push(record.id);
               });
               await setState({ selectedRowKeys });
               updateButtons();
            }
         }
      ],
   };

   const columns = [
      {
         title: <Text strong>Name</Text>,
         dataIndex: 'name',
      }, {
         title: <Text strong>Contact Number</Text>,
         dataIndex: 'contact_number',
         render: (text, record) => {
            return !record.contact_number ? <Tag>Not Available</Tag> : record.contact_number;
         }
      }, {
         title: <Text strong>Last Visit</Text>,
         dataIndex: 'last_visit',
         render: (text, record) => {
            return !record.last_visit ? <Tag color="geekblue">New Record</Tag> : moment(record.last_visit).format('MMMM DD, YYYY');
         },
         ...lastVisitFilterProps('last_visit')
      }, {
         title: <Text strong>Total Balance</Text>,
         dataIndex: 'total_balance',
         render: (text, record) => {
            return record.total_balance > 0 ? <Tag color="red">{'₱' + record.total_balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag> : <Tag>None</Tag>
         }
      }, {
         title: <Text strong>Next Appointment</Text>,
         dataIndex: 'next_appointment',
         render: (text, record) => {
            return !record.next_appointment ? <Tag>None</Tag> : (<React.Fragment>
               <Text>{moment(record.next_appointment).format('MMMM DD, YYYY')}</Text>
               <Divider type="vertical" />
               <Text>{moment(record.next_appointment).format('h:mm A')}</Text>
            </React.Fragment>);
         },
         ...nextAppointmentFilterProps('next_appointment')
      }
   ];

   const hasSelected = selectedRowKeys.length > 0;

   return (
      <React.Fragment>
         <Title level={4} style={{ margin: 0 }}>SMS</Title>
         <Row>
            <Col span={24}>
               <Search
                  style={{ width: '100%', zIndex: -999 }}
                  placeholder="search recipient by name"
                  enterButton
                  onSearch={(value) => getRecipients(value)}
                  onChange={handleSearchErased}
               />
            </Col>
         </Row>
         {/* <Row style={{marginTop: 12}} type="flex" justify="end">
               <Col span={12}>
                  <RangePicker allowClear={true} format="MMMM DD, YYYY" style={{width: '100%'}} />
               </Col>
            </Row> */}
         <Row style={{ marginTop: 12 }}>
            <Col span={8} align="left">
               <Button onClick={onUnselectAll} disabled={!hasSelected} >Unselect all</Button>
               <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} row(s)` : ''}
               </span>
            </Col>
            <Col span={16} align="right">
               <SendCustomMessageModal disabled={!state.customMessageButton} sendCustomMessage={handleSendCustomMessage} />
               <Button disabled={!state.balanceNoticeButton} onClick={handleSendBalanceNotice} style={{ marginRight: 8 }} type="primary">Send Balance Notice</Button>
               <Button disabled={!state.appointmentNoticeButton} onClick={handleSendAppointmentNotice} type="primary">Send Appointment Notice</Button>
            </Col>
         </Row>
         <Table
            onChange={(pagination, filters, sorter, { currentDataSource }) => {
               setState({ currentDataSource });
            }}
            loading={state.loading}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={state.recipients}
            rowKey={(record) => record.id}
            pagination={
               {
                  position: 'both',
                  showSizeChanger: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} patients`,
                  defaultCurrent: 1,
                  pageSize: 8,
                  onChange: (page, pageSize) => {
                     // getPaymentTransactions(state.search, state.rangeDate);
                  }
               }
            }
         />
      </React.Fragment>
   );



}

export default SMSTable;


