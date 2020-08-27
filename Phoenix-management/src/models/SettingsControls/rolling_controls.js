import { message } from 'antd';
import { get } from 'lodash';
import {
  setRollingPictures
} from '@/services/SettingsControls/rolling_controls';
  
const RollingPictures = {
  namespace: 'rollingPicture',
  state: {
  },
  effects: {
    * createRollingPicture({ payload }, { call, put }) {
        console.log(payload)
      const result = yield call(setRollingPictures, payload);
      if (result) {
        yield message.success('添加轮播图成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
   
  },
  reducers: {
   
  },
};
export default RollingPictures;
