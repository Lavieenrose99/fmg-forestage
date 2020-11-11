/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import { get } from 'lodash';
import {
  Card, Pagination, Col, Row, Tabs, Button,
  Modal, Input, Radio, notification, Alert
} from 'antd';
import {
  PlusCircleTwoTone
} from '@ant-design/icons';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import './course_tags_setting.less';

const gridStyle = {
  width: '13%',
  textAlign: 'center',
  margin: '10px',
  backgroundColor: '#FFEBCD',
};
const { TabPane } = Tabs;
const CourseList = (props) => {
  const { couresTagsList, couresTypeList } = props;
  const [changeVisible, setChangeVisible] = useState(false);
  const [tagsName, setTagsName] = useState('');
  const [adjId, setAdjId] = useState(0);
  const [tagsType, setTagsType] = useState(0);
  const [markAdj, setMarkAdj] = useState(0);
  useEffect(() => {
    props.dispatch({
      type: 'couresTags/fetchCourseTags',
      payload: { limit: 10, page: 1 },
    });
    props.dispatch({
      type: 'couresTags/fetchTypeCourseTags',
      payload: { limit: 10, page: 1 },
    });
  }, []);
  const handleTags = () => {
    if (tagsType === 1 && markAdj === 0) {
      props.dispatch({
        type: 'couresTags/setCourseTags',
        payload: {  query: { limit: 10, page: 1 }, name: tagsName },
      });
    } else if (tagsType === 2 && markAdj === 0) {
      props.dispatch({
        type: 'couresTags/setTypeCourseTags',
        payload: {  query: { limit: 10, page: 1 }, name: tagsName },
      });
    } else if (markAdj === 1) {
      props.dispatch({
        type: 'couresTags/adjCourseTags',
        payload: {  query: { limit: 10, page: 1 }, name: tagsName, tid: adjId  },
      });
    } else if (markAdj === 2) {
      props.dispatch({
        type: 'couresTags/adjTypeCourseTags',
        payload: {  query: { limit: 10, page: 1 }, name: tagsName, tid: adjId  },
      });
    } else {
      notification.info({
        message: '凤鸣谷',
        description:
          '请选择标签类型',
        placement: 'topRight',
      });
    }
    setMarkAdj(0);
    setTagsName('');
    setTagsType(0);
  };
  const comfirmHandleTag = () => {
    if (markAdj === 0) {
      Modal.confirm({
        mask: false,
        title: '凤鸣谷',
        content: '确认创建标签吗',
        okText: '确认',
        cancelText: '取消',
        onOk: () => { handleTags(); },
      }); 
    } else {
      Modal.confirm({
        mask: false,
        title: '凤鸣谷',
        content: '确认修改」标签吗',
        okText: '确认',
        cancelText: '取消',
        onOk: () => { handleTags(); },
      });
    }
  };
  
  return (
    <>
      <Alert
        //style={{ display: 'inline-block', marginLeft: 1000 }}
        message="小贴士"
        description="右键鼠标就可以对标签修改哦   "
        type="info"
        closable
        showIcon
      />
      <Tabs
        tabBarExtraContent={<Button
          onClick={() => setChangeVisible(true)}
          type="primary"
          style={{
            position: 'relative',
            right: '20px',
          }}
          icon={<PlusCircleTwoTone />}
        >
          添加标签
        </Button>}
        defaultActiveKey="1"
        centered
        size="large"
        className="course-tags-container" 
        tabBarStyle={{ backgroundColor: '#F5F5F5' }}
      >
        <TabPane
          key="1"
          tab={<span>
            <IconFont type="iconkecheng" />
            课程标签
          </span>}
        >
          <Card
            bordered={false} 
          >
            {
                couresTagsList.map((tags) => {
                  return <Card.Grid
                    style={gridStyle}
                    onContextMenu={
                    () => {
                      setChangeVisible(true),
                      setTagsName(tags.name),
                      setAdjId(tags.id),
                      setTagsType(1);
                      setMarkAdj(1);
                    }
                  }
                  >
                    <>
                      <span className="gird-tag-name-item">
                        {tags.name}
                      </span>
                      <IconFont
                        type="iconshanchu" 
                        className="grid-tag-name-icon"
                        onClick={() => {
                          Modal.confirm({
                            mask: false,
                            title: '凤鸣谷',
                            content: '确认删除标签吗',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => { 
                              props.dispatch({
                                type: 'couresTags/delCourseTags',
                                payload: {  query: { limit: 10, page: 1 }, tid: tags.id },
                              });
                            },
                          });
                        }}
                      />
                    </>
                  </Card.Grid>;
                })
            }
          </Card>
        </TabPane>
        <TabPane
          key="2"
          tab={<span>
            <IconFont type="iconzhonglei" />
            种类标签
          </span>}
        >
          <Card 
            bordered={false}
          >
            {
                couresTypeList.map((tags) => {
                  return <Card.Grid
                    style={gridStyle}
                    onContextMenu={
                    () => {
                      setChangeVisible(true),
                      setTagsName(tags.name),
                      setAdjId(tags.id),
                      setTagsType(2);
                      setMarkAdj(2);
                    }
                  }
                  >
                    <>
                      <span className="gird-tag-name-item">
                        {tags.name}
                      </span>
                      <IconFont
                        type="iconshanchu"
                        className="grid-tag-name-icon" 
                        onClick={() => {
                          Modal.confirm({
                            mask: false,
                            title: '凤鸣谷',
                            content: '确认删除标签吗',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => { 
                              props.dispatch({
                                type: 'couresTags/delTypeCourseTags',
                                payload: {  query: { limit: 10, page: 1 }, tid: tags.id },
                              });
                            },
                          });
                        }}
                      />
                    </>
                  </Card.Grid>;
                })
            }
          </Card>
        </TabPane>
      </Tabs>
      <Modal
        mask={false}
        title="凤鸣谷"
        visible={changeVisible}
        onOk={comfirmHandleTag}
        onCancel={() => { setChangeVisible(false); }}
        okText="提交"
        cancelText="取消"
      >
        <Row gutter={[16, 16]}>
          <Col offset={4} span={4} className="course-tags-span-item">
            <span>标签名称: </span>
          </Col>
          <Col>
            <Input
              span={8}
              value={tagsName}
              onChange={(e) => { setTagsName(e.target.value); }} 
              placeholder="请输入标签名称"
            />
          </Col>
        </Row>
        <Row>
          <Col offset={4}>
            <Radio.Group 
              onChange={(e) => { setTagsType(e.target.value); }}
              value={tagsType}
            >
              <Radio value={1}>课程标签</Radio>
              <Radio value={2}>类型标签</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

CourseList.propTypes = {
  couresTagsList: PropTypes.arrayOf({}),
  couresTypeList: PropTypes.arrayOf({}),
};
CourseList.defaultProps = {
  couresTagsList: [],
  couresTypeList: [],
};
export default  connect(({
  couresTags,
}) => ({
  couresTagsList: get(couresTags, 'tags', []),
  couresTypeList: get(couresTags, 'typeTags', []),
}))(CourseList);
