/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Drawer, Col, Row, Button, Select, Input, Modal
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import { expressCompany } from '@/utils/Express/Express';
import '@/style/Draw.less';

const { Option } = Select;
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">
      {title}
      :
    </p>
    {content}
  </div>
);
const DelieverySavingDrawer = (props) => {
  const {
    ifShow, data, clickShow, address, oid, dispatch, 
    setVisibleChild,
    orderId,
  } = props;
  const [orderNum, setOrderNum] =  useState('');
  const [expressId, setExpressId] = useState('');
  const [expressCompanyCode, setExpressCompanyCode] = useState('');
  const [gettingCode, setGettingCode] = useState('');
  const subDelivery = () => {
    dispatch({
      type: 'BillsListBack/sendDelivery',
      payload: {
        delievry:
        {
          order_code: orderId.orderNum,
          delivry_corp_name: expressCompanyCode,
          delivry_sheet_code: expressId,
          invoice_status: 3,
          create_time: Date.parse(new Date()) / 1000,
        },
        ids: {
          ooid: orderId.ooid,
          oid: orderId.oid,
        }, 
      },
    });
  };
  const onSubmitDelivery = () => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交快递信息吗吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { subDelivery(); },
    });
  };
  useEffect(() => {
    setOrderNum(oid);
  }, [oid]);
  return (
    <>
 
      <Drawer
        title="填写快递单号"
        width={500}
        closable
        onClose={() => setVisibleChild(false)}
        visible={ifShow}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setVisibleChild(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={onSubmitDelivery}>
              提交
            </Button>
          </div>
          }
      >
        <Row style={{ marginBottom: 20 }}>
          <Col span={4} style={{ marginTop: 6 }}>
            快递公司:
          </Col>
          <Col span={12}>
            <Select
              placeholder="请选择快递公司"
              allowClear
              size="middle"
              onChange={(text) => setExpressCompanyCode(text)}
              style={{ width: '12vw' }}
            >
              {expressCompany.map((arr) => {
                return  <Option value={arr.eid} key={arr.eid}>{arr.name}</Option>;
              })}

            </Select>
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={4} style={{ marginTop: 6 }}>
            订单号:
          </Col>
          <Col span={12}>
            <Input placeholder="订单号" value={orderId.orderNum} />
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={4} style={{ marginTop: 6 }}>
            快递单号:
          </Col>
          <Col span={12}>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入快递订单号码"
              onChange={(e) => setExpressId(e.target.value)}
            />
          </Col>
         
        </Row>
      </Drawer>
      
    </>
  );
};
DelieverySavingDrawer.propTypes = {
  data: PropTypes.arrayOf({}),
};
DelieverySavingDrawer.defaultProps = {
  data: [],
};

export default connect(({
  BillsListBack,
}) => ({
  BillsListBack,
}))(DelieverySavingDrawer);
