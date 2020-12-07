import React from 'react';
import moment from 'moment';

export const SessionDetails = (props) => {
  const { infos } = props;
  return infos 
    ? <>
      <div>
        <span>开始时间:</span> 
        {' '}
        <span>
          {moment(infos.begin_time)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <div>
        <span>结束时间:</span> 
        {' '}
        <span>
          {moment(infos.end_time)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <div>
        <span>价格:</span> 
        {' '}
        <span>
          {infos.money}
        </span>
      </div>
      <div>
        <span>人数限制:</span> 
        {' '}
        <span>
          {infos.people_limit}
        </span>
      </div>
    </> : null;
};
//PreApplyCancel = 1  // 撤销
//NoApply   = 2  // 预报名
//Apply = 4 //已报名
export const PreApplyStatus = [{
  id: 1,
  name: '撤销',
}, {
  id: 2,
  name: '预报名',
}, {
  id: 4,
  name: '已报名',
}];
export const ApplyStatus = [
  {
    id: 1,
    name: '未支付',
  }, {
    id: 2,
    name: '已支付',
  }, {
    id: 4,
    name: '已取消',
  }
];
