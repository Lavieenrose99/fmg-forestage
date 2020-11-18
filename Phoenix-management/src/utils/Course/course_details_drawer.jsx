/* eslint-disable camelcase */
import React, {
  useState, useEffect, useRef
} from 'react';
import {
  Form, Input, Button, Select,
  InputNumber, DatePicker, notification,
  Divider, Upload, Modal, Steps, Radio, Switch,
  Space, Table, Result, PageHeader, Checkbox, Row, Col,
  Drawer
} from 'antd';
import PropTypes from 'prop-types';
import { QINIU_SERVER, BASE_QINIU_URL } 
  from '@/utils/Token';
import {
  UploadOutlined, SmileOutlined, StopTwoTone, PlusCircleTwoTone 
} from '@ant-design/icons';
import moment  from 'moment';
import { get } from 'lodash';
import { connect } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
import request from '@/utils/request';
import {
  couseSession 
} from '@/utils/DataStore/course_table';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import RichTextEditor from '../RichTextEditor.jsx';
import { filterHTMLTag } from '../adjust_picture';
import { EditorLayout, uploadButton, layoutCourse } from '../Layout/basic_layout.jsx';

const { Option } = Select;  
const { Step } = Steps;

const CourseDetails = (props) => {
  const {
    show, changeStaus, detailsInfo, couresTypeList, id,
    couresTagsList,
    goodsArea, 
  } = props;
  const PFile = {
    url: BASE_QINIU_URL + detailsInfo.cover,
    uid: 11,
    name: detailsInfo.cover,
    status: 'done', 
  }; 
  const [form] = Form.useForm();
  const [fromSpec] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [qiniuToken, setQiniuToken] = useState('');
  const [session, setSession] = useState('');
  const [fileList, setFileList] = useState();
  const [richTextContent, setRichTextContent] = useState('');
  const [metionThings, setMetionThings] = useState('');
  const [courseArrange, setCourseArrange] = useState('');
  const [basicInfoOfCourse, setBasicInfoOfCourse] = useState({});
  const [handleVisible, setHandleVisible] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [is_put, setIs_put] = useState('');
  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        name: (detailsInfo.name ?? ''),
        small_name: detailsInfo.small_name,
        describe: detailsInfo.describe,
        feature: detailsInfo.feature,
        crowd: detailsInfo.crowd,
        attention: detailsInfo.attention,
        plan: detailsInfo.plan,
        place_tag: detailsInfo.place_tag,
        course_tag: detailsInfo.course_tag,
        kind: detailsInfo.kind,
        time: detailsInfo.time,
        begin_time: moment(moment(detailsInfo.advance_time)
          .format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm'),
        end_time: moment(moment(detailsInfo.putaway_time)
          .format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm'),
      });
    }
    const fmgCourseListSession = detailsInfo.session 
      ? detailsInfo.session.map((arr, index) => {
        return { ID: index, ...arr };
      }) : null;
    setCourseArrange(detailsInfo.plan);
    setMetionThings(detailsInfo.attention);
    setRichTextContent(detailsInfo.detail);
    setIs_put(detailsInfo.is_put);
    setSession(fmgCourseListSession);
    setFileList([PFile]);
  }, [detailsInfo]);
  const subscribeRichText = (text) => {
    setRichTextContent(text);
  };
  const subscribeMetionStaff = (text) => {
    setMetionThings(text);
  };
  const subscribeCourseArrange = (text) => {
    setCourseArrange(text);
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
  const onFinish = (values) => {
    const begin_time =  moment(values.begin_time).valueOf();
    const end_time = moment(values.end_time).valueOf();
    const cover = fileList[0].name;
    const detail = filterHTMLTag(richTextContent);
    const attention = filterHTMLTag(metionThings);
    const plan = filterHTMLTag(courseArrange);
    const basicInfoRaw = {
      begin_time,
      end_time,
      cover,
      detail,
      attention,
      plan,
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
    setSession([...preSession, sessionItem]);
  };
  const handleCourseInfo = () => {
    const courseInfoRaw = { session, ...basicInfoOfCourse };
    setCourseInfo(courseInfoRaw);
    setHandleVisible(true);
  };
  const comfirmHandleCourse = () => {
    const finalData = { ...courseInfo, is_put };
    console.log(finalData);
    props.dispatch({
      type: 'fmgCourse/AdjCourse',
      payload: { finalData, cid: id },
      
    });
  };
 
  return (
    <>
      <Drawer
        placement="top"
        height="100%"
        visible={show} 
        destroyOnClose
        forceRender
        onClose={() => {
          changeStaus(!show);
        }}
      >
        <PageHeader
          style={{ backgroundColor: 'white', marginBottom: 30 }}
          className="goods-publish-all-pages"
          title="创建课程"
          footer={<Steps
            current={current}
            className="site-navigation-steps"
          >
            <Step title="基本信息" description="完善课程基础信息" onClick={() => { setCurrent(0); }} />
            <Step title="场次安排" description="完善课程场次信息" onClick={() => { setCurrent(1); }} />
          </Steps>}
        /> 
         
        <div className="steps-content">
          {
    (() => {
      if (current === 0) {
        return (<div className="goods-basic-publish-contianer">
          <Divider>课程基本信息</Divider>
          <Form
            {...layoutCourse}
            form={form}
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
              <Col offset={4} span={6}>
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
                      <Upload
                        action={QINIU_SERVER}
                        data={{
                          token: qiniuToken,
                          key: `picture-${Date.parse(new Date())}`,
                        }}
                        listType="picture-card"
                        beforeUpload={getUploadToken}
                        fileList={fileList}
                        //onRemove={onFileList}
                        onChange={handleChange}
                      >
                        {uploadButton}
                      </Upload>
                    </span>
                  </>
             
                </Form.Item>
              </Col>
            </Row>
            <Divider>编辑课程详情</Divider>
            <Form.Item {...EditorLayout}>
              <RichTextEditor
                subscribeRichText={subscribeRichText} 
                defaultText={richTextContent}
              />
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
                  //onClick={onResetInfo}
                  type="primary"
                  style={{
                    margin: 20,
                  }}
                  icon={<StopTwoTone />}
                >
                  重置
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
              <Button type="primary" onClick={handleCourseInfo}>修改</Button>
            </Space>
          </div>
          <Modal
            mask={false}
            title="凤鸣谷"
            visible={handleVisible}
            onOk={comfirmHandleCourse}
            onCancel={() => { setHandleVisible(false); }}
            okText="修改"
            cancelText="取消"
          >
            <div style={{ textAlign: 'center' }}>
              <Space>
                <strong>
                  是否发布: 
                </strong>
                <Switch
                  defaultChecked={is_put} 
                  onChange={(e) => { setIs_put(e); }}
                />
              </Space>
            </div>
            
          </Modal>
        </>
        );
      }
    })()
  }
        </div>
      </Drawer>
    </>
  );
};

CourseDetails.propTypes = {
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
CourseDetails.defaultProps = {
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
}) => ({
    
}))(CourseDetails);
