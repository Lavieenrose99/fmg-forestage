import React, { PureComponent } from 'react';
import { Tag, Divider, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import RollingPictures from './rolling_picture_setting';

class RollingsIndex extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper>
        <RollingPictures />
      </PageHeaderWrapper>
    );
  }
}

export default RollingsIndex;
