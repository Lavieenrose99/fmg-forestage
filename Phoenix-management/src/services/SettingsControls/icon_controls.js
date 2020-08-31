import request from '@/utils/request';

export async function setIcons(payload) {
  return request('/api.farm/goods/icon', {
    method: 'POST',
    data: {
      picture: payload.picture, 
      title: payload.title,
      name: payload.name, 
    },
  });
}
export async function getIcons(payload) {
  return request('/api.farm/goods/icon/list', {
    method: 'GET',
    params: { ...payload.query },
  });
}
export async function mGetIcons(payload) {
  return request('/api.farm/goods/icon/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
  
export async function delIcons(payload) {
  return request(`/api.farm/goods/icon/${payload}`, {
    method: 'DELETE',
    //params: payload, 
  });
}
export async function adjustIcons(payload) {
  return request(`/api.farm/goods/icon/${payload.rid}`, {
    method: 'PUT',
    data: {
      title: payload.title, 
      picture: payload.picture,
      name: payload.name,
    },
  });
}
