import { Form, Input, notification, Button, Row, Col, Card } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { auth, db } from '@/services/firebase';
import { useRouter } from 'next/router';

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

const Signin = () => {
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

        auth().onAuthStateChanged(function(user) {
            if (user) {
              router.push("/");
            } else {
                var docRef = db.collection("User").doc(values.email);

                docRef.get().then((doc) => {
                    if (doc.exists) {
                        auth().createUserWithEmailAndPassword(values.email, values.password)
                        .then((userCredential) => {
                            // Signed in 
                            var user = userCredential.user;

                            // ...
                        })
                        .catch((error) => {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // ..
                        });
                    } else {
                        // doc.data() will be undefined in this case
                        unAuthorize()
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });

                
            }
        });
        
    };
        

    const unAuthorize = () => {
        notification.error({
          message: `Error`,
          description:
            'Unauthorize email.',
          placement:"top",
        });
      };

    return(
    <Row justify="center">
        <Col sm={16} md={6} lg={6} xl={6}></Col>
        <Col xs={22} sm={16} md={10 } lg={8} xl={6}>
        <div className="site-card-border-less-wrapper">
            <Card title="Signup" bordered={false} style={{ width: '100%' ,marginTop:100, borderRadius:'8px', boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}>
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

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password size={'large'} style={{borderRadius:'6px'}} autoComplete={'off'} />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password size={'large'} style={{borderRadius:'6px'}} autoComplete={'off'}  />
                </Form.Item>

                <Form.Item >
                <Button type="primary" htmlType="submit" style={{width:'100%',borderRadius:'6px'}} size={'large'}>
                    Submit
                </Button>
                </Form.Item>
            </Form>
            </Card>
        </div>
        </Col>
        <Col sm={16} md={6} lg={6} xl={6}></Col>
    </Row>
    )
}

export default Signin;