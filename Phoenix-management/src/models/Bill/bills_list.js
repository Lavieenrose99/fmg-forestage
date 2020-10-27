import { get } from 'lodash';
import { message } from 'antd';
import {
  getBillsListNew,
  MgetBillsList,
  getBillAddress,
  getBillDetails,
  postDelivery,
  MgetAccountList,
  getExpressList,
  getExpressMget,
  putBillsStatus,
  checkBillsList

} from '@/services/Bill/bills_list';
import { MgetGoods } from '@/services/CreateGoods/CreateGoods';
  
const GoodsClassModel = {
  namespace: 'BillsListBack',
  state: {
    bills_list: [],
  },
  effects: {
    * fetchBillsList({ payload }, { call, put }) {
      const response = yield call(getBillsListNew, payload);
      const infos = get(response, 'orders', []);
      const totals = get(response, 'total', '');
      const ids = infos.map((arr) => { return arr.id; });
      yield put({
        type: 'getBillslistEntity',
        payload: ids,
      });
    },
    * fetchExpressList({ payload }, { call, put }) {
      const response = yield call(getExpressList, payload);
      const infos = get(response, 'delivery', []);
      const ids = infos.map((arr) => { return arr.id; });
      yield put({
        type: 'saveExpressList',
        payload: infos,
      });
      yield put({
        type: 'fetchExpressEntity',
        payload: ids,
      });
    },
    * fetchExpressEntity({ payload }, { call, put }) {  
      const response = yield call(getExpressMget, payload);
      yield put({
        type: 'saveExpressEnity',
        payload: response,
      });
    },
    * sendDelivery({ payload }, { call }) {
      const raw =  yield call(postDelivery, payload.delievry);
      yield call(putBillsStatus, payload.ids);
      if (raw.id !== 0) {
        message.info('发货成功');
      } else {
        message.info('发货失败！');
      }
    },
    * getBillslistEntity({ payload }, { call, put }) {
      const response = yield call(MgetBillsList, payload);
      //将选出去重复后的总订单id
      const userIdSet = [...new Set(response.map((arr) => {
        return arr.account_id;
      }))];
      const fatherBills = [...new Set(response.map((arr) => {
        return arr.test_order;
      }))];
      const idSet = [];
      const fatherBillsUni = fatherBills.filter((arr, index, record) => {
        if (index !== 0) {
          //将每一次的id存入数组当中
          idSet.push(record[index - 1].id); 
        }
        return  (
          idSet.indexOf(arr.id) === -1
        );
      });
      const accountInfo = yield call(MgetAccountList, userIdSet);
      const account = accountInfo.map((info, index) => {
        return { ...info, account_id: userIdSet[index] };
      });
      yield put({
        type: 'saveBillsList',
        payload: response,
      });
      yield put({
        type: 'saveAccountList',
        payload: account,
      });
      yield put({
        type: 'saveAccountMainList',
        payload: fatherBillsUni,
      });
    },
    * fetchBillAddress({ payload }, { call, put }) {
      const response = yield call(getBillAddress, payload);
      yield put({
        type: 'saveBillAddress',
        payload: response,
      });
    },
    * fetchChildGoodsList({ payload }, { call, put }) {
      const response = yield call(MgetGoods, payload);
      yield put({
        type: 'saveChildGoods',
        payload: response,
      });
    },
    * fetchBillDetails({ payload }, { call, put }) {
      const response = yield call(getBillDetails, payload);
      const { data } = response;
      yield put({
        type: 'saveBillDetails',
        payload: data,
      });
    },
    * fetchCheckList({ payload }, { call, put }) {
      const response = yield call(checkBillsList, payload.stime, payload.etime);
      const userIdSet = [...new Set(response.map((arr) => {
        return arr.account_id;
      }))];
      const accountInfo = yield call(MgetAccountList, userIdSet);
      const account = accountInfo.map((info, index) => {
        return { ...info, account_id: userIdSet[index] };
      });
      yield put({
        type: 'saveChecklist',
        payload: response,
      });
      yield put({
        type: 'saveAccountCList',
        payload: account,
      });
    },
   
  },
  reducers: {
    saveBillsList(state, { payload }) {
      return {
        ...state,
        List: payload,
      };
    },
    saveChecklist(state, { payload }) {
      return {
        ...state,
        cBillsList: payload,
      };
    },
    saveExpressList(state, { payload }) {
      return {
        ...state,
        ExpressList: payload,
      };
    },
    saveExpressEnity(state, { payload }) {
      return {
        ...state,
        ExpressInfos: payload,
      };
    },
    saveChildGoods(state, { payload }) {
      return {
        ...state,
        ChildGoods: payload,
      };
    },
    saveAccountMainList(state, { payload }) {
      return {
        ...state,
        MainList: payload,
      };
    },
    saveAccountList(state, { payload }) {
      return {
        ...state,
        Account: payload,
      };
    },
    saveAccountCList(state, { payload }) {
      return {
        ...state,
        cAccount: payload,
      };
    },
    saveBillAddress(state, { payload }) {
      return {
        ...state,
        Address: payload,
      };
    },
    saveBillDetails(state, { payload }) {
      return {
        ...state,
        Details: payload,
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
