import React, { useState, useEffect } from 'react';
import {
  Drawer, Row, Col, Button, Tag, Modal, Avatar, Table
} from 'antd';
import {
  RefundReason, RefundSevice, RefundWays, RefundStatus, RefundGoodsList
} from '@/utils/Refund/refund_table.jsx';
import { BASE_QINIU_URL } 
  from '@/utils/Token';
import moment from 'moment';
import { connect } from 'umi';
import { get } from 'lodash';
import { DescriptionItem } from '../Drawer/details_drawer.jsx';

const RefundComfirm = (props) => {
  const {
    show, closeDrawer,
    billsInfos, cAccount, GoodsList, ReBillslist,
  } = props;
  const pictures = billsInfos.pictures ? JSON.parse(billsInfos.pictures) 
    : [{ picture: 'picture-1605170911000' }];
  const user = cAccount.find((item) => item.id === billsInfos.account_id)
    ? cAccount.find((item) => item.id === billsInfos.account_id) : { nickname: '用户', avator: '' };
  useEffect(() => {
    props.dispatch({
      type: 'BillsListBack/RefundGoods',
      payload: [billsInfos.order_detail_id],
    });
  }, [billsInfos]);
  // console.log(GoodsList, ReBillslist);
  const ReBillsGoods = ReBillslist.order_detail ? ReBillslist.order_detail.map((list) => {
    const Goods =  GoodsList.find((item) => item.id === list.goods_id);
    console.log(list)
    const specifications =  GoodsList.find((item) => item.id === list.goods_id) 
      ? {
        ...GoodsList.find((item) => item.id === list.goods_id)
          .specification.find((item) => {
            return item.id === list.goods_specification_id;
          }),
        num: list.purchase_qty, 
      } : null;
    const GoodsInfos = Goods ? Object.assign(Goods, { specifications }) : {};
    return GoodsInfos;
  }) : null;
  return (
    <Drawer
      width={640}
      destroyOnClose
      title="退单信息"
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
        <Col span={20}><DescriptionItem title="退款单号" content={billsInfos.out_refund_no} /></Col>
      </Row>
      <Row>
        <Col span={12}>
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
        <Col span={12}><DescriptionItem title="地址信息" content={billsInfos.address_id} /></Col>
      </Row>
      <Row>
        <Col span={12}><DescriptionItem title="订单ID" content={billsInfos.order_id} /></Col>
        <Col span={12}><DescriptionItem title="子订单ID" content={billsInfos.child_order_id} /></Col>
      </Row>
      <Row>
        <Col span={12}><DescriptionItem title="订单金额" content={billsInfos.total_fee / 100} /></Col>
        <Col span={12}><DescriptionItem title="退款金额" content={billsInfos.return_amount / 100} /></Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="退换理由" 
            content={RefundReason.find((item) => item.id === billsInfos.reason)
              ? RefundReason.find((item) => item.id === billsInfos.reason).type : null}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="退换服务"
            content={RefundSevice.find((item) => item.id === billsInfos.service_type)
              ? RefundSevice.find((item) => item.id === billsInfos.service_type).ser : null}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="退货方式" 
            content={RefundWays.find((item) => item.id === billsInfos.return_mode)
              ? RefundWays.find((item) => item.id === billsInfos.return_mode).way : '无'}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="退货状态" 
            content={<Tag>
              {RefundStatus.find((item) => item.id === billsInfos.status)
                ? RefundStatus.find((item) => item.id === billsInfos.status).status : null}
            </Tag>}
          />
        </Col>
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
        <Col span={22}>
          <DescriptionItem title="买家留言" content={billsInfos.message} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DescriptionItem
            title="商品详情"
            content={<Table
              columns={RefundGoodsList} 
              dataSource={ReBillsGoods}
              pagination={{
                pageSize: 2,
              }}
            />}
          />
        </Col>
      </Row>
      <Row>
        <strong span={20}>上传图片: </strong>
      </Row>
      <Row style={{ marginTop: 20 }}>
        {
            pictures.map((url) => {
              return <Col span={8}>
                <img
                  src={`${BASE_QINIU_URL}${url.picture}`}
                  alt="img" 
                  style={{ marginLeft: 20, marginBottom: 20 }}
                  width={180}
                  height={120}
                />
              </Col>;
            })
        }
      </Row>
    </Drawer>
  );
};

export default connect(({ fmgInfos, BillsListBack }) => ({
  InfosList: get(fmgInfos, 'InfosList', []),
  cAccount: get(BillsListBack, 'cAccount', []),
  GoodsList: get(BillsListBack, 'ChildGoods', []),
  ReBillslist: get(BillsListBack, 'ReBillList', []),
}))(RefundComfirm);
