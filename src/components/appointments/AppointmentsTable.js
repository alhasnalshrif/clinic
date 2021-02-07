import React, { useState } from 'react';
import { Modal, message, Menu, Dropdown, Badge, Button, Table, Row, Col, Input, Typography, DatePicker, Radio, Divider } from 'antd';
import moment from 'moment';
import { connect } from "react-redux";

import axios from 'axios';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { confirm } = Modal;
const { Search } = Input;
const { Text } = Typography;


function AppointmentsTable(props) {

   const [state, setState] = useState({
      search: '',
      selectedFilterBy: '',
      rangeDate: [],
   });




   const handleDeclineCancelAppointment = (values, id) => {

      const hide = message.loading(`${values.type === 'cancel' ? 'Cancelling' : 'Declining'} appointment...`, 0);
      axios.delete(`appointments/${id}/delete`, values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success(`Appointment Successfully ${values.type === 'cancel' ? 'Cancelled' : 'Declined'} `);
               // props.getAppointments(state.search, state.rangeDate);
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });

   }





   const handleNoContactNumber = (values) => {
      confirm({
         title: `Are you sure to ${values.type} this appointment?!`,
         content: 'This patient does not have available contact number, therefore will not be notified through SMS.',
         okText: 'Yes',
         onOk: () => {
            handleDeclineCancelAppointment(values);
         },
         onCancel() {
         },
      });
   }




   const handlePrint = () => {

      const body = [];
      let total = 0;
      // state.paymentTransactions.forEach(({ date_paid, amount_paid, payment_type, from, received_by }) => {
      props.appointments.forEach(({ date_paid, amount_paid, payment_type, from, received_by }) => {
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
         title: <Text strong>Patient Name</Text>,
         dataIndex: 'name',
         render: (text, record) => {
            return record.patient;
         }
      },
      {
         title: <Text strong>Date and Time</Text>,
         dataIndex: 'date',
         render: (text, record) => {
            const date = moment(record.date).format('MMMM DD, YYYY');
            const time = moment(record.date).format('h:mm A');
            return (
               <>
                  <Text>{date}</Text>
                  <Divider type="vertical" />
                  <Text>{time}</Text>
               </>
            );
         }
      },
      {
         title: <Text strong>Reason</Text>,
         dataIndex: 'reason',
         render: (text, record) => {
            return record.reason;
         }
      },
      {
         title: <Text strong>Status</Text>,
         dataIndex: 'status',
         filters: [{
            text: 'Pending',
            value: 'pending',
         }, {
            text: 'Confirmed',
            value: 'confirmed',
         }],

         filterMultiple: false,
         onFilter: (value, record) => {
            return record.status.indexOf(value) === 0;
         },

         render: (text, record) => {
            return record.status === 'confirmed' ? (<Badge status="success" text={<Text style={{ color: '#73d13d' }}>Confirmed</Text>} />)
               : record.status === 'pending' ? (
                  <Badge status="processing" text={<Text style={{ color: '#108ee9' }}>Pending</Text>} />
               )


                  : (<Badge status="error" text={<Text style={{ color: '#ff7875' }}>Cancelled</Text>} />)
         }
      },
      {
         title: <Text strong>Actions</Text>,
         dataIndex: 'actions',
         render: (text, record) => {

            const isAppointmentPast = moment(record.date).format('X') < moment(Date.now()).format('X');
            const menu = record.status === 'pending' ? (
               <Menu>
                  <Menu.Item>

                     {/* <a onClick={() => {
                        handleConfirmAppoinment({
                           id: record.id,
                           date: record.date,
                           name: record.name, contact_number:
                              record.contact_number
                        });
                     }}  target="_blank" rel="noopener noreferrer" > */}
                        Confirm Appointment
                           {/*  </a> */}
                  </Menu.Item>

                  <Menu.Item>
                     {/* {record.contact_number ? 
                     <DeclineCancelAppointmentModal onDeclineCancel={handleDeclineCancelAppointment}
                        appointment={{ id: record.id, date: record.date, name: record.name, contact_number: record.contact_number }} type="decline" />
                        : <a
                           onClick={() => handleNoContactNumber({ id: record.id, date: record.date, name: record.name, contact_number: record.contact_number, type: 'decline' })}
                           target="_blank" rel="noopener noreferrer">
                           Decline Appointment
                                                </a>} */}
                  </Menu.Item>

               </Menu>
            ) : (
                  <Menu>
                     <Menu.Item disabled>
                        Confirm Appointment
                     </Menu.Item>

                     {
                        isAppointmentPast ? (
                           <Menu.Item disabled>
                              Cancel Appointment
                           </Menu.Item>
                        ) : (
                              <Menu.Item>
                                 {/* {record.contact_number ? <DeclineCancelAppointmentModal
                                    onDeclineCancel={handleDeclineCancelAppointment}
                                    appointment={{ id: record.id, date: record.date, name: record.name, contact_number: record.contact_number }} type="cancel" />
                                    : <a
                                       onClick={() => handleNoContactNumber({ id: record.id, date: record.date, name: record.name, contact_number: record.contact_number, type: 'cancel' })}
                                       target="_blank" rel="noopener noreferrer">
                                       Cancel Appointment
                                                            </a>} */}
                              </Menu.Item>
                           )
                     }
                  </Menu>
               );

            const disabledDropdown = (record.status === 'cancelled'
               || record.status === 'declined'
               || (record.status === 'pending' && isAppointmentPast)
               || (record.status === 'confirmed' && isAppointmentPast)
            ) ? true : false;

            return (
               <Dropdown disabled={disabledDropdown} overlay={menu} trigger={['click']}>
                  <Button>
                     Actions
                     </Button>
               </Dropdown>
            );
         }
      },
      {
         title: <Text strong>Actions</Text>,
         dataIndex: 'actions',
         render: (text, record) => {
            return (

               <Button onClick={handlePrint} type="primary"> Print Transaction Log</Button>

            );
         }
      }
   ];

   return (
      <>



         <Table


            dataSource={props.appointments}

            size="medium"
            columns={columns}
            scroll={{ x: 300 }}
            rowKey={(record) => record.id}

            pagination={
               {
                  position: 'both',
                  defaultCurrent: 1,
                  pageSize: 10,
                  // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
                  // onChange: (page, pageSize) => {
                  //    props.getAppointments(state.search, state.rangeDate);
                  // }
               }
            }

         />


      </>
   );

}

// const mapStateToProps = state => {
//    return {

//       appointment: state.Abointments.assignmentes,
//       // loading: state.Abointment.loading
//    };
// };


export default connect(
   // mapStateToProps,
   // { getABNTs,createABNT }
)(AppointmentsTable);





