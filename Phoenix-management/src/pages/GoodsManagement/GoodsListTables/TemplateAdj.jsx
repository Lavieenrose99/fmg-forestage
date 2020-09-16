/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import {
  Form, Input, Button, Select,
  Checkbox, InputNumber, DatePicker,
  Divider, Upload, Modal, Steps, Radio, Switch, Space, Table, Result
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { StopTwoTone, UploadOutlined, PlusCircleTwoTone  } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import request from '@/utils/request';
import PropTypes from 'prop-types';
import React, {
  useState, useEffect, useRef
} from 'react';
import { get } from 'lodash';
import  './index.less';

const ModelListlayout = {
  labelCol: {
    //offset: 1,
  },
};
const uploadButton = (
  <div>
    <div className="ant-upload-text">
      <UploadOutlined />
      上传
    </div>
  </div>
);

const TemplateAdj = (props) => {
  const {
    info, template, id, gid, ifSale,
  } = props;
  const [fromSpec] = Form.useForm();
  const [checkUse, setCheckUse] = useState(false);
  const [adjTem, setAdjTem] = useState(info);
  const [fileList, setFileList] = useState([]);
  const [qiniuToken, setQiniuToken] = useState('');
  const QINIU_SERVER = 'http://upload-z2.qiniup.com';
  const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
  useEffect(() => {
    fromSpec.setFieldsValue({
      specification: [''],
    });
  }, []);
  const ModelsColums = template.map((arr) => {
    return {
      title: arr,
      dataIndex: 'specification',
      key: arr,
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
  }, { title: '库存', dataIndex: 'total', key: '库存' },
  { title: '重量', dataIndex: 'weight', key: '重量' }, 
  { title: '价格', dataIndex: 'price', key: '价格' },
  { title: '成本价', dataIndex: 'cost_price', key: '成本价' },
  { title: '优惠幅度', dataIndex: 'reduced_price', key: '优惠幅度' }];
  const detailsNameOut = [{
    title: '规格',
    key: '规格',
    children: ModelsColums, 
  }, { title: '库存', dataIndex: 'total', key: '库存' },
  { title: '重量', dataIndex: 'weight', key: '重量' }, 
  { title: '价格', dataIndex: 'price', key: '价格' },
  { title: '成本价', dataIndex: 'cost_price', key: '成本价' }
  ];
  const onReset = () => {
    fromSpec.resetFields();
    fromSpec.setFieldsValue({
      specification: [''],
    });
  };
  const comfirmDelItem = (index) => {
    const data = adjTem;
    data.splice(index, 1);
    setAdjTem([...data]);
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
  const settingGoods = {
    title: '操作',
    //dataIndex: goodsColumns,
    render: (text, record, index) => (
      <>
        <Space size="large">
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
  const goodsColumns = ifSale 
    ? [...detailsName, IconColums, settingGoods] : [...detailsNameOut, IconColums, settingGoods];
  const addSpecification = (data) => {
    const spciArr = Object.values(data);
    const specification = spciArr[0][0];
    const picture = fileList[0].name;
    const specific = { specification, picture };
    const Finaldata = Object.assign(data, specific);
    fromSpec.resetFields();
    fromSpec.setFieldsValue({
      specification: [''],
    });
    setFileList([]);
    setAdjTem([...adjTem, Finaldata]);
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
  const subGoodsSpec = () => {
    props.dispatch({
      type: 'CreateGoods/adjustGoodsSpec',
      payload: {
        pid: gid,
        specification: adjTem,
        template_id: id,
      },
    });
    props.closeModel();
    setFileList([]);
  };

  const submitSpc = () => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认修改规格信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { subGoodsSpec(); },
    });
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
  return (
    <>
      <div className="specification-adj-form-container">
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
            template.map((tem) => {
              return <span>
                <span>
                  {tem}
                  :
                  {' '}
                </span>
                <Form.Item
                  {...field}
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
                    style={{ width: '10vw', marginRight: 15, marginLeft: 10 }}
                  />
                </Form.Item>
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
          <Space size="large" style={{ marginBottom: 15 }}>
            <span>
              <span>库存: </span>
              <FormItem
                name="total"
              //label="库存"
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
              
          </Space>
              
          <FormItem>
            <span>优惠幅度: </span>
            <FormItem
              name="reduced_price"
              noStyle
            >
              
              <InputNumber
                disabled={!ifSale}
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
                  <Upload
                    action={QINIU_SERVER}
                    data={{
                      token: qiniuToken,
                      key: `picture-${Date.parse(new Date())}`,
                    }}
                    listType="picture-card"
                    beforeUpload={getUploadToken}
                    fileList={fileList}
                    onChange={handleChange}
                  >
                    {uploadButton}
                  </Upload>
                </span>
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
      <Divider>规格列表</Divider>
      <Table
        columns={goodsColumns}
        dataSource={adjTem}
        style={{ paddingLeft: 20, paddingRight: 20 }}
      />
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Button
          type="primary"
          onClick={submitSpc}
          style={{
            margin: 20,
          }}
        >
          提交
        </Button>
      </div>
       
    </>
  );
};

export default  connect(({
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
  
}))(TemplateAdj);
