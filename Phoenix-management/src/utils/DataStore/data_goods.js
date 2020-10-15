export const dataGoodsName = [{ title: '库存', dataIndex: 'total', key: '库存' },
  { title: '重量', dataIndex: 'weight', key: '重量' }, 
  {
    title: '价格',
    dataIndex: 'price',
    key: '价格',
    render: (price) => {
      const tprice = price / 100;
      return (
        tprice
      );
    }, 
  },
  {
    title: '成本价',
    dataIndex: 'cost_price',
    key: '成本价',
    render: (price) => {
      const tprice = price / 100;
      return (
        tprice
      );
    }, 
  },
  {
    title: '优惠幅度',
    dataIndex: 'reduced_price',
    key: '优惠幅度',
    render: (price) => {
      const tprice = price / 100;
      return (
        tprice
      );
    },  
  }];

export const dataGoodsNameOut = [{ title: '库存', dataIndex: 'total', key: '库存' },
  { title: '重量', dataIndex: 'weight', key: '重量' }, 
  {
    title: '价格',
    dataIndex: 'price',
    key: '价格',
    render: (price) => {
      const tprice = price / 100;
      return (
        tprice
      );
    },  
  },
  {
    title: '成本价',
    dataIndex: 'cost_price',
    key: '成本价',
    render: (price) => {
      const tprice = price / 100;
      return (
        tprice
      );
    },  
  }];

export const getaways = [{ id: 1, name: '快递' }, { id: 2, name: '同城配送' }, { id: 4, name: '自取' }];
export const putaways = [{ id: 1, name: '立即上架' }, { id: 2, name: '自定义上架时间' }, { id: 3, name: '放入仓库暂不上架' }];
