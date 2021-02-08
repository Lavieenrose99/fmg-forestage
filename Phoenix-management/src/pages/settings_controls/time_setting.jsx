import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import request from '@/utils/request';
import {
  Card, Statistic, InputNumber, Modal, message 
} from 'antd';
import { IconFont } from '@/utils/DataStore/icon_set';
import  './time_setting.less';

const TimeSetting = () => {
  const [preSettingTime, setPreSettingTime] = useState({});
  const [changeTime, setChangeTime] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    request('/api.farm/global/set_time', {
      method: 'GET',
    }).then(
      (response) => {
        setPreSettingTime(response);
      }
    );
  }, []);
  return (
    <PageHeaderWrapper>
      <div className="site-card-border-less-wrapper"> 
        {' '}
        <Card
          title="未付款自动取消时间"
          className="time-setting-items"
          bordered={false}
          style={{ width: 300 }} 
          extra={<IconFont
            type="iconguanli"
            onClick={() => {
              setIsModalVisible(!isModalVisible);
              setChangeTime({ auto_cancel: preSettingTime.auto_cancel, name: '未付款自动取消时间' });
            }}
          />}
        >
          <Statistic
            title="时间（天）"
            prefix={<IconFont type="iconshijian1" />} 
            value={preSettingTime.auto_cancel / 3600}
            
          />
        </Card>
        <Card
          title="完成不能追评时间"
          className="time-setting-items"
          bordered={false}
          style={{ width: 300 }}
          extra={<IconFont
            type="iconguanli"
            onClick={() => {
              setIsModalVisible(!isModalVisible);
              setChangeTime({ no_second_comment: preSettingTime.no_second_comment, name: '完成不能追评时间' });
            }}
          />}
        >
          {' '}
          <Statistic
            title="时间（天）"
            prefix={<IconFont type="iconshijian1" />} 
            value={preSettingTime.no_second_comment / 3600}
            extra={<IconFont type="iconguanli" />}
          />
        </Card>
        <Card
          title="自取自动收货时间"
          className="time-setting-items"
          bordered={false}
          style={{ width: 300 }}
          extra={<IconFont
            type="iconguanli"
            onClick={() => {
              setIsModalVisible(!isModalVisible);
              setChangeTime({ pick_auto_get: preSettingTime.pick_auto_get, name: '自取自动收货时间' });
            }}
          />}
        >
          <Statistic
            title="时间（天）"
            prefix={<IconFont type="iconshijian1" />} 
            value={preSettingTime.pick_auto_get / 3600}
          />
        </Card>
        <Card
          title="待评价到已完成时间"
          className="time-setting-items"
          bordered={false}
          style={{ width: 300 }}
          extra={<IconFont
            type="iconguanli"
            onClick={() => {
              setIsModalVisible(!isModalVisible);
              setChangeTime({ to_over: preSettingTime.to_over, name: '待评价到已完成时间' });
            }}
          />}
        >
          <Statistic
            title="时间（天）"
            prefix={<IconFont type="iconshijian1" />}
            value={preSettingTime.to_over / 3600}
          />
        </Card>
        <Card
          title="发货自动收货时间"
          className="time-setting-items"
          bordered={false}
          style={{ width: 300 }}
          extra={<IconFont
            type="iconguanli"
            onClick={() => {
              setIsModalVisible(!isModalVisible);
              setChangeTime({ tran_auto_get: preSettingTime.tran_auto_get, name: '发货自动收货时间' });
            }}
          />}
        >
          <Statistic
            title="时间（天）"
            prefix={<IconFont type="iconshijian1" />} 
            value={preSettingTime.tran_auto_get / 3600}
            extra={<IconFont type="iconguanli" />}
          />
        </Card>
      </div>
      <Modal
        title={changeTime.name}
        visible={isModalVisible} 
        onOk={() => {
          Modal.confirm({
            title: '凤鸣谷',
            content: '确认修改吗',
            okText: '确认',
            onOk: () => {
              request('/api.farm/global/set_time', {
                method: 'POST',
                data: preSettingTime,
              }).then(
                (response) => {
                  if (response.status === 'success') {
                    message.info('修改成功');
                  } else {
                    message.error('’修改失败！');
                  }
                }
              ); 
              setIsModalVisible(false);
              setChangeTime({});
            },
            cancelText: '取消',
          });
        }}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <span>新时间:   </span>
          <InputNumber
            defaultValue={Object.values(changeTime)[0] / 3600} 
            onChange={(e) => {
              const name = Object.keys(changeTime)[0];
              changeTime[name] = e * 3600;
              const NewReslut = Object.assign(preSettingTime, changeTime);
              setPreSettingTime(NewReslut);
            }}
          />
        </div>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default TimeSetting;
