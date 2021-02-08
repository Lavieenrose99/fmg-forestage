import React, { useEffect, useState } from 'react';
import {
  Table, Input, Button, Space, Avatar, Select, Popover, Tag
} from 'antd';
import {
  RedoOutlined
} from '@ant-design/icons';
import { connect } from 'umi';
import { get } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SessionDetails } from '@/utils/Course/apply_session';
import { ApplyColumn } from '@/utils/Course/course_table.jsx';
import  CourseApplyDrawer   from '@/utils/Course/apply_details_drawer.jsx';
import PropTypes from 'prop-types';

const { Option } = Select;

const RefundCoureslist = (props) => {
  const {
    ApplycourseList, fmgCourseList, goodsArea,
    couresTagsList, couresTypeList, Account,
  } = props;
  //课程标签
  const [courseId, setCourseId] = useState('');
  const [applyer, setApplyer] = useState('');
  const [applyStatus, setApplyStatus] = useState(5);
  const [showCBillsDetails, setShowCBillsDetalis] = useState(false);
  const [cBillsInfos, setCBillsInfos] = useState({});
  useEffect(() => {
    props.dispatch({
      type: 'fmgCourse/fetchRealApplyCourseList',
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
              用户注销
            </span>
          </div>
        );
      },
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
    ...ApplyColumn,
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Tag
            color="#2db7f5"
            onClick={() => {
              setShowCBillsDetalis(true);
              setCBillsInfos(record);
            }}
          >
            查看详情
          </Tag>
        );
      },
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
      <CourseApplyDrawer
        show={showCBillsDetails}
        closeDrawer={setShowCBillsDetalis} 
        billsInfos={cBillsInfos}
      />
    </PageHeaderWrapper>
  );
};

RefundCoureslist.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodsArea: PropTypes.arrayOf({}),
  couresTagsList: PropTypes.arrayOf({}),
  couresTypeList: PropTypes.arrayOf({}),
};
RefundCoureslist.defaultProps = {
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
  ApplycourseList: get(fmgCourse, 'ApplyRealcourseList', []),
  couresTagsList: get(couresTags, 'tags', []),
  couresTypeList: get(couresTags, 'typeTags', []),
  goodsArea: get(goodsArea, 'info', []),
  Account: get(BillsListBack, 'Account', []),
}))(RefundCoureslist);
