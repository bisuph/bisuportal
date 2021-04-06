import { Form, Input, Button, Checkbox, Layout, Row, Col, Card } from 'antd';
import {
  QuestionCircleOutlined,
  GooglePlusOutlined,
} from '@ant-design/icons';
import { signup, signInWithGoogle  } from '../../services/auth';
import { auth } from '../../services/firebase';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const { Content} = Layout;

export default function Demo () {
  const [form] = Form.useForm();
  const router = useRouter()

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        router.push("/")
      } 
    })
  
    return () => {
      
    }
  }, [])

  function onFinish (values) {
    console.log('Success:', values);
    const {email,password} = values
    try {
      auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });

      //  signup(state.email, state.password);
    } catch (error) {
      // setState({ error: error.message });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  async function googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error)
      // setState({ error: error.message });
    }
  }
  
  return (
    <>
    <Content >
    <Row>
      <Col span={8}></Col>
      <Col span={8}>
        <Card title="Money Management Sys" style={{ width: 500, marginTop:100 }}>
            <Form
                form={form}
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                      
                <Button type="primary" block style={{marginBottom:10}} htmlType="submit">
                  Log in
                </Button>

                <Button block icon={<GooglePlusOutlined />} onClick={()=> googleSignIn()}>
                  Sign in with Google
                </Button>
            </Form>
        </Card>
      </Col>
      <Col span={8}></Col>
    </Row>
    
    </Content>
    </>
  );
};
