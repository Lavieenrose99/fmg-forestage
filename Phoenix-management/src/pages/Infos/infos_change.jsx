import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { connect } from 'umi';
import { get } from 'lodash';
import RichTextEditor from '../../utils/RichTextEditor.jsx';
import { filterHTMLTag } from '../../utils/adjust_picture';

const FmgInfoCreator = (props) => {
  const { show, closeInfosModel } = props;
  const [infosTitle, setInfosTitle] = useState('');
  const [fmginfos, setFmgInfos] = useState(localStorage.getItem('infos'));
  const subscribeInfos = (text) => {
    localStorage.setItem('infos', text);
    setFmgInfos(text);
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
            type: 'fmgInfos/createInfos',
            payload: {
              title: infosTitle,
              content: filterHTMLTag(fmginfos),
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
