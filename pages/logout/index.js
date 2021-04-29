import { Spin, Alert, Form, Layout } from 'antd';
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
      if (user) {
        // router.push("/")
      } 
      else{
        router.push("/signin")
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
      setState({ error: error.message });
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
      setState({ error: error.message });
    }
  }
  
  return (
    <>
    <Content >
    <Spin tip="Loading...">
      <Alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </Spin>
    </Content>
    </>
  );
};
