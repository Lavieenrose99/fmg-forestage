/* eslint-disable camelcase */
import {
  Form, Input, Button, Select,
  InputNumber, DatePicker, notification,
  Divider, Upload, Modal, Steps, Radio, Switch,
  Space, Table, Result, PageHeader, Checkbox, Row, Col
} from 'antd';
import {
  SmileOutlined, StopTwoTone, PlusCircleTwoTone 
} from '@ant-design/icons';
import moment  from 'moment';
import { get } from 'lodash';
import React, {
  useState, useEffect, useRef
} from 'react';
import { connect } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
import request from '@/utils/request';
import {
  couseSession 
} from '@/utils/DataStore/course_table';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import PropTypes from 'prop-types';
import { layoutCourse, EditorLayout, uploadButton } from '@/utils/Layout/basic_layout.jsx';
import { QINIU_SERVER, BASE_QINIU_URL, pictureSize } 
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
  
const { Option } = Select;
  
const { Step } = Steps;
  
export const GoodsAddEditor = (props) => {
  const {
    goodsArea, goodsSale,
    couresTagsList, couresTypeList,
    goodsModelsList, goodsModel,
  } = props;
  const [form] = Form.useForm();
  const [fromSpec] = Form.useForm();
  const [previewImage, setPreviewImage] = useState('');
  const [current, setCurrent] = useState(0);
  const formRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [is_put, setIs_put] = useState(true);
  const [handleVisible, setHandleVisible] = useState(false);
  const [qiniuToken, setQiniuToken] = useState('');
  const [richTextContent, setRichTextContent] = useState(localStorage.getItem('RichText'));
  const [metionThings, setMetionThings] = useState(localStorage.getItem('MetionStaff'));
  const [courseArrange, setCourseArrange] = useState(localStorage.getItem('arrange'));
  const [fileList, setFileList] = useState(([JSON.parse(localStorage.getItem('FileList'))] ?? []));
  const [fileListAlot, setFileListAlot] = useState((JSON.parse(localStorage.getItem('FileListAlot')) ?? []));
  const [storeageGoods, setStoreageGoods] = useState((JSON.parse(localStorage.getItem('storage')) ?? {}));
  const [basicInfoOfCourse, setBasicInfoOfCourse] = useState({});
  const [courseInfo, setCourseInfo] = useState({});
  const [session, SetSession] = useState([]);

  const onResetPicture = () => {
    localStorage.removeItem('FileListAlot');
    setFileListAlot([]);
  };
    
  const onResetInfo = () => {
    localStorage.removeItem('FileList');
    localStorage.removeItem('storage');
    localStorage.removeItem('arrange');
    localStorage.removeItem('MetionStaff');
    localStorage.removeItem('RichText'); 
    localStorage.removeItem('FileListAlot');
    setFileList([]);
    setCourseArrange('');
    setCourseInfo('');
    setRichTextContent('');
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
  //看到其他的都要加true啊要不gettoken没用
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
  const onFileListAlot = (values) => {
    fileListAlot.splice(values.uid, 1);
    return false;
  };
  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };
    
  const subscribeRichText = (text) => {
    localStorage.setItem('RichText', text);
    setRichTextContent(text);
  };
  const subscribeMetionStaff = (text) => {
    localStorage.setItem('MetionStaff', text);
    setMetionThings(text);
  };
  const subscribeCourseArrange = (text) => {
    localStorage.setItem('arrange', text);
    setCourseArrange(text);
  };
    
  useEffect(() => {
    fromSpec.setFieldsValue({
      specification: [''],
    });
  }, []);
  
  useEffect(() => {
    props.dispatch({
      type: 'couresTags/fetchCourseTags',
      payload: { limit: 10, page: 1 },
    });
    props.dispatch({
      type: 'couresTags/fetchTypeCourseTags',
      payload: { limit: 10, page: 1 },
    });
    props.dispatch({
      type: 'goodsArea/fetchAreaTags',
      payload: { page: 1, limit: 99 },
    });
  }, []);
  const subscriptions = (values) => {
    if (values) {
      const begin_time =  moment(values.begin_time).valueOf();
      const end_time = moment(values.end_time).valueOf();
      const timestap = {
        begin_time, end_time,
      };
      const Goods = storeageGoods;
      const newGoods = Object.assign(Goods, values, timestap);
      localStorage.setItem('storage', JSON.stringify(newGoods));
    }
  };
  
  useEffect(() => {
    subscriptions();
    formRef.current.setFieldsValue({
      name: (storeageGoods.name ?? ''),
      small_name: storeageGoods.small_name,
      describe: storeageGoods.describe,
      feature: storeageGoods.feature,
      crowd: storeageGoods.crowd,
      attention: storeageGoods.attention,
      plan: storeageGoods.plan,
      place_tag: storeageGoods.place_tag,
      course_tag: storeageGoods.course_tag,
      kind: storeageGoods.kind,
      time: storeageGoods.time,
      begin_time: moment(moment(storeageGoods.advance_time)
        .format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm'),
      end_time: moment(moment(storeageGoods.putaway_time)
        .format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm'),
    });
  }, []);
 
  const onFinish = (values) => {
    const begin_time =  moment(values.begin_time).valueOf();
    const end_time = moment(values.end_time).valueOf();
    const kind = [values.kind];
    const place_tag = [values.place_tag];
    const course_tag = [values.course_tag];
    const cover = fileList[0].response.key;
    const detail = filterHTMLTag(richTextContent);
    const attention = filterHTMLTag(metionThings);
    const plan = filterHTMLTag(courseArrange);
    const pictures = fileListAlot.map((arrFiles, index) => {
      return { picture: arrFiles.judege, order: index };
    });
    const basicInfoRaw = {
      begin_time,
      end_time,
      kind,
      place_tag,
      cover,
      detail,
      course_tag,
      attention,
      plan,
      pictures,
    };
    const basicInfoUnion = Object.assign(values, basicInfoRaw);
    setBasicInfoOfCourse(basicInfoUnion);
    setCurrent(current + 1);
  };
  const addSession = (info) => {
    const begin_time =  moment(info.begin_time).valueOf();
    const end_time = moment(info.end_time).valueOf();
    const ID = session.length + 1;
    const seTime = { begin_time, end_time, ID };
    const sessionItem = Object.assign(info, seTime);
    const preSession = session;
    SetSession([...preSession, sessionItem]);
  };
  const handleCourseInfo = () => {
    const courseInfoRaw = { session, ...basicInfoOfCourse };
    setCourseInfo(courseInfoRaw);
    setHandleVisible(true);
  };
  const comfirmHandleCourse = () => {
    const finalData = { ...courseInfo, is_put };
    props.dispatch({
      type: 'fmgCourse/createCourse',
      payload: finalData,
    });
    setCurrent(2);
  };
  return (
    <>
      <PageHeader
        style={{ backgroundColor: 'white', marginBottom: 30 }}
        className="goods-publish-all-pages"
        breadcrumb={{ routes }}
        title="创建课程"
        footer={<Steps
          current={current}
          className="site-navigation-steps"
        >
          <Step title="基本信息" description="完善课程基础信息" />
          <Step title="场次安排" description="完善课程场次信息" />
          <Step title="成功提交" description="课程成功" />
        </Steps>}
      /> 
         
      <div className="steps-content">
        {
    (() => {
      if (current === 0) {
        return (<div className="goods-basic-publish-contianer">
          <Divider>课程基本信息</Divider>
          <Form
            onValuesChange={subscriptions}
            {...layoutCourse}
            form={form}
            ref={formRef}
            name="control-hooks"
            onFinish={onFinish}
            labelAlign="left"
          >
            <Row gutter={[20, 5]} style={{ marginTop: '20px' }}>
              <Col offset={2} span={17}>
                <Form.Item
                  name="name"
                  label="课程名称"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Input
                    placeholder="请输入课程名称"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col offset={2} span={17}>
                <Form.Item
                  name="small_name"
                  label="二级标题" 
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Input
                    placeholder="请输入课程名称"
                  />
              
                </Form.Item>
              </Col>
            </Row>
       
            <Row>
              <Col offset={2} span={17}>
                <Form.Item
                  name="describe"
                  label="课程简介"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <TextArea
                    placeholder="简单描述课程"
                  />
                </Form.Item>
              </Col>
              
            </Row>
            <Row>
              <Col offset={2} span={17}>
                <Form.Item
                  name="crowd"
                  label="适合人群"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <TextArea
                    placeholder="列出符合该课程的人群"
                  />
                </Form.Item>
              </Col>
              
            </Row>
            <Row gutter={[20, 5]}>
              <Col offset={4} span={5}>
                <Form.Item
                  name="place_tag"
                  label="课程分区"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    placeholder="选择课程属地"
                    allowClear
                  >
                    {goodsArea.map((arr) => {
                      return  <Option value={arr.id} key={arr.id}>{arr.place}</Option>;
                    })}
  
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5} pull={1}>
                <Form.Item
                  name="course_tag"
                  label="课程标签"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    placeholder="选择课程标签"
                    allowClear
                  >
                    {couresTagsList.map((arr) => {
                      return  <Option value={arr.id} key={arr.id}>{arr.name}</Option>;
                    })}
  
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5} pull={2}>
                <Form.Item
                  name="kind"
                  label="课程种类"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    placeholder="选择课程种类"
                    allowClear
                  >
                    {couresTypeList.map((arr) => {
                      return  <Option value={arr.id} key={arr.id}>{arr.name}</Option>;
                    })}
  
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={4} offset={4} style={{ paddingLeft: 10 }}>
                <Form.Item
                  name="time"
                  label="课程天数"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={7} pull={1}>
                <Form.Item
                  name="begin_time"
                  label="开始时间"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              </Col>
              <Col span={7} pull={3}>
                <Form.Item
                  name="end_time"
                  label="结束时间"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              </Col>
             
            </Row>
            
            <Row>
              <Col offset={4} span={5}>
                <Form.Item
                  name="cover"
                  label="课程封面"
                  rules={[
                    {
                      //required: true,
                    }
                  ]}
                >
                  <>
                    <span onClick={getUploadToken}>
                      <ImgCrop aspect={pictureSize.rolling} grid>
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
              </Col>
              <Col pull={2} span={12}>
                <>
                  <Form.Item
                    label="课程轮播图"
                    rules={[
                      {
                      //required: true,
                      }
                    ]}
                  >
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
                        onRemove={onFileListAlot}
                        onPreview={handlePreview}
                        onChange={handleChangeAlot}
                      >
                        {fileListAlot.length >= 5 ? null : uploadButton}
                      </Upload>
                    </span>
                  </Form.Item>
                </>
         
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={() => setPreviewVisible(!previewVisible)}
                >
                  <img style={{ width: '100%' }} src={previewImage} alt="previewImg" />
                </Modal>
              </Col>
            </Row>
            <Divider>编辑课程详情</Divider>
            <Form.Item {...EditorLayout}>
              <RichTextEditor subscribeRichText={subscribeRichText} defaultText={richTextContent} />
            </Form.Item>
            <Divider>编辑注意事项</Divider>
            <Form.Item {...EditorLayout}>
              <RichTextEditor
                subscribeRichText={subscribeMetionStaff} 
                defaultText={metionThings}
              />
            </Form.Item>
            <Divider>编辑课程安排</Divider>
            <Form.Item {...EditorLayout}>
              <RichTextEditor
                subscribeRichText={subscribeCourseArrange} 
                defaultText={courseArrange}
              />
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{
                    margin: 20,
                  }}
                  icon={<PlusCircleTwoTone />}
                >
                  下一步
                </Button>
                <Button
                  onClick={onResetInfo}
                  type="primary"
                  style={{
                    margin: 20,
                  }}
                  icon={<StopTwoTone />}
                >
                  重置
                </Button>
                <Button
                  onClick={onResetPicture}
                  type="primary"
                  style={{
                    margin: 20,
                  }}
                  icon={<StopTwoTone />}
                >
                  重置轮播
                </Button>
              </Space>
            </div>
          </Form>
        </div>);
      } if (current === 1) {
        return (<>
          <Form
            onFinish={addSession}
            form={fromSpec}
          >
            <Row style={{ backgroundColor: '#FFFFFF' }} gutter={[10, 40]}>
              <Col offset={2} span={6}>
                <Form.Item
                  name="begin_time"
                  label="课程开始时间"
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
              </Col>
              <Col pull={1} span={6}>
                <Form.Item
                  name="end_time"
                  label="课程结束时间"
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
              </Col>
              <Col pull={2} span={3}>
                <Form.Item
                  name="people_limit"
                  label="人数限制"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col pull={2} span={3}>
                <Form.Item
                  name="money"
                  label="场次价格"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <InputNumber 
                    formatter={(Sesionvalues) => `¥ ${Sesionvalues}`}
                    parser={(Sesionvalues) => Sesionvalues.replace(/¥ \s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col pull={2}>
                <Button
                  type="primary"
                  size="middle"
                  shape="circle"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: 'wheat',
                    colorRendering: 'auto', 
                  }}
                  htmlType="submit"
                  icon={<IconFont type="icontianjia1" />}
                />
              </Col>
            </Row>
            
          </Form>
          <Table
            bordered
            columns={couseSession}
            dataSource={session}
          />
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Space>
              <Button type="primary" onClick={() => { setCurrent(current - 1); }}>上一步</Button>
              <Button type="primary" onClick={handleCourseInfo}>提交</Button>
            </Space>
          </div>
          <Modal
            mask={false}
            title="凤鸣谷"
            visible={handleVisible}
            onOk={comfirmHandleCourse}
            onCancel={() => { setHandleVisible(false); }}
            okText="提交"
            cancelText="取消"
          >
            <div style={{ textAlign: 'center' }}>
              <Space>
                <strong>
                  是否发布: 
                </strong>
                <Switch defaultChecked={is_put} onChange={(e) => { setIs_put(e); }} />
              </Space>
            </div>
            
          </Modal>
        </>
        );
      }
      if (current === 2) {
        return (
          <Result
            icon={<SmileOutlined />}
            title="成功创建课程信息"
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
  couresTagsList: PropTypes.arrayOf({}),
  couresTypeList: PropTypes.arrayOf({}),
};
GoodsAddEditor.defaultProps = {
  goodId: 0,
  goodsArea: [],
  goodsSale: [],
  goodsClassFather: [],
  goodsClassChild: [],
  goodsModelsList: [],
  couresTagsList: [],
  couresTypeList: [],
  
};
  
export default connect(({
  goodsArea, goodsSale, goodsClass,
  goodsModels, CreateGoods, couresTags,
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
  couresTagsList: get(couresTags, 'tags', []),
  couresTypeList: get(couresTags, 'typeTags', []),
  
}))(GoodsAddEditor);
