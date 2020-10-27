import React from 'react';
import { Line } from '@ant-design/charts';

const DateLineChart = (props) => {
  const { dateAmount, timeLine } = props;
  const datalist = timeLine.map((time, index) => {
    return { 日期: time, 销售额: dateAmount[index] / 100 };
  });
  const config = {
    data: datalist,
    xField: '日期',
    yField: '销售额',
    smooth: true,
    
    style: {
      height: '40vh',
    },
    lineStyle: {
      lineWidth: 3,
    },
    textStyle: {
      fontSize: 24,
    },
    label: {
      style: {
        fill: 'grey',
        fontSize: 12
      },
      //rotate: true
    },
    meta: {
      value: {
        max: 2000,
      },
    },
  };
  return <Line {...config}  />;
};

export default DateLineChart;
