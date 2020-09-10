import React from 'react';
import {
  Table, Tag, Space, TreeSelect, 
  Modal, Input, Divider, Select, Button
} from 'antd';
import request from '@/utils/request';
import moment from 'moment';
import { connect, Link } from 'umi';
import { get } from 'lodash';
import { PlusCircleTwoTone, RedoOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PropTypes from 'prop-types';
import GoodsAdj from './GoodsAdj';
import TempalteAdj from './TemplateAdj';
import  './index.less';

const { Column, ColumnGroup } = Table;
const { Option, OptGroup } = Select;
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
      specification: {},
      template: [],
      template_id: 0, 
      visable: false,
      gid: 0,
      visableTem: false,
      FilterText: '',
      pageSize: 5,
      current: 1,
      record: {},
    };
  }

  componentDidMount() {
    const { dispatch, pageSize } = this.props;
    dispatch({
      type: 'CreateGoods/getGoodsList',
      payload: {
        query: {
          page: 1,
          limit: 5,
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

  reloadSelector = () => {
    const { dispatch } = this.props;
    const { current } = this.state;
    this.setState({
      tagsAreaCheck: 0,
      tagsSaleCheck: 0,
      FilterText: '',
    }, () => {
      dispatch({
        type: 'CreateGoods/getGoodsList',
        payload: {
          query: {
            page: current,
            limit: 10,
            place_tag: 0,
            sale_tag: 0,
          },
        }, 
      }); 
    });
  }

  showModal = (text) => {
    this.setState({
      visible: true,
      record: text,
    });
  };

  showModalTem = (data, tid, templateData, id) => {
    this.setState({
      specification: data,
      gid: tid,
      template: templateData,
      template_id: id,
      visableTem: true,
    });
  };

  confirm(id) {
    Modal.confirm({
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
          limit: 5,
        },
      }, 
    });
  }

  selectAreaItem = (item) => {
    const { dispatch } = this.props;
    const { current, tagsSaleCheck } = this.state;
    this.setState({
      tagsAreaCheck: item,
    }, () => {
      dispatch({
        type: 'CreateGoods/getGoodsList',
        payload: {
          query: {
            page: current,
            limit: 10,
            place_tag: item,
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
    const { current, tagsAreaCheck, tagsSaleCheck } = this.state;
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

  closeVisable = () => {
    this.setState({
      visible: false,
      visableTem: false,
    });
  }

  handleGetListData = () => {
    const { current, FilterText } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'CreateGoods/getGoodsList',
      payload: { query: { page: current, limit: 10, keyword: FilterText } }, 
    });
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

  handleCancel = () => {
    this.setState({ visible: false, visableTem: false });
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
    const GoodsInfos = Goods.map((arr, index) => {
      return { key: index, ...arr };
    });
    for (let i = 0; i < goodsClassFather.length; i++) {
      for (let j = 0; j < goodsClassChild.length; j++) {
        if (goodsClassFather[i].id === goodsClassChild[j].parent_id) {
          goodsClassChild[j] = { ...goodsClassChild[j], parent: goodsClassFather[i].title };
        }
      }
    }
    const goodsAreaList = [{ place: '全部', id: 0 }, ...goodsArea];
    const paginationProps = {
      showQuickJumper: false,
      showTotal: () => `共${GoodsTotal}条`,
      pageSize,
      current,
      total: GoodsTotal,
      onChange: (current) => this.changePage(current),
    };
    return (
      <PageHeaderWrapper>
        <div className="goods-list-container">
          <Link to="/goods/add-goods">
            <Button
              type="primary"
              style={{
                margin: 20,
              }}
              icon={<PlusCircleTwoTone />}
            >
              添加商品
            </Button>
          </Link>
          <div className="goods-list-selector">
            <Space size="large">
              <span className="good-selector-items">
                <span>
                  商品名称: 
                </span>
                <Input
                  className="goods-selector-name" 
                  onChange={this.MainTextOnChange}
                  placeholder="请输入该商品名称"
                />
              </span>
              <span className="good-selector-items">
                <span>
                  种类名称: 
                </span>
                <Select
                  className="goods-selector-class"
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
              </span>
              <span className="good-selector-items">
                <span>
                  属地标签: 
                </span>
                <Select
                  className="goods-selector-area"
                  onChange={this.selectAreaItem}
                  placeholder="请选择属地标签"
                  defaultValue={0}
                >
                  {
                goodsAreaList.map((arr) => {
                  return <Option value={arr.id}>{arr.place}</Option>;
                })
              }
                </Select>
              </span>
              <Button
                type="primary"
                onClick={this.reloadSelector}
                icon={<RedoOutlined />}
              >
                全部
              </Button>
            </Space>
          </div>
          {/* <Divider orientation="left" plain>属性标签</Divider> */}
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

          <Table dataSource={GoodsInfos} pagination={paginationProps}>
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
              render={(text, record, index) => (
                <Space size="middle" key={index}>
                  <a onClick={() => this.showModal(text)} key={text}>基本信息</a> 
                  <div key={index}>
                    <Modal 
                      key={index}
                      mask={false}
                      width="70vw"
                      height="80vh"
                      visible={this.state.visible}
                      title="基本信息"
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      footer={null}
                      destroyOnClose
                    >
                      <GoodsAdj
                        key={index}
                        info={this.state.record} 
                        closeModel={() => this.closeVisable()}
                      />
                    </Modal>
                  </div>
                  <a onClick={() => this.showModalTem(
                    text.specification,
                    text.id,
                    text.template,
                    text.template_id
                  )}
                  >
                    规格信息
                  </a> 
                  <div>
                    <Modal 
                      mask={false}
                      width="70vw"
                      height="80vh"
                      visible={this.state.visableTem}
                      title="修改"
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      footer={null}
                      destroyOnClose
                    >
                      <TempalteAdj
                        template={this.state.template} 
                        info={this.state.specification} 
                        id={this.state.template_id}
                        gid={this.state.gid}
                        closeModel={() => this.closeVisable()}
                      />
                    </Modal>
                  </div>
                  <a onClick={() => this.confirm(text)}>删除商品</a>
                </Space>
              )}
            />
          </Table>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default () => (
  <div>
    <div id="components-table-demo-reset-filter">
      <GoodsList />
    </div>
  </div>
);
