import {
  Table, Timeline, Space, Drawer 
} from 'antd';
import React, { useState, useEffect } from 'react';
import request from '@/utils/request';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { expressList, ApiCode } from '@/utils/Express/Express';
import { ExpressData } from '@/utils/Express/mock_data';
import { get } from 'lodash';

const ExpressList = (props) => {
  const { ExpressList, ExpressInfo } = props;
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [expressInfo, setExpressInfo] = useState([]);
  const [Com, setCom] = useState('');
  const [Num, setNum] = useState('');

  useEffect(() => {
    request('/api.farm/delivery/info/post', {
      method: 'POST',
      data: {
        delivry_corp_name: Com,
        delivry_sheet_code: Num,
      },
    }).then((data) => {
      setExpressInfo(data.info.data);
    }); 
  }, [Com]);
  useEffect(() => {
    props.dispatch({
      type: 'BillsListBack/fetchExpressList',
      payload: {
        limit: 99,
        page: 1,
      },
    });
  }, []);

  const checkExpressStatus = (data) => {
    setCom(data.delivery_corp_name);
    setNum(data.delivery_sheet_code);
    setVisibleDrawer(true); 
  };
  const columns = [
    ...expressList,
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => checkExpressStatus(record)}>
            查看快递
          </a>
        </Space>
      ),
    }
  ];
  return (
    <PageHeaderWrapper>
      <Table columns={columns} dataSource={ExpressInfo} />
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={() => setVisibleDrawer(false)}
        visible={visibleDrawer}
      >
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
    </PageHeaderWrapper>

  );
};
export default connect(({
  BillsListBack,
}) => ({
  BillsListBack,
  ExpressList: get(BillsListBack, 'ExpressList', []),
  ExpressInfo: get(BillsListBack, 'ExpressInfos', []),
}))(ExpressList);
