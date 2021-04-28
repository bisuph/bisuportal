import { Form, Popconfirm, Button , Table, Modal, Space } from 'antd';
import dynamic from 'next/dynamic'
import CustomPageheader from '../../component/customPageheader'
import React, { useEffect, useState } from 'react';
const { v4: uuidv4 } = require('uuid');
import { db, auth } from '../../services/firebase';
import _ from 'lodash'
const CreateOffice = dynamic(() => import('./component/createOffice'))
import CustomLayout from '../../component/customLayout';

import {
    PlusCircleOutlined, DeleteOutlined , EditOutlined
} from '@ant-design/icons';
import moment from 'moment';

    

export default function Offices() {
    const [form] = Form.useForm();
    const [genKey, setGenKey] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [data,setData] = useState([])
    const [userCred,setUserCred] = useState(null)

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                let ref = db.collection('User').doc(user.email)
                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                        setUserCred(snapshot.data())
                        db.collection("office").orderBy('name')
                        .onSnapshot((querySnapshot) => {
                            const list  = []
                            querySnapshot.forEach((doc) => {
                                var l = doc.data()
                                l.id = doc.id
                                l.created_date = doc.data().created_date.toDate()
                                list.push(l)
                            });
                            setData(list)
                            setConfirmLoading(false)
                        });
                    }

                })

                
            }
        })

        // return () => {
        //     unsubscribe()
        // }
    },[db])

    const showModal = () => {
        setGenKey('')
        setVisible(true);
    };

    const handleOk = (values) => {
        // setConfirmLoading(true);

        auth().onAuthStateChanged((user) => {
            if (user) {
                var insert = _.clone(values) 
                insert.created_by = user.email
                insert.created_date = new Date()
                var query = null
                if(!_.isEmpty(genKey)){
                    query = db.collection('office').doc(genKey).set(insert)
                }
                else{
                    query = db.collection('office').doc().set(insert)
                }

                query.then(function() {
                    form.setFieldsValue({ name: '' });
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
        form.setFieldsValue({ name: '' });
        setVisible(false);
    };

    const onEdit = (record) => {
        setGenKey(record.id)
        form.setFieldsValue({ name: record.name });
        setVisible(true);

    }

    const onPopConfirm = (record) => {
        setConfirmLoading(true)
        db.collection("office").doc(record.id).delete().then(() => {
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
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
        },
        {
            title: 'Created By',
            width: 250,
            dataIndex: 'created_by',
            key: 'created_by',
        },
        {
            title: 'Created Date',
            width: 250,
            dataIndex: 'created_date',
            key: 'created_date',
            render: (record) => {
                return  moment(record.created_date).format('MMMM D, YYYY HH:mm:ss')
            }
        },
        {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record) => {
        if(['Super Admin','Admin'].includes(userCred?.role) && (!['Administrative and Management Records','Campus Director'].includes(record.id))){
        return (
        <Space>
            <Button type='primary' icon={<EditOutlined />} size={'middles'}  onClick={()=>onEdit(record)} />
            <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>onPopConfirm(record)}>
                <Button type='primary' danger icon={<DeleteOutlined />} size={'middles'} />
            </Popconfirm>
        </Space>
        )}
        }
        
        },
    ];
    
    return (<CustomLayout>
        <CustomPageheader title={'Offices'} extra={[
            
                userCred?.role !== 'Member' ? <Button type="primary" icon={<PlusCircleOutlined />} size={"middle"} onClick={showModal}>Add</Button> : <></>
            
            
        ]}>
            <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} loading={confirmLoading} style={{boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}/>
        </CustomPageheader>
        <Modal
            // title="Add"
            visible={visible}
            confirmLoading={confirmLoading}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            closable={false}
        >
                <CreateOffice form={form} handleOk={handleOk} handleCancel={handleCancel} confirmLoading={confirmLoading} visible={visible} genKey={genKey}/>
        </Modal>
    </CustomLayout>)
}
