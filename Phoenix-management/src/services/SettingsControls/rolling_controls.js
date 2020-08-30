import request from '@/utils/request';

export async function setRollingPictures(payload) {
  return request('/api.farm/goods/slideshow', {
    method: 'POST',
    data: {
      picture: payload.picture, 
      goods_id: payload.goods_id,
      number: payload.number, 
    },
  });
}
export async function getRollingPictures(payload) {
  return request('/api.farm/goods/slideshow/list', {
    method: 'GET',
    params: { ...payload.query },
  });
}
export async function mGetRollingPictures(payload) {
  return request('/api.farm/goods/slideshow/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
  
export async function delRollingPictures(payload) {
  return request(`/api.farm/goods/slideshow/${payload}`, {
    method: 'DELETE',
    //params: payload, 
  });
}
export async function adjustRollingPictures(payload) {
  return request(`/api.farm/goods/slideshow/${payload.rid}`, {
    method: 'PUT',
    data: {
      goods_id: payload.goods_id, 
      picture: payload.picture,
      number: payload.number,
    },
  });
}
