import { message } from 'antd';
import { get } from 'lodash';
import request from '@/utils/request';
import {
  setGoods,
  setGoodsSpec,
  getGoodsList,
  MgetGoods,
  delGoodItem,
  adjGoodsItem,
  adjGoodsSpec
} from '@/services/CreateGoods/CreateGoods';
  
const GoodsClassModel = {
  namespace: 'CreateGoods',
  state: {
    GoodsClassTags: [],
  },
  effects: {
    * createGoods({ payload }, { call, put }) {
      const result = yield call(setGoods, payload);
      yield put({
        type: 'saveGoodsId',
        payload: result,
      });
      if (result) {
        yield message.success('添加商品成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * getGoodsList({ payload }, { call, put }) {
      yield  request('/api.farm/account/login/web_login', {
        method: 'POST',
        data: { open_id: 'om10q44CkR0EOYXL7yp3PVIvS0pg' },
      });
      const result = yield call(getGoodsList, payload);
      const { goods, total } = result;
      const ids = goods.map((arr) => {
        return arr.id;
      });
      yield put({
        type: 'fetchGoodsEntity',
        payload: ids,
      });
      yield put({
        type: 'savePageTotals',
        payload: total,
      });
    },

    * fetchGoodsEntity({ payload }, { call, put }) {
      const response = yield call(MgetGoods, payload);
      yield put({
        type: 'saveGoods',
        payload: response,
      });
    },

    * createGoodsSpec({ payload }, { call, put }) {
      const result = yield call(setGoodsSpec, payload);
      if (result) {
        yield message.success('添加商品规格成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * adjustGoodsSpec({ payload }, { call, put }) {
      const result = yield call(adjGoodsSpec, payload);
      yield put({
        type: 'getGoodsList',
        payload: { query: { limit: 999, page: 1 } },
      });
      if (result) {
        yield message.success('添加商品规格成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * adjGoods({ payload }, { call, put }) {
      const { tid, info } = payload;
      const result = yield call(adjGoodsItem, info, tid);
      yield put({
        type: 'getGoodsList',
        payload: { query: { limit: 999, page: 1 } },
      });
      if (result) {
        yield message.success('删除商品成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
    },
    * delGoods({ payload }, { call, put }) {
      const { tid, query } = payload;
      const result = yield call(delGoodItem, tid);
      yield put({
        type: 'getGoodsList',
        payload: query,
      });
      if (result) {
        yield message.success('删除商品成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
    },
  },
  reducers: {
    saveGoodsId(state, { payload }) {
      return {
        ...state,
        goodId: payload,
      };
    },
    saveGoods(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
    savePageTotals(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
  },
};
export default GoodsClassModel;
