import request from '@/utils/request';

export async function setGoodsSaleTags(payload) {
  return request('/api.farm/goods/sale_tag', {
    method: 'POST',
    data: { title: payload },
  });
}
export async function getGoodsSaleTags(payload) {
  return request('/api.farm/goods/sale_tag/list', {
    method: 'GET',
    params: { ...payload },
  });
}
export async function mGetGoodsSaleTags(payload) {
  return request('/api.farm/goods/sale_tag/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function delGoodsSaleTags(payload) {
  return request(`/api.farm/goods/sale_tag/${payload}`, {
    method: 'DELETE',
  });
}
export async function adjustGoodsSaleTags(id, cname) {
  return request(`/api.farm/goods/sale_tag/${id}`, {
    method: 'PUT',
    data: {
      title: cname, 
    },
  });
}
