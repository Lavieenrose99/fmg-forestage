import React, {
  useState, useEffect, useRef
}  from 'react';
import { HeartTwoTone, SmileTwoTone, UploadOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import {
  Card, Typography, Alert, Form, Icon,
  Input, Checkbox, Button, Select, 
  InputNumber, Upload, Modal, Divider, Table, Space
   
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { get } from 'lodash';
import './Admin.less';

const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 3,
    span: 16,
  },
};

const RollingPictures = (props) => {
  const QINIU_SERVER = 'http://upload-z2.qiniup.com';
  const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
  const [qiniuToken, setQiniuToken] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [showAdj, setShowAdj] = useState(false);
  const [oriOrder, setOriOrder] = useState(0);
  const [oriId, setOriId] = useState(0);
  const [oriPicture, setOriPicture] = useState('');
  const [rid, setRid] = useState(0);
  const [fileList, setFileList] = useState(([]));
  const [rollingInfos, setRollingInfos] = useState({});
  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };
  const handleChange = ({ file  }) => {
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
    setPreviewImage(fileItem.url);
    setFileList([fileItem]);
  };
  const handleChangefile = ({ file  }) => {
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
    setOriPicture(fileItem.response.key);
  };
  const getQiNiuToken = () => {
    request('/api.farm/goods/resources/qiniu/upload_token', {
      method: 'GET',
    }).then(
      (response) => {
        setQiniuToken(response.token);
      }
    );
  };
  const getUploadToken = () => {
    getQiNiuToken();
  };
  const uploadButton = (
    <div>
      <div className="ant-upload-text">
        <UploadOutlined />
        上传
      </div>
    </div>
  );
  useEffect(() => {
    props.dispatch({
      type: 'goodsClass/fetchClassTags',
      payload: { page: 1, limit: 99 }, 
    });
    props.dispatch({
      type: 'CreateGoods/getGoodsList',
      payload: {
        query: {
          page: 1,
          limit: 99,
        },
      }, 
    });
    props.dispatch({
      type: 'rollingPicture/fetchRollings',
      payload: {
        query: {
          page: 1,
          limit: 99,
        },
      }, 
    });
  }, []);
  const subRollingPictures = (data) => {
    props.dispatch({
      type: 'rollingPicture/createRollingPicture',
      payload: data,

    });
  };
 
  const handleDeletePictures = (aid) => {
    const { dispatch } = props;
    dispatch({
      type: 'rollingPicture/delRollings',
      payload: {
        tid: aid,
        query: {
          page: 1,
          limit: 10,
        },
      }, 
    });
  };
  const confirmChangePicture = () => {
    props.dispatch({
      type: 'rollingPicture/adjRollingPicture',
      payload: {
        rid,
        picture: oriPicture,
        goods_id: oriId,
        number: oriOrder,
      }, 
    });
    setShowAdj(false);
  };
  const submitChangePicture = () => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交轮播图信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: confirmChangePicture,
    });
  };
  const handelAdjustPicture = (data) => {
    setShowAdj(true);
    setOriId(data.goods_id);
    setOriOrder(data.oid);
    setOriPicture(data.picture);
    setRid(data.id);
  };
  const handleChangeCancel = () => {
    setShowAdj(false);
  };
  const handleChangeGoodsId = (data) => {
    setOriId(data);
  };
  const comfirmDelPicture = (id) => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认删除该轮播图吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleDeletePictures(id),
    });
  };
  const selectGoodsClass = (e) => {
    props.dispatch({
      type: 'CreateGoods/getGoodsList',
      payload: {
        query: {
          page: 1,
          limit: 10,
          kind_tag: e,
        },
      }, 
    });
  };
  const handleChangeOrder = (data) => {
    setOriOrder(data);
  };
  const onFinish = (values) => {
    const picture = fileList[0].response.key;
    const pRollingInfos = Object.assign(values, { picture });
    setRollingInfos(pRollingInfos);
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交轮播图信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { subRollingPictures(pRollingInfos); },
    });
  };
  const {
    Goods, goodsClassFather, 
    goodsClassChild, rollings, rollingslist,
  } = props;
  for (let i = 0; i < rollings.length; i++) {
    rollings[i] = { ...rollings[i], oid: i };
  }
  return (
    <PageHeaderWrapper>
      <Divider orientation="left" plain>类别标签</Divider>
      <Select
        style={{ width: '85vw', marginTop: 10, marginBottom: 20 }}
        onChange={selectGoodsClass}
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
      <Divider />
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="轮播商品"
          name="goods_id"
          rules={[
            {
              required: true,
              message: '请选择轮播商品',
            }
          ]}
        >
          <Select
            showSearch
            placeholder="请选择添加图片的商品"
            optionFilterProp="children"
          >
            {
              Goods.map((arr) => {
                return <Option value={arr.id}>{arr.name}</Option>;
              })
            }

          </Select>
        </Form.Item>

        <Form.Item
          label="轮播序号"
          name="number"
          rules={[
            {
              required: true,
              message: '请输入轮播图序号',
            }
          ]}
        >
          <InputNumber  />
        </Form.Item>
        <Form.Item
          label="商品视图"
          rules={[
            {
              //required: true,
            }
          ]}
        >
          <>
            <span onClick={getUploadToken}>
              <Upload
                action={QINIU_SERVER}
                data={{
                  token: qiniuToken,
                  key: `picture-${Date.parse(new Date())}`,
                }}
                showUploadList={false}
                listType="picture-card"
                beforeUpload={getUploadToken}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList[0] ? <img
                  src={fileList[0] 
                    ? BASE_QINIU_URL + fileList[0].response.key : null}
                  alt="avatar"
                  style={{ width: '100%' }}
                /> :  uploadButton}
              </Upload>
            </span>
          </>
           
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
      <Divider orientation="left" plain>轮播列表</Divider>
      <Table dataSource={rollings}>
        <Column
          title="轮播顺序"
          dataIndex="oid"
          key="oid"
          defaultSortOrder="ascend"
          sorter={(a, b) => a.oid - b.oid}
        />
        <Column
          title="轮播图片" 
          dataIndex="name"
          key="firstName"
          render={(text, record) => (
            <div style={{ textAlign: 'left' }}>
              <img
                src={record ? BASE_QINIU_URL + record.picture : null}
                alt="img" 
                style={{ width: 30, height: 30, marginRight: 20  }}
              />
            </div>
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
                  
                />
                <a onClick={() => handelAdjustPicture(record)}>修改</a> 
                <Modal
                  mask={false}
                  title="凤鸣谷"
                  visible={showAdj}
                  onOk={submitChangePicture}
                  onCancel={handleChangeCancel}
                  okText="提交"
                  cancelText="取消"
                >
                  <Divider orientation="left" plain>类别标签</Divider>
                  <Select
                    style={{ width: '10vw', marginTop: 10, marginBottom: 20 }}
                    onChange={selectGoodsClass}
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
                  <Divider />
                  <Divider orientation="left" plain>轮播商品</Divider>
                  <Select
                    style={{ width: '15vw', marginTop: 10, marginBottom: 20 }}
                    showSearch
                    placeholder="请选择添加图片的商品"
                    optionFilterProp="children"
                    defaultValue={oriId}
                    onChange={handleChangeGoodsId}
                  >
                    {
              Goods.map((arr) => {
                return <Option value={arr.id}>{arr.name}</Option>;
              })
            }

                  </Select>
                  <Divider orientation="left" plain>轮播顺序</Divider>
                  <InputNumber
                    defaultValue={oriOrder} 
                    onChange={handleChangeOrder}
                    value={oriOrder}
                  />
                  <Divider orientation="left" plain>轮播图片</Divider>
                  <span onClick={getQiNiuToken}>
                    <Upload
                      action={QINIU_SERVER}
                      data={
             {
               token: qiniuToken,
               key: `icon-${Date.parse(new Date())}`,
             }
}
                      listType="picture-card"
                      beforeUpload={getQiNiuToken}
                      showUploadList={false}
                      //fileList={oriPicture}
                      onChange={handleChangefile}
                    >
                      {oriPicture ?  <img src={BASE_QINIU_URL + oriPicture} alt="" style={{ height: 80, width: 80 }} /> : uploadButton}
                    </Upload>
                  </span>
                  <Upload />
                </Modal>
              </span>
              <a onClick={() => comfirmDelPicture(record.id)}>删除</a>
            </Space>
          )}
        />
  
      </Table>
    </PageHeaderWrapper>
  );
};

export default connect(({
  goodsArea, goodsSale, CreateGoods, goodsClass, rollingPicture,
}) => ({
  rollingPicture,
  rollings: get(rollingPicture, 'info', []),
  rollingslist: get(rollingPicture, 'List', []),
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
}))(RollingPictures);
