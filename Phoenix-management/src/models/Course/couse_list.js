/*
 * @Author: your name
 * @Date: 2020-11-04 10:34:03
 * @LastEditTime: 2020-11-19 09:27:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/models/Course/couse_list.js
 */
import { message } from 'antd';
import { get } from 'lodash';
import {
  getCourseList, MgetCourseEnity, 
  createCourse, DelCourse, adjCourse
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
    },
    * AdjCourse({ payload }, { call }) {
      const { finalData , cid } = payload;
      const reply  = yield call(adjCourse, finalData, cid);
      if (reply) {
        yield message.success('修改成功'); 
      } else {
        yield message.error('修改失败');
      }
    },
    * DelCourse({ payload }, { call }) {
      const reply  = yield call(DelCourse, payload);
      if (reply) {
        yield message.success('删除成功'); 
      } else {
        yield message.error('删除失败');
      }
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
