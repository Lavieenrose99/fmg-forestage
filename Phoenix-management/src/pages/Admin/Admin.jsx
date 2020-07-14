import React from 'react';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MarketMemberRegister from '../MarketMemberRegister';
import './Admin.less'

export default () => (
  <PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
    <div className="Admin-Register-page-container">
    <MarketMemberRegister />
    </div>
  </PageHeaderWrapper>
);
