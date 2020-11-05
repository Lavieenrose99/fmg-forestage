import request from '@/utils/request';

export async function getCourseList(payload) {
  return request('/api.farm/study/course/list', {
    method: 'GET',
    params: payload,
  });
}
export async function MgetCourseEnity(payload) {
  console.log(payload)
  return request('/api.farm/study/course/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
