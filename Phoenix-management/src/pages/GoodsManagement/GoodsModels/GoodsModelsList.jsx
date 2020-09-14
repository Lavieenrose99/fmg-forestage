/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Table, Input, Button, Popconfirm, Form, 
  Modal, Space, message, Tag, Divider, Switch 
} from 'antd';
import { connect } from 'umi';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { PlusCircleTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect(({ goodsModels }) => ({
  goodsModels,
  goodsModelsList: get(goodsModels, 'infos', ''),
  ModelsTotal: get(goodsModels, 'total', ''),
})) 
class GoodsModelsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '模版编号',
        dataIndex: 'id',
      },
      {
        title: '模版名称',
        dataIndex: 'title',
      },
      {
        title: '规格列表',
        dataIndex: 'template',
        render: (text) => (
          <>
            <Space size="small">
              {
                  text.map((arr) => {
                    return <Tag>{arr.name}</Tag>;
                  })
              }
            </Space>
          </>
        ),
      },
      {
        title: '启用规格',
        dataIndex: 'template',
        render: (text) => (
          <>
            <Space size="small">
              {
                  text.filter((arr) => {
                    return arr.use === true;
                  }).map((specification) => {
                    return <Tag>{specification.name}</Tag>;
                  })
              }
            </Space>
          </>
        ),
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <>
            <Space size="large">
              <a>查看商品</a>
              <a onClick={() => this.handleChange(text, record)}>修改</a>
              <a onClick={() => this.comfirmDelArea(text)}>删除</a>
            </Space>
          </>
        ),
      }
    ];
    this.state = {
      checkedUse: true,
      specificationAtom: '',
      specifications: [],
      teTitle: '',
      pageSize: 5,
      current: 1,
      setTemplateTitle: '',
      setSpecification: [],
      setTemplateId: '', 
      visible: false,
      changeVisible: false,
      page: 1,
      limit: 5,
    };
    this.InputTemplateTitle = this.InputTemplateTitle.bind(this);
  }

  componentDidMount() {
    //初始化拉取表格数据
    this.handleGetListData();
  }
  
  InputTemplateTitle=(e) => {
    this.setState({
      teTitle: e.target.value,
    });
  }

  InputModelsAtoms =(e) => {
    e.stopPropagation();
    this.setState({
      specificationAtom: e.target.value,
    });
  }
 
  submitAtoms =() => {
    const { specificationAtom, specifications, checkedUse } = this.state; 
    const atom = {
      name: specificationAtom, 
      use: checkedUse, 
    };
    this.setState({
      specifications: [...specifications, atom],
      specificationAtom: '',
    });
  }

  changePage=(current) => {
    this.setState({
      current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModels/fetchModelsTags',
      payload: { page: current, limit: 5 }, 
    });
  }

  ChangeTemplateTitle=(e) => {
    this.setState({
      setTemplateTitle: e.target.value,
    });
  }

 comfirmDelArea =(id) => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认删除该模版信息吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.handleDelete(id),
   });
 }

 comfirmSubmitModels =() => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认提交模版信息吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.subTemplate(),
   });
 }

 comfirmSubmitChangeModel =() => {
   Modal.confirm({
     mask: false,
     title: '凤鸣谷',
     content: '确认提交属地信息吗',
     okText: '确认',
     cancelText: '取消',
     onOk: () => this.changeModel(),
   });
 }
 
 changeModel=() => {
   const { dispatch } = this.props;
   const {
     page, limit, setSpecification, 
     setTemplateTitle, setTemplateId, 
   } = this.state;
   if (setTemplateTitle !== '' || setSpecification.length === 0) {
     dispatch({
       type: 'goodsModels/adjModelsTags',
       payload: {
         template: setSpecification,
         title: setTemplateTitle,
         tid: setTemplateId,
         query: {
           page,
           limit,
         },
       },
     });
     this.setState({
       changeVisible: false,
       setTemplateTitle: '',
       setTemplateId: '',
       setSpecification: [],
     });
   } else {
     message.error('属性不能为空');
   }
 }

 subTemplate=() => {
   const { dispatch } = this.props;
   const {
     page, limit, teTitle, specifications, 
   } = this.state;
   if (teTitle !== '') {
     dispatch({
       type: 'goodsModels/setModelsTags',
       payload: {
         title: teTitle,
         template: specifications,
         query: {
           page,
           limit,
         },
       },
     });
     this.setState({
       teTitle: '',
       specifications: [],
       visible: false,
     });
   } else {
     message.error('属性不能为空');
   }
 }

 handleCancel=() => {
   const { visible } = this.state;
   this.setState({
     visible: !visible,
   });
 }

 handleChangeCancel=() => {
   const { changeVisible } = this.state;
   this.setState({
     changeVisible: !changeVisible,
   });
 }

 handleAdd=() => {
   const { visible } = this.state;
   this.setState({
     visible: !visible,
   });
 }

 handleChange=(id, template) => {
   const { visible } = this.state;
   this.setState({
     changeVisible: !visible,
     setTemplateTitle: template.title,
     setSpecification: template.template,
     setTemplateId: id,
   });
 }

 handleDelete = (aid) => {
   const { page, limit } = this.state;
   const { dispatch } = this.props;
   dispatch({
     type: 'goodsModels/delModelsTags',
     payload: {
       tid: aid,
       query: {
         page,
         limit,
       },
     }, 
   });
 };

 handleSwitchChoose = (checked) => {
   this.setState({ checkedUse: checked });
 }

 handleSwitchChange = (arr) => {
   const newSepc = [];
   const { specifications } = this.state;
   for (let i = 0; i < specifications.length; i++) {
     if (i === (specifications || [])
       .findIndex((specification) => specification.name === arr.name)) {
       newSepc[i] = { name: arr.name, use: !arr.use };
     } else {
       newSepc[i] = specifications[i];
     }
   }
   this.setState({
     specifications: newSepc,
   });
 }

 handleSwitchAdj = (arr) => {
   const newSepc = [];
   const { setSpecification } = this.state;
   for (let i = 0; i < setSpecification.length; i++) {
     if (i === (setSpecification || [])
       .findIndex((specification) => specification.name === arr.name)) {
       newSepc[i] = { name: arr.name, use: !arr.use };
     } else {
       newSepc[i] = setSpecification[i];
     }
   }
   this.setState({
     setSpecification: newSepc,
   });
 }

 handleCloseCreateSpec = (spec) => {
   const { specifications } = this.state;
   const Sepc = specifications;
   const newSepc = Sepc.filter((arr, index) => {
     return index !== (specifications || [])
       .findIndex((specification) => specification.name === spec.name); 
   });
   this.setState({
     specifications: newSepc,
   });
 }

 handleCloseAdjSpec = (spec) => {
   const { setSpecification } = this.state;
   const Sepc = setSpecification;
   const newSepc = Sepc.filter((arr, index) => {
     return index !== (setSpecification || [])
       .findIndex((specification) => specification.name === spec.name); 
   });
   this.setState({
     setSpecification: newSepc,
   });
 }

 handleGetListData = () => {
   const { dispatch } = this.props;
   dispatch({
     type: 'goodsModels/fetchModels',
     payload: { page: 1, limit: 5  }, 
   });
 };

 render() {
   const {
     visible, changeVisible, setTemplateTitle, 
     pageSize, current, specifications,
     specificationAtom, checkedUse, setSpecification,
   } = this.state;
   const { goodsModelsList, ModelsTotal } = this.props;
   const columns = this.columns.map((col) => {
     return col;
   });
   const paginationProps = {
     showQuickJumper: false,
     showTotal: () => `共${ModelsTotal}条`,
     pageSize,
     current,
     onChange: (current) => this.changePage(current),
   };
   return (
     <PageHeaderWrapper>
     <div className="fmg-goods-area-list-tags">
       <Button
         onClick={this.handleAdd}
         type="primary"
         style={{
           marginBottom: 16,
         }}
         icon={<PlusCircleTwoTone />}
       >
         添加模版
       </Button>
       <Modal
         mask={false}
         title="凤鸣谷"
         visible={visible}
         onOk={this.comfirmSubmitModels}
         onCancel={this.handleCancel}
         okText="提交"
         cancelText="取消"
       >
         <Divider orientation="left" plain>模版名称</Divider>
         <Input placeholder="请输入模版名称" onChange={this.InputTemplateTitle} />
         <Divider orientation="left" plain>模版规格</Divider>
         <Input
           placeholder="输入规格"
           value={specificationAtom}
           onChange={(e) => this.InputModelsAtoms(e)}
           style={{
             width: '10vw ', 
             marginRight: 10, 
           }}
         />
         <Switch
           checkedChildren="启用"
           unCheckedChildren="暂不启用"
           checked={checkedUse}
           onChange={this.handleSwitchChoose}
           defaultChecked
           style={{
             marginRight: 10, 
           }}
         />
         <div>
           <Button
             onClick={() => { this.submitAtoms(); }}
             style={{
               marginTop: 10, 
             }}
           >
             确认
           </Button>
         </div>
         <Divider orientation="left" plain>规格列表</Divider>
         { 
         specifications.map((arr) => {
           return <div style={{
             marginBottom: 20, 
           }}
           >
             <Tag
               style={{
                 marginLeft: 10, 
               }}
             >
               {arr.name}
             </Tag>
             <Switch
               checkedChildren="启用"
               unCheckedChildren="暂不启用"
               checked={arr.use}
               onChange={(e) => this.handleSwitchChange(arr)}
               style={{
                 marginRight: 10, 
               }}
             />
             <Button
               type="dashed"
               danger
               size="small"
               icon={<DeleteTwoTone twoToneColor="red" />}
               onClick={() => this.handleCloseCreateSpec(arr)}
             >
               移除
             </Button>
           </div>; 
         })
}
       </Modal>
       <Modal
         mask={false}
         title="凤鸣谷"
         visible={changeVisible}
         onOk={this.comfirmSubmitChangeModel}
         onCancel={this.handleChangeCancel}
         okText="提交"
         cancelText="取消"
       >
         <Divider orientation="left" plain>模版名称</Divider>
         <Input value={setTemplateTitle} onChange={this.ChangeTemplateTitle} />
         <Divider orientation="left" plain>规格列表</Divider>
         {setSpecification.map((arr) => {
           return <div style={{
             marginBottom: 20, 
           }}
           >
             <Tag
               style={{
                 marginLeft: 10, 
               }}
             >
               {arr.name}
             </Tag>
             <Switch
               checkedChildren="启用"
               unCheckedChildren="暂不启用"
               checked={arr.use}
               onChange={(e) => this.handleSwitchAdj(arr)}
               style={{
                 marginRight: 10, 
               }}
             />
             <Button
               type="dashed"
               danger
               size="small"
               icon={<DeleteTwoTone twoToneColor="red" />}
               onClick={() => this.handleCloseAdjSpec(arr)}
             >
               移除
             </Button>
           </div>; 
         })}
       </Modal>
       <Table
         rowClassName={() => 'editable-row'}
         bordered
         dataSource={goodsModelsList}
         columns={columns}
         pagination={paginationProps}
       />
     </div>
     </PageHeaderWrapper>
   );
 }
}
GoodsModelsList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goodsModelsList: PropTypes.arrayOf({}),
  ModelsTotal: PropTypes.string.isRequired,
};
GoodsModelsList.defaultProps = {
  goodsModelsList: [],
};

export default GoodsModelsList;
