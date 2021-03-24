import React, { useState } from 'react';
import { Drawer, Button, Form, Input, Row, Col, DatePicker } from 'antd';
import {
    QuestionCircleOutlined,
    GooglePlusOutlined,
} from '@ant-design/icons';
import { db, auth } from '../../../services/firebase';
import moment from 'moment';

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
export default function AddUser ({...props}){
  
    const [form] = Form.useForm();
    const [state,setState] = useState({visible:false})
    function onFinish (values) {
        try {
            values.birthday = moment(values.birthday).format("YYYY-MM-DD")
            auth().onAuthStateChanged((user) => {
                if (user) {
                    db.collection(user.uid).doc('database').collection('accounts').add(values)
                    .then(function(docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        props?.onFinish(docRef.id)
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
                } else {
                router.push("/login")
                }
            })
            
            
        
        } catch (error) {
          console.log({ error: error.message });
        }
      };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    
    


    return (
        <>
        <Drawer
          title="Create a new account"
          width={720}
          onClose={props?.onClose}
          visible={props?.isModalVisible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {/* <Button onClick={props?.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={props?.onClose} type="primary">
                Submit
              </Button> */}
            </div>
          }
        >
        <Form
            form={form}
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter user name' }]}
                >
                  <Input placeholder="Please enter user name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="birthday"
                  label="Birthday"
                  rules={[{ required: true, message: 'Please select your birthday' }]}
                >
                  <DatePicker  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="work"
                  label="Work"
                  rules={[{ required: true, message: 'Please enter your work' }]}
                >
                  <Input placeholder="Please enter your work" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please enter your address' }]}
                >
                  <Input placeholder="Please enter your address" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'please enter url description',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="please enter url description" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item {...tailLayout} >
                    <Button type="primary" htmlType="submit" style={{float:'right'}}>
                    Submit
                    </Button>
                </Form.Item>    
              </Col>
            </Row>
        </Form>
        </Drawer>
        </>
    );
};
