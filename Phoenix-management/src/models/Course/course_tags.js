import { message } from 'antd';
import { get } from 'lodash';
import {
  setCourseClassTags,
  getCourseClassTags,
  mGetCourseClassTags,
  delCourseClassTags,
  adjustCourseClassTags,
  setCourseTypeTags,
  getCourseTypeTags,
  mGetCourseTypeTags,
  delCourseTypeTags,
  adjustCourseTypeTags

} from '@/services/Course/course_tags';
  
const GoodsClassModel = {
  namespace: 'couresTags',
  state: {
    //GoodsClassTags: [],
  },
  effects: {
    * fetchCourseTags({ payload }, { call, put }) {
      const response = yield call(getCourseClassTags, payload);
      const { courseKinds, total } = response;
      const ids = courseKinds.map((arr) => { return arr.id; });
      yield put({
        type: 'savePageTotals',
        payload: total,
      });
      yield put({
        type: 'getCourseTagsEntity',
        payload: ids,
      });
    },
    * getCourseTagsEntity({ payload }, { call, put }) {
      const response = yield call(mGetCourseClassTags, payload);
      yield put({
        type: 'saveCourseTags',
        payload: response,
      }); 
    },
    * fetchTypeCourseTags({ payload }, { call, put }) {
      const response = yield call(getCourseTypeTags, payload);
      const { courseTags, total } = response;
      const ids = courseTags.map((arr) => { return arr.id; });
      yield put({
        type: 'savePageTotals',
        payload: total,
      });
      yield put({
        type: 'getCourseTypeTagsEntity',
        payload: ids,
      });
    },
    * getCourseTypeTagsEntity({ payload }, { call, put }) {
      const response = yield call(mGetCourseTypeTags, payload);
      yield put({
        type: 'saveCourseTypeTags',
        payload: response,
      }); 
    },
  
    * setCourseTags({ payload }, { call, put }) {
      const {
        query, name,
      } = payload;
      const result = yield call(setCourseClassTags, name);
      yield put({
        type: 'fetchCourseTags',
        payload: query,
      });
      yield put({
        type: 'fetchTypeCourseTags',
        payload: query,
      });
      if (result) {
        yield message.success('添加课程标签成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * setTypeCourseTags({ payload }, { call, put }) {
      const {
        query, name, 
      } = payload;
      const result = yield call(setCourseTypeTags, name);
      yield put({
        type: 'fetchTypeCourseTags',
        payload: query,
      });
      yield put({
        type: 'fetchCourseTags',
        payload: query,
      });
      if (result) {
        yield message.success('添加类型标签成功'); 
      } else {
        yield message.error('添加失败请稍后重试');
      }
    },
    * delCourseTags({ payload }, { call, put }) {
      const { tid, query } = payload;
      const data =  yield call(delCourseClassTags, tid);
      yield put({
        type: 'fetchTypeCourseTags',
        payload: query,
      });
      yield put({
        type: 'fetchCourseTags',
        payload: query,
      });
      if (data) {
        yield message.success('删除属性成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
      yield put({
        type: 'fetchClassTags',
        payload: query,
      });
    },
    * delTypeCourseTags({ payload }, { call, put }) {
      const { tid, query } = payload;
      const data =  yield call(delCourseTypeTags, tid);
      yield put({
        type: 'fetchTypeCourseTags',
        payload: query,
      });
      yield put({
        type: 'fetchCourseTags',
        payload: query,
      });
      if (data) {
        yield message.success('删除属性成功'); 
      } else {
        yield message.error('删除失败请稍后重试');
      }
      yield put({
        type: 'fetchClassTags',
        payload: query,
      });
    },
    * adjCourseTags({ payload }, { call, put }) {
      const {
        tid, query, name,
      } = payload;
      const data = yield call(adjustCourseClassTags, tid, name);
      yield put({
        type: 'fetchTypeCourseTags',
        payload: query,
      });
      yield put({
        type: 'fetchCourseTags',
        payload: query,
      });
      if (data) {
        yield message.success('修改标签成功'); 
      } else {
        yield message.error('修改失败请稍后重试');
      }
    },
    * adjTypeCourseTags({ payload }, { call, put }) {
      const {
        tid, query, name,
      } = payload;
      const data = yield call(adjustCourseTypeTags, tid, name);
      yield put({
        type: 'fetchTypeCourseTags',
        payload: query,
      });
      yield put({
        type: 'fetchCourseTags',
        payload: query,
      });
      if (data) {
        yield message.success('修改标签成功'); 
      } else {
        yield message.error('修改失败请稍后重试');
      }
    },
  },
  reducers: {
    saveCourseTags(state, { payload }) {
      return {
        ...state,
        tags: payload,
      };
    },
    saveCourseTypeTags(state, { payload }) {
      return {
        ...state,
        typeTags: payload,
      };
    },
    savePageTotals(state, { payload }) {
      return {
        total: payload,
      };
    },
  },
};
export default GoodsClassModel;
