import request from '@/utils/request';

export async function setSpecificationTemplate(payload) {
  return request('/api.farm/goods/specification_template', {
    method: 'POST',
    data: { title: payload.title, template: payload.template },
  });
}
export async function getSpecificationTemplate(payload) {
  return request('/api.farm/goods/specification_template/list', {
    method: 'GET',
    params: { ...payload },
  });
}
export async function mGetSpecificationTemplate(payload) {
  return request('/api.farm/goods/specification_template/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function delSpecificationTemplate(payload) {
  return request(`/api.farm/goods/specification_template/${payload}`, {
    method: 'DELETE',
  });
}
export async function adjustSpecificationTemplate(payload) {
  return request(`/api.farm/goods/specification_template/${payload.tid}`, {
    method: 'PUT',
    data: {
      title: payload.title,
      template: payload.template,
    },
  });
}
