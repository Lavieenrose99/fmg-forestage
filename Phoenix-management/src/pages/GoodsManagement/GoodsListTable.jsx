import React from 'react';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MarketMemberRegister from '../MarketMemberRegister';
import './GoodsListTable.less';
import GoodsListTables from './GoodsListTables/index';
export default () => (
  <PageHeaderWrapper content=" 这个页面只有管理员才能查看">
    <GoodsListTables />
  </PageHeaderWrapper>
);
