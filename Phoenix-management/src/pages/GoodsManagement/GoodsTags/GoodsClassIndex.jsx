import React, { PureComponent } from 'react';
import { Tag, Divider, Tabs } from 'antd';
import GoodsClassList from './GoodsClassList';
import GoodsTagsList from './GoodsClassTags';

const { TabPane } = Tabs;

class GoodsClassIndex extends PureComponent {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="商品类别列表" key="1">
            <GoodsClassList />
          </TabPane>
          <TabPane tab="类别标签管理" key="2">
            <GoodsTagsList />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default GoodsClassIndex;
