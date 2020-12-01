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
  dataIndex: 'order_code',
  key: 'id',
},
{
  title: '快递单号',
  dataIndex: 'delivery_sheet_code',
  key: 'delivry_sheet_code',
},
{
  title: '快递公司',
  dataIndex: 'delivery_corp_name',
  key: 'delivry_corp_name',
  render: (text) => {
    const num = expressCompany.map((data) => {
      return data.eid;
    }).indexOf(text);
    return (
      expressCompany[num] ? expressCompany[num].name : null 
    );
  },
}
];
