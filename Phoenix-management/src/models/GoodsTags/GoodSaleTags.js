import { message } from 'antd';
import {
  setGoodsSaleTags, 
  getGoodsSaleTags, 
  delGoodsSaleTags, 
  adjustGoodsSaleTags 
} from '@/services/GoodsTags/GoodSaleTags';
  
const GoodsSaleModel = {
  namespace: 'goodsSale',
  state: {
    GoodsSalesTags: [],
  },
  effects: {
    * fetchSaleTags({ payload }, { call, put }) {
      const response = yield call(getGoodsSaleTags, payload);
      yield put({
        type: 'saveSaleTags',
        payload: response,
      });
    },
  
    * setSaleTags({ payload }, { call, put }) {
      const { query, place } = payload;
      const result = yield call(setGoodsSaleTags, place);
      yield put({
        type: 'fetchSaleTags',
        payload: query,
      });
      if (result) {
        yield message.success('添加属性成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * delSaleTags({ payload }, { call, put }) {
      const { tid, query } = payload;
      const data =  yield call(delGoodsSaleTags, tid);
      if (data) {
        yield message.success('删除属性成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
      yield put({
        type: 'fetchSaleTags',
        payload: query,
      });
    },
    * adjSaleTags({ payload }, { call, put }) {
      const { tid, query, place } = payload;
      const data = yield call(adjustGoodsSaleTags, tid, place);
      yield put({
        type: 'fetchSaleTags',
        payload: query,
      });
      if (data) {
        yield message.success('修改属性成功'); 
      } else {
        yield message.error('修改失败请稍后重试');
      }
    },
  },
  reducers: {
    saveSaleTags(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default GoodsSaleModel;
