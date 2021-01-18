/*
 * @Author: your name
 * @Date: 2020-11-02 19:44:16
 * @LastEditTime: 2021-01-18 18:44:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/utils/DataStore/bills_data_set.js
 */
export const TimeFilter = [
  {
    time: '全部时间',
    value: 99999999999,
  },
  {
    time: '七日内',
    value: 604800,
  },
  {
    time: '一个月内',
    value: 2592000,
  },
  {
    time: '三个月内',
    value: 7776000,
  }, {
    time: '半年内',
    value: 15552000,
  },
  {
    time: '一年内',
    value: 31104000,
  }
];
export const StatusSet = [
  {
    title: '全部',
    value: 0,
  },
  {
    title: '未支付',
    value: 1,
  }, {
    title: '待发货',
    value: 2,
  }, {
    title: '待收货',
    value: 3,
  }, {
    title: '待评价',
    value: 4,
  }, {
    title: '已完成',
    value: 5,
  }, {
    title: '已取消',
    value: 6,
  }, {
    title: '申请售后',
    value: 7,
  }, {
    title: '售后完成',
    value: 8,
  }, {
    title: '待提货',
    value: 9,
  }
];
