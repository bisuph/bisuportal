import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

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


const CreateUser = ({handleOk,confirmLoading,handleCancel,form,...props}) => {
   
    return(
            <Form form={form}  {...layouts} layout="vertical" name="nest-messages" onFinish={handleOk} validateMessages={validateMessages}>
                
                <Form.Item
                    name={'name'}
                    label="Office"
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
                <Input size={'large'} autoComplete={'off'} />
                </Form.Item>
                
                <Form.Item name={'role'} label="Role" 
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                >
                        <Select size='large' style={{ width: '100%' }}  >
                            {['Admin','Member'].map((value,i) => (
                                <Option key={value}>{value}</Option>
                            ))}
                        </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layouts.wrapperCol}}>
                    
                <Space direction='vertical' style={{width:'100%'}}>
                    
                    <Button type="primary" htmlType="submit" loading={confirmLoading} style={{width:'100%'}}>
                        Submit
                    </Button>
                    <Button onClick={handleCancel} style={{width:'100%'}}>
                        Cancel
                    </Button>

                </Space>
                </Form.Item>
            </Form>
    )
}

export default CreateUser;