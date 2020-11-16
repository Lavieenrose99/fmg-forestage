/*
 * @Author: your name
 * @Date: 2020-11-15 18:07:11
 * @LastEditTime: 2020-11-15 18:08:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/utils/noused_code_store.js
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import { get } from 'lodash';
import {
  Card, Pagination, Col, Row 
} from 'antd';
import {
  EditOutlined, EllipsisOutlined, SettingOutlined, InfoCircleFilled 
} from '@ant-design/icons';
import './course_list.less';

const { Meta } = Card;
const CourseList = (props) => {
  const { fmgCourseList } = props;
  useEffect(() => {
    props.dispatch({
      type: 'fmgCourse/fetchCourseList',
      payload: { limit: 99, page: 1 },
    });
  }, []);
  //console.log(props)
  return (
    <>
      <Row gutter={[16, 80]} wrap>
        {
        fmgCourseList.map((list) => {
          return <Col span={6}>
            <Card
              title={<div style={{ textAlign: 'center' }}>{list.name}</div>}
              hoverable
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="http://qiniu.daosuan.net/picture-1604563323000"
                />
    }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />
              ]}
            >
              {/* <Meta
                // avatar={<Avatar src="http://qiniu.daosuan.net/picture-1604559696000" />}
                title={list.name}
                description={<strong>{list.describe}</strong>}
              /> */}
              <>
                <Row gutter={[16, 16]} wrap>
                  <Col>
                    <strong>适合人群：</strong>
                    <strong style={{ display: 'inline' }}>{list.crowd}</strong>
                  </Col>
                  <Col>
                    <strong>课程时长：</strong>
                    <strong style={{ display: 'inline' }}>{`${list.time} 天`}</strong>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <strong>课程简介：</strong>
                    <p style={{ display: 'inline-flex' }}>{list.describe}</p>
                  </Col>
                </Row>
              </>
            </Card>
          </Col>;
        })
      }
      </Row>
      <Pagination defaultCurrent={1} total={50} />
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
}) => ({
  fmgCourseList: get(fmgCourse, 'courseList', []),
}))(CourseList);
