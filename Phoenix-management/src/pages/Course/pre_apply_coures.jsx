import React, { useEffect, useState } from 'react';
import {
  Table, Input, Button, Space, Avatar, Select, Popover
} from 'antd';
import {
  RedoOutlined, PlusCircleTwoTone
} from '@ant-design/icons';
import { connect } from 'umi';
import { get } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SessionDetails, PreApplyStatus } from '@/utils/Course/apply_session';
import moment from 'moment';
import PropTypes from 'prop-types';

const { Option } = Select;

const PreApplyCoureslist = (props) => {
  const {
    ApplycourseList, fmgCourseList, goodsArea,
    couresTagsList, couresTypeList, Account,
  } = props;
  //课程标签
  const [courseId, setCourseId] = useState('');
  const [applyer, setApplyer] = useState('');
  const [applyStatus, setApplyStatus] = useState('');
  useEffect(() => {
    props.dispatch({
      type: 'fmgCourse/fetchApplyCourseList',
      payload: {
        page: 1,
        limit: 99,
        course_id: courseId,
        author_id: applyer,
        status: applyStatus, 
      }, 
    });
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
  const preApplyTable = [
    { 
      title: '报名用户',
      dataIndex: 'account_id',
      width: '15%',
      key: 'id',
      render: (id) => {
        const user = Account.find((item) => item.id === id)
          ? Account.find((item) => item.id === id) : null;
        if (user) {
          return (
            <div className="fmg-refund-user-container">
              <span>
                <Avatar src={user.avator} />
              </span>
              <span style={{ marginLeft: 10 }}>
                {user.nickname}
              </span>
            </div>
          );
        }
        return (
          <div className="fmg-refund-user-container">
            <span>
              <Avatar>没注册</Avatar>
            </span>
            <span style={{ marginLeft: 10 }}>
              无该用户
            </span>
          </div>
        );
      },
    },
    { 
      title: '联系人', dataIndex: 'name', width: '10%',
    },
    {
      title: '报名课程',
      dataIndex: 'course_id',
      width: '15%',
      render: (data, record) => {
        const courseName = fmgCourseList.find((item) => item.id === data)
          ? fmgCourseList.find((item) => item.id === data).name : '课程已删除';
        const sessionInfo = fmgCourseList.find((item) => item.id === data)
          ? fmgCourseList.find((item) => item.id === data).session
            .find((item) => item.id === record.session_id) : null;
    
        return (
          <Popover content={<SessionDetails infos={sessionInfo} />} title="场次详情">
            <a>
              {`${courseName}第${sessionInfo ? sessionInfo.id : null}期`}
            </a>
          </Popover>
        );
      },
    },
    {
      title: '报名人数', dataIndex: 'people',
    },
    {
      title: '电话号码', dataIndex: 'phone',
    },
   
    {
      title: '报名时间',
      dataIndex: 'create_time',
      render: (time) => (
        <>
          <span>
            {moment(time * 1000)
              .format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </>
      ),
    }
  ];
  return (
    <PageHeaderWrapper>
      <div className="goods-list-container">
        <div className="goods-list-selector">
          <Space size="large">
            <span className="good-selector-items">
              <span>
                报名人: 
              </span>
              <Input
                className="goods-selector-name"
                onChange={
                (e) => {
                  const { id } = Account.find((item) => item.nickname === e.target.value)
                    ? Account.find((item) => item.nickname === e.target.value) : { id: 0 };
                  setApplyer(id);
                  props.dispatch({
                    type: 'fmgCourse/fetchApplyCourseList',
                    payload: {
                      page: 1,
                      limit: 99,
                      course_id: courseId,
                      author_id: id,
                      status: applyStatus, 
                    }, 
                  });
                }
              }
              />
            </span>
            <span className="good-selector-items">
              <span>
                报名课程: 
              </span>
              <Select
                className="goods-selector-name"
                onChange={
                (e) => {
                  setCourseId(e);
                  props.dispatch({
                    type: 'fmgCourse/fetchApplyCourseList',
                    payload: {
                      page: 1,
                      limit: 99,
                      course_id: e,
                      author_id: applyer,
                      status: applyStatus, 
                    }, 
                  });
                }
              }
              >
                {
                  fmgCourseList.map((tags) => {
                    return (
                      <Option value={tags.id}>{tags.name}</Option>
                    );
                  })
                }
              </Select>
            </span>
            <span className="good-selector-items">
              <span>
                报名状态: 
              </span>
              <Select
                className="goods-selector-name"
                onChange={
                (e) => {
                  setApplyStatus(e);
                  props.dispatch({
                    type: 'fmgCourse/fetchApplyCourseList',
                    payload: {
                      page: 1,
                      limit: 99,
                      course_id: courseId,
                      author_id: applyer,
                      status: e, 
                    }, 
                  });
                }
              }
              
              >
                {
                  PreApplyStatus.map((tags) => {
                    return (
                      <Option value={tags.id}>{tags.name}</Option>
                    );
                  })
                }
              </Select>
            </span>
            <Button
              type="primary"
              onClick={
                () => {
                  setCourseId();
                  setApplyStatus();
                  setApplyer();
                  props.dispatch({
                    type: 'fmgCourse/fetchApplyCourseList',
                    payload: {
                      page: 1,
                      limit: 99,
                      course_id: '',
                      author_id: '',
                      status: '', 
                    }, 
                  });
                }
              }
              style={{
                marginLeft: 20,
              }} 
              icon={<RedoOutlined />}
            >
              全部
            </Button>
          </Space>
        </div>
      </div>
      <Table columns={preApplyTable} dataSource={ApplycourseList} />
    </PageHeaderWrapper>
  );
};

PreApplyCoureslist.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodsArea: PropTypes.arrayOf({}),
  couresTagsList: PropTypes.arrayOf({}),
  couresTypeList: PropTypes.arrayOf({}),
};
PreApplyCoureslist.defaultProps = {
  goodsArea: [],
  couresTagsList: [],
  couresTypeList: [],
  
};
export default connect(({
  fmgCourse,
  couresTags,
  goodsArea,
  BillsListBack,
}) => ({
  fmgCourseList: get(fmgCourse, 'courseList', []),
  ApplycourseList: get(fmgCourse, 'ApplycourseList', []),
  couresTagsList: get(couresTags, 'tags', []),
  couresTypeList: get(couresTags, 'typeTags', []),
  goodsArea: get(goodsArea, 'info', []),
  Account: get(BillsListBack, 'Account', []),
}))(PreApplyCoureslist);
