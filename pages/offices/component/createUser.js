import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { db, auth } from '@/services/firebase';
import { getCampuses, getOffices } from '@/services/fecthData';
import { useRouter } from 'next/router';

const layouts = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 24,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */


const { Option } = Select;
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

const CreateUser = ({handleOk,confirmLoading,handleCancel,genKey,...props}) => {
    const [form] = Form.useForm();
   
    return(
            <Form key={genKey} form={form}  {...layouts} layout="vertical" name="nest-messages" onFinish={handleOk} validateMessages={validateMessages}>
                
                <Form.Item
                    name={'name'}
                    label="Name"
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                    tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                <Input autoComplete={'off'} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layouts.wrapperCol}}
                    rules={[
                        {
                        required: true,
                        },
                    ]}>
                <Space>
                    
                    <Button type="primary" htmlType="submit" loading={confirmLoading}>
                        Submit
                    </Button>
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                </Space>
                </Form.Item>
            </Form>
    )
}

export default CreateUser;