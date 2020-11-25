import React from 'react';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

const PictureCutting = () => (
  <div>
    <ImgCrop shape="round" aspect={0.5}>
      <Upload>+ Add image</Upload>
    </ImgCrop>
  </div>
);

export default PictureCutting;
