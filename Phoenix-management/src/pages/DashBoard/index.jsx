/* eslint-disable prefer-const */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import {
  Statistic, Row, Col, Button, Card, Divider 
} from 'antd';
import moment from 'moment';
import { createFromIconfontCN } from '@ant-design/icons';
import { get } from 'lodash';
import { connect } from 'umi';
import DateLineChart from '../Charts/test_charts';
import './index.less';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1787434_aotlqr7w799.js',
});
const CardStyle = {
  height: '12vh',
};
const StatisticPage = (props) => {
  const {
    dispatch, payAmount, Amount, NeedSendBills, List,
  } = props;
  const EndDay = List.length > 0 ? List[List.length - 1].create_time : 0;
  const firstDay =  List.length > 0 ? List[List.length - 1].create_time - 864000 : 0;
  const filterList = List.filter((info) => {
    return info.create_time >= firstDay;
  });
  let allPayment = 0; let allBuys = 0; let countArr = 0; 
  let countDate = List.length > 0 ?  List[List.length - 1].create_time - 864000 : 0;
  let DateRegion = []; let DateAmount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < filterList.length; i++) {
    DateAmount[countArr] += filterList[i].child_order_amount;
    if (countDate + 86400 < filterList[i].create_time) {
      countDate += 86400;
      countArr += 1;
    }
  }
  for (let i = firstDay; i < EndDay; i += 86400) {
    DateRegion.push(moment(i * 1000)
      .format('YYYY-MM-DD'));
  }
  for (let i = 0; i < payAmount.length; i++) {
    allPayment += payAmount[i];
  }
  for (let i = 0; i < Amount.length; i++) {
    allBuys += Amount[i] / 100;
  }
  useEffect(() => {
    dispatch({
      type: 'BillsListBack/fetchCheckList',
      payload: { stime: 0, etime: Date.parse(new Date()) / 1000 }, 
    });
    dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: { page: 1, limit: 99 },
    });
  }, []);
  return (
    <div className="dashboard-statistic-header">
      <Row gutter={[16, 80]} justify="center">
        <Col span={4} className="dashboard-statistic-header-item">
          <Card bordered bodyStyle={CardStyle}>
            <Statistic
              title="总收入"
              value={allPayment / 100} 
              prefix={<IconFont type="iconshourushoukuan" />}
            />
          </Card>
        </Col>
        <Col span={4} className="dashboard-statistic-header-item">
          <Card bordered bodyStyle={CardStyle}>
            <Statistic
              title="总销售额"
              value={allBuys}
              prefix={<IconFont type="iconfenzu" />}
            />
          </Card>
        </Col>
        <Col span={4} className="dashboard-statistic-header-item">
          <Card bordered bodyStyle={CardStyle}>
            <Statistic
              title="总收款订单"
              value={payAmount.length}
              suffix=" 单" 
              prefix={<IconFont type="icondingdan" />}
            />
          </Card>
        </Col>
        <Col span={4} className="dashboard-statistic-header-item">
          <Card bordered bodyStyle={CardStyle}>
            <Statistic
              title="待发货订单"
              value={NeedSendBills}
              suffix=" 单" 
              prefix={<IconFont type="icontixing" />}
            />
          </Card>
        </Col>
       
      </Row>
      <Row gutter={[40, 40]} justify="center">
        <Divider
          orientation="center"
          style={{
            borderWidth: '2px',
            fontSize: '20px',
            borderStyle: 'groove',
            color: '#808B96', 
          }}
        >
          十日销售曲线
        </Divider> 
        <Col span={20}>
          <DateLineChart timeLine={DateRegion} dateAmount={DateAmount} />
        </Col>
      </Row>
    </div>
  );
};

export default connect(({
  BillsListBack,
}) => ({
  payAmount: get(BillsListBack, 'cBillsList', []).map((info) => {
    return info.total_fee;
  }),
  Amount: get(BillsListBack, 'List', []).map((info) => {
    return info.child_order_amount;
  }),
  NeedSendBills: get(BillsListBack, 'List', []).filter((info) => {
    return info.order_status === 2;
  }).length,
  List: get(BillsListBack, 'List', []),
}))(StatisticPage);
