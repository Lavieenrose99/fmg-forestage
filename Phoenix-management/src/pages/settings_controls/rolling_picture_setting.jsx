import React, {
  useState, useEffect, useRef
}  from 'react';
import { HeartTwoTone, SmileTwoTone, UploadOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import {
  Card, Typography, Alert, Form, 
  Input, Checkbox, Button, Select, 
  InputNumber, Upload, Modal, Divider, Tag
   
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { get } from 'lodash';
import './Admin.less';

const { Option, OptGroup } = Select;

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
    localStorage.setItem('FileList', JSON.stringify(fileItem));
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
  }, []);
  const subRollingPictures = (data) => {
    props.dispatch({
      type: 'rollingPicture/createRollingPicture',
      payload: data,

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
  const onFinish = (values) => {
    const picture = fileList[0].response.key;
    const pRollingInfos = Object.assign(values, { picture });
    setRollingInfos(pRollingInfos);
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交商品信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { subRollingPictures(pRollingInfos); },
    });
  };
  const { Goods, goodsClassFather, goodsClassChild  } = props;
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
    </PageHeaderWrapper>
  );
};

export default connect(({
  goodsArea, goodsSale, CreateGoods, goodsClass, rollingPicture,
}) => ({
  rollingPicture,
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
