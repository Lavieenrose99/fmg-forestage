import React, { PureComponent } from 'react';
import { Tag, Divider, Tabs } from 'antd';
import GoodsAreaTags from './GoodsAreaTags.jsx';
import GoodSaleTags from './GoodsSaleTags.jsx';
import GoodClassTags from './GoodsClassTags.jsx';

const { TabPane } = Tabs;

class GoodsTagsList extends PureComponent {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="商品属地标签" key="1">
            <GoodsAreaTags />
          </TabPane>
          <TabPane tab="商品销售标签" key="2">
            <GoodSaleTags />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default GoodsTagsList;
