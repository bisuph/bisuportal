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
    try {
      //  signup(state.email, state.password);
    } catch (error) {
      // setState({ error: error.message });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  async function googleSignIn() {
    alert()
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
                    label="Username"
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
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
                  Submit
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
