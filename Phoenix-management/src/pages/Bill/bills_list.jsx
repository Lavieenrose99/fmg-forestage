/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useRef } from 'react';
import { get } from 'lodash';
import { connect } from 'umi';
import moment from 'moment';
import {
  Table, Input, DatePicker,
  Form, PageHeader, Space, Select, 
  Button, Badge, Avatar
} from 'antd';
import {
  RedoOutlined, MinusCircleTwoTone, 
  PlusCircleTwoTone
} from '@ant-design/icons';
import DetailsDrawer  from '@/utils/Drawer/details_drawer.jsx';
import DelieverySavingDrawer from '@/utils/Drawer/delivery_saving.jsx';
import { TimeFilter, StatusSet } from '@/utils/DataStore/bills_data_set.js';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import './bills_list.less';
import PropTypes from 'prop-types';

const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
const { Option } = Select;
const { RangePicker } = DatePicker;

const BillsList = (props) => {
  const {
    List, MainListBreak, Address, Account, MainList, ChildGoods, pageTotals,
  } = props;
  const [form] = Form.useForm();
  const [formExpress] = Form.useForm();
  const formRef = useRef(null);
  const [changeVisible, setChangeVisible] = useState(false);
  const [account, setAccount] = useState(Account);
  const [showDrawer, setshowDrawer] = useState(false);
  const [selectName, setSelectName] = useState('');
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [childOrderDetails, setChildOrderDetails] = useState([]);
  const [selectAccGname, setSelectAccGname] = useState('');
  const [selectAccSta, setSelectAccSta]  = useState('');
  const [orderId, setOrderId] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [childGoodsIdArr, setChildGoodsIdArr] = useState([]);
  const [childUnionInfo, setChildUnionInfo] = useState([]);
  const [childrenDrawer, setChildrenDrawer]  = useState(false);
  const [childBillsId, setChildBillsId] = useState({});
  const  [pageSize, setPageSize] = useState(10);
  const  [pageCurrent, setpageCurrent] = useState(1);
  const [childBillsInfos, setChildBillsInfos] = useState({});

  const MainListColumBreak = MainListBreak.map((arr, index) => {
    return {
      ...arr, key: index,
    };
  });
  const clickShow = () => {
    const show = showDrawer;
    setshowDrawer(!show);
  };
  const onExpand = (_, record) => {
    const ChildOrders = List.filter((info) => {
      return info.test_order.id === record.id;
    }).map((arr, index) => {
      return { ...arr, key: index };
    });
    setSelectedOrder(ChildOrders);
  };

  const onExpandChild = (_, record) => {
    setChildOrderDetails(record.order_detail);
    const ChildGoodsId = record.order_detail.map((info) => {
      return info.goods_id;
    });

    const ChildGoodsArr = record.order_detail.map((info) => {
      return info.goods_specification_id;
    });
    setChildGoodsIdArr(ChildGoodsArr);
    props.dispatch({
      type: 'BillsListBack/fetchChildGoodsList',
      payload: ChildGoodsId,
    });
  };
  useEffect(() => {
    const UnionGoods = childOrderDetails.map((infos, index) => {
      const specification = ChildGoods.length !== 0 
        ? ChildGoods[index].specification.filter((spec) => {
          return  spec.id === childGoodsIdArr[index];
        }) : [];
      const FilterChildGood = Object.assign((ChildGoods[index] ?? {}), (specification[0] ?? {}));
      return { ...infos, ...FilterChildGood };
    });
    setChildUnionInfo(UnionGoods);
  }, [ChildGoods]);
  const rawTimeSelector = (info) => {
    const reduce = info;
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: 1,
        limit: 99,
        username: selectName,
        name: selectAccGname,
        status: selectAccSta,
        start_time: (Date.parse(new Date()) / 1000  - reduce),
        end_time: Date.parse(new Date()) / 1000,
      },
    });
  };
  const filterTimePicker = (date) => {
    const start = date[0]._d;
    const end = date[1]._d;
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: pageCurrent,
        limit: pageSize,
        username: selectName,
        name: selectAccGname,
        status: selectAccSta,
        start_time: Date.parse(start) / 1000,
        end_time: Date.parse(end) / 1000,
      },
    });
  };
  const expandedTestRowRender = () => {
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        width: '20%',
        render: (text, record) => (
          <div>
            <img
              src={record ? BASE_QINIU_URL + record.picture : null}
              alt="img" 
              style={{ width: 30, height: 30, marginRight: 20  }}
            />
            <span>{text}</span>
          </div>
        ), 
      },
      {
        title: '规格',
        dataIndex: 'specification',
        render: (info) => (
          (info ? Object.values(info) : []).map((arr, index, record) => {
            return record.length !== index + 1 ? <span>{`${arr}/`}</span> : <span>{arr}</span>;
          })
        ),
      },
      {
        title: '数量',
        dataIndex: 'purchase_qty',
        render: (qty) => {
          return <span>{`x ${qty}`}</span>;
        }, 
      },
      {
        title: '运费',
        dataIndex: 'exp_fare',
        render: (exp) => {
          return exp / 100;
        }, 
      },
      {
        title: '优惠',
        dataIndex: 'coupon',
        render: (coupon) => {
          return <span>{coupon / 100}</span>;
        }, 
      },
      {
        title: '总额',
        dataIndex: 'goods_amount',
        render: (amount) => {
          return <span>{amount / 100}</span>;
        }, 
      },
      { title: '备注', dataIndex: 'message', key: 'name' }
      
    ];
  
    return <Table
      columns={columns} 
      dataSource={childUnionInfo} 
      pagination={false}
      bordered
    />;
  };
  const expandedRowRender = () => {
    const columns = [
      { title: '子订单号', dataIndex: 'order_num', key: 'order_num' },
      {
        title: '订单状态',
        dataIndex: 'order_status',
        key: 'name',
        render: (text, record) => {
          console.log(record);
          let t = '';
          let exstatus = 'Processing';
          if (text === 1) {
            t = '未支付';
            exstatus = 'warning';
          } else if (text === 2) {
            t = '待发货';
            exstatus = 'warning';
          } else if (text === 3) {
            t = '待收货';
            exstatus = 'processing';
          } else if (text === 4) {
            t = '待评价';
            exstatus = 'processing';
          } else if (text === 5) {
            t = '已完成';
            exstatus = 'success';
          } else {
            t = '已取消';
            exstatus = 'warning';
          }
          return (
            <span>
              <Badge status={`${exstatus}`} />
              {
              t
}
            </span>
          );
        }, 
      },
      {
        title: '商品总额',
        dataIndex: 'child_goods_amount',
        render: (divide) => {
          return (
            divide / 100
          );
        }, 
      },
      {
        title: '运费',
        dataIndex: 'child_exp_fare',
        render: (divide) => {
          return (
            divide / 100
          );
        }, 
      },
      {
        title: '子订单总额',
        dataIndex: 'child_order_amount',
        render: (divide) => {
          return (
            divide / 100
          );
        }, 
      },
      {
        title: '实付款',
        dataIndex: 'child_order_amount',
        render: (divide) => {
          return (
            divide / 100
          );
        }, 
      },
      {
        title: '发货方式',
        dataIndex: 'delivery',
        render: (text) => {
          let way = '';
          if (text === 1) {
            way = '快递配送';
          } else if (text === 2) {
            way = '同城配送';
          } else if (text === 4) {
            way = '买家自提';
          }
          return (
            way
          );
        }, 
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record) => {
          const mark = {};
          const ids = {
            orderNum: record.order_num,
            ooid: record.test_order.id,
            oid: record.id,
          };
          if (record.tracking_id) {
            mark.text = '查看物流';
            mark.id = 1;
          } else {
            mark.text = '快递发货';
            mark.id = 2;
          }
          return (
            <Space size="middle">
              <a onClick={() => {
                if (mark.id === 2) {
                  setChildrenDrawer(!childrenDrawer);
                  setChildBillsId(ids); 
                } else {
                  setshowDrawer(!showDrawer);
                  setChildBillsInfos(record)
                }
              }}
              >
                {mark.text}
              </a>
            </Space>
          );
        },
      }
    ];
    
    return <>
      <Table
        columns={columns}
        dataSource={selectedOrder} 
        pagination={false}
        bordered
        expandable={{
          expandedRowRender: expandedTestRowRender,
          defaultExpandAllRows: false,
          onExpand: onExpandChild,
        }}
      />
      <DelieverySavingDrawer
        ifShow={childrenDrawer}
        setVisibleChild={setChildrenDrawer} 
        orderId={childBillsId}
      />
      <DetailsDrawer
        show={showDrawer}
        data={childBillsInfos}
        clickShow={clickShow} 
        address={Address}
        oid={orderId}
      />
    </>;
  };
  useEffect(() => {
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: pageCurrent, limit: pageSize, 
      },
    });
  }, []);
  useEffect(() => {
    setAccount(Account);
  }, [Account]);
  const reloadSelector = () => {
    setSelectName('');
    setSelectAccGname('');
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: pageCurrent,
        limit: pageSize,
      },
    });
  };
  const selectUserName = (e) => {
    const auId = account.filter((arr) => {
      return arr.nickname === e.target.value;
    }).length !== 0
      ? account.filter((arr) => {
        return arr.nickname === e.target.value;
      })[0].account_id : null;
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: 1,
        limit: 99,
        author_id: auId,
        name: selectAccGname, 
      },
    });
    setSelectName(e.target.value);
  };
  const selectAccountId = (e) => {
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: pageCurrent,
        limit: pageSize,
        username: selectName,
        name: e.target.value,
        status: selectAccSta,
      },
    });
    setSelectAccGname(e.target.value);
  };
  const selectBillsStatus = (e) => {
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: pageCurrent,
        limit: pageSize,
        username: selectName,
        account_id: selectAccGname,
        status: e,
      },
    });
    setSelectAccSta(e);
  };
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderfatherUni',
      key: 2,
      width: '20%',
    },
    {
      title: '用户名',
      dataIndex: 'account_id',
      key: 'order_num',
      width: '15%',
      render: (id) => {
        const user = Account.find((item) => item.id === id)
          ? Account.find((item) => item.id === id) : null;
        if (user) {
          return (
            <div className="fmg-refund-user-container">
              <span>
                <Avatar src={user.avator} />
              </span>
              <span style={{ marginLeft: 10 }}>
                {user.nickname}
              </span>
            </div>
          );
        }
        return (
          <div className="fmg-refund-user-container">
            <span>
              <Avatar>没注册</Avatar>
            </span>
            <span style={{ marginLeft: 10 }}>
              无该用户
            </span>
          </div>
        );
      },
    },
    {
      title: '订单类型',
      dataIndex: 'status',
      key: 'order_num',
      width: '10%',
      render: (text) => {
        let t = '';
        const exstatus = 'processing';
        if (text === 2) {
          t = '未拆分';
        } else if (text === 1) {
          t = '已拆分';
        }
        return (
          <span>
            <Badge status={`${exstatus}`} />
            {
            t
}
          </span>
        );
      },
    },
    {
      title: '商品总额',
      dataIndex: 'total_goods_amount',
      key: 'order_num',
      width: '10%',
      render: (divide) => {
        return (
          divide / 100
        );
      },
    },
    {
      title: '总运费',
      key: 'order_num',
      dataIndex: 'total_exp_fare',
      width: '10%',
      render: (divide) => {
        return (
          divide  / 100
        );
      },
    },
    {
      title: '总优惠',
      key: 'order_num',
      dataIndex: 'total_coupon',
      width: '10%',
      render: (divide) => {
        return (
          divide / 100
        );
      },
    },
    {
      title: '实付款',
      key: 'order_num',
      dataIndex: 'total_order_amount',
      width: '10%',
      render: (divide) => {
        return (
          divide / 100
        );
      },
    },
    {
      title: '创建时间',
      key: 'order_num',
      dataIndex: 'create_time',
      width: '15%',
      render: (updateTime) => (
        <>
          <span>
            {moment(updateTime * 1000)
              .format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </>
      ),
    }
  ];
  const mergedColumnsUni = columns.filter((col) => {
    return col.key !== 1;
  });
  
  return (
    <Form form={form} component={false}>
      <PageHeader
        title="商品订单管理"
        style={{ backgroundColor: 'white' }} 
        footer={
          <>
            <div className="goods-bills-container">
              <div className="goods-list-selector">
                <Space size="large">
                  <span className="good-selector-items">
                    <span>
                      用户名称: 
                    </span>
                    <Input
                      className="goods-selector-name" 
                      value={selectName}
                      onChange={selectUserName}
                      placeholder="请输入用户名称"
                    />
                  </span>
                  <span className="good-selector-items">
                    <span>
                      商品名称: 
                    </span>
                    <Input
                      className="goods-selector-name" 
                      value={selectAccGname}
                      onChange={selectAccountId}
                      placeholder="请输入商品名称"
                    />
                  </span>
                  <span className="good-selector-items">
                    <span>
                      订单状态: 
                    </span>
                    <Select
                      className="goods-selector-name" 
                      placeholder="请选择订单状态"
                      onChange={selectBillsStatus}
                    >
                      {
                        StatusSet.map((info) => {
                          return <Option value={info.value}>
                            {
                            info.title
                          }

                          </Option>;
                        })
                      }
                    </Select>
                  </span>

                  <Button
                    type="primary"
                    onClick={reloadSelector}
                    icon={<RedoOutlined />}
                  >
                    清空
                  </Button>
                </Space>
              </div>
              <div className="bills-date-selector">
                <Select className="span-filter" defaultValue={TimeFilter[0].value} onChange={rawTimeSelector}>
                  {
                    TimeFilter.map((info) => {
                      return  <Option value={info.value}>
                        {
                     info.time 
}
                      </Option>;
                    })
                  }
                </Select>
                <span>
                  下单时间: 
                </span>
                <RangePicker
                  className="span-name-item"
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime 
                  onChange={filterTimePicker}
                />
              </div>
            </div>
            <Table
              bordered
              expandable={{
                expandedRowRender,
                defaultExpandAllRows: false,  
                expandIcon: ({ expanded, onExpand, record }) => (expanded ? (
                  <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} />
                ) : (
                  <PlusCircleTwoTone onClick={(e) => onExpand(record, e)} />
                )),
                onExpand,
              }}
              dataSource={MainListColumBreak}
              columns={mergedColumnsUni}
              rowClassName="editable-row"
              pagination={{
                total: pageTotals,
                pageSize,
                onShowSizeChange: (current, size) => {
                  setPageSize(size);
                },
                onChange: (page, size) => {
                  setpageCurrent(page);
                  props.dispatch({
                    type: 'BillsListBack/fetchBillsList',
                    payload: {
                      page, limit: size, 
                    },
                  });
                },
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
             
          </>
}
      /> 
    </Form>
    
  );
};
BillsList.propTypes = {
  List: PropTypes.arrayOf({}),
  Address: PropTypes.arrayOf({}),
};
BillsList.defaultProps = {
  List: [],
  Address: [],
};

export default  connect(({
  BillsListBack,
}) => ({
  List: get(BillsListBack, 'List', []),
  MainListBreak: get(BillsListBack, 'MainListBreak', []),
  MainList: get(BillsListBack, 'MainList', []),
  Details: get(BillsListBack, 'Details', {}),
  Address: get(BillsListBack, 'Address', {}),
  Account: get(BillsListBack, 'Account', []),
  ChildGoods: get(BillsListBack, 'ChildGoods', []),
  pageTotals: get(BillsListBack, 'total', []),
}))(BillsList);
