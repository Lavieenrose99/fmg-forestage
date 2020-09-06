/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import {
  Form, Input, Button, Select,
  Checkbox, InputNumber, DatePicker,
  Divider, Upload, Modal, Steps, Radio, Switch, Space, Table, Result
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PlusOutlined, UploadOutlined, SmileOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
import request from '@/utils/request';
import PropTypes from 'prop-types';
import React, {
  useState, useEffect, useRef
} from 'react';
import { get } from 'lodash';

const { Option, OptGroup } = Select;

const TemplateAdj = (props) => {
  return (
    <>
    </>
  );
};

export default TemplateAdj;
