export const ApiCode = {
  customer: '4E59BDEDD9D6279BCE70939B5989DF54',
  key: 'flHKGrTQ6370',
  secret: '20502db04dcd47a7873cd3db944798a6',
  userid: '0cc87e6ac8e04d29bd07058ce2f50ce4',
};

export const expressCompany = [
  { eid: 'zhongtong', name: '中通' },
  { eid: 'yuantong', name: '圆通' },
  { eid: 'shentong', name: '申通' },
  { eid: 'yunda', name: '韵达' },
  { eid: 'tiantian', name: '天天' },
  { eid: 'huitongkuaidi', name: '百世(汇通)' },
  { eid: 'zaijisong', name: '宅急送' },
  { eid: 'jiexpress', name: '急兔快递' }

];
export const expressList =  [{
  title: '订单号',
  dataIndex: 'id',
  key: 'id',
},
{
  title: '快递单号',
  dataIndex: 'delivry_sheet_code',
  key: 'delivry_sheet_code',
},
{
  title: '快递公司',
  dataIndex: 'delivry_corp_name',
  key: 'delivry_corp_name',
  render: (text) => {
    const num = expressCompany.map((data) => {
      return data.eid;
    }).indexOf(text);
    return (
      expressCompany[num] ? expressCompany[num].name : null 
    );
  },
},
{
  title: '订单状态',
  key: 'invoice_status',
  dataIndex: 'invoice_status',
  render: (text) => {
    let t = '';
    if (text === '1') {
      t = '未支付';
    } else if (text === 2) {
      t = '待发货';
    } else if (text === 3) {
      t = '待收获';
    } else if (text === 4) {
      t = '待评价';
    } else if (text === 5) {
      t = '已完成';
    }
    return (
      t
    );
  },
}];
