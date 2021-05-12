import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useContext } from 'react';
import { db, auth } from '../../../services/firebase';
import { getCampuses, getOffices } from '../../../services/fecthData';
import { useRouter } from 'next/router';
import { AccountContext } from '../../../context/AccountContext';

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

const CreateUser = ({form,handleOk,confirmLoading,handleCancel,genKey,...props}) => {
    const {account} = useContext(AccountContext)
    const router =  useRouter()
    const [loading, setLoading] = useState(false);
    const [campuses, setCampuses] = useState([])
    const [office, setOffice] = useState([])
    const [visibility,setVisibility] = useState(true)
    useEffect(() => {
        var unsubscribe = null
        setLoading(true)
        auth().onAuthStateChanged((user) => {
          if (user) {
           
                if(account?.role === 'Super Admin'){
                    var docRefCamp = getCampuses()
                    docRefCamp.then(docsCamp => {
                        setCampuses(docsCamp)
                    })
                }
                else{
                    form.setFieldsValue({ campus: account?.campus?.name});
                    form.setFieldsValue({ role: 'Member'});
                }
                

                var docRefOff = getOffices()
                docRefOff.then(docsOff => {
                    setOffice(docsOff)
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

    
    const onChangeRole = (value) => {
        console.log(value)
        if(!_.isEmpty(value)){
            setVisibility(false)
        }
        else{
            setVisibility(true)
        }
    }
    return(
            <Form form={form}  {...layouts} layout="vertical" name="nest-messages" onFinish={handleOk} validateMessages={validateMessages}>
                
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
                <Input size='large' autoComplete={'off'} readOnly={form?.getFieldValue('email') === '' ? false : true}/>
                </Form.Item>

                <Form.Item name={'role'} label="Higher Role" >
                        <Select onChange={(value)=>onChangeRole(value)} size='large' style={{ width: '100%' }}  loading={loading} disabled={account?.role !== 'Super Admin' ? true : false}>
                            {['','Super admin','University admin'].map(role => (
                                <Option key={role}>{role}</Option>
                            ))}
                        </Select>
                    
                </Form.Item>
            {
                (visibility && (
                    <>
                    <Form.Item name={'campus'} label="Campus" 
                        rules={[
                            {
                            required: true,
                            },
                        ]}
                    >
                            <Select size='large' style={{ width: '100%' }}  loading={loading} disabled={account?.role !== 'Super Admin' ? true : false}>
                                {campuses.map(campus => (
                                    <Option key={JSON.stringify({name:campus.name,id:campus.id})}>{campus.name}</Option>
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
                        <Select size='large' style={{ width: '100%' }}  >
                            {office.map(offices => (
                            <Option key={JSON.stringify({name:offices.name,id:offices.id,role:offices.role})}>{offices.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
                ))
            }
                

                <Form.Item wrapperCol={{ ...layouts.wrapperCol}}
                    rules={[
                        {
                        required: true,
                        },
                    ]}>
                <Space style={{width:'100%'}}  direction='vertical'>
                    
                    <Button type="primary" htmlType="submit" loading={confirmLoading} style={{width:'100%'}}>
                        Submit
                    </Button>
                    <Button onClick={handleCancel} style={{width:'100%'}}>
                        Cancel
                    </Button>

                </Space>
                </Form.Item>
            </Form>
    )
}

export default CreateUser;