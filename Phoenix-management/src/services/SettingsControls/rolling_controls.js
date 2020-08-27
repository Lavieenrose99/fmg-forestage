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
