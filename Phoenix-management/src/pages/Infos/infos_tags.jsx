import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { connect } from 'umi';
import { get } from 'lodash';

const FmgInfosTagsCreator = (props) => {
  const { showModal, close } = props;
  const [tagsName, setTagsName] = useState('');
  return (
    <Modal
      visible={showModal}
      onCancel={() => { close(false); }}
      onOk={() => {
        props.dispatch({
          type: 'fmgInfos/createInfosTags',
          payload: { name: tagsName },
        });
      }}
    >
      <span style={{ marginBottom: 5, display: 'block' }}>标签名称: </span>
      <Input onChange={(e) => {
        setTagsName(e.target.value);
      }}
      />
    </Modal>
  );
};

export default connect(({ fmgInfos }) => ({
  InfosList: get(fmgInfos, 'InfosList', []),
  TagsList: get(fmgInfos, 'TagsInfosList', []), 
}))(FmgInfosTagsCreator);
