import React, { useState } from 'react';
import { Layout, Tabs, Typography, message, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import UpdateAccountForm from '../components/user/UpdateAccountForm';
import UpdateAccountCredentialsForm from '../components/user/UpdateAccountCredentialsForm';
import axios from 'axios';

const { Title, Text } = Typography;
const { Content } = Layout;

function UserAccountSettings(props) {
   const [state, setState] = useState({
      account: {}
   });

   const handleUpdate = (values) => {
      const hide = message.loading('جاري تحديث الحساب...', 0);
      if (values.birthday)
         values.birthday = values.birthday.format('YYYY-MM-DD');
      values.role = state.account.role;

      axios.patch(`users/${state.account.id}/update`, values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('تم تحديث الحساب بنجاح');
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('حدث خطأ! يرجى المحاولة مرة أخرى.');
         });
   }

   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         {/* Page Header with Gradient */}
         <Card 
            className="clinic-card" 
            style={{ 
               marginBottom: 24, 
               padding: '32px 24px',
               background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
               border: 'none'
            }}
         >
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
                  <SettingOutlined style={{ fontSize: 32, color: '#fff' }} />
               </div>
               <div>
                  <Title level={2} style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
                     إعدادات الحساب
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 }}>
                     إدارة معلومات حسابك الشخصية وإعدادات الأمان
                  </Text>
               </div>
            </div>
         </Card>

         {/* Settings Tabs */}
         <Card className="clinic-card" style={{ padding: '24px' }}>
            <Tabs 
               size="large"
               defaultActiveKey="1"
               items={[
                  {
                     key: "1",
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <UserOutlined style={{ marginLeft: 8 }} />
                           المعلومات الشخصية
                        </span>
                     ),
                     children: (
                        <div style={{ padding: '24px 0' }}>
                           <UpdateAccountForm onUpdate={handleUpdate} account={state.account} />
                        </div>
                     )
                  },
                  {
                     key: "2",
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <LockOutlined style={{ marginLeft: 8 }} />
                           بيانات الاعتماد
                        </span>
                     ),
                     children: (
                        <div style={{ padding: '24px 0' }}>
                           <UpdateAccountCredentialsForm onUpdate={handleUpdate} account={state.account} />
                        </div>
                     )
                  },
                  {
                     key: "3",
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <BellOutlined style={{ marginLeft: 8 }} />
                           الإشعارات
                        </span>
                     ),
                     children: (
                        <div style={{ padding: '24px 0' }}>
                           <Card style={{ textAlign: 'center', padding: '48px' }}>
                              <BellOutlined style={{ fontSize: 48, color: 'var(--text-secondary)', marginBottom: 16 }} />
                              <Title level={4} style={{ color: 'var(--text-secondary)' }}>
                                 إعدادات الإشعارات قيد التطوير
                              </Title>
                              <Text style={{ color: 'var(--text-secondary)' }}>
                                 سيتم إضافة خيارات تخصيص الإشعارات قريباً
                              </Text>
                           </Card>
                        </div>
                     )
                  }
               ]}
            />
         </Card>
      </Content>
   );
}

export default UserAccountSettings;
