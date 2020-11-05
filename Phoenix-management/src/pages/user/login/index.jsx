import {
  Alert, notification, message, Spin 
} from 'antd';
import React, { useState } from 'react';
import { history, connect } from 'umi';
import QRCode from 'qrcode.react'
import request from '@/utils/request';
import LoginForm from './components/Login';
import logo from '../../../../public/favicon.png';
import styles from './style.less';

const {
  Tab, UserName, Password, Submit, 
} = LoginForm;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    const {
      port,
      protocol,
      hostname,
    } = window.location;
    console.log(port,protocol,hostname)
    if (values.userName === 'admin' && values.password === '123') {
      message.loading('加载中！！！');
      request('/api.farm/account/login/web_login', {
        method: 'POST',
        data: { open_id: 'om10q44CkR0EOYXL7yp3PVIvS0pg' },
      }).then((response) => {
        if (
          response.id === 8
        ) {
          message.success('登陆成功').then(() => {
            history.push('/page');
          });
        } else {
          notification.warning({
            
            message: '网络错误',
          });
        }
      });
    } else {
      notification.warning({
        message: '密码或者账号错误',
      });
    }
  };

  return (
    <div className={styles.main}>
      <img alt="logo" className={styles.logo} src={logo} />
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="userName"
            placeholder="用户名: admin"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              }
            ]}
          />
          <Password
            name="password"
            placeholder="密码: 123"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              }
            ]}
          />
        </Tab>

        <Submit>登录</Submit>
      </LoginForm>
      {/* <QRCode value="https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js" /> */}
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
