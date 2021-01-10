import React, { useState, useEffect } from 'react';
import { Table, message, Row, Col, Radio, Input, DatePicker, Tag, Typography, Button, Layout } from 'antd';
import moment from 'moment';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { getBILLS } from "../redux";
import { connect } from "react-redux";

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Title, Text } = Typography;


function Payments(props) {

   const [state, setState] = useState({
      loading: true,
      paymentTransactions: [],
      search: '',
      selectedFilterBy: '',
      rangeDate: []
   });



   const componentDidMount = () => {
      getPaymentTransactions();
   }

   useEffect(() => {
      props.getBILLS();
      // return () => {
      //    cleanup
      // };
   }, []);

   // paymentTransactions
console.log(props.bill)

   const getPaymentTransactions = (search = '', dates = []) => {

      let hide;
      if (search !== '')
         hide = message.loading('Searching...', 0);
      if (dates.length === 2) {
         setState({ loading: true });
         axios.get(`paymentTransactions`, {
            params: {
               startDate: dates[0].format('YYYY-MM-DD'),
               endDate: dates[1].format('YYYY-MM-DD'),
               search
            }
         })
            .then((response) => {
               if (response.status === 200) {
                  setTimeout(() => {
                     if (search !== '') {
                        hide();
                        message.info(`${response.data.paymentTransactions.length} payment(s) found`);
                     }
                     setState({ loading: false, paymentTransactions: response.data.paymentTransactions });
                  }, 300);
               }
            })
            .catch((err) => {
               console.log(err);
               message.error('Something went wrong! Please, try again.');
            });
      }

      else {
         setState({ loading: true });
         axios.get(`paymentTransactions`, {
            params: {
               search
            }
         })
            .then((response) => {
               if (response.status === 200) {
                  setTimeout(() => {
                     if (search !== '') {
                        hide();
                        message.info(`${response.data.paymentTransactions.length} payment(s) found`);
                     }
                     setState({ loading: false, paymentTransactions: response.data.paymentTransactions });
                  }, 300);
               }
            })
            .catch((err) => {
               console.log(err);
               message.error('Something went wrong! Please, try again.');
            });
      }

   }

   const handleSearchChange = (e) => {
      const { value } = e.target;
      setState({ search: value });
      if (value === '')
         getPaymentTransactions(value, state.rangeDate);
   }


   const onRadioChange = (e) => {
      const { value: filterBy } = e.target;
      setState({ selectedFilterBy: filterBy });
      if (filterBy === 'day')
         setState({ rangeDate: [moment(), moment()] });
      else if (filterBy === 'week')
         setState({ rangeDate: [moment().startOf('week'), moment().endOf('week')] });
      else if (filterBy === 'month')
         setState({ rangeDate: [moment().startOf('month'), moment().endOf('month')] });
      else if (filterBy === 'year')
         setState({ rangeDate: [moment().startOf('year'), moment().endOf('year')] });
      getPaymentTransactions(state.search, state.rangeDate);
   }

   const onRangePickerChange = (dates, dateStrings) => {
      setState({ selectedFilterBy: '' });
      setState({ rangeDate: dates });
      getPaymentTransactions(state.search, state.rangeDate);
   }

   const handlePrint = () => {

      const body = [];
      let total = 0;
      state.paymentTransactions.forEach(({ date_paid, amount_paid, payment_type, from, received_by }) => {
         total += amount_paid;
         body.push({
            date_paid: moment(date_paid).format('MMMM DD, YYYY'),
            amount_paid: amount_paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            payment_type,
            from,
            received_by
         });
      });

      const doc = new jsPDF({
         format: [612, 792]
      });
      const totalPagesExp = "{total_pages_count_string}";

      // Header
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

      doc.setFontSize(16);
      // doc.setFontStyle('bold');
      doc.text('Andres Dental Clinic', pageWidth - 68, 10);
      doc.setFontSize(10);
      doc.setTextColor(53, 53, 53);
      // doc.setFontStyle('normal');
      doc.text('One.O.5ive Department Store', pageWidth - 60, 14);
      doc.text('J. P. Rizal Street, Barangay 18', pageWidth - 62, 18);
      doc.text('Laoag City, 2900 Ilocos Norte', pageWidth - 60, 22);
      doc.text('09212451903', pageWidth - 35, 26);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Transaction Log', 15, 32);
      const [startDate, endDate] = state.rangeDate;
      doc.setFontSize(10);

      if (startDate && endDate) {
         doc.setTextColor(53, 53, 53);
         doc.text(`(${moment(startDate).format('MMMM DD, YYYY')} - ${moment(endDate).format('MMMM DD, YYYY')})`, 54, 32);
         doc.setTextColor(0, 0, 0);
      }

      doc.autoTable({
         columns: [
            { header: 'Date Paid', dataKey: 'date_paid' },
            { header: 'Amount Paid', dataKey: 'amount_paid' },
            { header: 'Payment Type', dataKey: 'payment_type' },
            { header: 'From', dataKey: 'from' },
            { header: 'Received By', dataKey: 'received_by' },
         ],
         body,
         didDrawPage: (data) => {
            // Footer
            var str = "Page " + doc.internal.getNumberOfPages()
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
               str = str + " of " + totalPagesExp;
            }
            // doc.setFontStyle('normal');

            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
            doc.text(str, data.settings.margin.left, pageHeight - 10);
            doc.text(`Generated on ${moment(Date.now()).format('MMMM DD, YYYY hh:mmA')}`, pageWidth - 73, pageHeight - 10);

         },
         startY: 34,
         showHead: 'firstPage',
      });

      doc.line(15, doc.autoTable.previous.finalY + 3, pageWidth - 15, doc.autoTable.previous.finalY + 3); // horizontal line  
      // doc.setFontStyle('bold');
      doc.text('TOTAL:', 15, doc.autoTable.previous.finalY + 8);
      doc.text(`${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 48, doc.autoTable.previous.finalY + 8);
      if (typeof doc.putTotalPages === 'function')
         doc.putTotalPages(totalPagesExp);

      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
   }



   const columns = [
      {
         title: <Text strong>Date Paid</Text>,
         dataIndex: 'date_paid',
         render: (text, record) => {
            const display = moment(record.date_paid).format('MMMM DD, YYYY') === moment(Date.now()).format('MMMM DD, YYYY') ? <Tag color="geekblue">Today</Tag>
               : moment(record.date_paid).format('MMMM DD, YYYY');
            return display;
         }
      },
      {
         title: <Text strong>Amount Paid</Text>,
         dataIndex: 'amount_paid',
         render: (text, record) => {
            return '₱' + record.amount_paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         }
      },
      {
         title: <Text strong>Payment Type</Text>,
         dataIndex: 'payment_type',
         render: (text, record) => {
            return record.payment_type.substring(0, 1).toUpperCase() + record.payment_type.substring(1, record.payment_type.length);
         }
      },
      {
         title: <Text strong>From</Text>,
         dataIndex: 'from',
         render: (text, record) => {
            return record.from;
         }
      },
      {
         title: <Text strong>Received By</Text>,
         dataIndex: 'received_by',
         render: (text, record) => {
            return record.received_by;
         }
      }
   ];

   return (
      <Layout style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <Title level={4} style={{ margin: 0 }}>TRANSACTION LOG</Title>
         <Row align="middle" gutter={8}>
            <Col style={{ marginBottom: 8 }} span={24}>
               <Search
                  style={{ width: '100%', zIndex: -999 }}
                  placeholder="search payment log by patient name"
                  enterButton
                  onSearch={(value) => getPaymentTransactions(value, state.rangeDate)}
                  onChange={handleSearchChange}
               />
            </Col>
            <Col span={12} align="right">
               <Radio.Group value={state.selectedFilterBy} onChange={onRadioChange}>
                  <Radio.Button value="day">All Today</Radio.Button>
                  <Radio.Button value="week">All Week</Radio.Button>
                  <Radio.Button value="month">All Month</Radio.Button>
                  <Radio.Button value="year">All Year</Radio.Button>
               </Radio.Group>
            </Col>
            <Col style={{ marginBottom: 8 }} span={12}>
               <RangePicker allowClear={true} value={state.rangeDate} format="MMMM DD, YYYY" onChange={onRangePickerChange} style={{ width: '100%' }} />
            </Col>
         </Row>
         <Row>
            <Col align="right">
               <Button onClick={handlePrint} type="primary"> Print Transaction Log</Button>
            </Col>
         </Row>
         <Table
            loading={state.loading}
            dataSource={state.paymentTransactions}
            size="medium"
            columns={columns}
            scroll={{ x: 500 }}
            rowKey={(record) => record.id}
            pagination={
               {
                  position: 'both',
                  showSizeChanger: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
                  defaultCurrent: 1,
                  pageSize: 15,
                  onChange: (page, pageSize) => {
                     getPaymentTransactions(state.search, state.rangeDate);
                  }
               }
            }
         />
      </Layout>
   );



}


const mapStateToProps = state => {
   return {

      bill: state.bill.bills,
   };
};


export default connect(
   mapStateToProps,
   { getBILLS }
)(Payments);
