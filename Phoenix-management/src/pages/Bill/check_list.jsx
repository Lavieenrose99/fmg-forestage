/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
/* eslint-disable no-magic-numbers */
import React from 'react';
import {
  Table, Input, Button, Space, Tag, DatePicker, Modal
} from 'antd';
import { connect } from 'umi';
import { get } from 'lodash';
import request from '@/utils/request';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined, StopTwoTone, DownloadOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import './check_list.less';

const { RangePicker } = DatePicker;
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
    st: '',
    et: '',
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

  filterTimePicker = (date) => {
    const start = date[0]._d;
    const end = date[1]._d;
    this.setState({
      st: start,
      et: end,
    });
  }

  setTimeRegion = () => {
    const {
      st, et, 
    } = this.state; 
    this.props.dispatch({
      type: 'BillsListBack/fetchCheckList',
      payload: { stime: Date.parse(st) / 1000, etime: Date.parse(et) / 1000 }, 
    });
  }

  onResetInfo =() => {
    const { stime, etime } = this.state; 
    this.props.dispatch({
      type: 'BillsListBack/fetchCheckList',
      payload: { stime, etime }, 
    });
  }

  onSureDown = () => {
    const {
      st,
    } = this.state;
    if (st === '') {
      Modal.error({
        title: '凤鸣谷',
        icon: <ExclamationCircleOutlined />,
        content: '请设定对账单时间',
      });
    } else {
      Modal.confirm({
        title: '凤鸣谷',
        icon: <ExclamationCircleOutlined />,
        content: '确认下载吗？',
        okText: '确认',
        onOk: () => { this.onSubmit(); },
        cancelText: '取消',
      });
    }
  }

  onSubmit =() => {
    const {
      st, et, 
    } = this.state; 
    window.location.href = `https://api.fmg.net.cn/pay/bill/download/${Date.parse(st) / 1000}/${Date.parse(et) / 1000}`;
  }

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
        title: '微信支付单号',
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
          const username = cAccount.find((acc) => acc.account_id === text) 
            ? cAccount.find((acc) => acc.account_id === text).nickname
            : '账户注销';
          return (
            username
          );
        },
      },
      {
        title: '支付状态',
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
        title: '支付总额',
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
            if ((i + 1) === 4 || (i + 1) === 8 || (i + 1) === 6) {
              dateTime.push(`${updateTimeStr[i]}/`);
            } else if (i === 8) {
              dateTime.push(' ');
              dateTime.push(updateTimeStr[i]);
            } else if (((i + 1) % 2 === 0) && ((i + 1) > 9)
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
    return (
      <>
        <div className="check-list-header-containter">
          <Button
            type="primary"
            style={{
              margin: 10,
            }}
            onClick={() => { this.setTimeRegion(); }}
            icon={<SearchOutlined />}
          >
            搜索
          </Button>
          <RangePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime 
            onChange={this.filterTimePicker}
          />
      
          <Button
            onClick={() => { this.onResetInfo(); }}
            type="ghost"
            style={{
              margin: 10,
            }}
            icon={<StopTwoTone />}
          >
            全部
          </Button>
          <Button
            onClick={() => { this.onSureDown(); }}
            type="ghost"
            style={{
              marginLeft: 30,
            }}
            icon={<DownloadOutlined />}
          >
            下载对账表
          </Button>
          
        </div>
        <Table columns={columns} dataSource={this.props.checkList} />
      </>
    );
  }
}

export default CheckList;
