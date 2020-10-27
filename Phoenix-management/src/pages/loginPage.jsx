import { Button, Result, Carousel } from 'antd';
import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './LoginPage.less';

const NoFoundPage = () => (
  <div
    className="login_parent"
  >
    <div className="login_child">
      <Result 
        icon={<SmileOutlined />}
        title="welcome"
        subTitle="欢迎使用凤鸣谷管理后台"
        extra={
          <Button type="primary" onClick={() => history.push('/sign')}>
            进入
          </Button>
     
    }
      />
    </div>
  </div>
);

export default NoFoundPage;
