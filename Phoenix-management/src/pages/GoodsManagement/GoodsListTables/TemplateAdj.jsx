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

const ModelListlayout = {
  labelCol: {
    offset: 8,
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
    info, template, id, gid, 
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
  const comfirmDelItem = (index) => {
    if (index === 0) {
      const data = [];
      setAdjTem(data);
    } else {
      const data = adjTem.splice(index, 1);
      setAdjTem(data);
    }
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
      <div style={{ textAlign: 'center' }}>
        <img
          src={pictures ? BASE_QINIU_URL + pictures : null}
          alt={pictures} 
          style={{ width: 30, height: 30  }}
        />
      </div>
    ),
  };
  const goodsColumns = [...detailsName, IconColums, settingGoods];
  const addSpecification = (data) => {
    const spciArr = Object.values(data);
    const specification = spciArr[0][0];
    const picture = fileList[0].name;
    const specific = { specification, picture };
    const Finaldata = Object.assign(data, specific);
   
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
      <div style={{ textAlign: 'center', backgroundColor: 'white' }}>
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
            template.map((tem) => {
              return <FormItem
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
                  addonBefore={['', tem]} 
                  style={{ width: '14vw', marginBottom: 10, marginRight: 10 }}
                />
              </FormItem>;
            })
          }
                      </div>
                    </>
                  ))}
                </div>
                
              );
            }}
          </Form.List>
          <Divider plain orientation="left" className="goods-models-normal-settings">常规设置</Divider>
          <Space size="large" style={{ marginBottom: 20 }}>
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
              
                <InputNumber style={{ width: '10vw', marginBottom: 10 }} />
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
             
                <InputNumber style={{ width: '10vw', marginBottom: 10 }} />
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
              
                <InputNumber style={{ width: '10vw', marginBottom: 10 }} />
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
              
                <InputNumber style={{ width: '10vw', marginBottom: 10 }} />
              </FormItem>
            </span>
              
          </Space>
          <div style={{ textAlign: 'center' }}>
            <span>是否优惠: </span>
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              checked={checkUse} 
              onChange={() => { setCheckUse(!checkUse); }}
              style={{ marginRight: 10 }}
            />
            <span>优惠幅度: </span>
            <FormItem
              name="reduced_price"
              rules={[
                {
                  //required: true,
                }
              ]}
              noStyle
            >
              
              <InputNumber disabled={!checkUse} style={{ width: '12vw', marginBottom: 10 }} />
            </FormItem>
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
              //showUploadList={false}
                    onChange={handleChange}
                  >
                    {uploadButton}
                  </Upload>
                </span>
              </>
       
            </Form.Item>
          </div>
          
          <Divider />
           
          <Button style={{ marginBottom: 10 }} htmlType="submit">添加</Button>
        </Form>
      </div>
      <Divider>规格列表</Divider>
      <Table
        columns={goodsColumns}
        dataSource={adjTem}
        style={{ paddingLeft: 20, paddingRight: 20 }}
      />
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Button onClick={submitSpc} type="primary">提交</Button>
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
