/* eslint-disable camelcase */
import {
  Form, Input, Button, Select,
  InputNumber, DatePicker, notification,
  Divider, Upload, Modal, Steps, Radio, Switch, Space, Table, Result, PageHeader, Checkbox
} from 'antd';
import {
  UploadOutlined, SmileOutlined, StopTwoTone, PlusCircleTwoTone 
} from '@ant-design/icons';
import moment  from 'moment';
import { get } from 'lodash';
import React, {
  useState, useEffect, useRef
} from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
import request from '@/utils/request';
import {
  dataGoodsName, dataGoodsNameOut, getaways, putaways 
} from '@/utils/DataStore/data_goods';
import PropTypes from 'prop-types';
import {
  layout, 
  EditorLayout, ModelListlayout, tailLayout, uploadButton
} from '@/utils/Layout/basic_layout.jsx';
import { QINIU_SERVER, BASE_QINIU_URL } 
  from '@/utils/Token';
import ImgCrop from 'antd-img-crop'; 
import RichTextEditor from '../../utils/RichTextEditor.jsx';
import { filterHTMLTag } from '../../utils/adjust_picture';
import '../../style/GoodsAddEditor.less';

const routes = [
  {
    path: '/',
    breadcrumbName: '首页',
  },
  {
    path: '/goods',
    breadcrumbName: '商品管理',
  },
  {
    path: '/goods/add-goods',
    breadcrumbName: '添加商品',
  }
];

const { Option, OptGroup } = Select;
const CheckboxGroup = Checkbox.Group;

const { Step } = Steps;

export const GoodsAddEditor = (props) => {
  const {
    goodsArea, goodsSale,
    goodsClassChild, goodsClassFather,
    goodsModelsList, goodsModel,
  } = props;
  const [form] = Form.useForm();
  const [fromSpec] = Form.useForm();
  const [formAdj]  = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const formRef = useRef(null);
  const formAdjRef = useRef(null);
  const [goodsDetails, setGoodsDetails] = useState([]);
  const [qiniuToken, setQiniuToken] = useState('');
  const [adjSpec, setAdjSpec] = useState({});
  const [adjVisible, setAdjVisible] = useState(false);
  const [AdjSpecName, setAdjSpecName] = useState([]);
  const [submitGoods, setSubmitGoods] = useState({});
  const [goodsModels, setgoodsModels] = useState([]);
  const [templateId, setTemplateId] = useState(0);
  const [goodID, setGoodsId] = useState(0);
  const [adjFileList, setAdjFileList] = useState(adjSpec.picture);
  const [adjIndex, setAdjIndex] = useState(-1);
  const [current, setCurrent] = useState(0);
  const [richTextContent, setRichTextContent] = useState(localStorage.getItem('RichText'));
  const [storeageGoods, setStoreageGoods] = useState((JSON.parse(localStorage.getItem('storage')) ?? {}));
  const [fileList, setFileList] = useState(([JSON.parse(localStorage.getItem('FileList'))] ?? []));
  const [fileVidoList, setfileVidoList] = useState(([JSON.parse(localStorage.getItem('fileVidoList'))] ?? []));
  const [fileListAlot, setFileListAlot] = useState((JSON.parse(localStorage.getItem('FileListAlot')) ?? []));
  
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
    key: '规格',
    children: ModelsColums,
   
  }, ...dataGoodsName];
  const detailsNameOut = [{
    title: '规格',
    key: '规格',
    children: ModelsColums,
  
  }, ...dataGoodsNameOut   
  ];
  const comfirmDelItem = (index) => {
    const data = goodsDetails;
    data.splice(index, 1);
    setGoodsDetails([...data]);
  };
  const delItem = (index) => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认删除该规格吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { comfirmDelItem(index); },
    });
  };
  const setAdjVis = () => {
    setAdjVisible(false);
    formAdj.setFieldsValue({
      specification: [''],
    });
    formAdj.resetFields();
  };
  const adjItem = (record, index) => {
    formAdj.setFieldsValue({
      specification: [''],
    });
    setAdjSpec(record);
    setAdjVisible(true);
    const array = (((goodsModel[0] || []).template || []).filter((arr) => {
      return arr.use !== false;
    }) || []).map((item) => {
      return item.name;
    });
    setAdjSpecName(array);
    setAdjFileList(record.picture);
    setAdjIndex(index);
  };
  const settingGoods = {
    title: '操作',
    //dataIndex: goodsColumns,
    render: (_, record, index) => (
      <>
        <Space size="large">
          <a onClick={() => adjItem(record, index)}>修改</a>
          <a onClick={() => delItem(index)}>删除</a>
        </Space>
      </>
    ),
  };
  const IconColums = {
    title: '图标',
    dataIndex: 'picture',
    render: (pictures) => (
      <div>
        <img
          src={pictures ? BASE_QINIU_URL + pictures : null}
          alt={pictures} 
          style={{ width: 30, height: 30  }}
        />
      </div>
    ),
  };
  const goodsColumns = submitGoods.sale 
    ? [...detailsName, IconColums, settingGoods] : [...detailsNameOut, IconColums, settingGoods];
  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };
  
  const onResetInfo = () => {
    localStorage.removeItem('FileList');
    localStorage.removeItem('storage');
    localStorage.removeItem('RichText'); 
    localStorage.removeItem('FileListAlot');
    localStorage.removeItem('fileVidoList');
    localStorage.removeItem('FileList');
    setFileList([]);
    setFileListAlot([]);
    setfileVidoList([]);
    setGoodsDetails('');
    form.resetFields();
    // eslint-disable-next-line no-restricted-globals
    location.reload(true);
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
    return true;
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
  const handleChangeAdj = ({ file  }) => {
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
      url: (response.key || ''),
    };
    setPreviewImage(fileItem.url);
    setAdjFileList(fileItem.url);
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
    localStorage.setItem('fileVidoList', JSON.stringify(fileItem));
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
      index: fileListAlot.length,
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
    localStorage.setItem('FileListAlot', JSON.stringify(fileListAlot));
    setFileListAlot([...fileListAlot]);
  };  
  const subscribeRichText = (text) => {
    localStorage.setItem('RichText', text);
    setRichTextContent(text);
  };
  
  useEffect(() => {
    getQiNiuToken();
  }, [fileListAlot]);
 
  useEffect(() => {
    fromSpec.setFieldsValue({
      specification: [''],
    });
  }, []);
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
      payload: { page: 1, limit: 99 },
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
      sale: (storeageGoods.sale ?? true),
      get_way: storeageGoods.get_way,
      limit: (storeageGoods.limit || false),
      putaway: storeageGoods.putaway,
      putaway_time: moment(moment(storeageGoods.putaway_time)
        .format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
      sale_point: storeageGoods.sale_point,
      kind_tag: storeageGoods.kind_tag,
      sale_tag: storeageGoods.sale_tag,
      place_tag: (storeageGoods.place ?? []),
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
    localStorage.removeItem('FileList');
    setFileList([]);
    setCurrent(current + 1);
  };
  const onFileListAlot = (values) => {
    fileListAlot.splice(values.uid, 1);
    return false;
  };
  const onReset = () => {
    fromSpec.resetFields();
    fromSpec.setFieldsValue({
      specification: [''],
    });
    localStorage.removeItem('FileList');
    setFileList([]);
  };
  const addSpecification = (data) => {
    const spciArr = Object.values(data);
    if (spciArr[0][0].length === 0) {
      notification.warning({
        message: '错误',
        description:
          '请先选择规格模版',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    } else {
      const cost_price = data.cost_price * 100;
      const reduced_price = data.reduced_price * 100;
      const price = data.price * 100;
      const newPrice = {
        cost_price,
        reduced_price,
        price,
      };
      const specification = spciArr[0][0];
      const picture = fileList[0].response.key;
      const specific = { specification, picture };
      const Finaldata = Object.assign(data, specific, newPrice);
      setGoodsDetails([...goodsDetails, Finaldata]);
      setFileList([]);
      onReset();
      setPreviewImage('');
    }
  };
  const adjSpecification = (adj) => {
    const spciArr = Object.values(adj);
    const specification = spciArr[0][0];
    const picture = adjFileList;
    const specific = { specification, picture };
    const Finaldata = Object.assign(adj, specific);
    const data = goodsDetails;
    data.splice(adjIndex, 1);
    data.push(Finaldata);
    setGoodsDetails([...data]);
    setAdjVisible(false);
    formAdj.setFieldsValue({
      specification: [''],
    });
    formAdj.resetFields();
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
    localStorage.removeItem('FileList');
    localStorage.removeItem('fileVidoList');
    localStorage.removeItem('FileListAlot');
    localStorage.removeItem('RichText');
    const { dispatch } = props;
    dispatch({
      type: 'CreateGoods/createGoods',
      payload: subValues,
    });
    setfileVidoList([]);
    setFileListAlot([]);
    setFileList([]);
    setRichTextContent('');
    setPreviewImage('');
    setSubmitGoods(subValues);
    setCurrent(current + 1);
  };
  const onFinish = (values) => {
    let get_way = 0;
    for (let i = 0; i < values.get_way.length; i++) {
      get_way += values.get_way[i];
    }
    if (get_way === 1) {
      get_way = 1;
    } else if (get_way === 2) {
      get_way = 2;
    } else if (get_way === 3) {
      get_way = 3;
    } else if (get_way === 4) {
      get_way = 4;
    } else if (get_way === 5) {
      get_way = 5;
    } else if (get_way === 6) {
      get_way = 6;
    } else if (get_way === 7) {
      get_way = 7;
    }
    const carriage = values.carriage * 100;
    const advance_time =  moment(values.advance_time).valueOf();
    const putaway_time = moment(values.putaway_time).valueOf();
    const kind_tag = [values.kind_tag];
    const place_tag = [values.place_tag];
    const sale_tag = [values.sale_tag];
    const cover = fileList[0].response.key;
    const view = fileVidoList[0].response.key;
    const detail = filterHTMLTag(richTextContent);
    const pictures = fileListAlot.map((arrFiles, index) => {
      return { picture: arrFiles.judege, order: index };
    });
    const timestap = {
      carriage,
      advance_time,
      putaway_time, 
      kind_tag,
      place_tag,
      sale_tag, 
      pictures,
      cover,
      view,
      get_way,
      detail,
    };
    const subValues = Object.assign(values, timestap);
    if (advance_time < putaway_time) {
      Modal.confirm({
        mask: false,
        title: '凤鸣谷',
        content: '确认提交商品信息吗',
        okText: '确认',
        cancelText: '取消',
        onOk: () => { subGoodsInfos(subValues); },
      });
    } else {
      notification.warning({
        message: '错误',
        description:
          '请检查预售时间与上架时间是否有冲突！',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    }
  };
  return (
    <>
      <PageHeader
        style={{ backgroundColor: 'white', marginBottom: 30 }}
        className="goods-publish-all-pages"
        breadcrumb={{ routes }}
        title="添加商品"
        footer={<Steps
          //type="navigation"
          current={current}
          className="site-navigation-steps"
        >
          <Step title="基本信息" description="完善商品基础信息" />
          <Step title="规格信息" description="完善商品规格" />
          <Step title="成功提交" description="发布商品成功" />
        </Steps>}
      /> 
       
      <div className="steps-content">
        {
  (() => {
    if (current === 0) {
      return (<div className="goods-basic-publish-contianer">
        <Divider>商品基本信息</Divider>
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
            name="place_tag"
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
            <CheckboxGroup>
              {
                getaways.map((ways) => {
                  return <Checkbox value={ways.id}>{ways.name}</Checkbox>;
                })
}
            </CheckboxGroup>
          </Form.Item>
          <Form.Item
            label="商品运费"
            name="carriage"
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
              <span onClick={getUploadToken}>
                <ImgCrop grid>
                  <Upload
                    action={QINIU_SERVER}
                    data={{
                      token: qiniuToken,
                      key: `picture-${Date.parse(new Date())}`,
                    }}
                    showUploadList={false}
                    listType="picture-card"
                    beforeUpload={getUploadToken}
                    onChange={handleChange}
                  >
                    {fileList[0] ? <img
                      src={fileList[0] 
                        ? BASE_QINIU_URL + fileList[0].response.key : null}
                      alt="avatar"
                      style={{ width: '100%' }}
                    /> :  uploadButton}
                  </Upload>
                </ImgCrop>
              </span>
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
              <span onClick={getUploadToken}>
                <ImgCrop grid>
                  <Upload
                    action={QINIU_SERVER}
                    data={{
                      token: qiniuToken,
                      key: `picture-${Date.parse(new Date())}`,
                    }}
                    listType="picture-card"
                    beforeUpload={getUploadToken}
                    fileList={fileListAlot}
                    onRemove={onFileListAlot}
                    onPreview={handlePreview}
                    onChange={handleChangeAlot}
                  >
                    {fileListAlot.length >= 5 ? null : uploadButton}
                  </Upload>
                </ImgCrop>
              </span>
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
              <span onClick={getUploadToken}>
                <Upload
                  action={QINIU_SERVER}
                  data={{
                    token: qiniuToken,
                    key: `video-${Date.parse(new Date())}`,
                  }}
                  listType="picture-card"
                  beforeUpload={getUploadToken}
                  showUploadList={false}
                  onChange={handleVidoChange}
                >
                  {fileVidoList[0] ? <img 
                    src={fileVidoList[0] ? BASE_QINIU_URL + fileVidoList[0].response.key : null}
                    alt="video"
                    style={{ width: '100%' }}
                  /> :  uploadButton}
                </Upload>
              </span>
            </>
          </Form.Item>
          <Divider>商品数量设置</Divider>
          <div style={{ marginBottom: 20, marginLeft: 250, marginTop: 20 }}>
            <Space size="large" style={{ marginLeft: 10 }}>
              <span>
                <FormItem
                  name="limit_total"
                  label="限购数量"
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
                <FormItem
                  name="min_sale"
                  label="起售数量"
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
                <FormItem
                  name="total"
                  label="库存数量"
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
          <Divider>编辑商品详情</Divider>
          <Form.Item {...EditorLayout}>
            <RichTextEditor subscribeRichText={subscribeRichText} defaultText={richTextContent} />
          </Form.Item>
          <Divider>其他属性</Divider>
          <Form.Item label=" " colon={false} className="goods-create-swtich-contianer">
            <Space size="middle">
              <span className="goods-create-swtich-item">

                <span>是否付款减库存：</span>
                <Form.Item
                  noStyle
                  name="paid_and_remove"
                  
                >
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked={storeageGoods.paid_and_remove}
                  />
                </Form.Item>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否显示库存：</span>
                <Form.Item noStyle name="show_total">
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked={storeageGoods.show_total}

                  />
                </Form.Item>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否支持换货：</span>
                <Form.Item noStyle name="exchange">
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked={storeageGoods.exchange}
                  />
                </Form.Item>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否支持七天无理由退货：</span>
                <Form.Item noStyle name="sale_return">
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked={storeageGoods.sale_return}
                  />
                </Form.Item>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否预售：</span>
                <Form.Item noStyle name="advance">
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked={storeageGoods.advance}

                  />
                </Form.Item>
              </span>
              <span className="goods-create-swtich-item">
                <span>是否上架：</span>
                <Form.Item noStyle name="on_sale">
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked={storeageGoods.on_sale}
                  />
                </Form.Item>
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
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否" 
                    defaultChecked={storeageGoods.limit}
                  />
                </Form.Item>
              </span>
            </Space>
          </Form.Item>
         
          <FormItem {...tailLayout}>
            <Button
              htmlType="submit"
              style={{
                margin: 20,
              }}
              icon={<PlusCircleTwoTone />}
            >
              下一步
            </Button>
            <Button
              onClick={onResetInfo}
              style={{
                margin: 20,
              }}
              icon={<StopTwoTone />}
            >
              重置
            </Button>

          </FormItem>
        </Form>
      </div>);
    } if (current === 1) {
      return (<>
        <div style={{ backgroundColor: 'white', padding: 20 }}> 
          <div className="specification-adj-form-container">
            <div style={{ marginLeft: 45, marginTop: 10, marginBottom: 20  }}>
              <Select
                onChange={selectTemplate}
                placeholder="选择规格模版"
                allowClear
                style={{ width: '8vw' }}
              >
                {(goodsModelsList || []).map((arr) => {
                  return  <Option value={arr.id} key={arr.id}>{arr.title}</Option>;
                })}
              </Select>
            </div>
            
            <Form
              onFinish={addSpecification}
              form={fromSpec}
            >
              <Form.List name="specification">
                {(fields) => {
                  return (
                    <div className="specification-adj-template">
                      {fields.map((field) => (
                        <>
                          <div>
                            {
            (((goodsModel[0] || []).template || []).filter((arr) => {
              return arr.use !== false;
            }) || []).map((tem) => {
              return <span>
                <span>
                  {tem.name}
                  :
                  {' '}
                </span>
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
                    style={{ width: '10vw', marginRight: 15, marginLeft: 10 }}
                  />
                </FormItem>
              </span>;
            })
          }
                          </div>
                        </>
                      ))}
                    </div>
                
                  );
                }}
              </Form.List>
              <Space size="large" style={{ marginBottom: 20 }}>
                <span>
                  <span>库存: </span>
                  <FormItem
                    name="total"
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
              
                    <InputNumber
                      className="specification-adj-normal"
                    />
                  </FormItem>
                </span> 
                <span>
                  <span>重量: </span>
                  <FormItem
                    name="weight"
              
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
              
                    <InputNumber className="specification-adj-normal" />
                  </FormItem>
                </span>
                <span>
                  <span>成本: </span>
                  <FormItem
                    name="cost_price"
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
              
                    <InputNumber
                      className="specification-adj-normal"
                      formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    />
                  </FormItem>
                </span>
                <span>
                  <span>价格: </span>
                  <FormItem
                    name="price"
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
             
                    <InputNumber
                      className="specification-adj-normal"
                      formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    />
                  </FormItem>
                </span>
              
              </Space>
              <FormItem>
                <span>优惠幅度: </span>
                <FormItem
                  name="reduced_price"
                  noStyle
                >
              
                  <InputNumber
                    disabled={!submitGoods.sale}
                    formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    style={{
                      width: '8vw', 
                      marginBottom: 10,
                      marginLeft: 10, 
                    }}
                  />
                </FormItem>
              </FormItem>
              <div>
                <Form.Item
                  label="规格例图"
                  rules={[
                    {
                    //required: true,
                    }
                  ]}
                  {...ModelListlayout}
                >
                  <>
                    <span onClick={getUploadToken}>
                      <ImgCrop grid>
                        <Upload
                          action={QINIU_SERVER}
                          data={{
                            token: qiniuToken,
                            key: `spec-${Date.parse(new Date())}`,
                          }}
                          listType="picture-card"
                          beforeUpload={getUploadToken}
                          showUploadList={false}
                          onPreview={handlePreview}
                          onChange={handleChange}
                        >
                          {fileList[0] ? <img 
                            src={BASE_QINIU_URL + fileList[0].response.key}
                            alt="pictures"
                            style={{ width: '100%' }}
                          /> :  uploadButton}
                        </Upload>
                      </ImgCrop>
                    </span>
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={() => setPreviewVisible(!previewVisible)}
                    >
                      <img style={{ width: '100%' }} src={previewImage} alt="previewImg" />
                    </Modal>
                  </>
                </Form.Item>
              </div>          
              <Button
                htmlType="submit"
                style={{
                  margin: 20,
                }}
                icon={<PlusCircleTwoTone />}
              >
                添加规格
              </Button>
              <Button
                onClick={onReset}
                style={{
                  margin: 20,
                }}
                icon={<StopTwoTone />}
              >
                重置
              </Button>
            </Form>
          </div>
          <Modal
            title="修改"
            visible={adjVisible}
            onOk={setAdjVis}
            onCancel={setAdjVis}
            width="50vw"
            footer={null}
            destroyOnClose
          >
            <Form
              onFinish={adjSpecification}
              form={formAdj}
              ref={formAdjRef}
            >
              <Form.List name="specification">
                {(fields) => {
                  return (
                    <div className="specification-adj-template">
                      {fields.map((field) => (
                        <>
                          <div>
                            {
           AdjSpecName.map((tem, index) => {
             return <span>
               <span>
                 {tem}
                 :
                 {' '}
               </span>
               <FormItem
                 {...field}
                 initialValue={Object.values(adjSpec.specification)[index]}
                 name={[field.name, `${tem}`]}
                 fieldKey={[[field.fieldKey, `${tem}`]]}
                 rules={[
                   {
                     //required: true,
                   }
                 ]}
                 noStyle
               >
                 <Input
                   style={{
                     width: '10vw', marginRight: 15, marginLeft: 10, marginBottom: 20, 
                   }}
                 />
               </FormItem>
             </span>;
           })
          }
                          </div>
                        </>
                      ))}
                    </div>
                
                  );
                }}
              </Form.List>
              <Space size="large" style={{ marginBottom: 20 }}>
                <span>
                  <span>库存: </span>
                  <FormItem
                    name="total"
                    initialValue={adjSpec.total}
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
              
                    <InputNumber
                      className="specification-adj-normal"
                    />
                  </FormItem>
                </span> 
                <span>
                  <span>重量: </span>
                  <FormItem
                    name="weight"
                    initialValue={adjSpec.weight}
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
              
                    <InputNumber className="specification-adj-normal" />
                  </FormItem>
                </span>
                <span>
                  <span>成本: </span>
                  <FormItem
                    name="cost_price"
                    initialValue={adjSpec.cost_price}
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
              
                    <InputNumber
                      className="specification-adj-normal"
                      formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    />
                  </FormItem>
                </span>
                <span>
                  <span>价格: </span>
                  <FormItem
                    name="price"
                    initialValue={adjSpec.price}
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                    noStyle
                  >
             
                    <InputNumber
                      className="specification-adj-normal"
                      formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    />
                  </FormItem>
                </span>
              
              </Space>
              <FormItem>
                <span>优惠幅度: </span>
                <FormItem
                  name="reduced_price"
                  initialValue={adjSpec.reduced_price}
                  noStyle
                >
              
                  <InputNumber
                    disabled={!submitGoods.sale}
                    formatter={(Goodvalues) => `¥ ${Goodvalues}`}
                    style={{
                      width: '8vw', 
                      marginBottom: 10,
                      marginLeft: 10, 
                    }}
                  />
                </FormItem>
              </FormItem>
              <div>
                <Form.Item
                //name="main_goods_video"
                  label="规格例图"
                  rules={[
                    {
                      //required: true,
                    }
                  ]}
                  {...ModelListlayout}
                >
                  <>
                    <span onClick={getUploadToken}>
                      <Upload
                        action={QINIU_SERVER}
                        data={{
                          token: qiniuToken,
                          key: `spec-${Date.parse(new Date())}`,
                        }}
                        listType="picture-card"
                        beforeUpload={getUploadToken}
                        showUploadList={false}
                        onPreview={handlePreview}
                        onChange={handleChangeAdj}
                      >
                        {adjFileList ? <img 
                          src={BASE_QINIU_URL + adjFileList}
                          alt="pictures"
                          style={{ width: '100%' }}
                        /> :  uploadButton}
                      </Upload>
                    </span>
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={() => setPreviewVisible(!previewVisible)}
                    >
                      <img style={{ width: '100%' }} src={previewImage} alt="previewImg" />
                    </Modal>
                  </>
                </Form.Item>
              </div>          
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  margin: 20,
                  marginLeft: 30,
                }}
                icon={<PlusCircleTwoTone />}
              >
                修改
              </Button>
            </Form>
          
          </Modal>
          ;
          <Divider>规格列表</Divider>
          <Table
            bordered
            columns={goodsColumns}
            dataSource={goodsDetails}
            style={{ paddingLeft: 20, paddingRight: 20 }}
          />

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Button onClick={submitSpc} type="primary">提交</Button>
          </div>
        </div>
      </>
      );
    }
    if (current === 2) {
      return (
        <Result
          icon={<SmileOutlined />}
          title="成功创建商品信息"
          extra={<Button type="primary" onClick={() => setCurrent(0)}>返回创建首页</Button>}
        />
      );
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
  goodsArea: get(goodsArea, 'info', []),
  goodsClassFather: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id === 0; }),
  goodsClassChild: get(goodsClass, 'tags', [])
    .filter((arr) => { return arr.parent_id !== 0; }),
  goodsModelsList: get(goodsModels, 'infos', ''),
  goodsModel: get(goodsModels, 'info', {}),
  goodId: CreateGoods.goodId,
  GoodsAreaTags: goodsArea.GoodsAreaTags,

}))(GoodsAddEditor);
