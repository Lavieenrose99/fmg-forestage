/* eslint-disable no-mixed-operators */
/*
 * @Author: your name
 * @Date: 2020-12-01 13:56:57
 * @LastEditTime: 2020-12-08 09:01:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/utils/Refund/refund_table.js
 */
import React from 'react';
import moment from 'moment';
import { Tag } from 'antd';
import { BASE_QINIU_URL } 
  from '@/utils/Token';
//id在7以后的是已经签收的退单
export const RefundReason = [{ id: 0, type: '七天无理由' }, { id: 1, type: '个人不喜欢' }, { id: 2, type: '空包' }, { id: 3, type: '未按约定时间发货' },
  { id: 4, type: '快递未送达' }, { id: 5, type: '无快递信息' }, { id: 6, type: '货物破损' }, { id: 7, type: '退运费' }, { id: 8, type: '大小/尺寸与商品描述不符' },
  { id: 9, type: '颜色/图案/款式与商品描述不符' }, { id: 10, type: '材料与商品描述不符' }, { id: 11, type: '做工问题' }, { id: 12, type: '质量问题' }, { id: 13, type: '少件，漏发'  }, { id: 14, type: '未按约定时间发货' }, { id: 15, type: '发票问题' }, { id: 16, type: '发错货' }
];
export const RefundSevice = [{ id: 1, ser: '直接退款' }, { id: 2, ser: '退货退款' }, { id: 4, ser: '换货' }];
export const RefundWays = [{ id: 1, way: '上门取件' }, { id: 2, way: '退货退款' }];
export const RefundStatus = [{ id: 1, status: '待审核' }, { id: 2, status: '审核通过' }, { id: 4, status: '审核失败' }, { id: 8,  status: '成功退货' }];
export const RefundListTable =  [
  {
    title: '退款单号',
    dataIndex: 'out_refund_no',
    width: '22%',
    key: 'out_refund_no',
  }, {
    title: '用户名',
    dataIndex: 'account_id',
    width: '10%',
    key: 'id',
  },
  {
    title: '退货状态',
    dataIndex: 'status',
    key: 'status',
    render: (info) => {
      let color;
      if (info === 1) {
        color = 'volcano';
      } else if (info === 2) {
        color = 'green';
      } else if (info === 4) {
        color = 'red';
      } else {
        color = '#87d068';
      }
      const { status } = RefundStatus.find((item) => item.id === info);
      return (
        <Tag color={color}>
          {
      status
        }
        </Tag>
      );
    },
  },
  {
    title: '订单金额',
    dataIndex: 'total_fee',
    width: '10%',
    key: 'id',
    render: (num) => {
      return (
        num / 100);
    },
  },
  {
    title: '退款金额',
    dataIndex: 'return_amount',
    width: '10%',
    key: 'id',
    render: (num) => {
      return (
        num / 100);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'update_time',
    render: (text) => {
      return (
        moment(text * 1000)
          .format('YYYY-MM-DD HH:mm:ss'));
    },
  }
];
export const RefundGoodsList = [
  {
    title: '商品',
    dataIndex: 'name',
    width: '30%',
    key: 'out_refund_no',
    render: (text, record) => {
      return (
        <div>
          <img
            src={record ? BASE_QINIU_URL + record.cover : null}
            alt="img" 
            style={{ width: 30, height: 30, marginRight: 20  }}
          />
          <span>{text}</span>
        </div>
      ); 
    },
  },
  {
    title: '规格',
    dataIndex: 'specifications',
    width: '10%',
    key: 'id',
    render: (info) => (
      (info ? Object.values(info.specification) : []).map((arr, index, record) => {
        return record.length !== index + 1 ? <span>{`${arr}/`}</span> : <span>{arr}</span>;
      })
    ),
  },
  {
    title: '数量',
    dataIndex: 'specifications',
    width: '10%',
    key: 'id',
    render: (info) => (
      <span>
        *
        {
     info ? info.num : null
}
      </span>
    ),
  },
  {
    title: '售价',
    dataIndex: 'specifications',
    width: '10%',
    key: 'id',
    render: (info) => (
      <span>
        {
      info ? info.cost_price / 100 : null
}
      </span>
    ),
  },  
  {
    title: '原价',
    dataIndex: 'specifications',
    width: '10%',
    key: 'id',
    render: (info) => (
      <span>
        {
      info ? info.price / 100 : null
}
      </span>
    ),
  },  
  {
    title: '小计',
    dataIndex: 'specifications',
    width: '10%',
    key: 'id',
    render: (info) => (
      <span>
        {
     info ? info.price / 100 * info.num : null
}
      </span>
    ),
  }
  
];
