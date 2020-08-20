import request from '@/utils/request';

export async function setGoodsAreaTags(payload) {
  return request('/api.farm/goods/place_tag', {
    method: 'POST',
    data: { place: payload },
  });
}
export async function getGoodsAreaTags(payload) {
  return request('/api.farm/goods/place_tag/list', {
    method: 'GET',
    params: { ...payload },
  });
}
export async function mGetGoodsAreaTags(payload) {
  return request('/api.farm/goods/place_tag/_mget', {
    method: 'POST',
    params: { ids: payload },
  });
}

export async function delGoodsAreaTags(payload) {
  return request(`/api.farm/goods/place_tag/${payload}`, {
    method: 'DELETE',
    //params: payload, 
  });
}
export async function adjustGoodsAreaTags(id, name) {
  return request(`/api.farm/goods/place_tag/${id}`, {
    method: 'PUT',
    data: {
      place: name, 
    },
  });
}
