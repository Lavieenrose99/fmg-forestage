import React, { useState, useEffect } from 'react';
import { Modal, Input, Upload } from 'antd';
import { connect } from 'umi';
import { get } from 'lodash';
import request from '@/utils/request';
import { QINIU_SERVER, BASE_QINIU_URL, pictureSize } 
  from '@/utils/Token';
import ImgCrop from 'antd-img-crop'; 
import { uploadButton } from '@/utils/Layout/basic_layout.jsx';
import RichTextEditor from '../../utils/RichTextEditor.jsx';
import { filterHTMLTag } from '../../utils/adjust_picture';

const FmgInfoCreator = (props) => {
  const { TextArea } = Input;
  const { show, closeInfosModel, infos } = props;
  const [infosPreSeem, setInfosPreSeem] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [qiniuToken, setQiniuToken] = useState('');
  const [infosTitle, setInfosTitle] = useState('');
  const [fileList, setFileList] = useState('');
  const [fmginfos, setFmgInfos] = useState(localStorage.getItem('infos'));
  const PFile = {
    response: { key: infos.cover },
    uid: 1,
    name: infos.cover,
    status: 'done', 
  };
  const subscribeInfos = (text) => {
    localStorage.setItem('infos', text);
    setFmgInfos(text);
  };
  useEffect(() => {
    setInfosTitle(infos.title);
    setFmgInfos(infos.content);
    setFileList([PFile]);
  }, [infos]);
  const getQiNiuToken = () => {
    request('/api.farm/goods/resources/qiniu/upload_token', {
      method: 'GET',
    }).then(
      (response) => {
        setQiniuToken(response.token);
      }
    );
  };
  //看到其他的都要加true啊要不gettoken没用
  const getUploadToken = () => {
    getQiNiuToken();
    return true;
  };
  const handleChange = ({ file  }) => {
    const {
      uid, name, type, thumbUrl, status, response = {},
    } = file;
    const fileItem = {
      uid,
      name,
      type,
      thumbUrl,
      status,
      response,
      url: BASE_QINIU_URL + (response.key || ''),
    };
    setPreviewImage(fileItem.url);
    setFileList([fileItem]);
    localStorage.setItem('FileList', JSON.stringify(fileItem));
  };
 
  return (
    <>
      <Modal
        title="FMG资讯"
        width="70vw"
        visible={show}
        destroyOnClose 
        onCancel={() => closeInfosModel(false)}
        onOk={() => {
          props.dispatch({
            type: 'fmgInfos/AdjInfos',
            payload: {
              finalData: {
                title: infosTitle,
                content: filterHTMLTag(fmginfos),
                cover: fileList[0].response.key,
              },
              Iid: infos.id, 
            },
          });
          localStorage.removeItem('infos');
          closeInfosModel(false);
        }}
      >
        <div className="fmg-infos-creator-container">
          <div className="fmg-infos-creator-title">
            <span>资讯标题: </span>
            <Input
              value={infosTitle}
              style={{
                display: 'inline-flex',
                width: '50vw',
                marginLeft: 20,
                marginBottom: 20, 
              }}
              onChange={(e) => {
                setInfosTitle(e.target.value);
              }}
            />
          </div>
          <div className="fmg-infos-creator-title">
            <span style={{
              position: 'fixed',
            }}
            >
              资讯摘要:
              {' '}
            </span>
            <TextArea
              style={{
                width: '50vw',
                marginLeft: 80,
                marginBottom: 10, 
              }}
              onChange={(e) => {
                setInfosPreSeem(e.target.value);
              }}
            />
          </div>
          <div className="fmg-infos-creator-title">
            <span  style={{
              display: 'inline-flex',
            }}
            >
              资讯封面:
              {' '}
            </span>
            <div
              onClick={getUploadToken}
              style={{
                display: 'inline-flex',
                width: '40vw',
                marginLeft: 20,
                marginBottom: 10,
              }}
            >
              <ImgCrop aspect={pictureSize.rolling} grid>
                <Upload
                  action={QINIU_SERVER}
                  data={{
                    token: qiniuToken,
                    key: `picture-${Date.parse(new Date())}`,
                  }}
                  showUploadList={false}
                  listType="picture-card"
                  beforeUpload={getUploadToken}
                  onChange={handleChange}
                >
                  {fileList[0] ? <img
                    src={fileList[0] 
                      ? BASE_QINIU_URL + fileList[0].response.key : null}
                    alt="avatar"
                    style={{ width: '100%' }}
                  /> :  uploadButton}
                </Upload>
              </ImgCrop>
            </div>
          </div>
     
          <RichTextEditor 
            subscribeRichText={subscribeInfos} 
            defaultText={fmginfos}
          />
        </div>
      </Modal>
    </>
  );
};
export default connect(({ fmgInfos }) => ({
  InfosList: get(fmgInfos, 'InfosList', []),
}))(FmgInfoCreator);
