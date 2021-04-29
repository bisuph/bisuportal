import { Form, Row, Col, Space, Input, Popconfirm, Button , Table, Modal } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import CustomPageheader from '../../component/customPageheader'
import React, { useContext, useEffect, useState } from 'react';
const { v4: uuidv4 } = require('uuid');
import { db, auth } from '../../services/firebase';
import _, { isString } from 'lodash'
const CreateUser = dynamic(() => import('./component/createUser'))
import CustomLayout from '../../component/customLayout';

import {
    PlusSquareOutlined, DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import { AccountContext } from '../../context/AccountContext';

    

export default function User() {
    const {account} = useContext(AccountContext)
    const [form] = Form.useForm();
    const router = useRouter()
    const [genKey, setGenKey] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [data,setData] = useState([])

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if(user){
                if(account?.role === 'Super Admin')
                {
                    db.collection("User").orderBy('email')
                    .onSnapshot((querySnapshot) => {
                        const list  = []
                        querySnapshot.forEach((doc) => {
                            var toPush = doc.data()
                            toPush.id = doc.id
                            list.push(toPush)
                        });
                        setData(list)
                        setConfirmLoading(false)
                    });
                }
                else{
                    
                    if(account?.role === 'Admin'){
                        
                        db.collection("User").where("campus", "==", account?.campus)
                        .onSnapshot((querySnapshot) => {
                            const list  = []
                            querySnapshot.forEach((doc) => {
                                var toPush = doc.data()
                                toPush.id = doc.id
                                list.push(toPush)
                            });
                            setData(list)
                            setConfirmLoading(false)
                        });
                    }
                    
                }
            }
            else{
                router.push("/")

            }
        })

        return () => {
        }
    },[account])


    const showModal = () => {
        setGenKey(null)
        if(account?.role === 'Admin'){
            form.setFieldsValue({ email: "" , offices:""});
        }
        else{
            form.setFieldsValue({ email: "" , campus:"",offices:""});
        }
        setVisible(true);
    };

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    const handleOk = (values) => {
        // setConfirmLoading(true);

        auth().onAuthStateChanged((user) => {
            if (user) {
               
                const newValues = _.clone(values)
                newValues.school = account?.school
                if(!isJson(newValues.offices)) 
                {delete newValues.offices} else {newValues.offices = JSON.parse(newValues.offices)}

                if(!isJson(newValues.campus))
                {delete newValues.campus} else {newValues.campus = JSON.parse(newValues.campus)}

                if(account?.role === 'Admin'){
                    newValues.campus = account?.campus
                }

                if(newValues.offices !== undefined){
                    if(newValues.offices.name == 'Administrative and management records'){
                        newValues.role = 'Admin'
                    }
                    else {
                        newValues.role = 'Member'
                    }
                }

                var query 
                if(genKey !== null){
                    query = db.collection('User').doc(genKey).update(newValues)
                }
                else
                {
                    query = db.collection('User').doc().set(newValues)
                }
                
                query.then(function() {
                    setVisible(false);
                    setGenKey(null)
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                    setVisible(false);
                });
                        
                        // console.log(newValues)
            } else {
                router.push("/signin")
            }
        })
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    const onPopConfirm = (record) => {
        setConfirmLoading(true)
        db.collection("User").doc(record.id).delete().then(() => {
            console.log("Document successfully deleted!");
            setConfirmLoading(false)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const onEdit = (record) => {
        setGenKey(record.id)
        form.setFieldsValue({email:record?.email,campus:record?.campus?.name,offices:record?.offices?.name});
        setVisible(true);
    }

    const columns = [
        {
            title: 'Email',
            width: 250,
            dataIndex: 'email',
            key: 'email',
            fixed: 'left',
        },
        // {
        //     title: 'School',
        //     dataIndex: 'school',
        //     key: 'school',
        // },
        {
            title: 'Campus',
            dataIndex: 'campus',
            key: 'campus',
            render : (record) => {
                return record?.name
            }
        },
        {
            title: 'Office',
            dataIndex: 'offices',
            key: 'offices',
            render : (record) => {
                return record?.name
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record) => 
        ((record.role !== 'Super Admin')) ?
        ((['Admin'].includes(account?.role)  && record?.role !== 'Admin' || (account.role == 'Super Admin')) && (<Space>
            <Button type='primary' icon={<EditOutlined />} size={'middles'}  onClick={()=>onEdit(record)} />
            <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>onPopConfirm(record)}>
                <Button type='primary' danger  icon={<DeleteOutlined />} size={'middles'} />
            </Popconfirm>
        </Space>))
        :
        <></>
        
        },
    ];
    
    return (<CustomLayout >
        <CustomPageheader title={'Users'} extra={[
            <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={()=>showModal()}>Add</Button>
        ]}>
            <Table bordered columns={columns} dataSource={data} scroll={{ x: 1300 }} loading={confirmLoading} style={{boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}/>
        </CustomPageheader>
        <Modal
            title="Create User"
            visible={visible}
            confirmLoading={confirmLoading}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            closable={false}
        >
            <CreateUser form={form} handleOk={handleOk} handleCancel={handleCancel} confirmLoading={confirmLoading} visible={visible} genKey={genKey}/>
        </Modal>
    </CustomLayout>)
}
