import request from '@/utils/request';

export async function setGoods(payload) {
  return request('/api.farm/goods', {
    method: 'POST',
    data: payload,
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
