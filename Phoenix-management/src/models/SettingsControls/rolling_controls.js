import { message } from 'antd';
import { get } from 'lodash';
import {
  setRollingPictures,
  getRollingPictures,
  mGetRollingPictures

} from '@/services/SettingsControls/rolling_controls';
  
const RollingPictures = {
  namespace: 'rollingPicture',
  state: {
  },
  effects: {
    * fetchRollings({ payload }, { call, put }) {
      const response = yield call(getRollingPictures, payload);
      const { slideshow } = response;
      const ids = slideshow.map((arr) => {
        return arr.id;
      });
      yield put({
        type: 'fetchRollingsEntity',
        payload: ids,
      });
      yield put({
        type: 'saveRollingsTotal',
        payload: response.total,
      });
    },
    * fetchRollingsEntity({ payload }, { call, put }) {
      const response = yield call(mGetRollingPictures, payload);
      yield put({
        type: 'saveRollings',
        payload: response,
      });
    },
    * createRollingPicture({ payload }, { call, put }) {
      const result = yield call(setRollingPictures, payload);
      if (result) {
        yield message.success('添加轮播图成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
   
  },
  reducers: {
    saveRollings(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
    saveRollingsTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
   
  },
};
export default RollingPictures;
