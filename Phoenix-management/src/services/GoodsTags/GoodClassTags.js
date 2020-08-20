import request from '@/utils/request';

export async function setGoodsClassTags(payload) {
  return request('/api.farm/goods/kind_tag', {
    method: 'POST',
    data: { title: payload.title, parent_id: payload.pid },
  });
}
export async function getGoodsClassTags(payload) {
  return request('/api.farm/goods/kind_tag/list', {
    method: 'GET',
    params: { ...payload },
  });
}
export async function mGetGoodsClassTags(payload) {
  return request('/api.farm/goods/kind_tag/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function delGoodsClassTags(payload) {
  return request(`/api.farm/goods/kind_tag/${payload}`, {
    method: 'DELETE',
  });
}
export async function adjustGoodsClassTags(id, cname, pid) {
  return request(`/api.farm/goods/kind_tag/${id}`, {
    method: 'PUT',
    data: {
      title: cname,
      parent_id: pid,
    },
  });
}
