import axios from 'axios';
import 'animate.css';
import { ConfigProvider, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './global.less';
import router from './router';

axios.interceptors.request.use((config) => {
  config.baseURL = '/api';
  return config;
});

axios.interceptors.response.use(({ data }) => {
  if (data && data?.success) {
    return data?.data;
  }
  message.error({ content: data?.msg ?? '请求失败', className: 'dvr-message' });
  return data;
});

const theme = {
  token: {
    colorPrimary: '#286AD4',
    colorInfo: '#286AD4',
    colorBgContainer: '#292D34', // 输入框 选择框等
    colorBgElevated: '#1F2228', // 弹窗等
    colorBgLayout: '#151718',
    lineWidth: 0,
    colorText: 'rgba(255,255,255,0.88)', // 1级文本色
    colorTextSecondary: 'rgba(255,255,255,0.65)', // 2级文本色
    colorTextTertiary: 'rgba(255,255,255,0.45)', // 3级文本色
    colorTextQuaternary: 'rgba(255,255,255,0.25)', // 4级文本色
  },
};

createRoot(document.getElementById('root')).render(
  <ConfigProvider
    locale={zhCN}
    input={{ autoComplete: 'off' }}
    theme={theme}
    componentSize={'middle'}
  >
    <RouterProvider router={router} />
  </ConfigProvider>,
);
