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
  checkBillsList,
  getRefundList,
  mGetRefundList,
  putExchangeStatus,
  putRejectStatus,
  DoRefund

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
    //快递
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
    //退款
    * fetchRefundList({ payload }, { call, put }) {
      const response = yield call(getRefundList, payload);
      const infos = get(response, 'refunds', []);
      const ids = infos.map((arr) => { return arr.id; });
      
      yield put({
        type: 'fetchRefundEntity',
        payload: ids,
      });
    },
    * fetchRefundEntity({ payload }, { call, put }) {  
      const response = yield call(mGetRefundList, payload);
      const userIdSet = [...new Set(response.map((arr) => {
        return arr.account_id;
      }))];
      const accountInfo = yield call(MgetAccountList, userIdSet);
      const account = accountInfo.map((info, index) => {
        return { ...info, account_id: userIdSet[index] };
      });
      yield put({
        type: 'saveRefundEnity',
        payload: response,
      });
      yield put({
        type: 'saveAccountCList',
        payload: account,
      });
    },
    * PleaseRefund({ payload }, { call }) {
      const raw =  yield call(putExchangeStatus, payload);
      yield call(DoRefund, payload);
      if (raw.id !== 0) {
        message.info('退款成功');
      } else {
        message.info('退款失败！');
      }
    },
    * RejectRefund({ payload }, { call }) {
      const raw =  yield call(putRejectStatus, payload);
      if (raw.id !== 0) {
        message.info('拒绝退款成功');
      } else {
        message.info('请求失败！');
      }
    },
    * RefundGoods({ payload }, { call, put }) {
      const raw =  yield call(MgetBillsList, payload);
      yield put({
        type: 'saveRefundBills',
        payload: raw[0],
      });
      if (raw.length > 0) {
        const goodsList  = raw[0].order_detail.map((infos) => {
          return infos.goods_id;
        });
        const ids = Array.from(new Set(goodsList));
        yield put({
          type: 'fetchChildGoodsList',
          payload: ids,
        });
        yield put({
          type: 'fetchBillAddress',
          payload: raw[0].address_id,
        });
      }
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
      const raw = yield call(MgetBillsList, payload);
      const response = raw.filter((info) => {
        return info.account_id !== 0;
      });
      //将选出去重复后的总订单id
      const userIdSet = [...new Set(response.map((arr) => {
        return arr.account_id;
      }))];
      const fatherBills = [...new Set(response.map((arr) => {
        return { ...arr.test_order, orderfatherUni: arr.order_num };
      }))];
      const idSetBreak = [];
      const idSet = [];
      const fatherBillsUniBreak = fatherBills.filter((arr, index, record) => {
        if (index !== 0) {
          //将每一次的id存入数组当中
          idSetBreak.push(record[index - 1].id); 
        }
        return  (
          idSetBreak.indexOf(arr.id) === -1 && arr.status === 1
        );
      });
      const fatherBillsUni = fatherBills.filter((arr, index, record) => {
        if (index !== 0) {
          //将每一次的id存入数组当中
          idSet.push(record[index - 1].id); 
        }
        return  (
          idSet.indexOf(arr.id) === -1 && arr.status === 2
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
        type: 'saveAccountMainListBreak',
        payload: fatherBillsUniBreak,
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
      const responseRaw = yield call(checkBillsList, payload.stime, payload.etime);
      const { data } = responseRaw; 
      const response = data;
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
    saveRefundBills(state, { payload }) {
      return {
        ...state,
        ReBillList: payload,
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
    saveRefundEnity(state, { payload }) {
      return {
        ...state,
        RefundInfos: payload,
      };
    },
    saveChildGoods(state, { payload }) {
      return {
        ...state,
        ChildGoods: payload,
      };
    },
    saveAccountMainListBreak(state, { payload }) {
      return {
        ...state,
        MainListBreak: payload,
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
