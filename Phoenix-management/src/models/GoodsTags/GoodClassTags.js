import { message } from 'antd';
import { get } from 'lodash';
import {
  setGoodsClassTags, 
  getGoodsClassTags, 
  delGoodsClassTags, 
  adjustGoodsClassTags,
  mGetGoodsClassTags
} from '@/services/GoodsTags/GoodClassTags';
  
const GoodsClassModel = {
  namespace: 'goodsClass',
  state: {
    GoodsClassTags: [],
  },
  effects: {
    * fetchClassTags({ payload }, { call, put }) {
      const response = yield call(getGoodsClassTags, payload);
      const infos = get(response, 'tags', []);
      const totals = get(response, 'total', '');
      const ids = infos.map((arr) => { return arr.id; });
      yield put({
        type: 'savePageTotals',
        payload: totals,
      });
      yield put({
        type: 'getClassTagsEntity',
        payload: ids,
      });
    },
    * getClassTagsEntity({ payload }, { call, put }) {
      const response = yield call(mGetGoodsClassTags, payload);
      yield put({
        type: 'saveClassTags',
        payload: response,
      }); 
    },
  
    * setClassTags({ payload }, { call, put }) {
      const {
        query, title, pid, picture, 
      } = payload;
      const payloads = { title, pid, picture };
      const result = yield call(setGoodsClassTags, payloads);
      yield put({
        type: 'fetchClassTags',
        payload: query,
      });
      if (result) {
        yield message.success('添加属性成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * delClassTags({ payload }, { call, put }) {
      const { tid, query } = payload;
      const data =  yield call(delGoodsClassTags, tid);
      if (data) {
        yield message.success('删除属性成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
      yield put({
        type: 'fetchClassTags',
        payload: query,
      });
    },
    * adjClassTags({ payload }, { call, put }) {
      console.log(payload);
      const {
        tid, query, title, pid, 
      } = payload;
      const data = yield call(adjustGoodsClassTags, tid, title, pid);
      yield put({
        type: 'fetchClassTags',
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
    saveClassTags(state, { payload }) {
      return {
        ...state,
        tags: payload,
      };
    },
    savePageTotals(state, { payload }) {
      return {
        total: payload,
      };
    },
  },
};
export default GoodsClassModel;
