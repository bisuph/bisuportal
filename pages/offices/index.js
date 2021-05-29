import { Form, Popconfirm, Button , Table, Modal, Space, Tag, message } from 'antd';
import dynamic from 'next/dynamic'
import CustomPageheader from '../../component/customPageheader'
import React, { useContext, useEffect, useState } from 'react';
import { db, auth } from '../../services/firebase';
import _ from 'lodash'
const CreateOffice = dynamic(() => import('./component/createOffice'))
import CustomLayout from '../../component/customLayout';

import {
    PlusCircleOutlined, DeleteOutlined , EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { AccountContext } from '../../context/AccountContext';
import PasswordConfirm from '../campuses/component/passwordConfirm';
import { checkOfficeData, checkOfficeExist, updateRemoveOffice } from '../../services/fecthData';

    

export default function Offices() {
    const {account} = useContext(AccountContext)
    const [form] = Form.useForm();
    const [genKey, setGenKey] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [data,setData] = useState([])
    const [password,setPassword] = useState(null)

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                
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
                insert.name = insert.name.toUpperCase()
                checkOfficeExist(insert.name).then(function(data){
                    if(data.length === 0 ||  genKey === data[0].id){
                        insert.created_by = user.email
                        var query = null
                        if(!_.isEmpty(genKey)){
                            insert.updated_date = new Date()
                            insert.updated_by = user.email
                            query = db.collection('office').doc(genKey).update(insert)
                        }
                        else{
                            insert.created_date = new Date()
                            query = db.collection('office').doc().set(insert)
                        }

                        query.then(function() {
                            form.setFieldsValue({ name: '' ,role:''});
                            setVisible(false);
                        })
                        .catch(function(error) {
                            console.error("Error adding document: ", error);
                            setVisible(false);
                        });
                    }
                    else{
                        message.error('Office name already exists.')
                        setConfirmLoading(false);
                    }
                })
                
            } else {
                router.push("/signin")
            }
        })

        setTimeout(() => {
        
        }, 2000);
    };

    const handleCancel = () => {
        form.setFieldsValue({ name: '', role:'' });
        setVisible(false);
    };

    const onEdit = (record) => {
        setGenKey(record.id)
        form.setFieldsValue({ name: record.name, role: record.role });
        setVisible(true);
    }

    const onPopConfirm = (record) => {
        checkOfficeData(record?.name).then(function(values){
            if(values?.length == 0){
                setPassword(record.id)
            }
            else{
                message.error('Uploaded file exist.')
            }
        })
    }

    const afterResult = (id) => {
        db.collection("office").doc(id).delete().then(() => {
            updateRemoveOffice(id)
            message.success("Document successfully deleted!");
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
            title: 'Role',
            width: 250,
            dataIndex: 'role',
            render: (role) => 
            (<Tag color={'blue'}>{role}</Tag>)
        },
        {
            title: 'Created By',
            width: 250,
            dataIndex: 'created_by',
        },
        {
            title: 'Created Date',
            width: 250,
            dataIndex: 'created_date',
            render: (created_date) => {
                return  moment(created_date).format('MMMM D, YYYY HH:mm:ss')
            }
        },
        {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record) => {
        if(['Super Admin'].includes(account?.role) && (!['Administrative and Management Records','Campus Director'].includes(record.id))){
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
            ['Super Admin'].includes(account?.role) ? <Button type="primary" icon={<PlusCircleOutlined />} size={"middle"} onClick={showModal}>Add</Button> : <></>
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
        {(password)&&(<PasswordConfirm open={password} setClose={setPassword} afterResult={afterResult}/>)}
    </CustomLayout>)
}
