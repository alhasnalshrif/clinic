import React, { Suspense } from 'react';
import { Layout, Tabs, Col, Typography, Card } from 'antd';
import { 
  UserAddOutlined, 
  CalendarOutlined, 
  DollarOutlined 
} from '@ant-design/icons';

import LoadingSkeleton from '../components/common/LoadingSkeleton';

// Lazy load components
const CreateDentalRecord = React.lazy(() => import('../components/reception/CreateDentalRecord'));
const CreateAppointment = React.lazy(() => import('../components/reception/CreateAppointment'));
const CreatePayment = React.lazy(() => import('../components/reception/CreatePayment'));

const { Title } = Typography;
const { Content } = Layout;

function Reception() {
   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         <Card className="clinic-card" style={{ marginBottom: 24, padding: '24px' }}>
            <Title level={2} style={{ margin: 0, color: 'var(--text-primary)' }}>
               الاستقبال
            </Title>
            <Typography.Text style={{ color: 'var(--text-secondary)' }}>
               إدارة تسجيل المرضى والحجوزات والفواتير
            </Typography.Text>
         </Card>

         <Card className="clinic-card" style={{ padding: '24px' }}>
            <Tabs 
               size="large"
               items={[
                  {
                     key: "1",
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <UserAddOutlined style={{ marginLeft: 8 }} />
                           كشف مريض
                        </span>
                     ),
                     children: (
                        <Col align="right" style={{ marginBottom: '8px' }}>
                           <Suspense fallback={<LoadingSkeleton />}>
                              <CreateDentalRecord />
                           </Suspense>
                        </Col>
                     )
                  },
                  {
                     key: "2", 
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <CalendarOutlined style={{ marginLeft: 8 }} />
                           حجز موعد
                        </span>
                     ),
                     children: (
                        <Col style={{ marginBottom: 8 }} align="right">
                           <Suspense fallback={<LoadingSkeleton />}>
                              <CreateAppointment />
                           </Suspense>
                        </Col>
                     )
                  },
                  {
                     key: "3",
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <DollarOutlined style={{ marginLeft: 8 }} />
                           إنشاء فاتورة
                        </span>
                     ),
                     children: (
                        <Suspense fallback={<LoadingSkeleton />}>
                           <CreatePayment />
                        </Suspense>
                     )
                  }
               ]}
            />
         </Card>
      </Content>
   );
}

export default Reception;