import React from 'react';
import { useParams } from 'react-router-dom';
import UserAccountsTable from '../components/user/UserAccountsTable';
import { Layout, Card, Typography, Row, Col, Statistic } from 'antd';
import { TeamOutlined, UserAddOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import UserAccount from '../components/user/UserAccount';

const { Content } = Layout;
const { Title, Text } = Typography;

function UserAccounts(props) {
   const { id } = useParams();
   
   if (id)
      return (
         <Content style={{ margin: '24px 24px 24px 36px' }}>
            <Card className="clinic-card" style={{ padding: '24px' }}>
               <UserAccount id={id} />
            </Card>
         </Content>
      );

   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         {/* Page Header with Gradient */}
         <Card 
            className="clinic-card" 
            style={{ 
               marginBottom: 24, 
               padding: '32px 24px',
               background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)',
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
                        <TeamOutlined style={{ fontSize: 32, color: '#fff' }} />
                     </div>
                     <div>
                        <Title level={2} style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
                           إدارة المستخدمين
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 }}>
                           إدارة حسابات المستخدمين والصلاحيات
                        </Text>
                     </div>
                  </div>
               </Col>
            </Row>
         </Card>

         {/* Statistics Cards */}
         <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">إجمالي المستخدمين</span>}
                     value={8}
                     prefix={<TeamOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">مستخدمون نشطون</span>}
                     value={6}
                     prefix={<CheckCircleOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">مستخدمون جدد (30 يوم)</span>}
                     value={2}
                     prefix={<UserAddOutlined style={{ color: 'var(--info-color)' }} />}
                     valueStyle={{ color: 'var(--info-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card" style={{ height: '100%' }}>
                  <Statistic
                     title={<span className="metric-title">أدوار نشطة</span>}
                     value={4}
                     prefix={<SafetyOutlined style={{ color: 'var(--warning-color)' }} />}
                     valueStyle={{ color: 'var(--warning-color)', fontSize: '32px', fontWeight: 600 }}
                  />
               </Card>
            </Col>
         </Row>

         {/* Users Table */}
         <Card className="clinic-card" style={{ padding: '24px' }}>
            <UserAccountsTable />
         </Card>
      </Content>
   );
}

export default UserAccounts;