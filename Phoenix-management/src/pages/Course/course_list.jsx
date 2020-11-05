import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import { get } from 'lodash';
import {
  Card, Avatar, Col, Row 
} from 'antd';
import {
  EditOutlined, EllipsisOutlined, SettingOutlined, InfoCircleFilled 
} from '@ant-design/icons';
import './course_list.less';

const { Meta } = Card;
const CourseList = (props) => {
  const { fmgCourseList } = props;
  console.log(fmgCourseList);
  console.log(props);
  useEffect(() => {
    props.dispatch({
      type: 'fmgCourse/fetchCourseList',
      payload: { limit: 10, page: 1 },
    });
  }, []);
  return (
    <Row gutter={[16, 80]} wrap>
      {
        fmgCourseList.map((list) => {
          return <Col span={6}>
            <Card
              hoverable
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="http://qiniu.daosuan.net/picture-1604559696000"
                />
    }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />
              ]}
            >
              <>
                <strong>适合人群：</strong>
                <p style={{ display: 'inline' }}>{list.crowd}</p>
              </>
              <Meta
                avatar={<Avatar src="http://qiniu.daosuan.net/picture-1604559696000" />}
                title={list.name}
                description={list.describe}
              />
            </Card>
          </Col>;
        })
      }
    </Row>
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
