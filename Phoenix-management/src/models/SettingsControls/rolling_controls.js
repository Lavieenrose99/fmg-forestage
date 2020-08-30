import { message } from 'antd';
import { get } from 'lodash';
import {
  setRollingPictures,
  getRollingPictures,
  mGetRollingPictures,
  delRollingPictures,
  adjustRollingPictures
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
      yield put({
        type: 'saveRollingsList',
        payload: slideshow,
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
      yield put({
        type: 'fetchRollings',
        payload: { limit: 10, page: 1 },
      });
      if (result) {
        yield message.success('添加轮播图成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * adjRollingPicture({ payload }, { call, put }) {
      const result = yield call(adjustRollingPictures, payload);
      yield put({
        type: 'fetchRollings',
        payload: { limit: 10, page: 1 },
      });
      if (result) {
        yield message.success('修改轮播图成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },

    * delRollings({ payload }, { call, put }) {
      const { tid, query } = payload;
      const result = yield call(delRollingPictures, tid);
      yield put({
        type: 'fetchRollings',
        payload: query,
      });
      if (result) {
        yield message.success('删除轮播图成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
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
    saveRollingsList(state, { payload }) {
      return {
        ...state,
        List: payload,
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
