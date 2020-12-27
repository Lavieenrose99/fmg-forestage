/*
 * @Author: your name
 * @Date: 2020-11-30 13:09:25
 * @LastEditTime: 2020-12-21 12:17:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/models/Infos/fmg_infos.js
 */
/*
 * @Author: your name
 * @Date: 2020-11-04 10:34:03
 * @LastEditTime: 2020-11-25 11:47:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/models/Infos/couse_list.js
 */
import { message } from 'antd';
import { get } from 'lodash';
import {
  getInfosList, MgetInfosEnity, 
  createInfos, DelInfos, adjInfos, 
  createInfosTags, getInfosTagsList,
  MgetInfosTagsEnity, InfosTagsDel
} from '@/services/Infos/fmg_infos';
  
const fmgInfosModel = {
  namespace: 'fmgInfos',
  state: {
    InfosList: [],
  },
  effects: {
    * createInfos({ payload }, { call, put }) {
      const response = yield call(createInfos, payload);
      if (response) {
        yield message.success('发布资讯成功'); 
      } else {
        yield message.error('发布失败');
      }
    },
    * createInfosTags({ payload }, { call, put }) {
      const response = yield call(createInfosTags, payload);
      if (response) {
        yield message.success('创建标签成功'); 
      } else {
        yield message.error('闯将标签失败');
      }
    },
    * fetchInfosTagsList({ payload }, { call, put }) {
      const response = yield call(getInfosTagsList, payload);
      const infos = get(response, 'news', []);
      const ids = infos.map((arr) => { return arr.id; });
      const raw = yield call(MgetInfosTagsEnity, ids);
      yield put({
        type: 'saveInfosTagsList',
        payload: raw,
      });
    },
    * fetchInfosList({ payload }, { call, put }) {
      const response = yield call(getInfosList, payload);
      const infos = get(response, 'news', []);
      const ids = infos.map((arr) => { return arr.id; });
      const raw = yield call(MgetInfosEnity, ids);
      yield put({
        type: 'saveInfosList',
        payload: raw,
      });
    },
    * AdjInfos({ payload }, { call }) {
      const { finalData, Iid } = payload;
      const reply  = yield call(adjInfos, finalData, Iid);
      if (reply) {
        yield message.success('修改成功'); 
      } else {
        yield message.error('修改失败');
      }
    },
    * DelInfos({ payload }, { call }) {
      const reply  = yield call(DelInfos, payload);
      if (reply) {
        yield message.success('删除成功'); 
      } else {
        yield message.error('删除失败');
      }
    },
    * DelInfosTags({ payload }, { call }) {
      const reply  = yield call(InfosTagsDel, payload);
      if (reply) {
        yield message.success('删除成功'); 
      } else {
        yield message.error('删除失败');
      }
    },
  },
  reducers: {
    saveInfosList(state, { payload }) {
      return {
        ...state,
        InfosList: payload,
      };
    },
    savePageTotals(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    saveInfosTagsList(state, { payload }) {
      return {
        ...state,
        TagsInfosList: payload,
      };
    },
  },
};
export default fmgInfosModel;
