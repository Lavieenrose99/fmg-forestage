import { message } from 'antd';
import { get } from 'lodash';
import {
  setSpecificationTemplate, 
  getSpecificationTemplate, 
  mGetSpecificationTemplate, 
  delSpecificationTemplate,
  adjustSpecificationTemplate
} from '@/services/GoodsTags/GoodsModesList';
  
const GoodsTemplateModels = {
  namespace: 'goodsModels',
  state: {
    GoodsModels: [],
  },
  effects: {
    * fetchModels({ payload }, { call, put }) {
      const response = yield call(getSpecificationTemplate, payload);
      const { templates } = response;
      const ids = templates.map((arr) => { return arr.id; });
      yield put({
        type: 'getModelsEntity',
        payload: ids,
      });
      yield put({
        type: 'saveModelsTotol',
        payload: response.total,
      });
    },
    * getModelsEntity({ payload }, { call, put }) {
      const response = yield call(mGetSpecificationTemplate, payload);
      yield put({
        type: 'saveGoodsModels',
        payload: response,
      });
    },
    * getModelEntity(payload, { call, put }) {
      const response = yield call(mGetSpecificationTemplate, [payload.paload]);
      yield put({
        type: 'saveGoodsModel',
        payload: response,
      });
    },
  
    * setModelsTags({ payload }, { call, put }) {
      const { query, title, template } = payload;
      const payloads = { title, template };
      const result = yield call(setSpecificationTemplate, payloads);
      yield put({
        type: 'fetchModels',
        payload: query,
      });
      if (result) {
        yield message.success('添加模版成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * delModelsTags({ payload }, { call, put }) {
      const { tid, query } = payload;
      const data =  yield call(delSpecificationTemplate, tid);
      if (data) {
        yield message.success('删除模版成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
      yield put({
        type: 'fetchModels',
        payload: query,
      });
    },
    * adjModelsTags({ payload }, { call, put }) {
      const {
        tid, query, title, template, 
      } = payload;
      const payloads = { title, template, tid };
      const data = yield call(adjustSpecificationTemplate, payloads);
      yield put({
        type: 'fetchModels',
        payload: query,
      });
      if (data) {
        yield message.success('修改模版成功'); 
      } else {
        yield message.error('修改失败请稍后重试');
      }
    },
  },
  reducers: {
    saveGoodsModels(state, { payload }) {
      return {
        ...state,
        infos: payload,
      };
    },
    saveGoodsModel(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
    saveModelsTotol(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
  },
};
export default GoodsTemplateModels;
