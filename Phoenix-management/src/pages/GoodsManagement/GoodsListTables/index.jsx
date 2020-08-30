import React from 'react';
import {
  Table, Tag, Space, TreeSelect, 
  Modal, Icon, Input, Divider, Select
} from 'antd';
import request from '@/utils/request';
import moment from 'moment';
import { connect } from 'umi';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import GoodsAddEditor from '../GoodsAddEditor';
import styles from './index.less';
import '../../../style/GoodsTagsIndex.less';

const { Column, ColumnGroup } = Table;
const { Option, OptGroup } = Select;
const { SHOW_PARENT } = TreeSelect;
const treeData = [];
const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
@connect(({
  goodsArea, goodsSale, CreateGoods, goodsClass, 
}) => ({
  goodsSale: get(goodsSale, 'tags', []),
  goodsArea: get(goodsArea, 'info', []),
  AreaTotal: get(goodsArea, 'total', ''),
  Goods: get(CreateGoods, 'info', []),
  goodsClassFather: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id === 0; }),
  goodsClassChild: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id !== 0; }),
  GoodsTotal: get(CreateGoods, 'total', ''),
  GoodsAreaTags: goodsArea.GoodsAreaTags,
})) 

class GoodsList extends React.Component {
  constructor() {
    super();
    this.state = {
      tagsAreaCheck: 0,
      tagsSaleCheck: 0,
      tagsClassCheck: 0, 
      visable: false,
      FilterText: '',
      pageSize: 10,
      current: 1,
    };
  }

  componentDidMount() {
    const { dispatch, pageSize } = this.props;
    dispatch({
      type: 'CreateGoods/getGoodsList',
      payload: {
        query: {
          page: 1,
          limit: 10,
        },
      }, 
    });
    dispatch({
      type: 'goodsArea/fetchAreaTags',
      payload: {
        query: {
          page: 1,
          limit: 10,
        },
      }, 
    });
    dispatch({
      type: 'goodsClass/fetchClassTags',
      payload: { page: 1, limit: 99 }, 
    });
    dispatch({
      type: 'goodsSale/fetchSaleTags',
      payload: { page: 1, limit: 99 }, 
    });
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
      onOk: () => this.handleDelete(id),
    });
  }

  changePage=(current) => {
    this.setState({
      current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'CreateGoods/getGoodsList',
      payload: {
        query: {
          page: current,
          limit: 10,
        },
      }, 
    });
  }

  selectAreaItemAll = () => {
    const { dispatch } = this.props;
    const { current, tagsSaleCheck } = this.state;
    this.setState({
      tagsAreaCheck: 0,
    }, () => {
      dispatch({
        type: 'CreateGoods/getGoodsList',
        payload: {
          query: {
            page: current,
            limit: 10,
            place_tag: 0,
            sale_tag: tagsSaleCheck,
          },
        }, 
      });
    });
  }

  selectAreaItem = (checked, item) => {
    const { dispatch } = this.props;
    const { current, tagsSaleCheck } = this.state;
    this.setState({
      tagsAreaCheck: item.id,
    }, () => {
      dispatch({
        type: 'CreateGoods/getGoodsList',
        payload: {
          query: {
            page: current,
            limit: 10,
            place_tag: item.id,
            sale_tag: tagsSaleCheck,
          },
        }, 
      }); 
    });
  }

  selectSaleItemAll = () => {
    const { dispatch } = this.props;
    const { current, tagsAreaCheck } = this.state;
    this.setState({
      tagsSaleCheck: 0,
    }, () => {
      dispatch({
        type: 'CreateGoods/getGoodsList',
        payload: {
          query: {
            page: current,
            limit: 10,
            place_tag: tagsAreaCheck,
            sale_tag: 0,
          },
        }, 
      });
    });
  }

  selectSaleItem = (checked, item) => {
    const { dispatch } = this.props;
    const { current, tagsAreaCheck } = this.state;
    this.setState({
      tagsSaleCheck: item.id,
    }, () => {
      dispatch({
        type: 'CreateGoods/getGoodsList',
        payload: {
          query: {
            page: current,
            limit: 10,
            place_tag: tagsAreaCheck,
            sale_tag: item.id,
          },
        }, 
      }); 
    });
  }

  selectClassItem = (item) => {
    const { dispatch } = this.props;
    const { current, tagsAreaCheck, tagsSaleCheck} = this.state;
    this.setState({
      tagsClassCheck: item.id,
    }, () => {
      dispatch({
        type: 'CreateGoods/getGoodsList',
        payload: {
          query: {
            page: current,
            limit: 10,
            place_tag: tagsAreaCheck,
            sale_tag: tagsSaleCheck,
            kind_tag: item,
          },
        }, 
      }); 
    });
  }

  MainTextOnChange = (e) => {
    const { current, FilterText } = this.state;
    const { dispatch } = this.props;
    this.setState({ FilterText: e.target.value }, () => { this.handleGetListData(); });
  };

  handleDelete = (data) => {
    const {  current } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'CreateGoods/delGoods',
      payload: {
        tid: data.id,
        query: {
          page: current,
          limit: 10,
        },
      }, 
    });
  };

  handleGetListData = () => {
    const { current, FilterText } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'CreateGoods/getGoodsList',
      payload: { query: { page: current, limit: 10, keyword: FilterText } }, 
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const {
      pageSize, current, tagsSaleCheck, tagsAreaCheck, 
    } = this.state;
    const {
      goodsClassChild, 
      Goods, GoodsTotal, 
      goodsClassFather, goodsArea,
      goodsSale,
    } = this.props;
    for (let i = 0; i < goodsClassFather.length; i++) {
      for (let j = 0; j < goodsClassChild.length; j++) {
        if (goodsClassFather[i].id === goodsClassChild[j].parent_id) {
          goodsClassChild[j] = { ...goodsClassChild[j], parent: goodsClassFather[i].title };
        }
      }
    }
    const paginationProps = {
      showQuickJumper: false,
      showTotal: () => `共${GoodsTotal}条`,
      pageSize,
      current,
      total: GoodsTotal,
      onChange: (current) => this.changePage(current),
    };
    return (
      <div>
        <Input onChange={this.MainTextOnChange} placeholder="请输入该商品关键字" />
        <Select
          style={{ width: '85vw', marginTop: 10 }}
          onChange={this.selectClassItem}
          placeholder="请选择商品类别"
        >
          {
                goodsClassFather.map((arr) => {
                  return <OptGroup label={arr.title}>
                    {(goodsClassChild.filter((tags) => {
                      return tags.parent_id === arr.id;
                    })).map((tag) => { return <Option value={tag.id}>{tag.title}</Option>; })}
                  </OptGroup>;
                })
              }
        </Select>
        <Divider orientation="left" plain>属地标签</Divider>
        <div className="Goods-Class-Tags-selector">
          
          {
           
            <Tag.CheckableTag 
              onClick={() => this.selectAreaItemAll()}
              checked={tagsAreaCheck === 0}
            >
              全部
            </Tag.CheckableTag>
}
          {
           goodsArea.map((arr) => {
             return <Tag.CheckableTag
               checked={tagsAreaCheck === arr.id}
               onChange={(e) => this.selectAreaItem(e, arr)}
             >
               {
           arr.place
}
             </Tag.CheckableTag>; 
           })
        
}

        </div>
        <Divider orientation="left" plain>属性标签</Divider>
        <div className="Goods-Class-Tags-selector">
          
          {
           
            <Tag.CheckableTag 
              onClick={() => this.selectSaleItemAll()}
              checked={tagsSaleCheck === 0}
            >
              全部
            </Tag.CheckableTag>
}
          {
           goodsSale.map((arr) => {
             return <Tag.CheckableTag
               checked={tagsSaleCheck === arr.id}
               onChange={(e) => this.selectSaleItem(e, arr)}
             >
               {
           arr.title
}
             </Tag.CheckableTag>; 
           })
        
}

        </div>

        <Table dataSource={Goods} pagination={paginationProps}>
          <Column
            title="商品序号"
            dataIndex="id"
            key="id"
            defaultSortOrder="descend"
            sorter={(a, b) => a.id - b.id}
          />
          <Column
            title="商品名称" 
            dataIndex="name"
            key="firstName"
            render={(text, record) => (
              <div style={{ textAlign: 'left' }}>
                <img
                  src={record ? BASE_QINIU_URL + record.cover : null}
                  alt="img" 
                  style={{ width: 30, height: 30, marginRight: 20  }}
                />
                <span>{text}</span>
              </div>
            )}
          />
          <Column
            title="总库存"
            dataIndex="total"
            key="total"
            defaultSortOrder="descend"
            sorter={(a, b) => a.total - b.total}
          />
          <Column
            title="付款人数"
            dataIndex="people"
            key="people"
            defaultSortOrder="descend"
            sorter={(a, b) => a.people - b.people}
          />
          <Column
            title="商品月销"
            dataIndex="month_sale"
            key="amount"
            defaultSortOrder="descend"
            sorter={(a, b) => a.amount - b.amount}
          />
          
          <Column
            title="更新时间"
            dataIndex="update_time"
            key="update_time"
            render={(updateTime) => (
              <>
                <span>
                  {moment(updateTime * 1000)
                    .format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </>
            )}
          />
          <Column
            title="操作"
            key="id"
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
                <a onClick={() => this.confirm(text)}>删除商品</a>
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
