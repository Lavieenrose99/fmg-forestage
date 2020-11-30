import React from 'react';
import moment from 'moment';

export const SessionDetails = (props) => {
  const { infos } = props;
  return (
    <>
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
    </>
  );
};
