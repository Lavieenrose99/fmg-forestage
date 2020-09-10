/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import {
  Form, Input, Button, Select,
  Checkbox, InputNumber, DatePicker,
  Divider, Upload, Modal, Steps, Radio, Switch, Space, Table, Result
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PlusOutlined, UploadOutlined, SmileOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
import request from '@/utils/request';
import PropTypes from 'prop-types';
import React, {
  useState, useEffect, useRef
} from 'react';
import { get } from 'lodash';
import RichTextEditor from '@/utils/RichTextEditor';

const { Option, OptGroup } = Select;
const uploadButton = (
  <div>
    <div className="ant-upload-text">
      <UploadOutlined />
      上传
    </div>
  </div>
);
const getaways = [{ id: 1, name: '快递' }, { id: 2, name: '同城配送' }, { id: 3, name: '自取' }];
const putaways = [{ id: 1, name: '立即上架' }, { id: 2, name: '自定义上架时间' }, { id: 3, name: '放入仓库暂不上架' }];

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
const EditorLayout = {
  wrapperCol: {
    offset: 1,
    //span: 8,
  },
};

const GoodsAdj = (props) => {
  const { info, closeModel } = props;
  const QINIU_SERVER = 'http://upload-z2.qiniup.com';
  const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
  const list = info.pictures.map((arr, index) => {
    return {
      url: BASE_QINIU_URL + arr.picture,
      uid: index,
      name: arr.picture,
      status: 'done', 
    };
  });
  const PFile = {
    url: BASE_QINIU_URL + info.cover,
    uid: 11,
    name: info.cover,
    status: 'done', 
  }; 
  const Video = {
    url: BASE_QINIU_URL + info.view,
    uid: 11,
    name: info.view,
    status: 'done', 
  };
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [fromSpec] = Form.useForm();
  const [fileList, setFileList] = useState([PFile]);
  const [fileListAlot, setFileListAlot] = useState(list);
  const [fileVidoList, setfileVidoList] = useState([Video]);
  const [richTextContent, setRichTextContent] = useState(info.detail);
  const [qiniuToken, setQiniuToken] = useState('');
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
  const handleChange = ({ file  }) => {
    const {
      uid, name, type, thumbUrl, status, response = {},
    } = file;
    const fileItem = {
      uid,
      name: response.key,
      type,
      thumbUrl,
      status,
      url: BASE_QINIU_URL + (response.key),
    };
    setFileList([fileItem]);
  };
  const subscribeRichText = (text) => {
    setRichTextContent(text);
  };
  const handleVidoChange = ({ file  }) => {
    const {
      uid, type, thumbUrl, status, response = {},
    } = file;
    //存储格式必须是mp4
    const fileItem = {
      uid,
      type,
      thumbUrl,
      status,
      name: response.key,
      url: BASE_QINIU_URL + (response.key || ''),
    };
    setfileVidoList([fileItem]);
  };
  const handleChangeAlot = ({ file  }) => {
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
      judege: (response.key || ''),
      url: BASE_QINIU_URL + (response.key),
    };

    if (fileItem.judege.length !== 0) {
      fileListAlot.pop();
      fileListAlot.pop();
      fileListAlot.push(fileItem);
    } else if (fileItem.status !== 'error') {
      fileListAlot.push(fileItem);
    }
    setFileListAlot([...fileListAlot]);
  };
  useEffect(() => {
    formRef.current.setFieldsValue({
      name: (info.name ?? ''),
      price: info.price,
      template_id: info.template_id,
      paid_and_remove: (info.paid_and_remove ?? false),
      show_total: (info.show_total ?? false),
      exchange: (info.exchange ?? false),
      sale_return: (info.sale_return ?? false),
      advance: (info.advance ?? false),
      advance_time: moment(moment(info.advance_time)
        .format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
      on_sale: (info.on_sale || false),
      sale: (info.sale ?? true),
      get_way: info.get_way,
      limit: (info.limit || false),
      putaway: info.putaway,
      putaway_time: moment(moment(info.putaway_time)
        .format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
      sale_point: info.sale_point,
      kind_tag: info.kind_tag[0],
      sale_tag: info.sale_tag[0],
      place_tag: (info.place_tag[0] ?? []),
      total: info.total,
      price_reduce: (info.price_reduce),
      carriage: info.carriage,
      min_sale: info.min_sale,
      limit_total: info.limit_total,
    });
  }, []);
  const {
    goodsArea, goodsSale,
    goodsClassChild, goodsClassFather,
    goodsModelsList, goodsModel,
  } = props;
  const adjGoodsInfos = (subValues) => {
    const { dispatch } = props;
    dispatch({
      type: 'CreateGoods/adjGoods',
      payload: { info: subValues, tid: info.id },
    });
    closeModel();
    setfileVidoList([]);
    setFileListAlot([]);
    setFileList([]);
    setRichTextContent('');
  };
  const onFinish = (values) => {
    const advance_time =  moment(values.advance_time).valueOf();
    const putaway_time = moment(values.putaway_time).valueOf();
    const kind_tag = [values.kind_tag];
    const place_tag = [values.place_tag];
    const sale_tag = [values.sale_tag];
    const view = fileVidoList[0].name;
    const cover = fileList[0].name;
    const detail = richTextContent;
    const pictures = fileListAlot.map((arrFiles, index) => {
      return { picture: arrFiles.name, order: index };
    });
    const subValues = Object.assign(values, {
      advance_time,
      putaway_time,
      kind_tag,
      place_tag,
      sale_tag, 
      pictures,
      cover,
      view,
      detail,
    });
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交商品信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { adjGoodsInfos(subValues); },
    });
  };
  const onFileList = () => {
    setFileList([]);
    return false;
  };
  const onFileVidio = () => {
    setfileVidoList([]);
    return false;
  };
  const onFileListAlot = (values) => {
    fileListAlot.splice(values.uid, 1);
    return false;
  };
 
  return (<>
    <Divider orientation="left">商品基本信息</Divider>
    <Form
      {...layout}
      form={form}
      ref={formRef}
      name="control-hooks"
      onFinish={onFinish}
      labelAlign="left"
    >
      <FormItem
        name="name"
        key={info.name}
        label="商品名称"
        rules={[
          {
            required: true,
          }
        ]}
      >
        <Input
          placeholder="请输入商品名称"

        />
      </FormItem>
      <FormItem
        name="place_tag"
        key={info.place_tag[0]}
        label="商品分区"
        rules={[
          {
            required: true,
          }
        ]}
      >
        <Select
          placeholder="选择商品分区"
          allowClear
        >
          {goodsArea.map((arr) => {
            return  <Option value={arr.id} key={arr.id}>{arr.place}</Option>;
          })}

        </Select>
      </FormItem>
      <FormItem
        name="kind_tag"
        key={info.kind_tag[0]}
        label="单品类别"
        rules={[
          {
            required: true,
          }
        ]}
      >
        <Select
          style={{ width: '40vw' }}
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
      </FormItem>
      <FormItem
        name="sale_point"
        label="商品卖点"
        key={info.sale_point}
        rules={[
          {
            required: true,
          }
        ]}
      >
        <TextArea
          placeholder="简单描述商品"

        />
      </FormItem>
      <FormItem
        name="sale_tag"
        label="单品属性"
        key={info.sale_tag}
        rules={[
          {
            required: true,
          }
        ]}
      >
        <Radio.Group>
          {
            goodsSale.map((positions) => {
              return <Radio
                value={positions.id}
              >
                {positions.title}
              </Radio>;
            })
          }
        </Radio.Group>
      </FormItem>
      <FormItem
        name="putaway"
        label="上架方式"
        key={info.putaway}
        rules={[
          {
            required: true,
          }
        ]}
      >
        <Radio.Group>
          {
            putaways.map((ways) => {
              return <Radio value={ways.id}>{ways.name}</Radio>;
            })
          }
        </Radio.Group>
      </FormItem>
      <FormItem
        name="get_way"
        label="配送方式"
        key={info.get_way}
        rules={[
          {
            required: true,
          }
        ]}
      >
        <Radio.Group>
          {
            getaways.map((ways) => {
              return <Radio value={ways.id}>{ways.name}</Radio>;
            })
          }
        </Radio.Group>
      </FormItem>
      <FormItem
        label="商品运费"
        name="carriage"
        key={info.carriage}
        rules={[
          {
            required: true,
          }
        ]}
      >
        <InputNumber
          style={{ minWidth: '10vw' }}
          formatter={(Goodvalues) => `¥ ${Goodvalues}`}
          parser={(Goodvalues) => Goodvalues.replace(/¥ \s?|(,*)/g, '')}
          min={0}
          step={0.01}
        />
      </FormItem>

      <FormItem
        name="advance_time"
        label="预售时间"
        rules={[
          {
            required: true,
          }
        ]}
      >
        <DatePicker
          showTime

        />
      </FormItem>
      <FormItem
        name="putaway_time"
        label="上架时间"
        rules={[
          {
            required: true,
          }
        ]}
      >
        <DatePicker
          showTime
        />
      </FormItem>
      <FormItem
        label="商品主视图"
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
              listType="picture-card"
              beforeUpload={getUploadToken}
              fileList={fileList}
              onRemove={onFileList}
              onChange={handleChange}
            >
              {uploadButton}
            </Upload>
          </span>
        </>
       
      </FormItem>
      <FormItem
        label="商品轮播图"
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
              listType="picture-card"
              beforeUpload={getUploadToken}
              fileList={fileListAlot}
              onChange={handleChangeAlot}
              onRemove={onFileListAlot}
            >
              {fileListAlot.length >= 5 ? null : uploadButton}
            </Upload>
          </span>
        </>
      </FormItem>
      <FormItem

        label="产品介绍视频"
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
              listType="picture-card"
              beforeUpload={getUploadToken}
              fileList={fileVidoList}
              onRemove={onFileVidio}
              onChange={handleVidoChange}
            >
              {uploadButton}
            </Upload>
          </span>
        </>
      </FormItem>
      <Divider orientation="left">商品数量设置</Divider>
      <div style={{ marginBottom: 30 }}>
        <Space size="large" style={{ marginLeft: 10 }}>
          <span>
            <span>限购数量: </span>
            <FormItem
              name="limit_total"
              key={info.limit_total}
              noStyle
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <InputNumber  />
            </FormItem>
          </span>
          <span>
            <span>起售数量: </span>
            <FormItem
              name="min_sale"
              noStyle
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <InputNumber  />
            </FormItem>

          </span>
          <span>
            <span>库存数量: </span>
            <FormItem
              name="total"
              noStyle
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <InputNumber  />
            </FormItem>
          </span>
        </Space>
      </div>
      <Divider orientation="left">编辑商品详情</Divider>
      <FormItem {...EditorLayout}>
        <RichTextEditor subscribeRichText={subscribeRichText} defaultText={richTextContent} />
      </FormItem>
      <Divider orientation="left">其他属性</Divider>
      <FormItem label=" " colon={false} className="goods-create-swtich-contianer">
        <Space size="middle">
          <span className="goods-create-swtich-item">

            <span>是否付款减库存：</span>
            <FormItem
              noStyle
              name="paid_and_remove"
              
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
              />
            </FormItem>
          </span>
          <span className="goods-create-swtich-item">
            <span>是否显示库存：</span>
            <FormItem noStyle name="show_total">
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"

              />
            </FormItem>
          </span>
          <span className="goods-create-swtich-item">
            <span>是否支持换货：</span>
            <FormItem noStyle name="exchange">
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
              />
            </FormItem>
          </span>
          <span className="goods-create-swtich-item">
            <span>是否支持七天无理由退货：</span>
            <FormItem noStyle name="sale_return">
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"

              />
            </FormItem>
          </span>
          <span className="goods-create-swtich-item">
            <span>是否预售：</span>
            <FormItem noStyle name="advance">
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"

              />
            </FormItem>
          </span>
          <span className="goods-create-swtich-item">
            <span>是否上架：</span>
            <FormItem noStyle name="on_sale">
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"

              />
            </FormItem>
          </span>
          <span className="goods-create-swtich-item">
            <span>是否使用优惠价：</span>
            <Form.Item noStyle name="sale">
              <Switch
                checkedChildren="是"
                unCheckedChildren="否" 
                defaultChecked
              />
            </Form.Item>
          </span>
          <span className="goods-create-swtich-item">
            <span>是否限购：</span>
            <Form.Item noStyle name="limit">
              <Switch checkedChildren="是" unCheckedChildren="否"  />
            </Form.Item>
          </span>
        </Space>
      </FormItem>
      <FormItem {...tailLayout}>
        <Button
          type="primary"
          htmlType="submit"
        >
          提交
        </Button>

      </FormItem>
    </Form>
  </>);
};

export default connect(({
  goodsArea, goodsSale, goodsClass,
  goodsModels, CreateGoods,
}) => ({
  goodsModels,
  goodsSale: get(goodsSale, 'tags', []),
  goodsArea: get(goodsArea, 'info', []),
  goodsClassFather: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id === 0; }),
  goodsClassChild: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id !== 0; }),
  goodsModel: get(goodsModels, 'info', {}),
  goodId: CreateGoods.goodId,
  GoodsAreaTags: goodsArea.GoodsAreaTags,
  
}))(GoodsAdj);
