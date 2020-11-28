import React, { useEffect, useState } from 'react';
import {
  Table, Input, Button, Space, Tag, DatePicker, Modal, Select, Popover
} from 'antd';
import moment from 'moment';
import {
  RedoOutlined, PlusCircleTwoTone
} from '@ant-design/icons';
import { connect } from 'umi';
import { get } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { render } from 'react-dom';

const { Option } = Select;

const SessionDetails = (props) => {
  const { infos } = props;
  return (
    <>
      <div>
        <span>开始时间:</span> 
        {' '}
        <span>
          {moment(infos.begin_time)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <div>
        <span>结束时间:</span> 
        {' '}
        <span>
          {moment(infos.end_time)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <div>
        <span>价格:</span> 
        {' '}
        <span>
          {infos.money}
        </span>
      </div>
      <div>
        <span>人数限制:</span> 
        {' '}
        <span>
          {infos.people_limit}
        </span>
      </div>
    </>
  );
};
const PreApplyCoureslist = (props) => {
  const { ApplycourseList, fmgCourseList } = props;
  console.log(ApplycourseList, fmgCourseList);

  useEffect(() => {
    props.dispatch({
      type: 'fmgCourse/fetchApplyCourseList',
      payload: { page: 1, limit: 99 }, 
    });
    props.dispatch({
      type: 'fmgCourse/fetchCourseList',
      payload: { limit: 99, page: 1 },
    });
  }, []);
  const preApplyTable = [
    { 
      title: '报名用户', dataIndex: 'account_id', 
    },
    { 
      title: '联系人', dataIndex: 'name', 
    },
    {
      title: '报名课程',
      dataIndex: 'course_id',
      render: (data, record) => {
        const courseName = fmgCourseList.find((item) => item.id === data)
          ? fmgCourseList.find((item) => item.id === data).name : '课程已删除';
        const sessionInfo = fmgCourseList.find((item) => item.id === data)
          ? fmgCourseList.find((item) => item.id === data).session
            .find((item) => item.id === record.session_id) : null;
    
        return (
          <Popover content={<SessionDetails infos={sessionInfo} />} title="场次详情">
            <a>
              {`${courseName}第${sessionInfo.id}期`}
            </a>
          </Popover>
        );
      },
    }, 
    {
      title: '电话号码', dataIndex: 'phone',
    },
    {
      title: '报名人数', dataIndex: 'people',
    }
  ];
  return (
    <PageHeaderWrapper>
      <div className="goods-list-container">
        <div className="goods-list-selector">
          <Space size="large">
            <span className="good-selector-items">
              <span>
                课程标签: 
              </span>
              <Input className="goods-selector-name" />
            </span>
            <span className="good-selector-items">
              <span>
                种类标签: 
              </span>
              <Input className="goods-selector-name" />
            </span>
            <span className="good-selector-items">
              <span>
                属地标签: 
              </span>
              <Input className="goods-selector-name" />
            </span>
            <Button
              type="primary"
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

export default connect(({
  fmgCourse,
}) => ({
  fmgCourseList: get(fmgCourse, 'courseList', []),
  ApplycourseList: get(fmgCourse, 'ApplycourseList', []),
}))(PreApplyCoureslist);
