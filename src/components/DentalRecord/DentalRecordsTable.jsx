import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Typography, Input, Tag } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from "react-redux";
import { getPATN } from "../../redux";
import { apiService } from '../../services/api';

const { Search } = Input;

const { Title, Paragraph, Text } = Typography;

function DentalRecordsTable(props) {

   const [patients, setPatients] = useState([]);
   const [allPatients, setAllPatients] = useState([]); // Store original data for filtering

   const patns = Array.isArray(props.patients) ? props.patients : [];
   const myProp = props.getPATN

   useEffect(() => {
      const fetchData = async () => {
         try {
            // First try to get data from Redux
            await myProp();

            // If Redux has data, use it
            if (Array.isArray(patns) && patns.length > 0) {
               setPatients(patns);
               setAllPatients(patns);
            } else {
               // Otherwise fetch directly from API
               const res = await apiService.getPatients();
               const apiData = Array.isArray(res.data) ? res.data : [];
               setPatients(apiData);
               setAllPatients(apiData);
            }
         } catch (error) {
            console.error('Error fetching patients:', error);
            setPatients([]);
            setAllPatients([]);
         }
      }
      fetchData();
   }, [myProp, patns?.length]);



   const updateInput = async (value) => {
      console.log(value);

      if (!value || value.trim() === '') {
         // If search is empty, show all patients
         setPatients(allPatients);
         return;
      }

      const filtered = allPatients.filter(a => {
         return a.name && a.name.toLowerCase().includes(value.toLowerCase());
      });

      console.log(filtered);
      setPatients(filtered);
   }



   console.log(patients);




   const columns = [
      {
         title: <Text strong>الاسم</Text>,
         dataIndex: 'name',
         defaultSortOrder: 'ascend',
         sorter: (a, b) => {
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
         },
         render: (text, record) => {
            return record.name || 'غير محدد';
         }
      },
      {
         title: <Text strong>آخر زيارة</Text>,
         width: 200,
         dataIndex: 'updatedAt',
         defaultSortOrder: 'descend',
         sorter: (a, b) => {
            const dateA = a.updatedAt ? moment(a.updatedAt) : moment(0);
            const dateB = b.updatedAt ? moment(b.updatedAt) : moment(0);
            return dateA.valueOf() - dateB.valueOf();
         },
         render: (text, record) => {
            const lastVisit = record.updatedAt || record.createdAt;
            if (!lastVisit) {
               return <Tag color="geekblue">سجل جديد</Tag>;
            }
            return moment(lastVisit).format('MMMM DD, YYYY');
         }
      },
      {
         title: <Text strong>رقم الهاتف</Text>,
         dataIndex: 'phone',
         render: (text, record) => {
            return record.phone || 'غير محدد';
         }
      },
      {
         title: <Text strong>العمر</Text>,
         dataIndex: 'age',
         render: (text, record) => {
            return record.age ? `${record.age} سنة` : 'غير محدد';
         }
      },
      {
         title: <Text strong>الجنس</Text>,
         dataIndex: 'sex',
         render: (text, record) => {
            const sexMap = {
               'MALE': 'ذكر',
               'FEMALE': 'أنثى'
            };
            return sexMap[record.sex] || 'غير محدد';
         }
      },
      {
         title: <Text strong>فصيلة الدم</Text>,
         dataIndex: 'bloodgroup',
         render: (text, record) => {
            return record.bloodgroup || 'غير محدد';
         }
      },
      {
         title: <Text strong>رقم المريض</Text>,
         dataIndex: 'id',
         render: (text, record) => {
            return <Paragraph copyable={true} >{record.id}</Paragraph>;
         }
      },
      {
         title: <Text strong>الإجراءات</Text>,
         dataIndex: 'actions',
         render: (text, record) => {
            return (
               <Link to={`/dentalrecords/${record.id}`}>
                  <Button type="primary">عرض السجل الطبي</Button>
               </Link>
            );
         }
      }
   ];


   return (
      <div style={{ direction: 'rtl', textAlign: 'right' }}>
         <Title level={4} style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>السجلات الطبية للأسنان</Title>

         <Row align="middle" gutter={8}>
            <Col span={24}>
               <Search
                  style={{
                     width: '100%',
                     margin: 10,
                     fontFamily: 'Arial, sans-serif',
                     direction: 'rtl'
                  }}
                  placeholder="البحث في السجلات الطبية باسم المريض"
                  enterButton="بحث"
                  onChange={(e) => updateInput(e.target.value)}

               />
            </Col>
         </Row>

         <Table
            dataSource={Array.isArray(patients) ? patients : []}
            size="medium"
            columns={columns}
            scroll={{ x: 300 }}
            rowKey={(record) => record.id}
            style={{ fontFamily: 'Arial, sans-serif' }}
            locale={{
               emptyText: 'لا توجد بيانات',
               filterTitle: 'تصفية',
               filterConfirm: 'موافق',
               filterReset: 'إعادة تعيين',
               selectAll: 'تحديد الكل',
               selectInvert: 'عكس التحديد',
               sortTitle: 'ترتيب',
            }}
            pagination={
               {
                  position: 'both',
                  defaultCurrent: 1,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                     `${range[0]}-${range[1]} من ${total} مريض`,
                  pageSizeOptions: ['10', '20', '50', '100'],
               }
            }

         />
      </div>
   );


}


const mapStateToProps = state => {
   return {
      patients: Array.isArray(state.patient.patients) ? state.patient.patients : [],
      // loading: state.Abointment.loading
   };
};


export default connect(
   mapStateToProps,
   { getPATN }
)(DentalRecordsTable);


