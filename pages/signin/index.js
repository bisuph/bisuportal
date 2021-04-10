import { Form, Input, Button, Checkbox, Layout, Row, Col, Card, Typography, message } from 'antd';
import { auth } from '../../services/firebase';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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
const { Title } = Typography;

export default function Demo () {
  const [form] = Form.useForm();
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

  function onFinish (values) {
    const {email,password} = values

    try {
      auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        message.error('Invalid email/password.');
        var errorCode = error.code;
        var errorMessage = error.message;
      });

      //  signup(state.email, state.password);
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
    <Row justify="center">
      <Col sm={16} md={6} lg={6} xl={6}>

      </Col>
      <Col xs={22} sm={16} md={10 } lg={8} xl={6}>
        <Card title="BISU Portal" style={{  marginTop:100, borderRadius:'8px', boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)' }}>
            <Form
                form={form}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                >
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                  <Input 
                      prefix={<UserOutlined className="site-form-item-icon" />} 
                      placeholder="Email" 
                      size='large' 
                      style={{borderRadius:'6px'}}
                      autoComplete={'off'}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    size='large' style={{borderRadius:'6px'}}
                    autoComplete={'off'}

                  />
                </Form.Item>
                <Form.Item>
                  <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{width:'100%',borderRadius:'6px',height:'48px'}} size={'large'}>
                    <Title level={4} strong={true} style={{color:'white'}}>Log In</Title>
                  </Button>
                  Or <a href="/signup">register now!</a>
                </Form.Item>

            </Form>
        </Card>
      </Col>
      <Col sm={16} md={6} lg={6} xl={6}>

      </Col>
    </Row>
    </>
  );
};
