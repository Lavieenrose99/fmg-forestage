import React from 'react';
import moment from 'moment';
import { Space } from 'antd';

export const couseSession = [
  { title: '#ID', dataIndex: 'ID' },
  { title: '人数限制', dataIndex: 'people_limit' }, 
  {
    title: '场次价格',
    dataIndex: 'money',
    render: (price) => {
      const tprice = price / 100;
      return (
        tprice
      );
    },  
  },
  {
    title: '开始时间',
    dataIndex: 'begin_time',
    render: (updateTime) => (
      <>
        <span>
          {moment(updateTime)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </>
    ), 
  }, {
    title: '结束时间',
    dataIndex: 'end_time',
    render: (updateTime) => (
      <>
        <span>
          {moment(updateTime)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </>
    ), 
  }, {
    title: '操作',
    //dataIndex: 'end_time',
    render: (info, record) => (
      <>
        <Space size="large">
          <a>修改</a>
          <a>删除</a>
        </Space>
      </>
    ), 
  }];
