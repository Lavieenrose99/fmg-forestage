import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, Link } from 'umi';
import { get } from 'lodash';
import {
  Tag, Table, Modal, Space, Input, Select, Button
} from 'antd';
import {
  RedoOutlined, PlusCircleTwoTone
} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import  CourseDetails  from '@/utils/Course/Course_details_drawer.jsx';
import './course_list.less';

const { Option } = Select;

const CourseList = (props) => {
  const {
    fmgCourseList, couresTagsList,
    couresTypeList, goodsArea, 
  } = props;
  const fmgCourseListFinal = fmgCourseList.map((arr, index) => {
    return { key: index, ...arr };
  });
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [details, setDetails] = useState({});
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
        <div className="goods-list-container">
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
          <div className="goods-list-selector">
            <Space size="large">
              <span className="good-selector-items">
                <span>
                  课程名称: 
                </span>
                <Input
                  className="goods-selector-name" 
                  //onChange={this.MainTextOnChange}
                  placeholder="请输入该课程名称"
                />
              </span>
              <span className="good-selector-items">
                <span>
                  课程标签: 
                </span>
                <Select
                  className="goods-selector-class"
                  //onChange={this.selectClassItem}
                  placeholder="请选择课程标签"
                >
                  {
            
              }
                </Select>
              </span>
              <span className="good-selector-items">
                <span>
                  种类标签: 
                </span>
                <Select
                  className="goods-selector-class"
                  //onChange={this.selectClassItem}
                  placeholder="请选择种类标签"
                >
                  {
            
              }
                </Select>
              </span>
              <span className="good-selector-items">
                <span>
                  属地标签: 
                </span>
                <Select
                  className="goods-selector-area"
                  //onChange={this.selectAreaItem}
                  placeholder="请选择属地标签"
                  defaultValue={0}
                />
              </span>
              <Button
                type="primary"
                //onClick={this.reloadSelector}
                icon={<RedoOutlined />}
              >
                全部
              </Button>
            </Space>
          </div>
        </div>
        <Table
          columns={courseList}
          dataSource={fmgCourseListFinal}
        />
        <CourseDetails
          show={detailsVisible} 
          changeStaus={setDetailsVisible}
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
