/*
 * @Author: your name
 * @Date: 2020-11-04 10:36:22
 * @LastEditTime: 2020-12-14 22:56:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/services/Course/course_list.js
 */
import request from '@/utils/request';

export async function createCourse(payload) {
  return request('/api.farm/study/course', {
    method: 'POST',
    data: payload,
  });
}
export async function adjCourse(payload, cid) {
  return request(`/api.farm/study/course/${cid}`, {
    method: 'PUT',
    data: payload,
  });
}
export async function getCourseList(payload) {
  return request('/api.farm/study/course/list', {
    method: 'GET',
    params: payload,
  });
}
export async function MgetCourseEnity(payload) {
  return request('/api.farm/study/course/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function DelCourse(payload) {
  return request(`/api.farm/study/course/${payload}`, {
    method: 'DELETE',
  });
}
export async function PreApplyList(payload) {
  return request('/api.farm/study/course/pre_apply/list', {
    method: 'GET',
    params: payload,
  });
}
export async function MgetPreApplyList(payload) {
  return request('/api.farm/study/course/pre_apply/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function ApplyList(payload) {
  return request('/api.farm/study/course/apply/list', {
    method: 'GET',
    params: payload,
  });
}
export async function MgetApplyList(payload) {
  return request('/api.farm/study/course/apply/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
