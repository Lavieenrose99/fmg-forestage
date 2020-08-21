/* eslint-disable camelcase */
import {
  Form, Input, Button, Select,
  Checkbox, InputNumber, DatePicker,
  Divider, Upload, Modal, Steps, Radio, Switch, Space, Table
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment, { isMoment } from 'moment';
import { get } from 'lodash';
import React, {
  useState, useEffect, useRef, Children 
} from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
import request from '@/utils/request';
import PropTypes from 'prop-types';
import RichTextEditor from '../../utils/RichTextEditor.jsx';
import '../../style/GoodsAddEditor.less';
import GoodsModelsList from './GoodsModels/GoodsModelsList.jsx';

const { Option, OptGroup } = Select;
const layout = {
  labelCol: {
    offset: 4,
  },
  wrapperCol: {
    span: 12,
  },
};
const EditorLayout = {
  wrapperCol: {
    offset: 4,
    //span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export const getaways = [{ id: 1, name: '快递' }, { id: 2, name: '同城配送' }, { id: 3, name: '自取' }];
export const putaways = [{ id: 1, name: '立即上架' }, { id: 2, name: '自定义上架时间' }, { id: 3, name: '放入仓库暂不上架' }];

const { Step } = Steps;

const GoodsAddEditor = (props) => {
  const [form] = Form.useForm();
  const [fromSpec] = Form.useForm();
  const QINIU_SERVER = 'http://upload-z2.qiniup.com';
  const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [fileVidoList, setfileVidoList] = useState([]);
  const [fileListAlot, setFileListAlot] = useState([]);
  const {
    goodsArea, goodsSale,
    goodsClassChild, goodsClassFather,
    goodsModelsList, goodsModel,
  } = props;
  const formRef = useRef(null);
  const [goodsDetails, setGoodsDetails] = useState([]);
  const [qiniuToken, setQiniuToken] = useState('');
  const [richTextContent, setRichTextContent] = useState('');
  const [rubbish, setRubbish] = useState([]);
  const [check, setCheck] = useState(false);
  const [storeageGoods, setStoreageGoods] = useState((JSON.parse(localStorage.getItem('storage')) ?? {}));
  const [submitGoods, setSubmitGoods] = useState([]);
  const [goodsModels, setgoodsModels] = useState([]);
  const [templateId, setTemplateId] = useState(0);
  const [goodID, setGoodsId] = useState(0);
  const [submitValues, setSumitvalues] = useState({});
  const [current, setCurrent] = useState(0);
  const ModelsName = (((goodsModel[0] || []).template || []).filter((arr) => {
    return arr.use !== false;
  }) || []).map((tem) => {
    return tem.name;
  });
  const ModelsColums = ModelsName.map((arr) => {
    return {
      title: arr,
      dataIndex: 'specification',
      render: (text, record) => (
        <span>
          {
           record.specification[arr]
         }
        </span> 
      ), 
    };
  });
  const detailsName = [{
    title: '规格',
    children: ModelsColums, 
  }, { title: '库存', dataIndex: 'total' },
  { title: '重量', dataIndex: 'weight' }, { title: '价格', dataIndex: 'price' },
  { title: '成本价', dataIndex: 'cost_price' }];

  // const goodsColumn = detailsName.map((arr) => {
  //   return { title: arr.name, dataIndex: arr.itemValue, key: arr.name };
  // });
  const settingGoods = {
    title: '操作',
    dataIndex: goodsColumns,
    render: (text, record) => (
      <>
        <Space size="large">
          <a onClick={() => this.handleChange()}>修改</a>
          <a onClick={() => this.comfirmDelArea()}>删除</a>
        </Space>
      </>
    ),
  };
  const goodsColumns = [...detailsName, settingGoods];
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
  const handleVidoChange = ({ file  }) => {
    const {
      uid, name, type, thumbUrl, status, response = {},
    } = file;
    //存储格式必须是mp4
    const fileItem = {
      uid,
      name,
      type,
      thumbUrl,
      status,
      response,
      url: BASE_QINIU_URL + (response.key || ''),
    };
    setfileVidoList([fileItem]);
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
  const subscribeRichText = (text) => {
    setRichTextContent(text);
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
    getQiNiuToken();
  }, [fileListAlot]);
  const uploadButton = (
    <div>
      <div className="ant-upload-text">
        <UploadOutlined />
        上传
      </div>
    </div>
  );
  useEffect(() => {
    fromSpec.setFieldsValue({
      specification: [''],
    });
  });
  useEffect(() => {
    const { goodId } = props;
    setGoodsId(goodId.id);
  }, []);

  useEffect(() => {
    props.dispatch({
      type: 'goodsArea/fetchAreaTags',
      payload: { page: 1, limit: 99 },
    });
    props.dispatch({
      type: 'goodsSale/fetchSaleTags',
      payload: { page: 1, limit: 99 },
    });
    props.dispatch({
      type: 'goodsClass/fetchClassTags',
      paload: { page: 1, limit: 99 },
    });
    props.dispatch({
      type: 'goodsModels/fetchModels',
      payload: { page: 1, limit: 99  },
    });
  }, []);
  const subscriptions = (values) => {
    if (values) {
      const advance_time =  moment(values.advance_time).valueOf();
      const putaway_time = moment(values.putaway_time).valueOf();
      const timestap = {
        advance_time, putaway_time,
      };
      const Goods = storeageGoods;
      const newGoods = Object.assign(Goods, values, timestap);
      localStorage.setItem('storage', JSON.stringify(newGoods));
    }
  };
  const selectTemplate = (template) => {
    props.dispatch({
      type: 'goodsModels/getModelEntity',
      paload: template,
    });
    setTemplateId(template);
  };

  useEffect(() => {
    subscriptions();
    formRef.current.setFieldsValue({
      name: (storeageGoods.name ?? ''),
      price: storeageGoods.price,
      template_id: storeageGoods.template_id,
      paid_and_remove: (storeageGoods.paid_and_remove ?? false),
      show_total: (storeageGoods.show_total ?? false),
      exchange: (storeageGoods.exchange ?? false),
      sale_return: (storeageGoods.sale_return ?? false),
      advance: (storeageGoods.advance ?? false),
      advance_time: moment(moment(storeageGoods.advance_time)
        .format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
      on_sale: (storeageGoods.on_sale || false),
      sale: (storeageGoods.sale || false),
      get_way: storeageGoods.get_way,
      limit: (storeageGoods.limit || false),
      putaway: storeageGoods.putaway,
      putaway_time: moment(moment(storeageGoods.putaway_time)
        .format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
      sale_point: storeageGoods.sale_point,
      kind_tag: storeageGoods.kind_tag,
      sale_tag: storeageGoods.sale_tag,
      palce_tag: (storeageGoods.palce_tag ?? []),
      total: storeageGoods.total,
      price_reduce: (storeageGoods.price_reduce),
      carriage: storeageGoods.carriage,
      min_sale: storeageGoods.min_sale,
      limit_total: storeageGoods.limit_total,
    });
  }, []);
  const subGoodsSpec = () => {
    props.dispatch({
      type: 'CreateGoods/createGoodsSpec',
      payload: {
        pid: props.goodId.id,
        specification: goodsDetails,
        template_id: templateId,
      },
    });
  };
  const addSpecification = (data) => {
    const dataArr = Object.values(data);
    const specification = dataArr[0][0];
    const item = { specification };
    const FinalDels = Object.assign(data, item);
    setGoodsDetails([...goodsDetails, FinalDels]);
  };
  const submitSpc = () => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交商品信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { subGoodsSpec(); },
    });
  };
  const subGoodsInfos = (subValues) => {
    localStorage.removeItem('storage');
    const { dispatch } = props;
    dispatch({
      type: 'CreateGoods/createGoods',
      payload: subValues,
    });
    setSubmitGoods(subValues);
    setCurrent(current + 1);
  };
  const onFinish = (values) => {
    const advance_time =  moment(values.advance_time).valueOf();
    const putaway_time = moment(values.putaway_time).valueOf();
    const kind_tag = [values.kind_tag];
    const palce_tag = [values.palce_tag];
    const sale_tag = [values.sale_tag];
    const cover = fileList[0].response.key;
    const view = fileVidoList[0].response.key;
    const detail = richTextContent;
    const pictures = fileListAlot.map((arrFiles, index) => {
      return { picture: arrFiles.judege, order: index };
    });
    const timestap = {
      advance_time,
      putaway_time, 
      kind_tag,
      palce_tag,
      sale_tag, 
      pictures,
      cover,
      view,
      detail,
    };
    const subValues = Object.assign(values, timestap);
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交商品信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { subGoodsInfos(subValues); },
    });
  };

  return (
    <>
      <Steps
        type="navigation"
        current={current}
        onChange={(current) => setCurrent(current)}
        className="site-navigation-steps"
      >
        <Step status="process" title="填写商品基本信息" />
        <Step status="process" title="完善商品规格信息" />
      </Steps>
      <div className="steps-content">
        {
  (() => {
    if (current === 0) {
      return (<>
        <Divider orientation="left">商品基本信息</Divider>
        <Form
          onValuesChange={subscriptions}
          {...layout}
          form={form}
          ref={formRef}
          name="control-hooks"
          onFinish={onFinish}
          labelAlign="left"
        >
          <Form.Item
            name="name"
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
          </Form.Item>
          <Form.Item
            name="palce_tag"
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
          </Form.Item>
          <Form.Item
            name="kind_tag"
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
          </Form.Item>
          <Form.Item
            name="sale_point"
            label="商品卖点"
            rules={[
              {
                required: true,
              }
            ]}
          >
            <TextArea
              placeholder="简单描述商品"

            />
          </Form.Item>
          <Form.Item
            name="sale_tag"
            label="单品属性"
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
          </Form.Item>
          <Form.Item
            name="putaway"
            label="上架方式"
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
          </Form.Item>
          <Form.Item
            name="get_way"
            label="配送方式"
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
          </Form.Item>
          <Form.Item
            label="价格设定"
            colon={false}
            rules={[
              {
                required: true,
              }
            ]}
          >
            <Space
              size="large"
              style={{ marginLeft: 20 }}
              className="goods-create-price-setting-container"
            >

              <span className="goods-create-price-setting-item">
                <span>商品价格:  </span>
                <FormItem name="price" noStyle>
                  <InputNumber
                    style={{ minWidth: '6vw' }}
                    formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    parser={(Goodvalues) => Goodvalues.replace(/¥\s?|(,*)/g, '')}
                    min={0}
                    step={0.01}
                  />
                </FormItem>
              </span>
              <span className="goods-create-price-setting-item">
                <span>优惠多少: </span>
                <FormItem name="price_reduce" noStyle>
                  <InputNumber
                    style={{ minWidth: '6vw' }}
                    formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    parser={(Goodvalues) => Goodvalues.replace(/¥ \s?|(,*)/g, '')}
                    min={0}
                    step={0.01}
                  />
                </FormItem>
              </span>
              <span className="goods-create-price-setting-item">
                <span>运费: </span>
                <FormItem noStyle name="carriage">
                  <InputNumber
                    style={{ minWidth: '6vw' }}
                    formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    parser={(Goodvalues) => Goodvalues.replace(/¥ \s?|(,*)/g, '')}
                    min={0}
                    step={0.01}
                  />
                </FormItem>
              </span>
            </Space>
          </Form.Item>
          <Form.Item
            label="商品数量设定"
            colon={false}
          >
            <Space size="large" style={{ marginLeft: 10 }}>
              <span>
                <span>限购数量: </span>
                <FormItem name="limit_total" noStyle>
                  <InputNumber  />
                </FormItem>
              </span>
              <span>
                <span>起售数量: </span>
                <FormItem name="min_sale" noStyle>
                  <InputNumber  />
                </FormItem>

              </span>
              <span>
                <span>库存数量: </span>
                <FormItem name="total" noStyle>
                  <InputNumber  />
                </FormItem>
              </span>
            </Space>
          </Form.Item>

          <Form.Item
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
          </Form.Item>
          <Form.Item
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
          </Form.Item>
          <Form.Item
            name="main_goods_picture"
            label="商品主视图"
            rules={[
              {
                //required: true,
              }
            ]}
          >
            <>
              <Upload
                action={QINIU_SERVER}
                data={{
                  token: qiniuToken,
                  key: `picture-${Date.parse(new Date())}`,
                }}
                listType="picture-card"
                beforeUpload={getUploadToken}
                fileList={fileList}
                //showUploadList={false}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {previewImage ? <img
                  src={previewImage}
                  alt="previewImg"
                  style={{ width: '100%' }}
                /> : uploadButton}
              </Upload>
            </>
          </Form.Item>
          <Form.Item
            name="main_goods_picture"
            label="商品轮播图"
            rules={[
              {
                //required: true,
              }
            ]}
          >
            <>
              <Upload
                action={QINIU_SERVER}
                data={{
                  token: qiniuToken,
                  key: `picture-${Date.parse(new Date())}`,
                }}
                listType="picture-card"
                beforeUpload={getUploadToken}
                fileList={fileListAlot}
                onPreview={handlePreview}
                onChange={handleChangeAlot}
              >
                {fileListAlot.length >= 5 ? null : uploadButton}
              </Upload>
            </>
          </Form.Item>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={() => setPreviewVisible(!previewVisible)}
          >
            <img style={{ width: '100%' }} src={previewImage} alt="previewImg" />
          </Modal>
          <Form.Item
            name="main_goods_video"
            label="产品介绍视频"
            rules={[
              {
                //required: true,
              }
            ]}
          >
            <>
              <Upload
                action={QINIU_SERVER}
                data={{
                  token: qiniuToken,
                  key: `video-${Date.parse(new Date())}`,
                }}
                listType="picture-card"
                beforeUpload={getUploadToken}
                fileList={fileVidoList}
                onChange={handleVidoChange}
              >
                {fileVidoList.length >= 1 ? null : uploadButton}
              </Upload>
            </>
          </Form.Item>
          <Form.Item {...EditorLayout}>
            <RichTextEditor subscribeRichText={subscribeRichText} />
          </Form.Item>
          <Form.Item label=" " colon={false} className="goods-create-swtich-contianer">
            <Space size="middle">
              <span className="goods-create-swtich-item">

                <span>是否付款减库存：</span>
                <FormItem
                  noStyle
                  name="paid_and_remove"
                  initialValue={false}
                >
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                </FormItem>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否显示库存：</span>
                <FormItem noStyle name="show_total" initialValue={false}>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"

                  />
                </FormItem>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否支持换货：</span>
                <FormItem noStyle name="exchange" initialValue={false}>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                </FormItem>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否支持七天无理由退货：</span>
                <FormItem noStyle name="sale_return" initialValue={false}>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"

                  />
                </FormItem>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否预售：</span>
                <FormItem noStyle name="advance" initialValue={false}>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"

                  />
                </FormItem>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否上架：</span>
                <FormItem noStyle name="on_sale" initialValue={false}>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"

                  />
                </FormItem>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否使用优惠价：</span>
                <FormItem noStyle name="sale" initialValue={false}>
                  <Switch checkedChildren="是" unCheckedChildren="否"  />
                </FormItem>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否限购：</span>
                <FormItem noStyle name="limit" initialValue={false}>
                  <Switch checkedChildren="是" unCheckedChildren="否"  />
                </FormItem>
              </span>
            </Space>
          </Form.Item>
         
          <FormItem {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
            >
              下一步
            </Button>

          </FormItem>
        </Form>
      </>);
    } if (current === 1) {
      return (<div style={{ textAlign: 'center', backgroundColor: 'white' }}>
        <Divider>{(goodsModel[0] || []).title}</Divider>
        <Divider plain orientation="left">规格</Divider>
        <Select
          style={{ marginBottom: 20 }}
          onChange={selectTemplate}
          placeholder="选择规格模版"
          allowClear
        >
          {goodsModelsList.map((arr) => {
            return  <Option value={arr.id} key={arr.id}>{arr.title}</Option>;
          })}

        </Select>
        <Form
          onFinish={addSpecification}
          form={fromSpec}
          
        >
          <Form.List name="specification">
            {(fields) => {
              return (
                <div style={{ textAlign: 'center', backgroundColor: 'white' }}>
                  {fields.map((field) => (
                    <>
                      <div>
                        {
            (((goodsModel[0] || []).template || []).filter((arr) => {
              return arr.use !== false;
            }) || []).map((tem) => {
              return <div>
                <FormItem
                  {...field}
                  name={[field.name, `${tem.name}`]}
                  fieldKey={[[field.fieldKey, `${tem.name}`]]}
                  rules={[
                    {
                      //required: true,
                    }
                  ]}
                  noStyle
                >
                  <Input
                    addonBefore={['', tem.name]} 
                    style={{ width: '14vw', marginBottom: 10 }}
                  />
                </FormItem>
              </div>;
            })
          }
                      </div>
                    </>
                  ))}
                </div>
                
              );
            }}
          </Form.List>
          <Divider plain orientation="left">常规设置</Divider>
          <div>
            <FormItem
              name="total"
              label="库存"
              rules={[
                {
                  required: true,
                }
              ]}
              noStyle
            >
              <InputNumber style={{ width: '14vw', marginBottom: 10 }} />
            </FormItem>
          </div>
          <div>
            <FormItem
              name="price"
              rules={[
                {
                  required: true,
                }
              ]}
              noStyle
            >
              <InputNumber addonBefore="价格" style={{ width: '14vw', marginBottom: 10 }} />
            </FormItem>
          </div>
          <div>
            <FormItem
              name="weight"
              
              rules={[
                {
                  required: true,
                }
              ]}
              noStyle
            >
              <InputNumber addonBefore="重量" style={{ width: '14vw', marginBottom: 10 }} />
            </FormItem>
          </div>
          <div>
            <FormItem
              name="cost_price"
              addonBefore="价格"
              rules={[
                {
                  required: true,
                }
              ]}
              noStyle
            >
              <InputNumber addonBefore="成本价" style={{ width: '14vw', marginBottom: 10 }} />
            </FormItem>
          </div>
          <Divider />
          <Button style={{ marginBottom: 10 }} htmlType="submit">添加</Button>
        </Form>
        <Divider>规格列表</Divider>
        <Table
          columns={goodsColumns}
          dataSource={goodsDetails}
          style={{ paddingLeft: 20, paddingRight: 20 }}
        />
        <Button onClick={submitSpc}>提交</Button>

      </div>);
    }
  })()
}
      </div>

    </>
  );
};
GoodsAddEditor.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodId: PropTypes.number,
  goodsArea: PropTypes.arrayOf({}),
  goodsSale: PropTypes.arrayOf({}),
  goodsClassFather: PropTypes.arrayOf({}),
  goodsClassChild: PropTypes.arrayOf({}),
  goodsModelsList: PropTypes.arrayOf({}),
};
GoodsAddEditor.defaultProps = {
  goodId: 0,
  goodsArea: [],
  goodsSale: [],
  goodsClassFather: [],
  goodsClassChild: [],
  goodsModelsList: [],

};

export default connect(({
  goodsArea, goodsSale, goodsClass,
  goodsModels, CreateGoods,
}) => ({
  goodsModels,
  goodsSale: get(goodsSale, 'tags', []),
  goodsArea: get(goodsArea, 'tags', []),
  goodsClassFather: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id === 0; }),
  goodsClassChild: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id !== 0; }),
  goodsModelsList: get(goodsModels, 'infos', ''),
  goodsModel: get(goodsModels, 'info', {}),
  goodId: CreateGoods.goodId,
  GoodsAreaTags: goodsArea.GoodsAreaTags,

}))(GoodsAddEditor);
