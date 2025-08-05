import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Alert,
  Spin,
  Divider,
  Row,
  Col,
  Tag
} from 'antd';
import {
  // ServerOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { updateServerUrl, testServerConnection, APP_CONFIG } from '../../config/app';

const { Title, Text, Paragraph } = Typography;

const ServerConfigPage = () => {
  const [form] = Form.useForm();
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadCurrentServerUrl();
  }, []);

  const loadCurrentServerUrl = async () => {
    if (window.electronAPI) {
      try {
        const url = await window.electronAPI.getServerUrl();
        setCurrentUrl(url);
        form.setFieldsValue({ serverUrl: url });
        
        // Test connection on load
        testConnection(url);
      } catch (error) {
        console.error('Error loading server URL:', error);
      }
    }
  };

  const testConnection = async (url = null) => {
    const testUrl = url || form.getFieldValue('serverUrl');
    if (!testUrl) return;

    setTesting(true);
    try {
      const isConnected = await testServerConnection(testUrl);
      setConnectionStatus(isConnected);
    } catch (error) {
      setConnectionStatus(false);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    setSaved(false);
    
    try {
      const success = await updateServerUrl(values.serverUrl);
      if (success) {
        setCurrentUrl(values.serverUrl);
        setSaved(true);
        
        // Test the new connection
        await testConnection(values.serverUrl);
        
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error('Failed to save server URL');
      }
    } catch (error) {
      console.error('Error saving server URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConnectionStatusTag = () => {
    if (testing) {
      return <Tag icon={<Spin size="small" />} color="processing">Testing...</Tag>;
    }
    
    if (connectionStatus === true) {
      return <Tag icon={<CheckCircleOutlined />} color="success">Connected</Tag>;
    }
    
    if (connectionStatus === false) {
      return <Tag icon={<ExclamationCircleOutlined />} color="error">Connection Failed</Tag>;
    }
    
    return <Tag color="default">Not Tested</Tag>;
  };

  if (!APP_CONFIG.IS_ELECTRON) {
    return (
      <Card>
        <Alert
          message="Server Configuration Not Available"
          description="Server configuration is only available in the desktop application."
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2}>
              {/* <ServerOutlined style={{ marginRight: '8px' }} /> */}
              Server Configuration
            </Title>
            <Paragraph type="secondary">
              Configure the server URL for the clinic management system. This allows the desktop
              application to connect to your local server or a remote server on your network.
            </Paragraph>
          </div>

          {saved && (
            <Alert
              message="Settings Saved Successfully"
              description="Server URL has been updated successfully."
              type="success"
              showIcon
              closable
            />
          )}

          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Current Server URL:</Text>
                <br />
                <Text code>{currentUrl}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Connection Status:</Text>
                <br />
                {getConnectionStatusTag()}
              </Col>
            </Row>
          </Card>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            size="large"
          >
            <Form.Item
              name="serverUrl"
              label="Server URL"
              rules={[
                { required: true, message: 'Please enter a server URL' },
                { type: 'url', message: 'Please enter a valid URL' }
              ]}
            >
              <Input
                placeholder="http://localhost:8000"
                // prefix={<ServerOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  Save Configuration
                </Button>
                
                <Button
                  onClick={() => testConnection()}
                  loading={testing}
                  icon={<ReloadOutlined />}
                  size="large"
                >
                  Test Connection
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Divider />

          <div>
            <Title level={4}>Configuration Examples:</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small">
                <Text strong>Local Server (Default):</Text>
                <br />
                <Text code>http://localhost:8000</Text>
                <br />
                <Text type="secondary">Use this when running the server on the same computer</Text>
              </Card>
              
              <Card size="small">
                <Text strong>Network Server:</Text>
                <br />
                <Text code>http://192.168.1.100:8000</Text>
                <br />
                <Text type="secondary">Use this when connecting to a server on your local network</Text>
              </Card>
              
              <Card size="small">
                <Text strong>Remote Server:</Text>
                <br />
                <Text code>https://clinic.yourdomain.com</Text>
                <br />
                <Text type="secondary">Use this when connecting to a remote hosted server</Text>
              </Card>
            </Space>
          </div>

          <Alert
            message="Important Notes"
            description={
              <ul style={{ margin: 0 }}>
                <li>Make sure the server is running and accessible before saving the configuration</li>
                <li>Use HTTPS URLs for remote servers to ensure secure communication</li>
                <li>The desktop application will automatically start a local server if available</li>
                <li>Changes will take effect immediately after saving</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default ServerConfigPage;