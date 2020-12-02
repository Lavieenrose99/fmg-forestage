import {
  Table, Space, Button, Input, Avatar
} from 'antd';
import React, { useState, useEffect } from 'react';
import request from '@/utils/request';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  RefundListTable
} from '@/utils/Refund/refund_table.jsx';
import  RefundComfirm  from '@/utils/Refund/Refund_comfim_drawer.jsx';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import { get } from 'lodash';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined
} from '@ant-design/icons';

const FmgRefundList = (props) => {
  const { RefundList, cAccount } = props;
  console.log(cAccount);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [checkRefundInfo, setCheckRefundInfo] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const userAtom = {
    title: '用户',
    dataIndex: 'account_id',
    width: '10%',
    key: 'id',
    render: (id) => {
      const user = cAccount.find((item) => item.id === id)
        ? cAccount.find((item) => item.id === id) : null;
      if (user) {
        return (
          <>
            <Avatar src={user.avator} />
            <span style={{ marginLeft: 10 }}>
              {user.nickname}
            </span>
          </>
        );
      }
      return (
        <>
          <Avatar>没注册</Avatar>
          <span style={{ marginLeft: 10 }}>
            无该用户
          </span>
        </>
      );
    },
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters, 
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`输入 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={
          () => { setSearchText(''); setSearchedColumn(''); }
}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <IconFont type="iconsousuo" style={{ color: filtered ? '#1890ff' : undefined, fontSize: 20 }} />,
    onFilter: (value, record) => (record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : ''),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )),
  });
  useEffect(() => {
    props.dispatch({
      type: 'BillsListBack/fetchRefundList',
      payload: {
        limit: 99,
        page: 1,
      },
    });
  }, []);
  RefundListTable[1] = userAtom;
  console.log(RefundListTable, userAtom);
  RefundListTable[0] = { ...RefundListTable[0], ...getColumnSearchProps('out_refund_no') };
  
  //一般的table记得分开抽象，需要处理的table再组合
  const columns = [
    ...RefundListTable,
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => { setCheckRefundInfo(record); setVisibleDrawer(true); }}>
            处理退款
          </a>
        </Space>
      ),
    }
  ];
  return (
    <PageHeaderWrapper>
      <Table columns={columns} dataSource={RefundList} />
      <RefundComfirm
        show={visibleDrawer}
        closeDrawer={setVisibleDrawer}
        billsInfos={checkRefundInfo}
      />
    </PageHeaderWrapper>

  );
};
export default connect(({
  BillsListBack,
}) => ({
  BillsListBack,
  RefundList: get(BillsListBack, 'RefundInfos', []),
  cAccount: get(BillsListBack, 'cAccount', []),
}))(FmgRefundList);
