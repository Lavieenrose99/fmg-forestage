/* eslint-disable react/no-string-refs */
/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Modal, message } from 'antd';
import request from '@/utils/request';
import { ImageDrop } from 'quill-image-drop-module';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
//import MYURL  from '../api/config';
const MYURL = 'http://upload-z2.qiniup.com';
const BASE_QINIU_URL = 'http://qiniu.daosuan.net/';
Quill.register('modules/imageDrop', ImageDrop);
class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', qiniutoken: '' }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.changeImageBeforeUpload = this.changeImageBeforeUpload.bind(this);
    this.uploadForImage = this.uploadForImage.bind(this);
    this.imageHandler = this.imageHandler.bind(this);
    this.showUploadBox = this.showUploadBox.bind(this);
    this.hideUploadBox = this.hideUploadBox.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

    modules={ //富文本配置
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ script: 'sub' }, { script: 'super' }],      // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }],          // outdent/indent
          [{ direction: 'rtl' }],                         // text direction
          [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
          [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: this.showUploadBox.bind(this),
        },
      },
      imageDrop: true,
    };

    showUploadBox() {
      this.setState({
        uploadBoxVisible: true,
      });
    }

    hideUploadBox() {
      this.setState({
        uploadBoxVisible: false,
      });
    }
    
    selectImage() {
      this.refs.uploadInput.click();//点击modal的html结构中的input标签
    }

    changeImageBeforeUpload(e) {
      const file = e.target.files[0];
      request('/api.farm/goods/resources/qiniu/upload_token', {
        method: 'GET',
      }).then(
        (response) => {
          this.setState({
            qiniutoken: response,
          });
        }
      );
     
      if (!file) {
        return;
      }
      let src;
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        src = URL.createObjectURL(file);
      } else {
        message.error('图片上传只支持JPG/PNG格式,请重新上传！');
        return;
      }
      if (file.size / 1024 / 1024 > 5) {
        message.error('图片上传大小不要超过5MB,请重新上传！');
        return;
      }
      this.setState({
        src,
        file,
      });
    }

    uploadForImage(files, token) {
      const uploadItem = new FormData();
      uploadItem.append('action', 'z2');
      uploadItem.append('token', token.token);
      uploadItem.append('file', files);
      uploadItem.append('key', `richText-${Date.parse(new Date())}`);
      request(MYURL, {
        credentials: 'omit',
        method: 'POST',
        data: uploadItem,
        //requestType: 'form',
      }).then(
        (response) => {
          console.log(response);
          this.imageHandler(`${BASE_QINIU_URL}${response.key}`);
        }
      );
    }

    imageHandler(url) {
      console.log(url);
      const quill = this.reactQuillRef.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : 0;
      quill.insertEmbed(index, 'image', url, Quill.sources.USER);//插入图片
      quill.setSelection(index + 1);//光标位置加1 
    }

    handleUpload() {      
      const this_ = this;
      /*调用上传图片的封装方法*/
      if (!this.state.file) {
        alert('请选择图片！！');
      } else {
        const { file } = this.state;
        const { qiniutoken } = this.state;
        this.uploadForImage(file, qiniutoken);
      }
    }
    
    handleChange(value) {
      const { subscribeRichText } = this.props;
      this.setState({ text: value }, () => {
        const { text } = this.state;
        subscribeRichText(text);
      });
    }

    render() {
      const { uploadBoxVisible, src, text } = this.state;
      return (
        <div style={{ height: 400 }}> 
          <ReactQuill
            id="ddd"
            ref={(el) => { this.reactQuillRef = el; }}
            value={text}
            onChange={this.handleChange}
            theme="snow"
            modules={this.modules}
            style={{ height: 300, width: '60vw' }}
          />
          <Modal
            title="上传图片"
            visible={uploadBoxVisible}
            onCancel={this.hideUploadBox}
            onOk={this.handleUpload}
            maskClosable={false}
            width={500}
          >
            <div className="ImagaBox">
              <div>
                <Button onClick={this.selectImage.bind(this)} style={{ background: '#18ade4', border: 'none', color: '#fff' }}>
                  选择图片
                </Button>
                <input
                  ref="uploadInput"
                  type="file"
                  accept="image/*"
                  style={{ width: '100px', border: 'none', visibility: 'hidden' }}
                  onChange={this.changeImageBeforeUpload.bind(this)}
                />
              </div>
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                {src
                  ? <img src={src} alt="" style={{ maxWidth: '100%', height: '300px' }} />
                  :                            <div style={{ background: '#f2f2f2', width: '100%', height: '300px' }} />}
              </div>
            </div>
          </Modal>
        </div>
      );
    }
}
RichTextEditor.propTypes = {
  subscribeRichText: PropTypes.func,
};
RichTextEditor.defaultProps = {
  subscribeRichText: noop,
};
export default RichTextEditor;
