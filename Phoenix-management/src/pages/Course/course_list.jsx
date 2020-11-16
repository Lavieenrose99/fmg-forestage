import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import { get } from 'lodash';
import {
  Tag, Table, Modal, Space
} from 'antd';
import {
  
} from '@ant-design/icons';
import './course_list.less';

const CourseList = (props) => {
  const {
    fmgCourseList, couresTagsList,
    couresTypeList, goodsArea, 
  } = props;
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
      render: (text) => {
        return (
          <Space>
            <Tag color="#108ee9">
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
      <Table
        columns={courseList}
        dataSource={fmgCourseList}
      />
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
