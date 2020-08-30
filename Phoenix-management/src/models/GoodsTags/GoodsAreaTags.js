import { message } from 'antd';
import {
  setGoodsAreaTags, 
  getGoodsAreaTags, 
  delGoodsAreaTags, 
  adjustGoodsAreaTags,
  mGetGoodsAreaTags
} from '@/services/GoodsTags/GoodsAreaTags';

const GoodsAreaModel = {
  namespace: 'goodsArea',
  state: {
    GoodsAreaTags: [],
  },
  effects: {
    * fetchAreaTags({ payload }, { call, put }) {
      const response = yield call(getGoodsAreaTags, payload);
      const { tags } = response;
      const ids = tags.map((arr) => {
        return arr.id;
      });
      yield put({
        type: 'fetchAreaEntity',
        payload: ids,
      });
      yield put({
        type: 'saveAreaTagsTotal',
        payload: response.total,
      });
    },
    * fetchAreaEntity({ payload }, { call, put }) {
      const response = yield call(mGetGoodsAreaTags, payload);
      yield put({
        type: 'saveAreaTags',
        payload: response,
      });
    },

    * setAreaTags({ payload }, { call, put }) {
      const { query, place, picture } = payload;
      const result = yield call(setGoodsAreaTags, place, picture);
      yield put({
        type: 'fetchAreaTags',
        payload: query,
      });
      if (result) {
        yield message.success('添加属地成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * delAreaTags({ payload }, { call, put }) {
      const { tid, query } = payload;
      const result = yield call(delGoodsAreaTags, tid);
      yield put({
        type: 'fetchAreaTags',
        payload: query,
      });
      if (result) {
        yield message.success('删除属地成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
    },
    * adjAreaTags({ payload }, { call, put }) {
      const {
        tid, query, place, picture, 
      } = payload;
      const result = yield call(adjustGoodsAreaTags, tid, place, picture);
      yield put({
        type: 'fetchAreaTags',
        payload: query,
      });
      if (result) {
        yield message.success('修改属地成功'); 
      } else {
        yield message.error('修改失败请稍后重试');
      }
    },
    
  },
  
  reducers: {
    saveAreaTags(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
    saveAreaTagsTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
  },
};
export default GoodsAreaModel;
