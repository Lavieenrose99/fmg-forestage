import { message } from 'antd';
import { get } from 'lodash';
import {
  setGoods,
  setGoodsSpec,
  getGoodsList,
  MgetGoods,
  delGoodItem,
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
