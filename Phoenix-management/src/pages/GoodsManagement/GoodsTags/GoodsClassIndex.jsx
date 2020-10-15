import React, { PureComponent } from 'react';
import { PageHeader, Tabs } from 'antd';
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
        <PageHeader 
          title="商品类别管理"
          style={{ backgroundColor: 'white' }}
          footer={<Tabs defaultActiveKey="1">
            <TabPane tab="商品类别列表" key="1">
              <GoodsClassList />
            </TabPane>
            <TabPane tab="类别标签管理" key="2">
              <GoodsTagsList />
            </TabPane>
          </Tabs>}
        />
        
      </>
    );
  }
}

export default GoodsClassIndex;
