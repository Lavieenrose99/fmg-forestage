import React, { useState } from 'react';
import { Modal, Input, Tag } from 'antd';
import { connect } from 'umi';
import { get } from 'lodash';

const FmgInfosTagsHandler = (props) => {
  const { show, close, infos } = props;
  const [ifDel, setIfDel] = useState(false);
  const [delId, setDelId] = useState(0);
  return (
    <Modal
      visible={show}
      onCancel={() => { close(false); }}
      onOk={() => {
        props.dispatch({
          type: 'fmgInfos/createInfosTags',
          payload: { name: tagsName },
        });
      }}
    >
      <span style={{ marginBottom: 5, display: 'block' }}>标签名称: </span>
      {
          infos.map((tags) => {
            return (
              <Tag
                closable={ifDel && (delId === tags.id)}
                key={tags.id}
                onMouseDown={() => {
                  setTimeout(() => {
                    setIfDel(true);
                    setDelId(tags.id);
                  }, '1000');
                }}
                onMouseUp={
                  () => {
                    console.log('end');
                  }
              }
              >
                {tags.name}
              </Tag>
            );
          })
      }
    </Modal>
  );
};

export default connect(({ fmgInfos }) => ({
  InfosList: get(fmgInfos, 'InfosList', []),
  TagsList: get(fmgInfos, 'TagsInfosList', []), 
}))(FmgInfosTagsHandler);
