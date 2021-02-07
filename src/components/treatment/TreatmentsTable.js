import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Dropdown, Menu, Button, message, Tag, Typography, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';

import AddTreatmentModal from './AddTreatmentModal';

import InstallmentPaymentsHistoryModal from '../payments/InstallmentPaymentsHistoryModal';
import PayInstallmentModal from '../payments/PayInstallmentModal';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DownCircleFilled, PrinterFilled } from '@ant-design/icons';


const { Text } = Typography;

const balanceStatus = (paymentType, balance) => {
   if (paymentType === 'in-full')
      return <Tag color="blue">Fully Paid</Tag>;
   else if (paymentType === 'no-charge')
      return <Tag color="green">No Charge</Tag>
   else if (paymentType === 'installment')
      return balance === 0 ? <Tag color="blue">Fully Paid</Tag> : <Tag color="red">{'₱' + balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>;
}




function TreatmentsTable(props) {

   const [state, setState] = useState({
      loading: true,
      filterByBalance: false,
      treatments: []
   });


   console.log(state.treatments);


   useEffect(() => {

      getTreatments();


   }, []);

   console.log(state.treatments);


   const getTreatments = () => {
      setState({ loading: true });
      axios.get(`${process.env.REACT_APP_API_URL}/treatments/${props.patientId}/`)
         .then((response) => {
            if (response.status === 200) {
               setState({ treatments: response.data });

            }
         })
         .catch((err) => {
            console.log(err);
            message.error('Something went wrong! Please, try again.');
         });
   }

   const handleAddTreatment = (values) => {
      const hide = message.loading('Adding New Treatment...', 0);
      // values.date_treated = values.date_treated.format('YYYY-MM-DD');
      axios.post(`${process.env.REACT_APP_API_URL}/treatments/${props.patientId}/`, values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('New Treatment Added Sucessfully');
               getTreatments();
               // props.getPatient();
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Someting went wrong! Please, try again');
         });
   }
   console.log(state.treatments);

   const handlePayInstallment = (id, values) => {
      const hide = message.loading('Processing Payment...', 0);
      // values.date_paid = values.date_paid.format('YYYY-MM-DD');
      axios.post(`${process.env.REACT_APP_API_URL}/payment/${id}/`, values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Payment Processed Sucessfully');
               getTreatments();
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Someting went wrong! Please, try again');
         });
   }

   const handleDeleteTreatment = (id) => {
      Modal.info({
         title: 'Are you sure?',
         content: 'Are you sure to delete this treatment? This action cannot be undone.',
         onOk: () => {
            const hide = message.loading('Deleting Treatment...', 0);
            // values.date_paid = values.date_paid.format('YYYY-MM-DD');
            axios.delete(`${process.env.REACT_APP_API_URL}/treatments/${id}/`)
               .then((response) => {
                  if (response.status === 200) {
                     hide();
                     message.success('Treatment Deleted Sucessfully');
                     getTreatments();
                  }
               })
               .catch((err) => {
                  console.log(err);
                  hide();
                  message.error('Someting went wrong! Please, try again');
               });
         },
         onCancel() { },
      });
   }


   // PRINT PAYMENT RECEIPT FOR FULLY PAID TREATMENT
   const handlePrintPaymentReceipt = (treatment) => {
      const doc = new jsPDF({
         format: [612, 792]
      });

      // const pageSize = doc.internal.pageSize;
      // const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      // const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

      doc.setFontSize(10);
      // doc.setFontStyle('bold');
      doc.text('Almasa Dental Clinic', 15, 10);
      doc.setFontSize(8);
      doc.setTextColor(53, 53, 53);
      // doc.setFontStyle('normal');
      doc.text('One.O.5ive Department Store', 15, 13);
      doc.text('J. P. Rizal Street, Barangay 18', 15, 16);
      doc.text('Laoag City, 2900 Ilocos Norte', 15, 19);
      doc.text('01276328326', 15, 22);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Receipt #: ${treatment.id + '00'}`, 15, 28);
      doc.text(`Date: ${moment(treatment.date_treated).format('MMMM DD, YYYY')}`, 15, 32);
      doc.text(`Payment Type: ${treatment.payment_type}`, 15, 36);
      doc.text(`For: ${treatment.description}`, 15, 40);
      // doc.setFontStyle('bold');

      doc.line(15, 42, 100, 42); // horizontal line 
      // doc.text(`Amount Paid: P${treatment.total_amount_to_pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 15, 46);
      doc.line(15, 49, 100, 49); // horizontal line 




      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');

   }

   const handleVoidLastPaymentTransaction = (id) => {
      Modal.info({
         title: 'Are you sure?',
         content: 'Are you sure to void the last payment transaction made on this treatment? This action cannot be undone.',
         onOk: () => {
            const hide = message.loading('Voiding Last Payment Transaction...', 0);
            // values.date_paid = values.date_paid.format('YYYY-MM-DD');
            axios.delete(`${process.env.REACT_APP_API_URL}/treatments/${id}/voidLastPaymentTransaction`)
               .then((response) => {
                  if (response.status === 200) {
                     hide();
                     message.success('Last Payment Transaction Voided Successfully');
                     getTreatments();
                  }
               })
               .catch((err) => {
                  console.log(err);
                  hide();
                  message.error('Someting went wrong! Please, try again');
               });
         },
         onCancel() { },
      });
   }

   console.log(state.treatments);

   const columns = [
      {
         title: <Text strong>Description</Text>,
         width: 190,
         fixed: 'left',
         dataIndex: 'description',
         render: (text, record) => {
            return record.description;
         }
      },
      {
         title: <Text strong>Tooth No</Text>,
         dataIndex: 'tooth_affected_no',
         render: (text, record) => {
            return !record.tooth_affected_no ? 'N/A' : record.tooth_affected_no;
         }
      },
      {
         title: <Text strong>Date Treated</Text>,
         dataIndex: 'date_treated',
         render: (text, record) => {
            return moment(record.date_treated).format('MMMM DD, YYYY');
         }
      },
      {
         title: <Text strong>Treated By</Text>,
         dataIndex: 'treated_by',
         render: (text, record) => {
            return record.treated_by;
         }
      },
      {
         title: <Text strong>Payment Type</Text>,
         dataIndex: 'payment_type',
         render: (text, record) => {
            // return record.payment_type.substring(0, 1).toUpperCase() + record.payment_type.substring(1, record.payment_type.length);
            return record.payment_type;
         }
      },
      {
         title: <Text strong>Total Amount To Pay</Text>,
         dataIndex: 'total_amount_to_pay',
         render: (text, record) => {
            return !record.total_amount_to_pay ? '₱' + 0 : '₱' + record.total_amount_to_pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         }
      },
      {
         title: <Text strong>Balance</Text>,
         dataIndex: 'balance',
         filters: [{
            text: 'Fully Paid',
            value: 'fully-paid',
         }, {
            text: 'No Charge',
            value: 'no-charge',
         }, {
            text: 'Has Balance',
            value: 'balance',
         }],
         filterMultiple: false,
         onFilter: (value, record) => {
            if (value === 'balance')
               return record.balance > 0
            else if (value === 'fully-paid') {
               return record.balance === 0;
            }
            return !record.balance && record.payment_type === 'no-charge'
         },
         render: (text, record) => {
            return balanceStatus(record.payment_type, record.balance);
         }
      },
      {
         title: <Text strong>Actions</Text>,
         width: 80,
         fixed: 'right',
         dataIndex: 'actions',
         render: (text, record) => {

            console.log(record.transaction_count);

            if (record.payment_type !== 'installment') {
               const fullyPaidMenu = (
                  <Menu>
                     <Menu.Item>
                        <a href={() => false} onClick={() => handlePrintPaymentReceipt(record)} target="_blank" rel="noopener noreferrer"><PrinterFilled />Print Receipt</a>
                     </Menu.Item>
                     {
                        // props.role === 'dentist' ? (
                        <Menu.Item>
                           <a href={() => false} onClick={() => handleDeleteTreatment(record.id)} target="_blank" rel="noopener noreferrer">Delete Treatment</a>
                        </Menu.Item>
                        // ) : (null)
                     }

                  </Menu>
               );
               return (
                  <Dropdown overlay={fullyPaidMenu}>
                     <Button>
                        Actions <DownCircleFilled />
                     </Button>
                  </Dropdown>
               );
            }

            const disabled = parseInt(record.balance) === 0 ? true : false;

            // INSTALLMENT PAYMENT TYPE ACTIONS
            const installmentMenu = (

               <Menu>
                  { disabled ? (
                     <Menu.Item disabled>
                        <PayInstallmentModal treatmentId={record.id} currentBalance={record.balance} onPay={handlePayInstallment} />
                     </Menu.Item>
                  ) : (
                        <Menu.Item>
                           <PayInstallmentModal treatmentId={record.id} currentBalance={record.balance} onPay={handlePayInstallment} />
                        </Menu.Item>
                     )}

                  <Menu.Item>
                     <InstallmentPaymentsHistoryModal treatment={record} treatmentId={record.id} />
                  </Menu.Item>

                  {/* {props.role === 'dentist' && record.transaction_count === 1 ? ( */}
                  <Menu.Item>
                     <a href={() => false} onClick={() => handleDeleteTreatment(record.id)} target="_blank" rel="noopener noreferrer">Delete Treatment</a>
                  </Menu.Item>
                  {/*  ) : props.role === 'dentist' && record.transaction_count > 1 ? ( */}
                  <Menu.Item>
                     <a href={() => false} onClick={() => handleVoidLastPaymentTransaction(record.id)} target="_blank" rel="noopener noreferrer">Void Last Payment Transaction</a>
                  </Menu.Item>
                  {/*  ) : (null)} */}
               </Menu>

            );

            return (
               <Dropdown overlay={installmentMenu} trigger={['click']}>
                  <Button>
                     <DownCircleFilled />
                     Actions
                  </Button>
               </Dropdown>
            );
         }
      }
   ];

   return (
      <>
         <Row align="bottom" style={{ marginTop: 8, marginBottom: 8 }}>
            <Col style={{ marginBottom: 8 }} span={24} align="right">
               <AddTreatmentModal onAdd={handleAddTreatment} />
            </Col>
         </Row>

         <Table
            loading={state.loading}
            dataSource={state.treatments}
            size="medium"
            // width="100%"
            columns={columns}
            scroll={{ x: 1000 }}
            rowKey={(record) => record.id}
            pagination={
               {
                  // position: 'both',
                  // showSizeChanger: true,
                  // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} treatments`,
                  // defaultCurrent: 1,
                  // pageSize: 8,

               }
            }
         />
      </>
   );
}


export default TreatmentsTable;