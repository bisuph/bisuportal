import { Tabs, Row, Col, Card, Layout, Popconfirm, Button , Table, Modal } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import CustomPageheader from '../../component/customPageheader'
import React, { useEffect, useState } from 'react';
const { v4: uuidv4 } = require('uuid');
import { db, auth } from '../../services/firebase';
import _ from 'lodash'
const CreateUser = dynamic(() => import('./component/createUser'))
import CustomLayout from '../../component/customLayout';

import {
    PlusSquareOutlined, DeleteOutlined
} from '@ant-design/icons';

    

export default function Offices() {
    const [genKey, setGenKey] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [data,setData] = useState([])

    useEffect(()=>{
        const unsubscribe = db.collection("Offices")
        .onSnapshot((querySnapshot) => {
            const list  = []
            querySnapshot.forEach((doc) => {
                var l = doc.data()
                l.id = doc.id
                list.push(l)
            });
            setData(list)
            setConfirmLoading(false)
        });

        return () => {
            unsubscribe()
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
                db.collection('Offices').doc(values.name).set(values)
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

    const onPopConfirm = (record) => {
        setConfirmLoading(true)
        db.collection("Offices").doc(record.id).delete().then(() => {
            console.log("Document successfully deleted!");
            setConfirmLoading(false)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }


    const columns = [
        {
            title: 'Name',
            width: 250,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
        },
        {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record) => 
        <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>onPopConfirm(record)}>
            <Button  icon={<DeleteOutlined />} size={'middles'} />
        </Popconfirm>,
        
        },
    ];
    
    return (<CustomLayout>
        <CustomPageheader title={'Offices'} extra={[
            <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={showModal}>Add</Button>
        ]}>
            <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} loading={confirmLoading}/>
        </CustomPageheader>
        <Modal
            title="Add Office"
            visible={visible}
            confirmLoading={confirmLoading}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
        >
            <CreateUser handleOk={handleOk} handleCancel={handleCancel} confirmLoading={confirmLoading} visible={visible} genKey={genKey}/>
        </Modal>
    </CustomLayout>)
}
