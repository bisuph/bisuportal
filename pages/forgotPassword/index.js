import { Form, Input, notification, Button, Row, Col, Card, message, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { useRouter } from 'next/router';
import { checkUserExist } from '../../services/fecthData';

const layouts = {
    labelCol: {
        span: 24,
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

const ForgotPassword = () => {
    const router = useRouter()

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
          if (user) {
            router.push("/")
          } 
        })
      
        return () => {
          
        }
    }, [])
      
    const onFinish = (values) => {

        auth().sendPasswordResetEmail(values.email).then(function() {
            message.success('Email sent')
            router.push('/signin')
        // Email sent.
        }).catch(function(error) {
        // An error happened.
        });        
    };
        
    return(
    <Row justify="center">
        <Col sm={16} md={6} lg={6} xl={6}></Col>
        <Col xs={22} sm={16} md={10 } lg={8} xl={6}>
        <div className="site-card-border-less-wrapper">
            <Card title="Find your account" bordered={false} style={{ width: '100%' ,marginTop:100, borderRadius:'8px', boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}>
            <Form {...layouts} layout="vertical" name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                
                <Form.Item
                    name={'email'}
                    label="Email"
                    rules={[
                        {
                        type: 'email',
                        },
                    ]}
                    tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                <Input size={'large'} style={{borderRadius:'6px'}} autoComplete={'off'}/>
                </Form.Item>

                <Form.Item >
                <Space direction='vertical' style={{width:'100%'}}>
                <Button type="primary" htmlType="submit" style={{width:'100%',borderRadius:'6px'}} size={'large'}>
                    Submit
                </Button>
                <Button type="primary" danger onClick={()=>router.push('/signin')} style={{width:'100%',borderRadius:'6px'}} size={'large'}>
                    Cancel
                </Button>
                </Space>
                </Form.Item>
            </Form>
            </Card>
        </div>
        </Col>
        <Col sm={16} md={6} lg={6} xl={6}></Col>
    </Row>
    )
}

export default ForgotPassword;