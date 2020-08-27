import React, { PureComponent } from 'react';
import {
  Table, Input, Button, Popconfirm, Form, Modal, 
  Space, message, Tag, Radio, Divider, Upload
} from 'antd';
import request from '@/utils/request';
import { connect } from 'umi';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { PlusCircleTwoTone, UploadOutlined } from '@ant-design/icons';
import '../../../style/GoodsTagsIndex.less';

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

@connect(({ goodsClass }) => ({
  goodsClassFather: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id === 0; }),
  goodsClassChild: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id !== 0; }),
  ClassTotal: get(goodsClass, 'total', ''),
  //GoodsAreaTags: goodsArea.GoodsAreaTags,
}))
class GoodsClassList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '类别名称',
        dataIndex: 'title',
        //editable: true,
      },
      {
        title: '类别标签',
        dataIndex: 'parent',
        render: (text) => (
          <>
            <Tag color="blue">{text}</Tag>
          </>
        ),
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
              <a onClick={() => this.handleChange(text, record.title)}>修改</a>
              <a onClick={() => this.comfirmDelClass(text)}>删除</a>
            </Space>
          </>
        ),
      }
    ];
    this.state = {
      SelectedTagsValue: '',
      GoodsClass: '',
      tagsCheck: 0,
      setGoodsClassTags: '',
      setClassId: '',
      visible: false,
      changeVisible: false,
      goodsClassFather: [],
      qiniuToken: '',
      fileList: [],
      page: 1,
      limit: 99,
    };
    this.handleGetListData = this.handleGetListData.bind(this);
  }

  componentDidMount() {
    //初始化拉取表格数据
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsClass/fetchClassTags',
      payload: { page: 1, limit: 99 }, 
    });
  }

  componentWillReceiveProps() {
    if (this.state.goodsClassFather.length === 0) {
      this.handleGetListData(); 
    }
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

  InputGoodsClass=(e) => {
    this.setState({
      GoodsClass: e.target.value,
    });
  }

  ChangeGoodsClass=(e) => {
    this.setState({
      setGoodsClassTags: e.target.value,
    });
  }

 comfirmDelClass =(id) => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认删除该种类吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.handleDelete(id),
   });
 }

 comfirmsubmitClass =() => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认提交商品种类吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.subClass(),
   });
 }

 comfirmsubmitChangeClass =() => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认提交该商品种类吗吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.changeClass(),
   });
 }

 changeClass=() => {
   const { dispatch } = this.props;
   const {
     page, limit, setGoodsClassTags, setClassId, 
   } = this.state;
   if (setGoodsClassTags !== '') {
     dispatch({
       type: 'goodsClass/adjClassTags',
       payload: {
         title: setGoodsClassTags,
         tid: setClassId,
         query: {
           page,
           limit,
         },
       },
     }); 
     this.setState({
       changeVisible: false,
       setGoodsClassTags: '',
       setClassId: '',
     }); 
   } else {
     message.error('属性不能为空');
   }
 }

 subClass=() => {
   const { dispatch } = this.props;
   const {
     page, limit, SelectedTagsValue, fileList, 
   } = this.state;
   const { GoodsClass } = this.state;
   if (GoodsClass !== '') {
     dispatch({
       type: 'goodsClass/setClassTags',
       payload: {
         title: GoodsClass,
         pid: SelectedTagsValue,
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

 selectitem = (checked, item) => {
   this.setState({
     tagsCheck: item.id,
   });
   const { dispatch } = this.props;
   dispatch({
     type: 'goodsClass/fetchClassTags',
     payload: { page: 1, limit: 99, parent_id: item.id }, 
   });
 }

 selectClassTags = (e) => {
   this.setState({
     SelectedTagsValue: e.target.value,
   });
 };

 selectitemall = () => {
   this.setState({
     tagsCheck: 0,
   });
   const { dispatch } = this.props;
   dispatch({
     type: 'goodsClass/fetchClassTags',
     payload: { page: 1, limit: 99 }, 
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

 handleCancel=() => {
   const {  visible } = this.state;
   this.setState({
     visible: !visible,
   });
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

 handleChange =(id, classTags) => {
   const {  visible } = this.state;
   this.setState({
     changeVisible: !visible,
     setGoodsClassTags: classTags,
     setClassId: id,
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
  const { goodsClassFather } = this.props;
  this.setState({
    goodsClassFather,
  });
};

render() {
  const columns = this.columns.map((col) => {
    return col;
  });
  const {
    visible, changeVisible, setGoodsClassTags,
    tagsCheck, goodsClassFather, SelectedTagsValue,
    qiniuToken, fileList,
  } = this.state;
  const { goodsClassChild } = this.props;
  for (let i = 0; i < goodsClassFather.length; i++) {
    for (let j = 0; j < goodsClassChild.length; j++) {
      if (goodsClassFather[i].id === goodsClassChild[j].parent_id) {
        goodsClassChild[j] = { ...goodsClassChild[j], parent: goodsClassFather[i].title };
      }
    }
  }
  return (
    <>
      <div className="fmg-goods-class-list-tags">
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
          icon={<PlusCircleTwoTone />}
        >
          添加商品种类
        </Button>
        <Divider orientation="left" plain>类别标签</Divider>
        <div className="Goods-Class-Tags-selector">
          {
            <Tag.CheckableTag 
              onClick={() => this.selectitemall()}
              checked={tagsCheck === 0}
            >
              全部
            </Tag.CheckableTag>
}
          {
           goodsClassFather.map((arr) => {
             return <Tag.CheckableTag
               checked={tagsCheck === arr.id}
               onChange={(e) => this.selectitem(e, arr)}
             >
               {
           arr.title
}
             </Tag.CheckableTag>; 
           })
}
        </div>
        <Modal
          mask={false}
          title="凤鸣谷"
          visible={visible}
          onOk={this.comfirmsubmitClass}
          onCancel={this.handleCancel}
          okText="提交"
          cancelText="取消"
        >
          <Divider orientation="left" plain>类别标签 </Divider>
          <Radio.Group onChange={this.selectClassTags} value={SelectedTagsValue}>
            {
              goodsClassFather.map((arr) => { return <Radio value={arr.id}>{arr.title}</Radio>; })
           
           }
          </Radio.Group>
          <Divider orientation="left" plain>类别名称 </Divider>
          <Input
            placeholder="请输入商品类别名称"
            onChange={this.InputGoodsClass} 
            className="goods-class-selected-input"
          />
          <Divider orientation="left" plain>种类LOGO</Divider>
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
          onOk={this.comfirmsubmitChangeClass}
          onCancel={this.handleChangeCancel}
          okText="提交"
          cancelText="取消"
        >
          <Divider orientation="left" plain>类别名称</Divider>
          <Input value={setGoodsClassTags} onChange={this.ChangeGoodsClass} />
          <Divider orientation="left" plain>种类LOGO</Divider>
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
        <Divider orientation="left" plain>类别列表</Divider>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          columns={columns}
          dataSource={goodsClassChild}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
}
}
GoodsClassList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodsClassFather: PropTypes.arrayOf({}).isRequired,
  goodsClassChild: PropTypes.arrayOf({}).isRequired,
};
GoodsClassList.defaultProps = {
  //goodsSale: [],
};
export default GoodsClassList;
