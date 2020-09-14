import React, { PureComponent } from 'react';
import {
  Tag, Divider, Tabs, PageHeader 
} from 'antd';
import GoodsAreaTags from './GoodsAreaTags.jsx';
import GoodSaleTags from './GoodsSaleTags.jsx';

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
        <PageHeader 
          style={{ backgroundColor: 'white' }}
          title="商品标签管理"
          footer={<Tabs defaultActiveKey="1">
            <TabPane tab="商品属地标签" key="1">
              <GoodsAreaTags />
            </TabPane>
            <TabPane tab="商品销售标签" key="2">
              <GoodSaleTags />
            </TabPane>
          </Tabs>}
        />
        
      </>
    );
  }
}

export default GoodsTagsList;
