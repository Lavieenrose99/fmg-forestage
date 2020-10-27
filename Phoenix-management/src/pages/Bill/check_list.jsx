import React from 'react';
import {
  Table, Input, Button, Space, Tag
} from 'antd';
import { connect } from 'umi';
import { get } from 'lodash';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

@connect(({ BillsListBack }) => ({
  checkList: get(BillsListBack, 'cBillsList', []),
  cAccount: get(BillsListBack, 'cAccount', []),
})) 
class CheckList extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    stime: 0,
    etime: Date.parse(new Date()) / 1000,
  };

  componentDidMount() {
    const { stime, etime } = this.state; 
    this.props.dispatch({
      type: 'BillsListBack/fetchCheckList',
      payload: { stime, etime }, 
    });
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters, 
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => (record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : ''),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) => (this.state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const { checkList, cAccount }  = this.props;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'out_trade_no',
        key: 'out_trade_no',
        width: '20%',
        ...this.getColumnSearchProps('out_trade_no'),
      },
      {
        title: '快递单号',
        dataIndex: 'transaction_id',
        key: 'transaction_id',
        width: '20%',
        ...this.getColumnSearchProps('transaction_id'),
      },
      {
        title: '用户',
        dataIndex: 'account_id',
        key: 'out_trade_no',
        width: '8%',
        ...this.getColumnSearchProps('account_id'),
        render: (text) => {
          const username = cAccount.length > 0 ? cAccount.filter((info) => {
            return info.account_id === text;
          })[0].nickname : null;
          return (
            username
          );
        },
      },
      {
        title: '订单状态',
        dataIndex: 'trade_state',
        width: '8%',
        key: 'trade_state',
        render: (text) => {
          return (
            <Tag color="green">
              {text}
            </Tag>
          );
        },
      },      
      {
        title: '订单总额',
        width: '8%',
        dataIndex: 'total_fee',
        key: 'trade_state',
        render: (text) => {
          return (
            text / 100
          );
        },
      },
      {
        title: '创建时间',
        dataIndex: 'time_start',
        width: '15%',
        render: (updateTime) => {
          const updateTimeStr = JSON.stringify(updateTime);
          const dateTime = [];
          for (let i = 0; i < updateTimeStr.length; i++) {
            if ((i + 1) === 4 || (i + 1) === 6) {
              dateTime.push(`${updateTimeStr[i]}/`);
            } else if (i === 7) {
              dateTime.push(' ');
            } else if (((i + 1) % 2 === 0) && ((i + 1) > 8)
            && ((i + 1) < updateTimeStr.length)) {
              dateTime.push(`${updateTimeStr[i]}:`);
            } else {
              dateTime.push(updateTimeStr[i]);
            }
          }
          return (
            <>
              <span>
                {dateTime}
              </span>
            </>
          );
        },
      }

    ];
    return <Table columns={columns} dataSource={this.props.checkList} />;
  }
}

export default CheckList;
