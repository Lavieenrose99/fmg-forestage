import request from '@/utils/request';

export async function setGoods(payload) {
  return request('/api.farm/goods', {
    method: 'POST',
    data: payload,
  });
}
export async function getGoodsList(payload) {
  return request('/api.farm/goods/list', {
    method: 'GET',
    params: payload.query,
  });
}

export async function MgetGoods(payload) {
  return request('/api.farm/goods/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function adjGoodsItem(payload, id) {
  return request(`/api.farm/goods/${id}`, {
    method: 'PUT',
    data: payload,
  });
}

export async function delGoodItem(id) {
  return request(`/api.farm/goods/${id}`, {
    method: 'DELETE',
  });
}

export async function setGoodsSpec(payload) {
  return request(`/api.farm/goods/specification/${payload.pid}`, {
    method: 'POST',
    data: {
      specification: payload.specification,
      template_id: payload.template_id,
    },
  });
}
export async function adjGoodsSpec(payload) {
  return request(`/api.farm/goods/specification/${payload.pid}`, {
    method: 'PUT',
    data: {
      specification: payload.specification,
      template_id: payload.template_id,
    },
  });
}
