import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider direction="rtl">
    <App />
  </ConfigProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
