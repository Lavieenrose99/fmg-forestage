import React, { PureComponent } from 'react';
import {
  Tag, Divider, Tabs, PageHeader 
} from 'antd';
import RollingPictures from './rolling_picture_setting';

class RollingsIndex extends PureComponent {
  render() {
    return (
      <PageHeader
        style={{ backgroundColor: 'white' }} 
        title="轮播图管理"
        subTitle="宣传图片将展示到首页轮播"
        footer={<RollingPictures />}
      />
    );
  }
}

export default RollingsIndex;
