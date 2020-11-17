/*
 * @Author: your name
 * @Date: 2020-11-17 17:34:19
 * @LastEditTime: 2020-11-17 23:23:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/utils/Layout/basic_layout.js
 */
import React from 'react';
import {
  UploadOutlined,
} from '@ant-design/icons';
export const  EditorLayout = {
  wrapperCol: {
    offset: 4,
    //span: 8,
  },
};

export const tailLayout = {
  wrapperCol: {
    offset: 9,
    span: 16,
  },
};

export const layout = {
  labelCol: {
    offset: 4,
  },
  wrapperCol: {
    span: 12,
  },
};

export const ModelListlayout = {
  labelCol: {
    offset: 0,
  },
};

export const layoutCourse = {
  labelCol: {
    offset: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

export const uploadButton = (
  <div>
    <div className="ant-upload-text">
      <UploadOutlined />
      上传
    </div>
  </div>
);
