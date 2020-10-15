import React, { useState, useEffect } from 'react';
import {
  Drawer, Divider, Col, Row, Button, 
  Space, Select, Input, Modal
} from 'antd';
import moment from 'moment';
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
const DetailsDrawer = (props) => {
  const {
    show, data, clickShow, address, oid, dispatch,
  } = props;
  const [childrenDrawer, setChildrenDrawer]  = useState(false);
  const [orderNum, setOrderNum] =  useState('');
  const [expressId, setExpressId] = useState('');
  const [expressCompanyCode, setExpressCompanyCode] = useState('');
  const [gettingCode, setGettingCode] = useState('');
  const ListExpress = (data || []).filter((list) => {
    return list.delivery === 1;
  });
  const ListCity = (data || []).filter((list) => {
    return list.delivery === 2;
  });
  const ListSelf = (data || []).filter((list) => {
    return list.delivery === 4;
  });
  const subDelivery = () => {
    dispatch({
      type: 'BillsListBack/sendDelivery',
      payload: {
        order_code: orderNum,
        delivry_corp_name: expressCompanyCode,
        delivry_sheet_code: expressId,
        receive_code: gettingCode,
        invoice_status: 3,
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
        title="订单信息"
        width={640}
        placement="right"
        closable
        onClose={clickShow}
        visible={show}
      >
        <p className="site-description-item-profile-p">订单地址</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="收件人" content={address.name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="联系方式" content={address.phone} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="省份" content={address.province_name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="市/区" content={`${address.city_name}/${address.district_name}`} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="详细地址" content={address.detail} />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">订单详情</p>
        {
            ListExpress.length !== 0 ? <>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="发货方式" content="快递" />
                </Col>
                <Col>
                  <DescriptionItem
                    title="快递单号"
                    content={ListExpress[0].tracking_id === 0 
                      ? <>
                        <Space size="large">
                          <span>无</span>
                          <a onClick={() => setChildrenDrawer(true)}>点击发货</a>
                        </Space>
                      </> : ListExpress.tracking_id}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="子订单号" content={ListExpress[0].child_order_id} />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="商品名称"
                    // content={ListExpress[0].child_total_coupon === 0 ? '无' 
                    //   : ListExpress[0].child_total_coupon}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="子订单总额" content={ListExpress[0].child_goods_amount} />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="优惠"
                    content={ListExpress[0].child_total_coupon === 0 ? '无' 
                      : ListExpress[0].child_total_coupon}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="创建时间"
                    content={moment(ListExpress[0].create_time * 1000)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="更新时间"
                    content={moment(ListExpress[0].update_time * 1000)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  />
                </Col>
              </Row>
              <Divider /> 
            </> : null
        }
        {
            ListCity.length !== 0 ? <> 
              <Row>
                <Col span={12}>
                  <DescriptionItem title="发货方式" content="同城配送" />
                </Col>
                <Col>
                  <DescriptionItem
                    title="快递单号"
                    content={ListCity[0].tracking_id === 0 
                      ? <>
                        <Space size="large">
                          <span>无</span>
                          <a onClick={() => setChildrenDrawer(true)}>点击发货</a>
                        </Space>
                      </> : ListCity.tracking_id}
                  />
                </Col>
              </Row> 
              <Row>
                <Col span={12}>
                  <DescriptionItem title="子订单号" content={ListCity[0].child_order_id} />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="商品名称"
                    // content={ListExpress[0].child_total_coupon === 0 ? '无' 
                    //   : ListExpress[0].child_total_coupon}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="子订单总额" content={ListCity[0].child_goods_amount} />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="优惠"
                    content={ListCity[0].child_total_coupon === 0 ? '无' 
                      : ListCity[0].child_total_coupon}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="创建时间"
                    content={moment(ListCity[0].create_time * 1000)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="更新时间"
                    content={moment(ListCity[0].update_time * 1000)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  />
                </Col>
              </Row>
              <Divider />
            </> : null
        }
        {
            ListSelf.length !== 0 ? <>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="发货方式" content="自提" />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="自提时间"
                    content={moment(ListSelf[0].delivery_time * 1000)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="子订单号" content={ListSelf[0].child_order_id} />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="商品名称"
                    // content={ListExpress[0].child_total_coupon === 0 ? '无' 
                    //   : ListExpress[0].child_total_coupon}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="子订单总额" content={ListSelf[0].child_goods_amount} />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="优惠"
                    content={ListSelf[0].child_total_coupon === 0 ? '无' 
                      : ListSelf[0].child_total_coupon}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="创建时间"
                    content={moment(ListSelf[0].create_time * 1000)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="更新时间"
                    content={moment(ListSelf[0].update_time * 1000)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  />
                </Col>
              </Row>
              <Divider />
            </> : null
        }
        <Drawer
          title="填写快递单号"
          width={500}
          closable
          onClose={() => setChildrenDrawer(false)}
          visible={childrenDrawer}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={() => setChildrenDrawer(false)} style={{ marginRight: 8 }}>
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
              <Input placeholder="订单号" value={orderNum} />
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
          <Row>
            <Col span={4} style={{ marginTop: 6 }}>
              取件码:
            </Col>
            <Col span={12}>
              <Input
                style={{ width: '100%' }}
                placeholder="请输入快递取件码"
                onChange={(e) => setGettingCode(e.target.value)}
              />
            </Col>
         
          </Row>
        </Drawer>
      </Drawer>
      
    </>
  );
};
DetailsDrawer.propTypes = {
  data: PropTypes.arrayOf({}),
};
DetailsDrawer.defaultProps = {
  data: [],
};

export default connect(({
  BillsListBack,
}) => ({
  BillsListBack,
}))(DetailsDrawer);
