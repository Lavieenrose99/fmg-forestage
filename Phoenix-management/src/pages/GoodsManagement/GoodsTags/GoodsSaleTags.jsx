/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Table, Input, Button, Popconfirm, Form, Modal, Space, message, Divider 
} from 'antd';
import { connect } from 'umi';
import { get, noop } from 'lodash';
import PropTypes from 'prop-types';
import { PlusCircleTwoTone } from '@ant-design/icons';

  @connect(({ goodsArea, goodsSale }) => ({
    goodsSale: get(goodsSale, 'tags', []),
    SaleTotal: get(goodsSale, 'total', ''),
    GoodsAreaTags: goodsArea.GoodsAreaTags,
  })) 
class GoodSaleTags extends React.Component {
    constructor(props) {
      super(props);
      this.columns = [
        {
          title: '销售属性',
          dataIndex: 'title',
        },
        {
          title: '操作',
          dataIndex: 'id',
          render: (text, record) => (
            <>
              <Space size="large">
                <a>查看商品</a>
                <a onClick={() => this.handleChange(text, record.title)}>修改</a>
                <a onClick={() => this.comfirmDelArea(text)}>删除</a>
              </Space>
            </>
          ),
        }
      ];
      this.state = {
        Goodsplace: '',
        setGoodspalce: '',
        setPlaceId: '',
        visible: false,
        changeVisible: false,
        pageSize: 5,
        current: 1,
        page: 1,
        limit: 5,
      };
      this.InputGoodsPlace = this.InputGoodsPlace.bind(this);
    }
  
    componentDidMount() {
      //初始化拉取表格数据
      this.handleGetListData();
    }

    changePage=(current) => {
      this.setState({
        current,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'goodsSale/fetchSaleTags',
        payload: { page: current, limit: 5 }, 
      });
    }

    InputGoodsPlace=(e) => {
      this.setState({
        Goodsplace: e.target.value,
      });
    }
  
    ChangeGoodsPlace=(e) => {
      this.setState({
        setGoodspalce: e.target.value,
      });
    }
  
   comfirmDelArea =(id) => {
     Modal.confirm({
       mask: false,
       title: '凤鸣谷',
       content: '确认删除该销售属性吗',
       okText: '确认',
       cancelText: '取消',
       onOk: () => this.handleDelete(id),
     });
   }
  
   comfirmsubmitArea =() => {
     Modal.confirm({
       mask: false,
       title: '凤鸣谷',
       content: '确认提交销售属性吗',
       okText: '确认',
       cancelText: '取消',
       onOk: () => this.subArea(),
     });
   }
  
   comfirmsubmitChangeArea =() => {
     Modal.confirm({
       mask: false,
       title: '凤鸣谷',
       content: '确认提交该销售属性吗',
       okText: '确认',
       cancelText: '取消',
       onOk: () => this.changeArea(),
     });
   }
  
   changeArea=() => {
     const { dispatch } = this.props;
     const {
       page, limit, setGoodspalce, setPlaceId, 
     } = this.state;
     if (setGoodspalce !== '') {
       dispatch({
         type: 'goodsSale/adjSaleTags',
         payload: {
           place: setGoodspalce,
           tid: setPlaceId,
           query: {
             page,
             limit,
           },
         },
       }); 
       this.setState({
         changeVisible: false,
         setGoodspalce: '',
         setPlaceId: '',
       }); 
     } else {
       message.error('属性不能为空');
     }
   }
  
   subArea=() => {
     const { dispatch } = this.props;
     const { page, limit } = this.state;
     const { Goodsplace } = this.state;
     if (Goodsplace !== '') {
       dispatch({
         type: 'goodsSale/setSaleTags',
         payload: {
           place: Goodsplace,
           query: {
             page,
             limit,
           },
         },
       });
       this.setState({
         visible: false,
       }); 
     } else {
       message.error('属性不能为空');
     }
   }
  
   handleCancel=() => {
     const {  visible } = this.state;
     this.setState({
       visible: !visible,
     });
   }
  
   handleChangeCancel=() => {
     const {  changeVisible } = this.state;
     this.setState({
       changeVisible: !changeVisible,
     });
   }
  
   handleAdd=() => {
     const {  visible } = this.state;
     this.setState({
       visible: !visible,
     });
   }
  
   handleChange=(id, place) => {
     const {  visible } = this.state;
     this.setState({
       changeVisible: !visible,
       setGoodspalce: place,
       setPlaceId: id,
     });
   }

     handleDelete = (aid) => {
       const { page, limit } = this.state;
       const { dispatch } = this.props;
       dispatch({
         type: 'goodsSale/delSaleTags',
         payload: {
           tid: aid,
           query: {
             page,
             limit,
           },
         }, 
       });
     };
  
   handleGetListData = () => {
     const { dispatch } = this.props;
     dispatch({
       type: 'goodsSale/fetchSaleTags',
       payload: { page: 1, limit: 5 }, 
     });
   };
  
   render() {
     const {
       goodsSale, SaleTotal, 
     } = this.props;
     const EnigoodsSale = goodsSale.filter((tags) => { return tags.title !== ''; }); 
     const {
       visible, changeVisible, setGoodspalce, pageSize, current, 
     } = this.state;
     const paginationProps = {
       showQuickJumper: false,
       showTotal: () => `共${SaleTotal}条`,
       pageSize,
       current,
       total: SaleTotal,
       onChange: (current) => this.changePage(current),
     };
     const columns = this.columns.map((col) => {
       return col;
     });
     return (
       <div className="fmg-goods-area-list-tags" style={{ marginTop: 20 }}>
         <Button
           onClick={this.handleAdd}
           type="primary"
           style={{
             marginBottom: 16,
           }}
           icon={<PlusCircleTwoTone />}
         >
           添加销售属性
         </Button>
         <Modal
           mask={false}
           title="凤鸣谷"
           visible={visible}
           onOk={this.comfirmsubmitArea}
           onCancel={this.handleCancel}
           okText="提交"
           cancelText="取消"
         >
           <Divider orientation="left" plain>销售属性</Divider>
           <Input placeholder="请输入销售属性" onChange={this.InputGoodsPlace} />
         </Modal>
         <Modal
           mask={false}
           title="凤鸣谷"
           visible={changeVisible}
           onOk={this.comfirmsubmitChangeArea}
           onCancel={this.handleChangeCancel}
           okText="提交"
           cancelText="取消"
         >
           <Divider orientation="left" plain>销售属性</Divider>
           <Input value={setGoodspalce} onChange={this.ChangeGoodsPlace} />
         </Modal>
         <Table
           rowClassName={() => 'editable-row'}
           bordered
           dataSource={EnigoodsSale}
           columns={columns}
           pagination={paginationProps}
         />
       </div>
     );
   }
  }
GoodSaleTags.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodsSale: PropTypes.arrayOf({}),
  SaleTotal: PropTypes.number.isRequired,
};
GoodSaleTags.defaultProps = {
  goodsSale: [],
};
  
export default GoodSaleTags;
