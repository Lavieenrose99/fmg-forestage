import request from '@/utils/request';

export async function setGoodsAreaTags(place, picture) {
  return request('/api.farm/goods/place_tag', {
    method: 'POST',
    data: { place, picture },
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
    data: { ids: payload },
  });
}

export async function delGoodsAreaTags(payload) {
  return request(`/api.farm/goods/place_tag/${payload}`, {
    method: 'DELETE',
    //params: payload, 
  });
}
export async function adjustGoodsAreaTags(id, name, picture) {
  return request(`/api.farm/goods/place_tag/${id}`, {
    method: 'PUT',
    data: {
      place: name, 
      picture,
    },
  });
}
