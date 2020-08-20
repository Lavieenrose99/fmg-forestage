/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Table, Input, Button, Popconfirm, Form, Modal, Space, message, Divider 
} from 'antd';
import { connect } from 'umi';
import { get, noop } from 'lodash';
import PropTypes from 'prop-types';
import { PlusCircleTwoTone } from '@ant-design/icons';

@connect(({ goodsClass }) => ({
  goodsClass,
  goodsClassFather: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id === 0; }),
  goodsClassChild: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id !== 0; }),
  ClassTotal: get(goodsClass, 'total', ''),
  //GoodsAreaTags: goodsArea.GoodsAreaTags,
}))
class GoodClassTags extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '种类标签',
        dataIndex: 'title',
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <>
            <Space size="large">
              <a>查看种类</a>
              <a onClick={() => this.handleChange(text, record.title)}>修改</a>
              <a onClick={() => this.comfirmDelClassTags(text)}>删除</a>
            </Space>
          </>
        ),
      }
    ];
    this.state = {
      setGoodsClassTags: '',
      setClassTagsId: '',
      visible: false,
      changeVisible: false,
      page: 1,
      limit: 99,
    };
    this.InputGoodsClassTags = this.InputGoodsClassTags.bind(this);
  }
  
  componentDidMount() {
    //初始化拉取表格数据
    this.handleGetListData();
  }

    InputGoodsClassTags=(e) => {
      this.setState({
        Goodsplace: e.target.value,
      });
    }
  
    ChangeGoodsClassTags=(e) => {
      this.setState({
        setGoodsClassTags: e.target.value,
      });
    }
  
   comfirmDelClassTags =(id) => {
     Modal.confirm({
       mask: false,
       title: '凤鸣谷',
       content: '确认删除该种类标签吗',
       okText: '确认',
       cancelText: '取消',
       onOk: () => this.handleDelete(id),
     });
   }
  
   comfirmsubmitClassTags =() => {
     Modal.confirm({
       mask: false,
       title: '凤鸣谷',
       content: '确认提交种类标签吗',
       okText: '确认',
       cancelText: '取消',
       onOk: () => this.subClassTags(),
     });
   }
  
   comfirmsubmitChangeClassTags =() => {
     Modal.confirm({
       mask: false,
       title: '凤鸣谷',
       content: '确认提交该种类标签吗',
       okText: '确认',
       cancelText: '取消',
       onOk: () => this.changeClassTags(),
     });
   }
  
   changeClassTags=() => {
     const { dispatch } = this.props;
     const {
       page, limit, setGoodsClassTags, setClassTagsId, 
     } = this.state;
     if (setGoodsClassTags !== '') {
       dispatch({
         type: 'goodsClass/adjClassTags',
         payload: {
           title: setGoodsClassTags,
           tid: setClassTagsId,
           query: {
             page,
             limit,
           },
         },
       }); 
       this.setState({
         changeVisible: false,
         setGoodsClassTags: '',
         setClassTagsId: '',
       }); 
     } else {
       message.error('属性不能为空');
     }
   }
  
   subClassTags=() => {
     const { dispatch } = this.props;
     const { page, limit } = this.state;
     const { Goodsplace } = this.state;
     if (Goodsplace !== '') {
       dispatch({
         type: 'goodsClass/setClassTags',
         payload: {
           title: Goodsplace,
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
       setGoodsClassTags: place,
       setClassTagsId: id,
     });
   }

     handleDelete = (aid) => {
       const { page, limit } = this.state;
       const { dispatch } = this.props;
       dispatch({
         type: 'goodsClass/delClassTags',
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
       type: 'goodsClass/fetchClassTags',
       payload: { page: 1, limit: 99 }, 
     });
   };
  
   render() {
     const {
       goodsClassFather,
     } = this.props;
     const {
       visible, changeVisible, setGoodsClassTags,
     } = this.state;
     const columns = this.columns.map((col) => {
       return col;
     });
     return (
       <div className="fmg-goods-area-list-tags">
         <Button
           onClick={this.handleAdd}
           type="primary"
           style={{
             marginBottom: 16,
           }}
           icon={<PlusCircleTwoTone />}
         >
           添加类别标签
         </Button>
         <Modal
           mask={false}
           title="凤鸣谷"
           visible={visible}
           onOk={this.comfirmsubmitClassTags}
           onCancel={this.handleCancel}
           okText="提交"
           cancelText="取消"
         >
           <Divider orientation="left" plain>标签名称</Divider>
           <Input placeholder="请输入标签名称" onChange={this.InputGoodsClassTags} />
         </Modal>
         <Modal
           mask={false}
           title="凤鸣谷"
           visible={changeVisible}
           onOk={this.comfirmsubmitChangeClassTags}
           onCancel={this.handleChangeCancel}
           okText="提交"
           cancelText="取消"
         >
           <Divider orientation="left" plain>标签名称</Divider>
           <Input value={setGoodsClassTags} onChange={this.ChangeGoodsClassTags} />
         </Modal>
         <Table
           rowClassName={() => 'editable-row'}
           bordered
           dataSource={goodsClassFather}
           columns={columns}
           pagination={{ pageSize: 5 }}
         />
       </div>
     );
   }
}
GoodClassTags.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodsClassFather: PropTypes.arrayOf({}).isRequired,
};
GoodClassTags.defaultProps = {
  //goodsSale: [],
};
  
export default GoodClassTags;
