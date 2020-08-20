import request from '@/utils/request';

export async function setGoods(payload) {
  return request('/api.farm/goods', {
    method: 'POST',
    data: payload,
  });
}
