import React from 'react';
import {
  Table, Tag, Space, TreeSelect, Modal, Icon 
} from 'antd';
import GoodsAddEditor from '../GoodsAddEditor';
import styles from './index.less';

const { Column, ColumnGroup } = Table;
const { SHOW_PARENT } = TreeSelect;
const treeData = [
  {
    title: '蔬菜',
    value: '蔬菜',
    key: '蔬菜',
    children: [
      {
        title: '西兰花',
        value: '西兰花',
        key: '西兰花',
      }
    ],
  },
  {
    title: '水果',
    value: '水果',
    key: '水果',
    children: [
      {
        title: '苹果',
        value: '苹果',
        key: '苹果',
      },
      {
        title: '李子',
        value: '李子',
        key: '李子',
      },
      {
        title: '大桂圆',
        value: '大桂圆',
        key: '大桂圆',
      }
    ],
  },
  {
    title: '香草制品',
    value: '香草制品',
    key: '香草制品',
    children: [
      {
        title: '檀木香氛',
        value: '檀木香氛',
        key: '檀木香氛',
      }
    ],
  },
  {
    title: '香草苗苗',
    value: '0-3',
    key: '0-3',
    children: [
      {
        title: '薰衣草苗',
        value: '0-3-0',
        key: '0-3-0',
      }
    ],
  }
];

const data = [
  {
    key: '1',
    name: '檀木香氛',
    price: 99.98,
    amount: 99,
    goodsArea: '香草小镇',
    updateTime: '2020-7-19',
    tags: ['轮播展示'],
    classification: { index: 1, name: '香草制品' },
  },
  {
    key: '2',
    name: '迷迭香马迷纯喷雾',
    price: 32.3,
    amount: 66,
    goodsArea: '香草小镇',
    updateTime: '2020-7-19',
    tags: ['轮播展示'],
    classification: { index: 1, name: '香草制品' },
  },
  {
    key: '3',
    name: '本地现摘大桂圆',
    price: 32.3,
    amount: 99,
    goodsArea: '一号营地',
    updateTime: '2020-7-19',
    tags: ['新品上市'],
    classification: { index: 2, name: '水果' },
  },
  {
    key: '4',
    name: '户外拓展一日体验',
    price: 99,
    amount: 99,
    goodsArea: '躬耕乐园',
    updateTime: '2020-7-19',
    tags: ['新品上市'],
    classification: { index: 3, name: '生态体验' },
  },
  {
    key: '5',
    name: '西兰花',
    price: 10,
    amount: 99,
    goodsArea: '躬耕乐园',
    updateTime: '2020-7-19',
    tags: ['轮播展示'],
    classification: { index: 4, name: '蔬菜' },
  }
];

class GoodsList extends React.Component {
  constructor() {
    super();
    this.state = {
      visable: false,

    };
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  confirm(id) {
    Modal.warning({
      mask: false,
      title: '凤鸣谷',
      content: '确认要删除该商品吗',
      okText: '确认',
      cancelText: '取消',
      //onOk: () => this.delItem(id),
    });
  }

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({ value });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const tProps = {
      treeData,
      //value: this.state.value,
      onChange: this.onChange,
      //treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: '搜素商品',
      style: {
        width: '98%',
      },
    };
    return (
      <div>
        <TreeSelect
          {...tProps} 
          showSearch
          optionFilterProp="children"
          allowClear
          multiple
          treeDefaultExpandAll
        />
        <Table dataSource={data}>
          <Column title="商品名称" dataIndex="name" key="firstName" />
          <Column
            title="商品售价"
            dataIndex="price"
            key="price"
            defaultSortOrder="descend"
            sorter={(a, b) => a.price - b.price}
          />
          <Column
            title="剩余库存"
            dataIndex="amount"
            key="amount"
            defaultSortOrder="descend"
            sorter={(a, b) => a.amount - b.amount}
          />
          <Column title="所在分区" dataIndex="goodsArea" key="address" />
          <Column
            title="展示属性"
            dataIndex="tags"
            key="tags"
            render={(tags) => (
              <>
                {tags.map((tag) => (
                  <Tag color="blue" key={tag}>
                    {tag}
                  </Tag>
                ))}
              </>
            )}
          />
          <Column
            title="产品分类"
            dataIndex="classification"
            key="classification"
            render={(classification) => (
              <>
                <Tag>{classification.name}</Tag>
              </>
            )}
          />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <span>
                  <Icon
                    type="edit"
                    style={{ marginLeft: 8 }} 
                    onClick={() => this.showModal()}
                  />
                  <a onClick={() => this.showModal()}>修改</a> 
                  <div>
                    <Modal 
                      mask={false}
                      width="50vw"
                      visible={this.state.visible}
                      title="修改"
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      footer={null}
                    >
                      <GoodsAddEditor />
                    </Modal>
                  </div>
                </span>
                <a onClick={() => this.confirm()}>删除商品</a>
              </Space>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default () => (
  <div className={styles.container}>
    <div id="components-table-demo-reset-filter">
      <GoodsList />
    </div>
  </div>
);
