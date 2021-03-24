import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { db, auth } from '@/services/firebase';
import { getCampuses, getOffices } from '@/services/fecthData';

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
    const [userCred, setUserCred] = useState(null);
    const [cities, setCities] = useState(cityData[provinceData[0]]);
    const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);

    const [campuses, setCampuses] = useState([])
    const [office, setOffice] = useState([])
    useEffect(() => {
        var unsubscribe = null
        auth().onAuthStateChanged((user) => {
          if (user) {
            
            let ref = db.collection('User').doc(user.email)
            ref.get()
            .then( snapshot => {  //DocSnapshot
                if (snapshot.exists) {
                    setUserCred(snapshot.data())
                    let userData = snapshot.data()
                    var docRefCamp = getCampuses(userData.school)
                    docRefCamp.then(docsCamp => {
                        setCampuses(docsCamp)
                    })

                    var docRefOff = getOffices(userData.school)
                    docRefOff.then(docsOff => {
                        setOffice(docsOff)
                    })
                        
                } else {
                    console.log("No such document!");
                }  
            })
            
          } else {
          router.push("/login")
          }
        })
      
        return () => {
        //   unsubscribe()
        }
    },[genKey])

    useEffect(()=>{

    },[])


    const handleCampusChange = value => {
        console.log(value)
        db.collection('School').doc(userData.school).collection("Campuses").onSnapshot(function (querySnapshot) {
            querySnapshot.docs.map((doc,i) => {
                campusArr.push(doc.id)
            });
            setCampuses(campusArr)
            // setDataSource(data)
        });
    };
    
    const onSecondCityChange = value => {
        setSecondCity(value);
    };

    return(
            <Form key={genKey} {...layouts} layout="vertical" name="nest-messages" onFinish={handleOk} validateMessages={validateMessages}>
                
                <Form.Item
                    name={['user', 'email']}
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
                <Input autoComplete={'off'} />
                </Form.Item>

                <Form.Item
                    name={['user', 'name']}
                    label="Display name"
                    rules={[
                        {
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

                <Form.Item name={['user', 'campus']} label="Campus">
                    <Select style={{ width: '100%' }} >
                        {campuses.map(campus => (
                        <Option key={campus}>{campus}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name={['user', 'offices']} label="Offices">
                    <Select style={{ width: '100%' }} >
                        {office.map(offices => (
                        <Option key={offices}>{offices}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layouts.wrapperCol}}>
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