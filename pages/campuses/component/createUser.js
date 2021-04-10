import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TextArea from 'antd/lib/input/TextArea';
import { db, auth } from '../../../services/firebase';

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

const CreateUser = ({handleOk,confirmLoading,handleCancel,genKey,...props}) => {
    const [form] = Form.useForm();
   
    const router =  useRouter()
    const [loading, setLoading] = useState(false);
    const [userCred, setUserCred] = useState(null);
    useEffect(() => {
        var unsubscribe = null
        setLoading(true)
        auth().onAuthStateChanged((user) => {
          if (user) {
            form.setFieldsValue({ name: ''});
            form.setFieldsValue({ address: ''});
            
          } else {
            router.push("/signin")
          }
        })
        setLoading(false)
      
        return () => {
        //   unsubscribe()
        }
    },[genKey])

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

                <Form.Item
                    name={'address'}
                    label="Address"
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
                <TextArea autoComplete={'off'} />
                </Form.Item>

                <Form.Item 
                    rules={[
                        {
                        required: true,
                        },
                ]}>
                <Space style={{float:'right'}}>
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={confirmLoading}>
                        Submit
                    </Button>
                </Space>
                </Form.Item>
            </Form>
    )
}

export default CreateUser;