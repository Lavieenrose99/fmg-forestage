/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useRef } from 'react';
import { get } from 'lodash';
import { connect } from 'umi';
import moment from 'moment';
import {
  Table, Input, InputNumber,
  Form, PageHeader, Space, Modal, Select, 
  Button, Dropdown, Badge, Menu
} from 'antd';
import request from '@/utils/request';
import {
  RedoOutlined, MinusCircleTwoTone, 
  PlusCircleTwoTone, DownOutlined 
} from '@ant-design/icons';
import DetailsDrawer  from '@/utils/Drawer/details_drawer.jsx';
import DelieverySavingDrawer from '@/utils/Drawer/delivery_saving.jsx';
import PropTypes from 'prop-types';

const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
const { Option } = Select;
const layout = {
  labelCol: {
    span: 7,
  },
};

const BillsList = (props) => {
  const {
    List, Address, Account, MainList, ChildGoods,
  } = props;
  const [form] = Form.useForm();
  const [formExpress] = Form.useForm();
  const formRef = useRef(null);
  const [changeVisible, setChangeVisible] = useState(false);
  const [showDrawer, setshowDrawer] = useState(false);
  const [data, setData] = useState([]);
  const [selectName, setSelectName] = useState('');
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [childOrderDetails, setChildOrderDetails] = useState([]);
  const [selectAccId, setSelectAccID] = useState('');
  const [orderId, setOrderId] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [childGoodsIdArr, setChildGoodsIdArr] = useState([]);
  const [childUnionInfo, setChildUnionInfo] = useState([]);
  const [childrenDrawer, setChildrenDrawer]  = useState(false);
  const [childBillsId, setChildBillsId] = useState({});
  // const time = new Date().getTime();
  // const paraData = JSON.stringify({ sendAddr: `${mockAddress.detail}` });
  // const md5Code = md5(`${paraData}${  
  //   time}${ApiCode.key}${ApiCode.secret}`).toLocaleUpperCase();
  const MainListColum = MainList.map((arr, index) => {
    return {
      ...arr, key: index,
    };
  });
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
          const ids = {
            orderNum: record.order_num,
            ooid: record.test_order.id,
            oid: record.id,
          };
          return (
            <Space size="middle">
              <a onClick={() => {
                setChildrenDrawer(!childrenDrawer);
                setChildBillsId(ids); 
              }}
              >
                快递发货
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
    </>;
  };
  useEffect(() => {
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: { page: 1, limit: 99 },
    });
  }, []);

  const reloadSelector = () => {
    setSelectName('');
    setSelectAccID('');
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: 1,
        limit: 99,
      },
    });
  };
  const selectUserName = (e) => {
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: 1,
        limit: 99,
        username: 
        e.target.value,
        account_id: selectAccId, 
      },
    });
    setSelectName(e.target.value);
  };
  const selectAccountId = (e) => {
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: {
        page: 1, limit: 99, username: selectName, account_id: e.target.value, 
      },
    });
    setSelectAccID(e.target.value);
  };
  const clickShow = () => {
    const show = showDrawer;
    setshowDrawer(!show);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const getInfos = (arr, aid, oid) => {
    props.dispatch({
      type: 'BillsListBack/fetchBillAddress',
      payload: aid,
    });
    setData(arr);
    setOrderId(oid);
    setshowDrawer(true);
  };
  const sendGoods = (aid, record) => {
    setChangeVisible(true);
    props.dispatch({
      type: 'BillsListBack/fetchBillAddress',
      payload: aid,
    });
    formExpress.setFieldsValue({
      recManName: Address.name ?? '',
      recManMobile: Address.phone ?? '',
      recManPrintAddr: (Address.province_name
         + Address.city_name + Address.district_name + Address.detail) ?? '',
      weight: record.weight ?? 0,
      remark: record.message ?? '',
    });
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_num',
      key: 'order_num',
      width: '20%',
    },
    {
      title: '用户名',
      dataIndex: 'account_id',
      key: 'order_num',
      width: '8%',
      render: (text) => {
        const username = Account.length !== 0 ? Account.filter((info) => {
          return info.account_id === text;
        })[0].nickname : null;
        return (
          username
        );
      },
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'order_num',
      width: '8%',
      render: (text, record) => {
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
    },
    {
      title: '操作',
      key: 'order_num',
      dataIndex: 'operation',
      width: '40%',
      render: (_, record) => {
        return (
          <Space size="large">
            {record.delivery === 1
              ? <a disabled={editingKey !== ''} onClick={() => sendGoods(record.address_id, record)}>
                快递发货
              </a> : null}
            {
              <a onClick={() => getInfos(record.child_order,
                record.address_id, record.order_num)}
              >
                详细信息
              </a>
              }
          </Space>
        );
      },
    }
  ];
  const mergedColumns = columns.map((col) => {
    return col;
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
                      订单号: 
                    </span>
                    <Input
                      className="goods-selector-name" 
                      value={selectAccId}
                      onChange={selectAccountId}
                      placeholder="请输入订单号"
                    />
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
              dataSource={MainListColum}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
            />
        
          </>
}
      /> 
    
      <DetailsDrawer
        show={showDrawer}
        data={data}
        clickShow={clickShow} 
        address={Address}
        oid={orderId}
      />
    </Form>
    
  );
};
BillsList.propTypes = {
  List: PropTypes.arrayOf({}),
  Details: PropTypes.arrayOf({}),
  Address: PropTypes.arrayOf({}),
};
BillsList.defaultProps = {
  List: [],
  Details: [],
  Address: [],
};

export default  connect(({
  BillsListBack,
}) => ({
  List: get(BillsListBack, 'List', []),
  MainList: get(BillsListBack, 'MainList', []),
  Details: get(BillsListBack, 'Details', {}),
  Address: get(BillsListBack, 'Address', {}),
  Account: get(BillsListBack, 'Account', []),
  ChildGoods: get(BillsListBack, 'ChildGoods', []),
}))(BillsList);
