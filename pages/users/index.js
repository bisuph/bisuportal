import { Tabs, Row, Col, Card, Layout, Button, Table, Modal } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import CustomPageheader from '@/component/customPageheader'
import React, { useState } from 'react';
const { v4: uuidv4 } = require('uuid');
import { db, auth } from '@/services/firebase';
import _ from 'lodash'
const CreateUser = dynamic(() => import('./component/createUser'))

import {
    PlusSquareOutlined
} from '@ant-design/icons';
import CustomLayout from '@/component/customLayout';

    const columns = [
        {
        title: 'Email',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        },
        {
        title: 'Username',
        width: 100,
        dataIndex: 'age',
        key: 'age',
        fixed: 'left',
        },
        {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <a>action</a>,
        },
    ];
    
    const data = [
        {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York Park',
        },
        {
        key: '2',
        name: 'Jim Green',
        age: 40,
        address: 'London Park',
        },
    ];

export default function User() {
    const { TabPane } = Tabs;

    function callback(key) {
    console.log(key);
    }

    const [genKey, setGenKey] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    const showModal = () => {
        setGenKey(uuidv4())
        setVisible(true);
    };

    const handleOk = (values) => {
        setModalText('The modal will be closed after two seconds');
        // setConfirmLoading(true);

        auth().onAuthStateChanged((user) => {
            

            if (user) {
                let ref = db.collection('User').doc(user.email)

                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                        let userData = snapshot.data()
                        console.log(userData); 
                   
                        const newValues = _.clone(values)
                        newValues.school = userData.school
                        console.log(values);

                        db.collection('User').doc(newValues.email).set(newValues)
                        .then(function() {
                            console.log('created');
                        })
                        .catch(function(error) {
                            console.error("Error adding document: ", error);
                        });
                    }
                })
            } else {
                router.push("/login")
            }
        })

        setTimeout(() => {
        
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };
    
    return (<CustomLayout>
        <CustomPageheader title={'Users'} extra={[
            <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={showModal}>Add</Button>
        ]}>
            <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />
        </CustomPageheader>
        <Modal
            title="Create User"
            visible={visible}
            // onOk={handleOk}
            confirmLoading={confirmLoading}
            // onCancel={handleCancel}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}

            // footer={[
            //     <Button key="back" onClick={handleCancel}>
            //       Return
            //     </Button>,
            //     <Button key="submit" type="primary" loading={confirmLoading}>
            //       Submit
            //     </Button>
            // ]}
        >
            <CreateUser handleOk={handleOk} handleCancel={handleCancel} confirmLoading={confirmLoading} visible={visible} genKey={genKey}/>
        </Modal>
    </CustomLayout>)
}
