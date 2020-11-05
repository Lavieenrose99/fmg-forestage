import { message } from 'antd';
import { get } from 'lodash';
import {
  getCourseList, MgetCourseEnity
} from '@/services/Course/course_list';
  
const fmgCourseModel = {
  namespace: 'fmgCourse',
  state: {
    CourseList: [],
  },
  effects: {
    * fetchCourseList({ payload }, { call, put }) {
      const response = yield call(getCourseList, payload);
      const infos = get(response, 'courses', []);
      const totals = get(response, 'total', '');
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
