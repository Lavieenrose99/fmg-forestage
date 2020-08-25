/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Table, Input, Button, Popconfirm, Form, Modal, Space, message,
  Divider, 
  Upload
} from 'antd';
import request from '@/utils/request';
import { connect } from 'umi';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { PlusCircleTwoTone, UploadOutlined } from '@ant-design/icons';

const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
const QINIU_SERVER = 'http://upload-z2.qiniup.com';
const uploadButton = (
  <div>
    <div className="ant-upload-text">
      <UploadOutlined />
      上传
    </div>
  </div>
);
@connect(({ goodsArea, goodsSale }) => ({
  goodsSale,
  goodsArea: get(goodsArea, 'info', []),
  AreaTotal: get(goodsArea, 'total', ''),
  GoodsAreaTags: goodsArea.GoodsAreaTags,
  //addAreaTags: goodsArea.setAreaTag,
})) 
class GoodAreaTags extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '属地名称',
        dataIndex: 'place',
      },
      {
        title: '图标',
        dataIndex: 'picture',
        render: (pictures, source) => (
          <div style={{ textAlign: 'center' }}>
            <img
              src={BASE_QINIU_URL + pictures}
              alt={pictures} 
              style={{ width: 30, height: 30  }}
            />
          </div>
        )
        ,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <>
            <Space size="large">
              <a>查看商品</a>
              <a onClick={() => this.handleChange(text, record.place, record.picture)}>修改</a>
              <a onClick={() => this.comfirmDelArea(text)}>删除</a>
            </Space>
          </>
        ),
      }
    ];
    this.state = {
      Goodsplace: '',
      pageSize: 5,
      current: 1,
      setGoodspalce: '',
      setPlaceId: '',
      qiniuToken: '',
      fileList: [],
      visible: false,
      changeVisible: false,
      page: 1,
      limit: 5,
    };
    this.InputGoodsPlace = this.InputGoodsPlace.bind(this);
  }

  componentDidMount() {
    //初始化拉取表格数据
    this.handleGetListData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { qiniuToken } = this.state;
    if (nextState.qiniuToken !== qiniuToken);
    return true;
  }
  
  InputGoodsPlace=(e) => {
    this.setState({
      Goodsplace: e.target.value,
    });
  }

   getQiNiuToken = () => {
     request('/api.farm/goods/resources/qiniu/upload_token', {
       method: 'GET',
     }).then(
       (response) => {
         this.setState({
           qiniuToken: response.token,
         });
       }
     );
   };

  changePage=(current) => {
    this.setState({
      current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsArea/fetchAreaTags',
      payload: { page: current, limit: 5 }, 
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
     content: '确认删除该属地信息吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.handleDelete(id),
   });
 }

 comfirmsubmitArea =() => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认提交属地信息吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.subArea(),
   });
 }

 comfirmsubmitChangeArea =() => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认提交属地信息吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.changeArea(),
   });
 }

 changeArea=() => {
   const { dispatch } = this.props;
   const {
     page, limit, setGoodspalce, setPlaceId, fileList,
   } = this.state;
   if (setGoodspalce !== '') {
     dispatch({
       type: 'goodsArea/adjAreaTags',
       payload: {
         place: setGoodspalce,
         picture: fileList[0].response.key,
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
   const {
     page, limit, Goodsplace, fileList, 
   } = this.state;
   if (Goodsplace !== '') {
     dispatch({
       type: 'goodsArea/setAreaTags',
       payload: {
         place: Goodsplace,
         picture: fileList[0].response.key,
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

 handleChangefile = ({ file  }) => {
   const {
     uid, name, type, thumbUrl, status, response = {},
   } = file;
   const fileItem = {
     uid,
     name,
     type,
     thumbUrl,
     status,
     response,
     url: BASE_QINIU_URL + (response.key || ''),
   };
   
   this.setState({
     fileList: [fileItem],
   });
 };

 handleCancel=() => {
   const { visible } = this.state;
   this.setState({
     visible: !visible,
   });
 }

 handleChangeCancel=() => {
   const { changeVisible } = this.state;
   this.setState({
     changeVisible: !changeVisible,
   });
 }

 handleAdd=() => {
   const { visible } = this.state;
   this.setState({
     visible: !visible,
   });
 }

 handleChange=(id, place, picture) => {
   const { visible } = this.state;
   this.setState({
     changeVisible: !visible,
     setGoodspalce: place,
     setPicture: picture,
     setPlaceId: id,
   });
 }

 handleDelete = (aid) => {
   const { page, limit } = this.state;
   const { dispatch } = this.props;
   dispatch({
     type: 'goodsArea/delAreaTags',
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
     type: 'goodsArea/fetchAreaTags',
     payload: { page: 1, limit: 5 }, 
   });
 };

 render() {
   const {
     visible, changeVisible, setGoodspalce, 
     pageSize, current, qiniuToken, fileList, setPicture,
   } = this.state;
   const { goodsArea, AreaTotal } = this.props;
   const EnigoodsArea = goodsArea.filter((tags) => { return tags.place !== ''; }); 
   const columns = this.columns.map((col) => {
     return col;
   });
   const paginationProps = {
     showQuickJumper: false,
     showTotal: () => `共${AreaTotal}条`,
     pageSize,
     current,
     total: AreaTotal,
     onChange: (current) => this.changePage(current),
   };
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
         添加属地
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
         <Divider orientation="left" plain>属地名称</Divider>
         <Input placeholder="请输入属地名称" onChange={this.InputGoodsPlace} />
         <Divider orientation="left" plain>属地LOGO</Divider>
         <span onClick={this.getQiNiuToken}>
           <Upload
             action={QINIU_SERVER}
             data={
             {
               token: qiniuToken,
               key: `icon-${Date.parse(new Date())}`,
             }
}
             listType="picture-card"
             beforeUpload={this.getQiNiuToken}
             fileList={fileList}
             onChange={this.handleChangefile}
           >
             {fileList.length >= 1 ? null : uploadButton}
           </Upload>
         </span>
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
         <Divider orientation="left" plain>属地名称</Divider>
         <Input value={setGoodspalce} onChange={this.ChangeGoodsPlace} />
         <Divider orientation="left" plain>属地LOGO</Divider>
         <span onClick={this.getQiNiuToken}>
           <Upload
             action={QINIU_SERVER}
             data={
             {
               token: qiniuToken,
               key: `icon-${Date.parse(new Date())}`,
             }
}
             listType="picture-card"
             beforeUpload={this.getQiNiuToken}
             fileList={fileList}
             onChange={this.handleChangefile}
           >
             {fileList.length >= 1 ? null : uploadButton}
           </Upload>
         </span>
         <img src={BASE_QINIU_URL + setPicture} alt="" style={{ height: 50, width: 50 }} />
         <Upload />
       </Modal>
       <Table
         rowClassName={() => 'editable-row'}
         bordered
         dataSource={EnigoodsArea}
         columns={columns}
         pagination={paginationProps}
       />
     </div>
   );
 }
}
GoodAreaTags.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodsArea: PropTypes.arrayOf({}),
  AreaTotal: PropTypes.string.isRequired,
};
GoodAreaTags.defaultProps = {
  goodsArea: [],
};

export default GoodAreaTags;
