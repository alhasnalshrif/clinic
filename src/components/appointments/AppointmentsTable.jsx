import React, { useState } from "react";
import {
  Modal,
  message,
  Menu,
  Dropdown,
  Badge,
  Button,
  Table,
  Row,
  Col,
  Input,
  Typography,
  DatePicker,
  Radio,
  Divider,
  Tag,
  Space,
  Tooltip,
  Empty
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from "moment";
import { connect } from "react-redux";

import axios from "axios";

import jsPDF from "jspdf";
import "jspdf-autotable";

const { confirm } = Modal;
const { Search } = Input;
const { Text } = Typography;

function AppointmentsTable(props) {
  const [state, setState] = useState({
    search: "",
    selectedFilterBy: "",
    rangeDate: [],
  });

  const handleDeclineCancelAppointment = (values, id) => {
    const hide = message.loading(
      `${values.type === "cancel" ? "Cancelling" : "Declining"} appointment...`,
      0
    );
    axios
      .delete(`appointments/${id}/delete`, values)
      .then((response) => {
        if (response.status === 200) {
          hide();
          message.success(
            `Appointment Successfully ${
              values.type === "cancel" ? "Cancelled" : "Declined"
            } `
          );
          // props.getAppointments(state.search, state.rangeDate);
        }
      })
      .catch((err) => {
        console.log(err);
        hide();
        message.error("Something went wrong! Please, try again.");
      });
  };

  const handleNoContactNumber = (values) => {
    confirm({
      title: `Are you sure to ${values.type} this appointment?!`,
      content:
        "This patient does not have available contact number, therefore will not be notified through SMS.",
      okText: "Yes",
      onOk: () => {
        handleDeclineCancelAppointment(values);
      },
      onCancel() {},
    });
  };

  const handleViewAppointment = (record) => {
    Modal.info({
      title: `تفاصيل الموعد - ${record.patient}`,
      content: (
        <div style={{ marginTop: 20 }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>اسم المريض: </Text>
              <Text>{record.patient}</Text>
            </Col>
            <Col span={12}>
              <Text strong>التاريخ: </Text>
              <Text>{moment(record.date).format('DD/MM/YYYY')}</Text>
            </Col>
            <Col span={12}>
              <Text strong>الوقت: </Text>
              <Text>{moment(record.date).format('h:mm A')}</Text>
            </Col>
            <Col span={12}>
              <Text strong>الحالة: </Text>
              <Text>{record.status === 'confirmed' ? 'مؤكد' : record.status === 'pending' ? 'في الانتظار' : 'ملغي'}</Text>
            </Col>
            <Col span={24}>
              <Text strong>سبب الزيارة: </Text>
              <Text>{record.reason || 'فحص عام'}</Text>
            </Col>
          </Row>
        </div>
      ),
      width: 600,
    });
  };

  const handleEditAppointment = (record) => {
    console.log('تعديل الموعد:', record);
    message.info('سيتم إضافة نافذة تعديل الموعد قريباً');
  };

  const handleConfirmAppointment = (record) => {
    Modal.confirm({
      title: 'تأكيد الموعد',
      content: `هل أنت متأكد من تأكيد موعد ${record.patient}؟`,
      onOk: () => {
        message.success('تم تأكيد الموعد بنجاح');
        // Add API call here
      }
    });
  };

  const handleCancelAppointment = (record) => {
    Modal.confirm({
      title: 'إلغاء الموعد',
      content: `هل أنت متأكد من إلغاء موعد ${record.patient}؟`,
      onOk: () => {
        message.success('تم إلغاء الموعد بنجاح');
        // Add API call here
      }
    });
  };

  const handlePrintAppointment = (record) => {
    console.log('طباعة الموعد:', record);
    message.info('سيتم طباعة تفاصيل الموعد');
  };
    const body = [];
    let total = 0;
    // state.paymentTransactions.forEach(({ date_paid, amount_paid, payment_type, from, received_by }) => {
    props.appointments.forEach(
      ({ date_paid, amount_paid, payment_type, from, received_by }) => {
        total += amount_paid;
        body.push({
          date_paid: moment(date_paid).format("MMMM DD, YYYY"),
          amount_paid: amount_paid
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          payment_type,
          from,
          received_by,
        });
      }
    );

    const doc = new jsPDF({
      format: [612, 792],
    });
    const totalPagesExp = "{total_pages_count_string}";

    // Header
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    doc.setFontSize(16);
    // doc.setFontStyle('bold');
    doc.text("Andres Dental Clinic", pageWidth - 68, 10);
    doc.setFontSize(10);
    doc.setTextColor(53, 53, 53);
    // doc.setFontStyle('normal');
    doc.text("One.O.5ive Department Store", pageWidth - 60, 14);
    doc.text("J. P. Rizal Street, Barangay 18", pageWidth - 62, 18);
    doc.text("Laoag City, 2900 Ilocos Norte", pageWidth - 60, 22);
    doc.text("09212451903", pageWidth - 35, 26);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Transaction Log", 15, 32);
    const [startDate, endDate] = state.rangeDate;
    doc.setFontSize(10);

    if (startDate && endDate) {
      doc.setTextColor(53, 53, 53);
      doc.text(
        `(${moment(startDate).format("MMMM DD, YYYY")} - ${moment(
          endDate
        ).format("MMMM DD, YYYY")})`,
        54,
        32
      );
      doc.setTextColor(0, 0, 0);
    }

    doc.autoTable({
      columns: [
        { header: "Date Paid", dataKey: "date_paid" },
        { header: "Amount Paid", dataKey: "amount_paid" },
        { header: "Payment Type", dataKey: "payment_type" },
        { header: "From", dataKey: "from" },
        { header: "Received By", dataKey: "received_by" },
      ],
      body,
      didDrawPage: (data) => {
        // Footer
        var str = "Page " + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === "function") {
          str = str + " of " + totalPagesExp;
        }
        // doc.setFontStyle('normal');

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        doc.text(str, data.settings.margin.left, pageHeight - 10);
        doc.text(
          `Generated on ${moment(Date.now()).format("MMMM DD, YYYY hh:mmA")}`,
          pageWidth - 73,
          pageHeight - 10
        );
      },
      startY: 34,
      showHead: "firstPage",
    });

    doc.line(
      15,
      doc.autoTable.previous.finalY + 3,
      pageWidth - 15,
      doc.autoTable.previous.finalY + 3
    ); // horizontal line
    // doc.setFontStyle('bold');
    doc.text("TOTAL:", 15, doc.autoTable.previous.finalY + 8);
    doc.text(
      `${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      48,
      doc.autoTable.previous.finalY + 8
    );
    if (typeof doc.putTotalPages === "function")
      doc.putTotalPages(totalPagesExp);

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  const columns = [
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>اسم المريض</Text>,
      dataIndex: "patient",
      key: "patient",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: 'var(--text-primary)' }}>
            <UserOutlined style={{ marginLeft: 8, color: 'var(--primary-color)' }} />
            {record.patient || 'غير محدد'}
          </Text>
          {record.phone && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <PhoneOutlined style={{ marginLeft: 4 }} />
              {record.phone}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>التاريخ والوقت</Text>,
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        const date = moment(record.date).format("DD/MM/YYYY");
        const time = moment(record.date).format("h:mm A");
        const isToday = moment(record.date).isSame(moment(), 'day');
        const isPast = moment(record.date).isBefore(moment());
        
        return (
          <Space direction="vertical" size={0}>
            <Text style={{ 
              color: isToday ? 'var(--primary-color)' : isPast ? 'var(--text-secondary)' : 'var(--text-primary)',
              fontWeight: isToday ? 'bold' : 'normal'
            }}>
              <CalendarOutlined style={{ marginLeft: 8 }} />
              {date}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <ClockCircleOutlined style={{ marginLeft: 4 }} />
              {time}
            </Text>
          </Space>
        );
      },
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>سبب الزيارة</Text>,
      dataIndex: "reason",
      key: "reason",
      render: (text, record) => (
        <Text style={{ color: 'var(--text-primary)' }}>
          {record.reason || 'فحص عام'}
        </Text>
      ),
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>الحالة</Text>,
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "مؤكد", value: "confirmed" },
        { text: "في الانتظار", value: "pending" },
        { text: "ملغي", value: "cancelled" },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.status === value,
      render: (text, record) => {
        const statusConfig = {
          confirmed: {
            color: 'success',
            icon: <CheckCircleOutlined />,
            text: 'مؤكد',
            className: 'status-confirmed'
          },
          pending: {
            color: 'processing',
            icon: <ClockCircleOutlined />,
            text: 'في الانتظار',
            className: 'status-pending'
          },
          cancelled: {
            color: 'error',
            icon: <CloseCircleOutlined />,
            text: 'ملغي',
            className: 'status-cancelled'
          }
        };

        const config = statusConfig[record.status] || statusConfig.pending;
        
        return (
          <Tag 
            className={`status-badge ${config.className}`}
            icon={config.icon}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: <Text strong style={{ color: 'var(--text-primary)' }}>الإجراءات</Text>,
      key: "actions",
      render: (text, record) => {
        const isAppointmentPast = moment(record.date).isBefore(moment());
        
        return (
          <Space>
            <Tooltip title="عرض التفاصيل">
              <Button 
                icon={<EyeOutlined />} 
                size="small"
                onClick={() => handleViewAppointment(record)}
              />
            </Tooltip>
            
            {!isAppointmentPast && record.status !== 'cancelled' && (
              <Tooltip title="تعديل الموعد">
                <Button 
                  icon={<EditOutlined />} 
                  size="small"
                  onClick={() => handleEditAppointment(record)}
                />
              </Tooltip>
            )}

            {record.status === 'pending' && !isAppointmentPast && (
              <Tooltip title="تأكيد الموعد">
                <Button 
                  icon={<CheckCircleOutlined />} 
                  size="small"
                  type="primary"
                  className="clinic-btn-primary"
                  onClick={() => handleConfirmAppointment(record)}
                />
              </Tooltip>
            )}

            {!isAppointmentPast && record.status !== 'cancelled' && (
              <Tooltip title="إلغاء الموعد">
                <Button 
                  icon={<CloseCircleOutlined />} 
                  size="small"
                  danger
                  onClick={() => handleCancelAppointment(record)}
                />
              </Tooltip>
            )}
            
            <Tooltip title="طباعة">
              <Button 
                icon={<PrinterOutlined />} 
                size="small"
                onClick={() => handlePrintAppointment(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      <Table
        dataSource={props.appointments}
        columns={columns}
        rowKey={(record) => record.id}
        locale={{
          emptyText: (
            <Empty
              description={
                <div className="empty-state">
                  <CalendarOutlined className="empty-state-icon" />
                  <div className="empty-state-title">لا توجد مواعيد</div>
                  <div className="empty-state-description">
                    لم يتم العثور على أي مواعيد مجدولة
                  </div>
                </div>
              }
            />
          )
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} من أصل ${total} موعد`,
          position: ['bottomCenter']
        }}
        scroll={{ x: 800 }}
        size="middle"
        className="clinic-table"
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}

// const mapStateToProps = state => {
//    return {

//       appointment: state.Abointments.assignmentes,
//       // loading: state.Abointment.loading
//    };
// };

export default connect()(AppointmentsTable);
// mapStateToProps,
// { getABNTs,createABNT }
