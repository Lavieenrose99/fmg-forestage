import { message } from 'antd';
import { get } from 'lodash';
import {
  setIcons,
  getIcons,
  mGetIcons,
  delIcons,
  adjustIcons
} from '@/services/SettingsControls/icon_controls';
  
const RollingPictures = {
  namespace: 'Icons',
  state: {
  },
  effects: {
    * fetchIcons({ payload }, { call, put }) {
      const response = yield call(getIcons, payload);
      const { icons } = response;
      const ids = icons.map((arr) => {
        return arr.id;
      });
      yield put({
        type: 'fetchIconsEntity',
        payload: ids,
      });
      yield put({
        type: 'saveIconsTotal',
        payload: response.total,
      });
    },
    * fetchIconsEntity({ payload }, { call, put }) {
      const response = yield call(mGetIcons, payload);
      yield put({
        type: 'saveIcons',
        payload: response,
      });
    },
    * createIcons({ payload }, { call, put }) {
      const result = yield call(setIcons, payload);
      yield put({
        type: 'fetchIcons',
        payload: { query: { limit: 99, page: 1 } },
      });
      if (result) {
        yield message.success('添加图标成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * adjIcons({ payload }, { call, put }) {
      const result = yield call(adjustIcons, payload);
      yield put({
        type: 'fetchIcons',
        payload: { query: { limit: 99, page: 1 } },
      });
      if (result) {
        yield message.success('修改图标成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },

    * delIcons({ payload }, { call, put }) {
      const result = yield call(delIcons, payload);
      yield put({
        type: 'fetchIcons',
        payload: { query: { limit: 99, page: 1 } },
      });
      if (result) {
        yield message.success('删除图标成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
    },
   
  },
  reducers: {
    saveIcons(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
    saveIconsTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
   
  },
};
export default RollingPictures;
