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
import { expressCompany, ApiCode } from '@/utils/Express/Express';
import DetailsDrawer  from '@/utils/Drawer/details_drawer.jsx';
import PropTypes from 'prop-types';
import qs from 'qs';
import md5 from 'js-md5';
import TextArea from 'antd/lib/input/TextArea';

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

const { Option } = Select;
const layout = {
  labelCol: {
    span: 7,
  },
};
const mockAddress = {
  city_id: 28,
  city_name: '珠海市',
  country_id: 1,
  detail: '北京师范大学珠海分校',
  district_id: 0,
  district_name: '香洲区',
  id: 16,
  name: '小陈',
  phone: '13829801238',
  province_id: 5,
  province_name: '广东省',

};

const BillsList = (props) => {
  const {
    List, Address, Account, MainList, 
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
  const time = new Date().getTime();
  const paraData = JSON.stringify({ sendAddr: `${mockAddress.detail}` });
  const md5Code = md5(`${paraData}${  
    time}${ApiCode.key}${ApiCode.secret}`).toLocaleUpperCase();
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

    console.log(ChildGoodsId);
  };

  const expandedTestRowRender = () => {
    const columns = [
      { title: '商品名称', dataIndex: 'goods_id', key: 'date' },
      { title: '规格', dataIndex: 'goods_specification_id', key: 'name' },
      { title: '数量', dataIndex: 'purchase_qty', key: 'name' },
      { title: '备注', dataIndex: 'message', key: 'name' },
      { title: '运费', dataIndex: 'exp_fare', key: 'name' },
      {
        title: '更新时间',
        dataIndex: 'update_time',
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
  
    return <Table
      columns={columns} 
      dataSource={childOrderDetails} 
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
      { title: '商品总额', dataIndex: 'child_goods_amount' },
      { title: '运费', dataIndex: 'child_exp_fare' },
      { title: '优惠', dataIndex: 'child_order_amount' },
      { title: '实付款', dataIndex: 'child_order_amount' },
      {
        title: '发货方式',
        dataIndex: 'delivery',
        render: (text) => {
          let way = '';
          if (text === 1) {
            way = '快递配送';
          }
          if (text === 2) {
            way = '同城配送';
          } else {
            way = '买家自提';
          }
          return (
            way
          );
        }, 
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
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
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size="middle">
            <a>商品详情</a>
          </Space>
        ),
      }
    ];
    
    return <Table
      columns={columns}
      dataSource={selectedOrder} 
      pagination={false}
      bordered
      expandable={{
        expandedRowRender: expandedTestRowRender,
        defaultExpandAllRows: false,
        onExpand: onExpandChild,
      }}
    />;
  };

  useEffect(() => {
    props.dispatch({
      type: 'BillsListBack/fetchBillsList',
      payload: { page: 1, limit: 99 },
    });
  }, []);
  useEffect(() => {
    const uploadItem = {
      method: 'querymkt',
      key: ApiCode.key,
      t: time,
      param: paraData,
      sign: md5Code,
    };
    request('/api.request/order/borderbestapi.do', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: qs.stringify(uploadItem),
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
  const onFinish = (values) => {
  };
  const clickShow = () => {
    const show = showDrawer;
    setshowDrawer(!show);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const comfirmDelievery = () => {
    setChangeVisible(false);
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
          divide
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
          divide
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
          divide
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
      <Modal
        mask={false}
        width={800}
        title="凤鸣谷"
        visible={changeVisible}
        onOk={comfirmDelievery}
        onCancel={comfirmDelievery}
        okText="提交"
        cancelText="取消"
      >
        <Form
          {...layout}
          name="basic"
          form={formExpress}
          ref={formRef}
          onFinish={onFinish}
        >
          <Form.Item
            label="快递公司"
            name="kuaidicom"
            rules={[
              {
                required: true,
                message: '请选择快递公司',
              }
            ]}
          >
            <Select
              placeholder="请选择运力允许的快递公司"
              allowClear
              size="middle"
              style={{ width: '12vw' }}
            >
              {expressCompany.map((arr) => {
                return  <Option value={arr.eid} key={arr.eid}>{arr.name}</Option>;
              })}

            </Select>
          </Form.Item>
          <Form.Item
            label="收件人"
            name="recManName"
            rules={[
              {
                required: true,
                message: '请输入快递收件人姓名',
              }
            ]}
          >
            <Input
              style={{ width: '10vw' }}
            />
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="recManMobile"
            rules={[
              {
                required: true,
                message: '请输入收件人手机号',
              }
            ]}
          >
            <Input
              style={{ width: '10vw' }}
            />
          </Form.Item>
          <Form.Item
            label="货品重量"
            name="weight"
            rules={[
              {
                required: true,
                message: '请输入货品重量',
              }
            ]}
          >
            <InputNumber
              style={{ width: '10vw' }}
            />
          </Form.Item>
       
          <Form.Item
            label="货品名称"
            name="cargo"
            rules={[
              {
                required: true,
                message: '请输入货品名称',
              }
            ]}
          >
            <Input
              style={{ width: '15vw' }}
            />
          </Form.Item>
          <Form.Item
            label="发货地址"
            name="sendManPrintAddr"
            initialValue="广东省江门市凤鸣谷"
            rules={[
              {
                required: true,
                message: '请输入发货地址',
              }
            ]}
          >
            <TextArea
              style={{ width: '20vw' }}
            />
          </Form.Item>
          <Form.Item
            label="收货地址"
            name="recManPrintAddr"
            rules={[
              {
                required: true,
                message: '请输入收件人地址',
              }
            ]}
          >
            <TextArea
              style={{ width: '20vw' }}
            />
          </Form.Item>
          <Form.Item
            label="货品备注"
            name="remark"
          >
            <TextArea
              style={{ width: '20vw' }}
            />
          </Form.Item>
        </Form>
      </Modal>
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
