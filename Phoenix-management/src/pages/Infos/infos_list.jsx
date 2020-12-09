import React, { useState, useEffect } from 'react';
import {
  Tag, Table, Modal, Space, Input, Select, Button, Switch, List, Radio
} from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { get } from 'lodash';
import {
  PlusCircleTwoTone
} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {  MockInfosTags } from '@/utils/Express/mock_data';
import { IconFont } from '@/utils/DataStore/icon_set.js';
import { BASE_QINIU_URL } 
  from '@/utils/Token';
import { filterHTMLStr } from '../../utils/adjust_picture';
import FmgInfoCreator  from  './infos_create.jsx';
import FmgInfoChange from './infos_change.jsx';
import FmgInfosTagsCreator from './infos_tags.jsx';
import './infos_list.less';

const InfosList = (props) => {
  const { InfosList, TagsList } = props;
  const [infosTagsChecked, setInfosTagsChecked] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addInfosTags, setAddInfosTags] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeItem, setChangeItem] = useState({});
  useEffect(() => {
    props.dispatch({
      type: 'fmgInfos/fetchInfosList',
      payload: { limit: 99, page: 1 },
    });
    props.dispatch({
      type: 'fmgInfos/fetchInfosTagsList',
      payload: { limit: 99, page: 1 },
    });
  }, []);
  return (
    <PageHeaderWrapper>
      <Button
        type="primary"
        style={{
          margin: 20,
        }}
        onClick={() => {
          setShowAddModal(true);
        }}
        icon={<PlusCircleTwoTone />}
      >
        添加资讯
      </Button>
      <div className="Goods-Class-Tags-selector">
        <IconFont
          type="icontianjia1"
          className="info-plus-icon"
          onClick={() => {
            setAddInfosTags(true);
          }}
        />
          
        {
         
          <Tag.CheckableTag 
            onClick={() => setInfosTagsChecked(0)}
            checked={infosTagsChecked === 0}
          >
            全部
          </Tag.CheckableTag>
}
        {
          MockInfosTags.map((arr) => {
            return <Tag.CheckableTag
              checked={infosTagsChecked === arr.id}
              onChange={() => {
                setInfosTagsChecked(arr.id); 
              }}
            >
              {
         arr.name
}
            </Tag.CheckableTag>; 
          })
      
}
       
      </div>
      <div className="fmg-infos-container">
        <List
          className="fmg-infos-items"
          itemLayout="vertical"
          size="default"
          pagination={{
            onChange: (page) => {
            },
            pageSize: 5,
          }}
          dataSource={InfosList}
          footer={
            <div>
              <b>凤鸣谷</b>
            </div>
    }
          renderItem={(item) => (
            <List.Item
              className="fmg-infos-item"
              key={item.title}
              actions={[
                <IconFont 
                  style={{ marginRight: 10 }}
                  type="iconxiangqingchakan"
                  onClick={() => {
                    setChangeItem(item);
                    setShowChangeModal(true);
                  }}
                />,
                <IconFont
                  type="iconshanchu"
                  style={{ margin: 10 }}
                  onClick={
                () => {
                  Modal.confirm({
                    mask: false,
                    title: '凤鸣谷',
                    content: '确认删除资讯吗',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                      props.dispatch({
                        type: 'fmgInfos/DelInfos',
                        payload: item.id,
                      }); 
                    },
                  }); 
                }
            }
                />
           
              ]}
              extra={
                <>
                  <Space size="large">
          
                    <img
                      style={{ marginTop: 20 }}
                      width={180}
                      height={120}
                      alt="logo"
                      src={item.cover ? BASE_QINIU_URL + item.cover
                        : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'}
                    />
                    <span>
                      {moment(item.create_time * 1000)
                        .format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                    <Tag color="red">热门</Tag>
                    <div style={{ textAlign: 'right' }} />
                  </Space>
                 
                </>
        }
            >
              <List.Item.Meta
                className="fmg-infos-item-meta"
                title={<a href={item.href}>{item.title}</a>}
                description={<span
                  className="info-show-text"
                  onClick={() => {
                    setChangeItem(item);
                    setShowChangeModal(true);
                  }}
                >
                  {
                  filterHTMLStr(item.content)
}
                </span>}
              />
            </List.Item>
          )}
        />
      </div>
      <FmgInfoCreator show={showAddModal} closeInfosModel={setShowAddModal} />
      <FmgInfoChange
        show={showChangeModal} 
        closeInfosModel={setShowChangeModal}
        infos={changeItem}
      />
      <FmgInfosTagsCreator showModal={addInfosTags} close={setAddInfosTags} />
    </PageHeaderWrapper>
  );
};

export default connect(({ fmgInfos }) => ({
  InfosList: get(fmgInfos, 'InfosList', []),
  TagsList: get(fmgInfos, 'TagsInfosList', []), 
}))(InfosList);
