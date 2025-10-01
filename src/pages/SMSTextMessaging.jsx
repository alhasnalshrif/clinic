import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Row, Col, Statistic, Button, Empty } from 'antd';
import { 
   MessageOutlined, 
   SendOutlined, 
   CheckCircleOutlined, 
   ClockCircleOutlined,
   PlusOutlined 
} from '@ant-design/icons';
import SMSTable from '../components/sms/SMSTable';

const { Content } = Layout;
const { Title, Text } = Typography;

function SMSTextMessaging(props) {
   const [stats, setStats] = useState({
      totalMessages: 0,
      sentToday: 0,
      delivered: 0,
      pending: 0
   });

   // Mock stats - replace with real API call
   useEffect(() => {
      setStats({
         totalMessages: 245,
         sentToday: 12,
         delivered: 238,
         pending: 7
      });
   }, []);

   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         {/* Page Header with Gradient */}
         <Card 
            className="clinic-card" 
            style={{ 
               marginBottom: 24, 
               padding: '32px 24px',
               background: 'linear-gradient(135deg, var(--success-color) 0%, var(--info-color) 100%)',
               border: 'none'
            }}
         >
            <Row align="middle" justify="space-between">
               <Col>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div 
                        style={{ 
                           width: 64, 
                           height: 64, 
                           borderRadius: '16px',
                           background: 'rgba(255, 255, 255, 0.2)',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           backdropFilter: 'blur(10px)'
                        }}
                     >
                        <MessageOutlined style={{ fontSize: 32, color: '#fff' }} />
                     </div>
                     <div>
                        <Title level={2} style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
                           الرسائل النصية SMS
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 }}>
                           إدارة وإرسال الرسائل النصية للمرضى
                        </Text>
                     </div>
                  </div>
               </Col>
               <Col>
                  <Button
                     type="primary"
                     size="large"
                     icon={<PlusOutlined />}
                     style={{ 
                        background: '#fff',
                        color: 'var(--success-color)',
                        border: 'none',
                        height: 48,
                        padding: '0 32px',
                        fontWeight: 500,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                     }}
                  >
                     إرسال رسالة جديدة
                  </Button>
               </Col>
            </Row>
         </Card>

         {/* Statistics Cards */}
         <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">إجمالي الرسائل</span>}
                     value={stats.totalMessages}
                     prefix={<MessageOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">رسائل اليوم</span>}
                     value={stats.sentToday}
                     prefix={<SendOutlined style={{ color: 'var(--info-color)' }} />}
                     valueStyle={{ color: 'var(--info-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">تم التسليم</span>}
                     value={stats.delivered}
                     prefix={<CheckCircleOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">قيد الإرسال</span>}
                     value={stats.pending}
                     prefix={<ClockCircleOutlined style={{ color: 'var(--warning-color)' }} />}
                     valueStyle={{ color: 'var(--warning-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
         </Row>

         {/* Messages Table */}
         <Card className="clinic-card" style={{ padding: '24px' }}>
            <SMSTable />
         </Card>
      </Content>
   );
}

export default SMSTextMessaging;