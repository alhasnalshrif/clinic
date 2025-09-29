import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import './styles/design-system.css';
import arEG from 'antd/es/locale/ar_EG';

const App = () => {
  const theme = {
    token: {
      // Primary Colors
      colorPrimary: '#2563eb',
      colorPrimaryHover: '#3b82f6',
      colorPrimaryActive: '#1d4ed8',
      colorPrimaryBg: '#eff6ff',
      
      // Success Colors
      colorSuccess: '#22c55e',
      colorSuccessHover: '#4ade80',
      colorSuccessActive: '#16a34a',
      colorSuccessBg: '#f0fdf4',
      
      // Warning Colors
      colorWarning: '#f59e0b',
      colorWarningHover: '#fbbf24',
      colorWarningActive: '#d97706',
      colorWarningBg: '#fffbeb',
      
      // Error Colors
      colorError: '#dc2626',
      colorErrorHover: '#ef4444',
      colorErrorActive: '#b91c1c',
      colorErrorBg: '#fef2f2',
      
      // Info Colors
      colorInfo: '#0ea5e9',
      colorInfoHover: '#38bdf8',
      colorInfoActive: '#0284c7',
      colorInfoBg: '#f0f9ff',
      
      // Text Colors
      colorText: '#1f2937',
      colorTextSecondary: '#6b7280',
      colorTextTertiary: '#9ca3af',
      
      // Background Colors
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBgLayout: '#f9fafb',
      
      // Border
      colorBorder: '#e5e7eb',
      colorBorderSecondary: '#f3f4f6',
      
      // Border Radius
      borderRadius: 6,
      borderRadiusLG: 8,
      borderRadiusSM: 4,
      
      // Typography
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      lineHeight: 1.5,
      
      // Spacing
      padding: 16,
      paddingLG: 24,
      paddingSM: 12,
      paddingXS: 8,
      
      // Shadows
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      
      // Motion
      motionDurationFast: '0.15s',
      motionDurationMid: '0.25s',
      motionDurationSlow: '0.35s',
      
      // Control components
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    },
    components: {
      Button: {
        borderRadius: 6,
        fontWeight: 500,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
      },
      Card: {
        borderRadius: 8,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        borderColor: '#f3f4f6',
      },
      Table: {
        borderRadius: 8,
        headerBg: '#f9fafb',
        headerColor: '#374151',
        headerSplitColor: '#e5e7eb',
        rowHoverBg: '#f9fafb',
      },
      Input: {
        borderRadius: 6,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
      },
      Select: {
        borderRadius: 6,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
      },
      DatePicker: {
        borderRadius: 6,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
      },
      Modal: {
        borderRadius: 8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      Drawer: {
        borderRadius: 8,
      },
      Tabs: {
        horizontalMargin: '0 0 16px 0',
        cardBg: '#ffffff',
      },
      Menu: {
        itemBorderRadius: 6,
        subMenuItemBorderRadius: 6,
        itemMarginBlock: 4,
        itemMarginInline: 8,
      },
      Layout: {
        headerBg: '#ffffff',
        siderBg: '#ffffff',
        bodyBg: '#f9fafb',
      },
      Form: {
        labelColor: '#374151',
        labelFontSize: 14,
        labelRequiredMarkColor: '#dc2626',
        itemMarginBottom: 20,
      },
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: 16,
      },
      Progress: {
        remainingColor: '#f3f4f6',
      },
      Tag: {
        borderRadius: 16,
        fontSizeSM: 12,
      },
      Badge: {
        borderRadius: 10,
      },
      Alert: {
        borderRadius: 6,
        withDescriptionPadding: '12px 16px',
      },
      Message: {
        borderRadius: 6,
      },
      Notification: {
        borderRadius: 8,
      },
    },
  };

  return (
    <ConfigProvider
      direction="rtl"
      locale={arEG}
      theme={theme}
    >
      <AntdApp>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
