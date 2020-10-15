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
