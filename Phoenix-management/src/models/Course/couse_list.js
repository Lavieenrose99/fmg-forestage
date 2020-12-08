/*
 * @Author: your name
 * @Date: 2020-11-04 10:34:03
 * @LastEditTime: 2020-12-08 15:52:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/models/Course/couse_list.js
 */
import { message } from 'antd';
import { get } from 'lodash';
import {
  getCourseList, MgetCourseEnity, 
  createCourse, DelCourse, adjCourse,
  PreApplyList, MgetPreApplyList
} from '@/services/Course/course_list';
import { MgetAccountList } from '@/services/Bill/bills_list';
  
const fmgCourseModel = {
  namespace: 'fmgCourse',
  state: {
    CourseList: [],
  },
  effects: {
    * createCourse({ payload }, { call, put }) {
      const response = yield call(createCourse, payload);
      if (response) {
        yield message.success('发布课程成功'); 
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
    * fetchApplyCourseList({ payload }, { call, put, take }) {
      const response = yield call(PreApplyList, payload);
      const infos = get(response, 'preApplys', []);
      const ids = infos.map((arr) => { return arr.id; });
      const raw = yield call(MgetPreApplyList, ids);
      const userIdSet = [...new Set(raw.map((arr) => {
        return arr.account_id;
      }))];
      const accountInfo = yield call(MgetAccountList, userIdSet);
      //复习一下saga
      yield put({
        type: 'BillsListBack/saveAccountList',
        payload: accountInfo,
      });
      yield put({
        type: 'saveApplyCourseList',
        payload: raw,
      });
      //yield take('BillsListBack/saveAccountList/@@end');
    },
    * AdjCourse({ payload }, { call }) {
      const { finalData, cid } = payload;
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
    saveApplyCourseList(state, { payload }) {
      return {
        ...state,
        ApplycourseList: payload,
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
