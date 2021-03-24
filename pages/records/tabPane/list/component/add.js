import React, { useState, useEffect } from 'react';
import { Drawer, Button, Form, Input, Row, Col, DatePicker, Select, InputNumber } from 'antd';
import {
    QuestionCircleOutlined,
    GooglePlusOutlined,
} from '@ant-design/icons';
import { db, auth } from '../../../../../services/firebase';
import moment from 'moment';

const { Option } = Select;

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
export default function AddIncomeType ({...props}){

    

    const [form] = Form.useForm();
    const [state,setState] = useState({
      visible:false,
      accountType:[]
    })
    const [incomeType,setIncomeType] = useState([])

    useEffect(() => {
      var unsubscribe = null
      auth().onAuthStateChanged((user) => {
        if (user) {
          unsubscribe = db.collection(user.uid).doc('database').collection("accounts").onSnapshot(function (querySnapshot) {
            const data = querySnapshot.docs.map((doc,i) => {
              const newData = doc.data()
              newData.id = doc.id
              newData.key = i
              return newData
            });
            setState({...state,accountType:data})
          });
        }
      })
    
      return () => {
        unsubscribe()
      }
    }, [props?.isModalVisible])

    useEffect(() => {
      var unsubscribe = null
      auth().onAuthStateChanged((user) => {
        if (user) {
          unsubscribe = db.collection(user.uid).doc('database').collection("income_type").onSnapshot(function (querySnapshot) {
              const data2 = querySnapshot.docs.map((doc,i) => {
                const newData = doc.data()
                newData.id = doc.id
                newData.key = i
                return newData
              });
              setIncomeType(data2)
          });
        }
      })
    
      return () => {
        unsubscribe()
      }
    }, [props?.isModalVisible])

    

    function onFinish (values) {
      values.date = moment(values.date).format("YYYY-MM-DD")
      console.log(values)
        try {
            auth().onAuthStateChanged((user) => {
                if (user) {
                    db.collection(user.uid).doc('database').collection('income').add(values)
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
          title="Add Income"
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
              description: "",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="account"
                  label="Account"
                  rules={[{ required: true, message: 'Please select an account' }]}
                >
                  <Select >
                  {
                    state.accountType.map((data,i)=>{
                      return <Option key={i} value={data.name}>{data.name}</Option>
                    })
                  }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="date"
                  label="Date"
                >
                  <DatePicker defaultValue={moment(new Date, 'YYYY-MM-DD')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                >
                  <Input.TextArea rows={4} placeholder="please enter url description" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="incomeType"
                  label="Income Type"
                  rules={[{ required: true, message: 'Please select an account' }]}
                >
                  <Select >
                  {
                    incomeType.map((data,i)=>{
                      return <Option key={i} value={data.description}>{data.description}</Option>
                    })
                  }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[{ required: true, message: 'Please enter an amount' }]}
                >
                  <InputNumber min={0} defaultValue={0}  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item {...tailLayout} >
                    <Button type="primary" htmlType="submit" style={{float:'right'}}>
                    Save
                    </Button>
                </Form.Item>    
              </Col>
            </Row>
        </Form>
        </Drawer>
        </>
    );
};
