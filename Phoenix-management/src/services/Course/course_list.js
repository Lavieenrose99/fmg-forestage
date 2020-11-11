/*
 * @Author: your name
 * @Date: 2020-11-04 10:36:22
 * @LastEditTime: 2020-11-11 09:44:42
 * @LastEditors: your name
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
