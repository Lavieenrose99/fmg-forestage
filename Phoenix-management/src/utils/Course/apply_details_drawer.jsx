import React, { useState, useEffect } from 'react';
import {
  Drawer, Row, Col, Button, Tag, Modal, Avatar, Table
} from 'antd';
import { BASE_QINIU_URL } 
  from '@/utils/Token';
import moment from 'moment';
import { connect } from 'umi';
import { get } from 'lodash';
import {
  ApplyMemberTable
} from './course_table.jsx';
import { DescriptionItem } from '../Drawer/details_drawer.jsx';

const CourseApplyDrawer = (props) => {
  const {
    show, closeDrawer,
    billsInfos, Account, GoodsList,
    ReBillslist, Address,
  } = props;
  const user = Account.find((item) => item.id === billsInfos.account_id)
    ? Account.find((item) => item.id === billsInfos.account_id) : { nickname: '用户', avator: '' };
  useEffect(() => {
    props.dispatch({
      type: 'BillsListBack/RefundGoods',
      payload: [billsInfos.child_order_id],
    });
  }, [billsInfos]);
  return (
    <Drawer
      width={640}
      destroyOnClose
      title="报名详情"
      placement="right"
      closable={false}
      onClose={() => closeDrawer(false)}
      visible={show}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => closeDrawer(false)} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => {
              Modal.confirm({
                mask: false,
                title: '凤鸣谷',
                content: '确认退款吗',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  props.dispatch({
                    type: 'BillsListBack/PleaseRefund',
                    payload: billsInfos.id,
                  }); 
                },
              });
            }}
          >
            批准
          </Button>
          <Button
            type="dashed"
            danger
            style={{ float: 'left' }}
            onClick={() => {
              Modal.confirm({
                mask: false,
                title: '凤鸣谷',
                content: '确认拒绝退款吗',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  props.dispatch({
                    type: 'BillsListBack/RejectRefund',
                    payload: billsInfos.id,
                  }); 
                },
              });
            }}
          >
            拒绝
          </Button>
        </div>
      }
    >
      <Row>
        <Col span={20}>
          <DescriptionItem
            title="支付单号"
            content={billsInfos.wx_pay_order_id === 0 ? '暂无信息' 
              : billsInfos.wx_pay_order_id}
          />
        </Col>
      </Row>
      <Row>
        <Col span={20}>
          <DescriptionItem
            title="用户"
            content={<>
              <Avatar src={user.avator} />
              <span style={{ marginLeft: 10 }}>
                {user.nickname}
              </span>
            </>}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}><DescriptionItem title="订单金额" content={billsInfos.total_money / 100} /></Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="创建时间"
            content={moment(billsInfos.create_time * 1000)
              .format('YYYY-MM-DD HH:mm:ss')}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="更新时间"
            content={moment(billsInfos.update_time * 1000)
              .format('YYYY-MM-DD HH:mm:ss')}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DescriptionItem
            title="报名人员"
            content={<Table
              columns={ApplyMemberTable} 
              dataSource={billsInfos.parters}
              pagination={{
                pageSize: 2,
              }}
            />}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default connect(({ fmgInfos, BillsListBack }) => ({
  InfosList: get(fmgInfos, 'InfosList', []),
  Account: get(BillsListBack, 'Account', []),
  GoodsList: get(BillsListBack, 'ChildGoods', []),
  ReBillslist: get(BillsListBack, 'ReBillList', []),
  Address: get(BillsListBack, 'Address', []),
}))(CourseApplyDrawer);
