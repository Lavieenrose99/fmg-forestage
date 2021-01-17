/*
 * @Author: your name
 * @Date: 2020-09-17 23:56:19
 * @LastEditTime: 2021-01-18 00:57:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/services/Bill/bills_list.js
 */
import request from '@/utils/request';

// 订单旧接口
export async function getBillsList(payload) {
  return request('/api.farm/list', {
    method: 'GET',
    params: payload,
  });
}
// 订单新接口
export async function getBillsListNew(payload) {
  return request('/api.farm/_order/list', {
    method: 'GET',
    params: payload,
  });
}
//快递单号接口
export async function getExpressList(payload) {
  return request('/api.farm/delivery/info/list', {
    method: 'GET',
    params: payload,
  });
}
//查账接口
export async function checkBillsList(stime, etime) {
  return request('/api.farm/pay/bill', {
    method: 'POST',
    data: { time_start: stime, time_end: etime },
  });
}
//待退款订单列表
export async function getRefundList(payload) {
  return request('/api.farm/exchange/list', {
    method: 'GET',
    params: payload,
  });
}
//待退款订单mget
export async function mGetRefundList(payload) {
  return request('/api.farm/exchange/mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
//批准退款
export async function putExchangeStatus(payload) {
  return request(`/api.farm/exchange/pmt/${payload}`, {
    method: 'PUT',
    data: { status: 2 },
  });
}
export async function putRejectStatus(payload) {
  return request(`/api.farm/exchange/pmt/${payload.id}`, {
    method: 'PUT',
    data: { status: 4, reason_desc: payload.text },
  });
}
//退款接口 /pay/refund/:eid
export async function DoRefund(payload) {
  return request(`/api.farm/pay/refund/${payload}`, {
    method: 'GET',
  });
}
export async function DoCourseRefund(payload) {
  return request(`/api.farm/pay/apply/refund/${payload}`, {
    method: 'GET',
  });
}
export async function putBillsStatus(payload) {
  return request(`/api.farm/_order/status/${payload.ooid}/child_order/${payload.oid}`, {
    method: 'PUT',
    data: { status: 3 },
  });
}
export async function getExpressMget(payload) {
  return request('/api.farm/delivery/info/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function MgetBillsList(payload) {
  return request('/api.farm/_order/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function MgetAccountList(payload) {
  return request('/api.farm/account/info/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}

export async function getBillAddress(aid) {
  return request(`/api.farm/address/info/get/${aid}`, {
    method: 'GET',
  });
}
export async function getBillDetails(oid) {
  return request(`/api.farm/order/${oid}`, {
    method: 'GET',
  });
}
export async function postDelivery(payload) {
  return request('/api.farm/delivery/info', {
    method: 'POST',
    data: payload,
  });
}

//获取全部用户
export async function getAllUserList(payload) {
  return request('/api.farm/account/info/list', {
    method: 'GET',
    params: payload,
  });
}
