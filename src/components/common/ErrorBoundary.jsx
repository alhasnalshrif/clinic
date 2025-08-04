import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="خطأ في التطبيق"
          subTitle="عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          extra={
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
              className="clinic-btn-primary"
            >
              إعادة تحميل الصفحة
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;