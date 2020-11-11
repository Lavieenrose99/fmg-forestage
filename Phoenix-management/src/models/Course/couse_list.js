/*
 * @Author: your name
 * @Date: 2020-11-04 10:34:03
 * @LastEditTime: 2020-11-11 10:12:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/models/Course/couse_list.js
 */
import { message } from 'antd';
import { get } from 'lodash';
import {
  getCourseList, MgetCourseEnity, createCourse
} from '@/services/Course/course_list';
  
const fmgCourseModel = {
  namespace: 'fmgCourse',
  state: {
    CourseList: [],
  },
  effects: {
    * createCourse({ payload }, { call, put }) {
      const response = yield call(createCourse, payload);
      if (response) {
        yield message.success('发货成功'); 
      } else {
        yield message.error('发布失败');
      }
    },
    * fetchCourseList({ payload }, { call, put }) {
      const response = yield call(getCourseList, payload);
      const infos = get(response, 'courses', []);
      const ids = infos.map((arr) => { return arr.id; });
      const raw = yield call(MgetCourseEnity, ids);
      yield put({
        type: 'saveCourseList',
        payload: raw,
      });
    //   yield put({
    //     type: 'getClassTagsEntity',
    //     payload: ids,
    //   });
    },
  },
  reducers: {
    saveCourseList(state, { payload }) {
      return {
        ...state,
        courseList: payload,
      };
    },
    savePageTotals(state, { payload }) {
      return {
        total: payload,
      };
    },
  },
};
export default fmgCourseModel;
