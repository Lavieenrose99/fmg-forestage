/*
 * @Author: your name
 * @Date: 2020-11-05 14:47:25
 * @LastEditTime: 2020-11-16 20:26:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/services/Course/course_tags.js
 */
import request from '@/utils/request';
//研学类型api
export async function setCourseClassTags(payload) {
  return request('/api.farm/study/course/kind', {
    method: 'POST',
    data: {
      name: payload,
    },
  });
}
export async function getCourseClassTags(payload) {
  return request('/api.farm/study/course/kind/list', {
    method: 'GET',
    params: { ...payload },
  });
}
export async function mGetCourseClassTags(payload) {
  return request('/api.farm/study/course/kind/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function delCourseClassTags(payload) {
  return request(`/api.farm/study/course/kind/${payload}`, {
    method: 'DELETE',
  });
}
export async function adjustCourseClassTags(id, cname) {
  return request(`/api.farm/study/course/kind/${id}`, {
    method: 'PUT',
    data: {
      name: cname,
    },
  });
}

//研学分类api

export async function setCourseTypeTags(payload) {
  return request('/api.farm/study/course/tag', {
    method: 'POST',
    data: {
      name: payload,
    },
  });
}
export async function getCourseTypeTags(payload) {
  return request('/api.farm/study/course/tag/list', {
    method: 'GET',
    params: { ...payload },
  });
}
export async function mGetCourseTypeTags(payload) {
  return request('/api.farm/study/course/tag/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function delCourseTypeTags(payload) {
  return request(`/api.farm/study/course/tag/${payload}`, {
    method: 'DELETE',
  });
}
export async function adjustCourseTypeTags(id, cname) {
  return request(`/api.farm//study/course/tag/${id}`, {
    method: 'PUT',
    data: {
      name: cname,
    },
  });
}
