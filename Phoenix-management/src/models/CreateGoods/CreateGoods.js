import { message } from 'antd';
import { get } from 'lodash';
import {
  setGoods,
  setGoodsSpec,
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
    * createGoodsSpec({ payload }, { call, put }) {
      console.log(payload)
      const result = yield call(setGoodsSpec, payload);
      if (result) {
        yield message.success('添加商品规格成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
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
    savePageTotals(state, { payload }) {
      return {
        total: payload,
      };
    },
  },
};
export default GoodsClassModel;
