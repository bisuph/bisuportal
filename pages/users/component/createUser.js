import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../services/firebase';
import { getCampuses, getOffices } from '../../../services/fecthData';
import { useRouter } from 'next/router';

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


const { Option } = Select;
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

const CreateUser = ({handleOk,confirmLoading,handleCancel,genKey,...props}) => {
    const [form] = Form.useForm();
   
    const router =  useRouter()
    const [loading, setLoading] = useState(false);
    const [userCred, setUserCred] = useState(null);
    const [campuses, setCampuses] = useState([])
    const [office, setOffice] = useState([])
    useEffect(() => {
        var unsubscribe = null
        setLoading(true)
        auth().onAuthStateChanged((user) => {
          if (user) {
            
            let ref = db.collection('User').doc(user.email)

            ref.get()
            .then( snapshot => {  //DocSnapshot
                if (snapshot.exists) {
                    setUserCred(snapshot.data())
                    let userData = snapshot.data()

                    if(userData.role === 'Super Admin'){

                        var docRefCamp = getCampuses()
                        docRefCamp.then(docsCamp => {
                    console.log(docsCamp)

                            setCampuses(docsCamp)
                        })
                    }
                    else{
                        form.setFieldsValue({ campus: userData.campus});
                        form.setFieldsValue({ role: 'Member'});
                    }
                    

                    var docRefOff = getOffices()
                    docRefOff.then(docsOff => {
                        setOffice(docsOff)
                    })
                        
                } else {
                    console.log("No such document!");
                }  
            })
            
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
                    name={'email'}
                    label="Email"
                    rules={[
                        {
                        type: 'email',
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

                <Form.Item name={'role'} label="Role" 
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                >
                        <Select style={{ width: '100%' }}  loading={loading} disabled={userCred?.role !== 'Super Admin' ? true : false}>
                                <Option key={'Super Admin'}>{'Super Admin'}</Option>
                                <Option key={'Admin'}>{'Admin'}</Option>
                                <Option key={'Member'}>{'Member'}</Option>
                        </Select>
                    
                </Form.Item>

                <Form.Item name={'campus'} label="Campus" 
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                >
                        <Select style={{ width: '100%' }}  loading={loading} disabled={userCred?.role !== 'Super Admin' ? true : false}>
                            {campuses.map(campus => (
                                <Option key={campus}>{campus}</Option>
                            ))}
                        </Select>
                    
                </Form.Item>

                <Form.Item name={'offices'} label="Offices" loading={loading} 
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                >
                    <Select style={{ width: '100%' }}  >
                        {office.map(offices => (
                        <Option key={offices}>{offices}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layouts.wrapperCol}}
                    rules={[
                        {
                        required: true,
                        },
                    ]}>
                <Space>
                    
                    <Button type="primary" htmlType="submit" loading={confirmLoading}>
                        Submit
                    </Button>
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                </Space>
                </Form.Item>
            </Form>
    )
}

export default CreateUser;