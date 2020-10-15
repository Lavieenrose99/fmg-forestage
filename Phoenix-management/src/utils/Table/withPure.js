import { Table } from 'antd';
import { Component } from 'react';

const withPure = (Comp) => {
  return class PureTable extends Component {
    shouldComponentUpdate(nextProps, nextState) {
      //--在这里控制
      return true;
    }

    render() {
      return super.render();
    }
  };
};
export default withPure(Table);
