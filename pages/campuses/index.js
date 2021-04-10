import { PageHeader, Row, Col, Card, Layout, Button } from 'antd';
import { useRouter } from 'next/router'
import UserCard from '../../component/userCard'
import React, { useContext, useEffect, useState } from 'react';
import {
    PlusSquareOutlined
  } from '@ant-design/icons';
import CustomLayout from '../../component/customLayout';
import Modal from 'antd/lib/modal/Modal';
import CreateUser from './component/createUser';
import { auth, db } from '../../services/firebase';
const { v4: uuidv4 } = require('uuid');
  

const colCard = {
    xs:24 ,
    sm:12 ,
    md:6 ,
    lg:6 ,
    xl:6 ,
    xxl:6
}

export default function Schools() {

    const router = useRouter()
    const [data,setData] = useState([])
    const [genKey, setGenKey] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                db.collection('Campuses')
                .onSnapshot((querySnapshot) => {
                    const list  = []
                    querySnapshot.forEach((doc) => {

                        var newList = doc.data()
                        newList.id = doc.id
                        list.push(newList)
                    });
                    setData(list)
                    // setConfirmLoading(false)
                });
            } 
        })
        return () => {
            // unsubscribe()
        }
    },[db])


    const showModal = () => {
        setGenKey(uuidv4())
        setVisible(true);
    };

    const handleOk = (values) => {
        // setConfirmLoading(true);

        auth().onAuthStateChanged((user) => {
            if (user) {
                db.collection('Campuses').doc(values.name).set({
                    address:values.address
                })
                .then(function() {
                    setVisible(false);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                    setVisible(false);
                });
            } else {
                router.push("/signin")
            }
        })

        setTimeout(() => {
        
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    return (
        <CustomLayout>
        <Row gutter={[16, 16]}>
            <Col span={24}>
            <PageHeader
                style={{
                    background:'white',
                    marginBottom:10
                }}
                className="site-page-header"
                onBack={() => window.history.back()}
                title="Campuses"
                subTitle="This is a subtitle"

                extra={[
                    <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={() => showModal()}>
                        Add
                    </Button>
                ]}
            />
            </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
        {
            data.map((item,i) => {
                return(
                    <Col  {...colCard} key={i}>
                        <UserCard 
                            title = {item.id}
                            description = {item.address}
                            avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                        />
                    </Col>
                )
            })
        }
        </Row>
        <Modal
            title="New Campus"
            visible={visible}
            confirmLoading={confirmLoading}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
        >
            <CreateUser handleOk={handleOk} handleCancel={handleCancel} confirmLoading={confirmLoading} visible={visible} genKey={genKey}/>
        </Modal>
        </CustomLayout>
    )
}
