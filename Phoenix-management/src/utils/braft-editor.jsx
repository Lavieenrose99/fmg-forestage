/* eslint-disable camelcase */
import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { ImageUtils } from 'braft-finder';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
  
const braft_utils = require('braft-utils');

const { ContentUtils } = braft_utils;

export default class RichTextEditor extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState(null),
  }

  handleChange = (editorState) => {
    this.setState({ editorState });
  }

  uploadHandler = (param) => {
    if (!param.file) {
      return false;
    }
  
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [{
        type: 'IMAGE',
        url: URL.createObjectURL,
      }]),
    });
  }

  render() {
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <UploadOutlined />
            </button>
          </Upload>
        ),
      }
    ];
    return (
      <div>
        <div className="editor-wrapper">
          <BraftEditor
            value={this.state.editorState}
            onChange={this.handleChange}
            controls={controls}
            extendControls={extendControls}
          />
        </div>
      </div>
    );
  }
}
