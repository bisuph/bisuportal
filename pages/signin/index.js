import { Form, Input, Button, Checkbox, Layout, Row, Col, Card, Typography, message, Space } from 'antd';
import { auth, fire } from '../../services/firebase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { checkUserExist } from '../../services/fecthData';

const { Title } = Typography;
const { Footer } = Layout;

export default function Signin () {
  const [form] = Form.useForm();
  const router = useRouter()
  const [loading,setLoading] = useState(false)

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
    setLoading(true)
    try {
      auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        checkUserExist(email).then(function(result){
          if(result.length === 0){
            var user = fire.auth().currentUser;
            user.delete().then(function() {
              message.error('Unauthenticated account.')
            }).catch(function(error) {
              // An error happened.
            });
          }
        })
        // Signed in
        setLoading(false)
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        setLoading(false)
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
    <Row justify="center" style={{marginTop:100,}}>
      
      <Col sm={22} md={10} lg={10} xl={10}>
        <Space direction='vertical' align='center' style={{width:'100%'}} wrap={true}>
          <img src='https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png' />
          <Title style={{color:'#0567c1',marginBottom:0}} level={3} align='center'>Electronic Records Management System </Title>
          {/* <Title style={{color:'#0567c1',marginBottom:0}} level={3} align='center'>Of</Title>  */}
          <Title style={{color:'#0567c1'}} level={3} align='center'>Bohol Island State University</Title>
        </Space>
      </Col>
      <Col xs={22} sm={16} md={10 } lg={8} xl={6}>
        
        <Card title="Signin" style={{   borderRadius:'8px', boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)' }}>
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
                  <a className="login-form-forgot" href="/forgotPassword">
                    Forgot password
                  </a>
                </Form.Item>

                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit" className="login-form-button" style={{width:'100%',borderRadius:'6px',height:'48px'}} size={'large'}>
                    {!loading ? <Title level={4} strong={true} style={{color:'white'}}>Log In</Title> : ''}
                  </Button>
                  Or <a href="/signup">Signup</a>
                </Form.Item>

            </Form>
        </Card>
      </Col>
      
    </Row>
    <Footer style={{ textAlign: 'center' }}>Electronic Records Management System  ©2021</Footer>
    </>
  );
};
