import {
  Table, Timeline, Space, Drawer 
} from 'antd';
import React, { useState, useEffect } from 'react';
import request from '@/utils/request';
import qs from 'qs';
import md5 from 'js-md5';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { expressList, ApiCode } from '@/utils/Express/Express';
import { ExpressData } from '@/utils/Express/mock_data';

const ExpressList = () => {
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [expressInfo, setExpressInfo] = useState([]);
  const [Com, setCom] = useState('');
  const [Num, setNum] = useState('');
  const paramData = JSON.stringify({
    com: Com,
    num: Num,
    from: '',
    phone: '',
    to: '',
    resultv2: '0',
    show: '0',
    order: 'desc', 
  });
  const md5code = md5(`${paramData}${ApiCode.key}${ApiCode.customer}`).toLocaleUpperCase();
  useEffect(() => {
    const uploadItem = {
      customer: ApiCode.customer,
      param: paramData,
      sign: md5code,
    };
    request('/api.poll/poll/query.do', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(uploadItem),
    }).then((data) => {
      setExpressInfo(data.data);
    }); 
  }, [Com]);

  const checkExpressStatus = (data) => {
    setCom(data.delivry_corp_name);
    setNum(data.delivry_sheet_code);
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
      <Table columns={columns} dataSource={ExpressData} />
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
export default ExpressList;
