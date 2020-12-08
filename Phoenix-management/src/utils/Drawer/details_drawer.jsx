import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import {
  Drawer, Divider, Col, Row, Button, 
 Select, Timeline
} from 'antd';
import request from '@/utils/request';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import '@/style/Draw.less';

export const DescriptionItem = ({ title, content }) => (
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
    show, data, clickShow, Address, oid, dispatch,
  } = props;
  const [expressInfo, setExpressInfo] = useState([]);
  useEffect(() => {
    if (data.address_id) {
      props.dispatch({
        type: 'BillsListBack/fetchBillAddress',
        payload: data.address_id,
      });
      request('/api.farm/delivery/info/post', {
        method: 'POST',
        data: {
          delivry_corp_name: data.tracking_company,
          delivry_sheet_code: data.tracking_id,
        },
      }).then((info) => {
        setExpressInfo(info.info.data);
      }); 
    }
  }, [data]);
  return (
    <>
      <Drawer
        mask={false}
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
            <DescriptionItem title="收件人" content={Address.name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="联系方式" content={Address.phone} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="省份" content={Address.province_name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="市/区" content={`${Address.city_name}/${Address.district_name}`} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="详细地址" content={Address.detail} />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">订单详情</p>
        <Timeline>
          {
          (expressInfo ?? []).map((info) => {
            return <Timeline.Item>
              {`${info.context}  ${info.time}`} 
            </Timeline.Item>;
          })
        }
        </Timeline>
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
  Address: get(BillsListBack, 'Address', {}),
}))(DetailsDrawer);
