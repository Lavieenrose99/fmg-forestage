/*
 * @Author: your name
 * @Date: 2020-11-15 18:11:30
 * @LastEditTime: 2020-12-15 16:13:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/utils/Course/course_table.js
 */
import React from 'react';
import moment from 'moment';
import { Tag } from 'antd';
import { render } from 'enzyme';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import { ApplyStatus } from './apply_session.jsx';

export const courseList = [
  { title: '课程名', dataIndex: 'name' },
  { title: '课程标签', dataIndex: 'course_tag' }, { title: '种类标签', dataIndex: 'kind' },
  { title: '属地标签', dataIndex: 'place_tag' }, { title: '课程天数', dataIndex: 'time' }, {
    title: '操作',
  }
];

export const ApplyColumn = [
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    render: (info) => {
      let color;
      let name;
      if (info === 1) {
        color = 'volcano';
      } else if (info === 2) {
        color = 'green';
      } else if (info === 4) {
        color = 'red';
      } else {
        color = '#87d068';
      }
      if (info !== 0) {
        name = ApplyStatus.find((item) => item.id === info) 
          ? ApplyStatus.find((item) => item.id === info).name : null;
      } else {
        name = '状态错误';
        color = 'red';
      }
      return (
        <Tag color={color}>
          {
      name 
        }
        </Tag>
      );
    },
  },
  {
    title: '报名方式',
    dataIndex: 'is_pre_apply',
    render: (info) => {
      let way; 
      if (info) {
        way = '预报名报名';
      } else {
        way = '直接报名';
      }
      return (
        <Tag>{way}</Tag>
      );
    },
  },
  {
    title: '报名人数', dataIndex: 'people',
  },
  {
    title: '总价格', dataIndex: 'total_money',
  },
 
  {
    title: '报名时间',
    dataIndex: 'create_time',
    render: (time) => (
      <>
        <span>
          {moment(time * 1000)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </>
    ),
  }
];

export const ApplyMemberTable = [
  { title: '姓名', dataIndex: 'name' },
  {
    title: <>
      <span>
        <IconFont type="icongenders" />
        性别
      </span>
    </>,
    dataIndex: 'sex',
    render: (sex) => {
      const sexInfo = {};
      if (sex === 1) {
        sexInfo.name = '男';
        sexInfo.icon = 'iconnan';
      } else {
        sexInfo.name = '女';
        sexInfo.icon = 'iconnv';
      }
      return (
        <span>
          <IconFont type={sexInfo.icon} />
          {sexInfo.name}
        </span>
      );
    },
  },
  {
    title: '年龄',
    dataIndex: 'birth',
    render: (age) => {
      const now = Date.parse(new Date());
      return (
        `${((now - age) / 31536000).toFixed(0)} 岁`
      );
    }, 
  },
  { title: '身份证号码', dataIndex: 'number' }, { title: '电话', dataIndex: 'phone' }
  
];
