import React, {
  useState, useEffect, useRef
}  from 'react';
import {  UploadOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import {
  Form, Icon,
  Input, Button, Select, PageHeader,
  Upload, Modal, Divider, Table, Space, Tabs
} from 'antd';
import {
  layout, tailLayout 
} from '@/utils/Layout/basic_layout.jsx';
import { connect } from 'umi';
import { get } from 'lodash';
import { QINIU_SERVER, BASE_QINIU_URL } 
  from '@/utils/Token';

const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
  
const IconUpload = (props) => {
  const [qiniuToken, setQiniuToken] = useState('');
  const [form] = Form.useForm();
  const [showAdj, setShowAdj] = useState(false);
  const [oriName, setOriName] = useState('');
  const [oriTitle, setOriTitle] = useState('');
  const [oriPicture, setOriPicture] = useState('');
  const [rid, setRid] = useState(0);
  const [fileList, setFileList] = useState(([]));
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
    setFileList([fileItem]);
  };
  const handleChangefile = ({ file  }) => {
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
    setOriPicture(fileItem.response.key);
  };
  const getQiNiuToken = () => {
    request('/api.farm/goods/resources/qiniu/upload_token', {
      method: 'GET',
    }).then(
      (response) => {
        setQiniuToken(response.token);
      }
    );
  };
  const getUploadToken = () => {
    getQiNiuToken();
  };
  const uploadButton = (
    <div>
      <div className="ant-upload-text">
        <UploadOutlined />
        上传
      </div>
    </div>
  );
  useEffect(() => {
    props.dispatch({
      type: 'Icons/fetchIcons',
      payload: {
        query: {
          page: 1,
          limit: 99,
        },
      }, 
    });
  }, []);
  const submitDelIcons = (tid) => {
    props.dispatch({
      type: 'Icons/delIcons',
      payload: tid,
    
    });
  };
  const comfirmDelIcon = (tid) => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认删除图标信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => submitDelIcons(tid),
    });
  };
  const subIcons = (data) => {
    props.dispatch({
      type: 'Icons/createIcons',
      payload: data,
  
    });
    form.resetFields();
    setFileList([]);
  };
  const handelAdjustIcons = (data) => {
    setShowAdj(true);
    setOriName(data.name);
    setOriTitle(data.title);
    setOriPicture(data.picture);
    setRid(data.id);
  };
  const submitChangeIcons = () => {
    props.dispatch({
      type: 'Icons/adjIcons',
      payload: {
        rid,
        picture: oriPicture,
        name: oriName,
        title: oriTitle,
      }, 
    });
    setShowAdj(false);
  };
  const comfirmAdjustIcons = () => {
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交轮播图信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: submitChangeIcons,
    });
  };
  const handleChangeCancel = () => {
    setShowAdj(false);
  };
  const handleChangeTitle = (data) => {
    setOriTitle(data.target.value);
  };
  const handleChangeName = (e) => {
    setOriName(e.target.value);
  };
  const onFinish = (values) => {
    const picture = fileList[0].response.key;
    const pIconInfos = Object.assign(values, { picture });
    Modal.confirm({
      mask: false,
      title: '凤鸣谷',
      content: '确认提交轮播图信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { subIcons(pIconInfos); },
    });
  };
  const { iconsList } = props;
  return (
    <PageHeader 
      title="图标管理"
      subTitle="url是图标到七牛地址"
      style={{ backgroundColor: 'white' }}
      footer={<Tabs defaultActiveKey="1">
        <TabPane tab="图标列表" key="1" style={{ marginTop: 20 }}>
          <Table dataSource={iconsList}>
            <Column
              title="图标区域"
              dataIndex="title"
              key="title"
            />
            <Column
              title="图标名称"
              dataIndex="name"
              key="name"
            />
            <Column
              title="图标" 
              dataIndex="picture"
              key="picture"
              render={(text, record) => (
                <div style={{ textAlign: 'left' }}>
                  <img
                    src={record ? BASE_QINIU_URL + record.picture : null}
                    alt="img" 
                    style={{ width: 30, height: 30, marginRight: 20  }}
                  />
                </div>
              )}
            />
            <Column
              title="图标地址" 
              dataIndex="picture"
              key="picture_address"
              render={(text, record) => (
                <div style={{ textAlign: 'left' }}>
                  {BASE_QINIU_URL + record.picture}
                </div>
              )}
            />
            <Column
              title="操作"
              key="id"
              render={(text, record) => (
                <Space size="middle">
                  <span>
                    <Icon
                      type="edit"
                      style={{ marginLeft: 8 }}
                    />
                    <a onClick={() => handelAdjustIcons(record)}>修改</a> 
                    <Modal
                      mask={false}
                      title="凤鸣谷"
                      visible={showAdj}
                      onOk={comfirmAdjustIcons}
                      onCancel={handleChangeCancel}
                      okText="提交"
                      cancelText="取消"
                    >
                      <Divider orientation="left" plain>区域</Divider>
                      <Input defaultValue={oriTitle} value={oriTitle} onChange={handleChangeTitle} style={{ width: '18vw' }} />
                      <Divider orientation="left" plain>名称</Divider>
                      <Input defaultValue={oriName} value={oriName} onChange={handleChangeName} style={{ width: '18vw' }} />
                      <Divider orientation="left" plain>图片</Divider>
                      <span onClick={getQiNiuToken}>
                        <Upload
                          action={QINIU_SERVER}
                          data={
           {
             token: qiniuToken,
             key: `icon-${Date.parse(new Date())}`,
           }
}
                          listType="picture-card"
                          beforeUpload={getQiNiuToken}
                          showUploadList={false}
                    //fileList={oriPicture}
                          onChange={handleChangefile}
                        >
                          {oriPicture  
                            ? <img src={BASE_QINIU_URL + oriPicture} alt="" style={{ height: 80, width: 80 }} /> : uploadButton}
                        </Upload>
                      </span>
                      <Upload />
                    </Modal>
                  </span>
                  <a onClick={() => comfirmDelIcon(record.id)}>删除</a>
                </Space>
              )}
            />

          </Table>
        </TabPane>
        <TabPane tab="添加图标" key="2">
          <Form
            style={{ marginTop: 50 }}
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="位置"
              name="title"
              rules={[
                {
                  required: true,
                  message: '请输入图标位置',
                }
              ]}
            >
              <Input style={{ width: '18vw' }} />
            </Form.Item>
            <Form.Item
              label="名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入图标名称',
                }
              ]}
            >
              <Input style={{ width: '18vw' }} />
            </Form.Item>
            <Form.Item
              label="图标"
              rules={[
                {
                  //required: true,
                }
              ]}
            >
              <>
                <span onClick={getUploadToken}>
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
                </span>
              </>
         
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
    
      </Tabs>}
    />
  );
};
  
export default connect(({ Icons }) => ({
  Icons,
  iconsList: get(Icons, 'info', []), 
 
}))(IconUpload);
