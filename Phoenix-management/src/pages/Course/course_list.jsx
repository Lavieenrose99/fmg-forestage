/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, Link } from 'umi';
import { get } from 'lodash';
import {
  Tag, Table, Modal, Space, Input, Select, Button, Switch, List, Radio
} from 'antd';
import {
  RedoOutlined, PlusCircleTwoTone, MessageOutlined, LikeOutlined, StarOutlined
} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import  CourseDetails  from '@/utils/Course/Course_details_drawer.jsx';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import { QINIU_SERVER, BASE_QINIU_URL, pictureSize } 
  from '@/utils/Token';
import './course_list.less';

const { Option } = Select;
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const CourseList = (props) => {
  const {
    fmgCourseList, couresTagsList,
    couresTypeList, goodsArea, 
  } = props;
  const fmgCourseListFinal = fmgCourseList.map((arr, index) => {
    return { key: index, ...arr };
  });
  const [showWays, setShowWays] = useState(1);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectThings, setSelect] = useState({
    name: '', place_tag: '', course_tag: '', kind: '', crowd: '', is_put: '', 
  });
  const [details, setDetails] = useState({});
  const [ID, setID] = useState('');
  useEffect(() => {
    props.dispatch({
      type: 'fmgCourse/fetchCourseList',
      payload: { limit: 99, page: 1 },
    });
    props.dispatch({
      type: 'couresTags/fetchCourseTags',
      payload: { limit: 99, page: 1 },
    });
    props.dispatch({
      type: 'couresTags/fetchTypeCourseTags',
      payload: { limit: 99, page: 1 },
    });
    props.dispatch({
      type: 'goodsArea/fetchAreaTags',
      payload: { page: 1, limit: 99 },
    });
  }, []);
  const sendChange = () => {
    props.dispatch({
      type: 'fmgCourse/fetchCourseList',
      payload: { limit: 99, page: 1, ...selectThings }, 
    });
  };
  const courseList = [
    { title: '课程名', dataIndex: 'name' },
    {
      title: '课程标签',
      dataIndex: 'course_tag',
      key: 'name',
      render: (tag) => {
        //console.log(tag[0])
        let  name = '';
        if (tag.length > 0 && couresTagsList.length > 0) {
          name = (couresTagsList).find((info) => info.id === tag[0]).name;
        } else {
          name = '无'; 
        }
        return (
          <Tag>{name}</Tag>
        );
      }, 
    }, {
      title: '种类标签',
      dataIndex: 'kind',
      render: (tag) => {
      //console.log(tag[0])
        let  name = '';
        if (tag.length > 0 && couresTypeList.length > 0) {
          name = (couresTypeList).find((info) => info.id === tag[0]).name;
        } else {
          name = '无'; 
        }
        return (
          <Tag>{name}</Tag>
        );
      },  
    },
    {
      title: '属地标签',
      dataIndex: 'place_tag',
      key: 'id',
      render: (tag) => {
        //console.log(tag[0])
        let  name = '';
        if (tag.length > 0 && goodsArea.length > 0) {
          name = (goodsArea).find((info) => info.id === tag[0]).place;
        } else {
          name = '无'; 
        }
        return (
          <Tag>{name}</Tag>
        );
      },   
    }, { title: '课程天数', dataIndex: 'time' }, {
      title: '操作',
      key: 'id',
      render: (text) => {
        //console.log(text)
        return (
          <Space>
            <Tag
              color="#108ee9"
              onClick={() => {
                setDetails(text);
                setID(text.id);
                setDetailsVisible(!detailsVisible);
              }}
            >
              查看详情
            </Tag>
            <Tag
              color="#f50"
              onClick={() => {
                Modal.confirm({
                  mask: false,
                  title: '凤鸣谷',
                  content: '确认删除课程吗',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => { 
                    props.dispatch({
                      type: 'fmgCourse/DelCourse',
                      payload: text.id, 
                    });
                  },
                }); 
              }}
            >
              删除课程
            </Tag>
          </Space>
        );
      },
    }
  ];
 
  return (
    <>
      <PageHeaderWrapper>
        <div className="course-list-container">
          <Link to="/page/study/create_course">
            <Button
              type="primary"
              style={{
                margin: 20,
              }}
              icon={<PlusCircleTwoTone />}
            >
              添加课程
            </Button>
          </Link>
          <Radio.Group
            defaultValue={showWays}
            onChange={
               
                (e) => {
                  setShowWays(e.target.value); 
                }
} 
            style={{ float: 'right' }}
          >
            <Radio.Button value={1}>
              <IconFont type="iconliebiao" style={{ marginRight: 4 }} />
              列表
            </Radio.Button>
            <Radio.Button value={2}>
              <IconFont type="iconbiaoge" style={{ marginRight: 4 }} />
              表格
            </Radio.Button>
          </Radio.Group>
          <div className="goods-list-selector">
            <Space size="large">
              <span className="good-selector-items">
                <span>
                  课程标签: 
                </span>
                <Select
                  className="goods-selector-class"
                  onChange={(e) => {
                    const course_tag = [e];
                    const replace = Object.assign(selectThings, { course_tag });
                    setSelect(replace);
                    sendChange();
                  }}
                  placeholder="请选择课程标签"
                >
                  {
                  couresTagsList.map((tags) => {
                    return <Option value={tags.id}>{tags.name}</Option>;
                  })
              }
                </Select>
              </span>
              <span className="good-selector-items">
                <span>
                  种类标签: 
                </span>
                <Select
                  className="goods-selector-class"
                  onChange={(e) => {
                    const kind = [e];
                    const replace = Object.assign(selectThings, { kind });
                    setSelect(replace);
                    sendChange();
                  }}
                  placeholder="请选择种类标签"
                >
                  {
                  couresTypeList.map((tags) => {
                    return <Option value={tags.id}>{tags.name}</Option>;
                  })
              }
                </Select>
              </span>
              <span className="good-selector-items">
                <span>
                  属地标签: 
                </span>
                <Select
                  className="goods-selector-area"
                  onChange={(e) => {
                    const place_tag = [e];
                    const replace = Object.assign(selectThings, { place_tag });
                    setSelect(replace);
                    sendChange();
                  }}
                  placeholder="请选择属地标签"
                  //defaultValue={0}
                >
                  {
                  goodsArea.map((tags) => {
                    return <Option value={tags.id}>{tags.place}</Option>;
                  })
              }
                </Select>
              </span>
              <Button
                type="primary"
                style={{
                  marginLeft: 20,
                }}
                onClick={() => {
                  setSelect({
                    name: '', place_tag: '', course_tag: '', kind: '', crowd: '', is_put: '', 
                  });
                  sendChange();
                }}
                icon={<RedoOutlined />}
              >
                全部
              </Button>
            </Space>
          </div>
          <div className="goods-list-selector">
            <Space size="large">
              <span className="good-selector-items">
                <span>
                  课程名称: 
                </span>
                <Input
                  className="goods-selector-name" 
                  onChange={(e) => {
                    const name = e.target.value;
                    const replace = Object.assign(selectThings, { name });
                    setSelect(replace);
                    sendChange();
                  }}
                  placeholder="请输入该课程名称"
                />
              </span>
              <span className="good-selector-items">
                <span>
                  适合人群: 
                </span>
                <Input
                  className="goods-selector-name" 
                  onChange={(e) => {
                    const crowd = e.target.value;
                    const replace = Object.assign(selectThings, { crowd });
                    setSelect(replace);
                    sendChange();
                  }}
                  placeholder="请输入适合该课的人群"
                />
              </span>
              <span className="good-selector-items">
                <span>
                  是否上架: 
                </span>
                <Switch
                  //className="goods-selector-name" 
                  style={{ width: '3vw', marginLeft: 20 }}
                  checkedChildren="是" 
                  unCheckedChildren="否"
                  defaultChecked
                  onChange={(e) => {
                    const is_put = e;
                    const replace = Object.assign(selectThings, { is_put });
                    setSelect(replace);
                    sendChange();
                  }}
                 
                />
              </span>
            </Space>
          </div>
         
        </div>
        {
            showWays === 2
              ? <Table
                  columns={courseList}
                  dataSource={fmgCourseListFinal}
              />
              :        <div className="course-list-container">
                <List
                  className="fmg-course-list-item"
                  itemLayout="vertical"
                  size="small"
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 1,
                  }}
                  dataSource={fmgCourseList}
                  renderItem={(item) => {
                    const courseTag = {
                      type: '',
                      area: '',
                      class: '',
                    };
                    if (item.kind.length > 0 && couresTypeList.length > 0) {
                      courseTag.type = (couresTypeList)
                        .find((info) => info.id === item.kind[0]).name;
                    } else {
                      courseTag.type = '无'; 
                    }
                    if (item.place_tag.length > 0 && goodsArea.length > 0) {
                      courseTag.area = (goodsArea)
                        .find((info) => info.id === item.place_tag[0]).place;
                    } else {
                      courseTag.area = '无'; 
                    }
                    if (item.course_tag.length > 0 && couresTagsList.length > 0) {
                      courseTag.class = (couresTagsList)
                        .find((info) => info.id === item.course_tag[0]).name;
                    } else {
                      courseTag.class = '无'; 
                    }
              
                    return (
                      <List.Item
                        key={item.title}
                        actions={[
                          <span
                            onClick={() => {
                              setDetails(item);
                              setID(item.id);
                              setDetailsVisible(!detailsVisible);
                            }}
                          >
                            <IconFont 
                              style={{ marginRight: 4 }}
                              type="iconxiangqingchakan"
                            />
                            课程详情
                          </span>,
                          <span onClick={() => {
                            Modal.confirm({
                              mask: false,
                              title: '凤鸣谷',
                              content: '确认删除课程吗',
                              okText: '确认',
                              cancelText: '取消',
                              onOk: () => { 
                                props.dispatch({
                                  type: 'fmgCourse/DelCourse',
                                  payload: item.id, 
                                });
                              },
                            }); 
                          }}
                          >
                            <IconFont 
                              style={{ marginRight: 4 }}
                              type="iconshanchu"
                            />
                            删除
                          </span>,
                          <>
                            <Tag color="blue">{courseTag.class}</Tag>
                            <Tag color="magenta">{courseTag.type}</Tag>
                            <Tag color="gold">{courseTag.area}</Tag>
                          </>

                        ]}
                        extra={
                          <img
                            width={200}
                            height={120}
                            alt="logo"
                            src={BASE_QINIU_URL + item.cover}
                          />
        }
                      >
                        <List.Item.Meta
                          title={<a href={item.href}>{item.name}</a>}
                          description={item.describe}
                        />
                        <div>
                          <span>适合人群: </span>
                          {item.crowd}
                        </div>
                      </List.Item>
                    ); 
                  }}
                />
              </div>
}
        <CourseDetails
          show={detailsVisible} 
          changeStaus={setDetailsVisible}
          id={ID}
          detailsInfo={details}
          couresTypeList={couresTypeList}
          couresTagsList={couresTagsList}
          goodsArea={goodsArea}
        />
      </PageHeaderWrapper>
    </>
  );
};

CourseList.propTypes = {
  fmgCourseList: PropTypes.arrayOf({}),
};
CourseList.defaultProps = {
  fmgCourseList: [],
};

export default  connect(({
  fmgCourse,
  couresTags,
  goodsArea,
}) => ({
  fmgCourseList: get(fmgCourse, 'courseList', []),
  couresTagsList: get(couresTags, 'tags', []),
  couresTypeList: get(couresTags, 'typeTags', []),
  goodsArea: get(goodsArea, 'info', []),
}))(CourseList);
