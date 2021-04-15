import { Tabs, Row, Col, Space, Input, Popconfirm, Button , Table, Modal } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import CustomPageheader from '../../component/customPageheader'
import React, { useEffect, useState } from 'react';
const { v4: uuidv4 } = require('uuid');
import { db, auth } from '../../services/firebase';
import _ from 'lodash'
const CreateUser = dynamic(() => import('./component/createUser'))
import CustomLayout from '../../component/customLayout';
import Highlighter from 'react-highlight-words';

import {
    PlusSquareOutlined, DeleteOutlined, SearchOutlined
} from '@ant-design/icons';
import { set } from 'nprogress';

    

export default function User() {
    const router = useRouter()
    const [genKey, setGenKey] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [data,setData] = useState([])

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if(user){
    
                let ref = db.collection('User').doc(user.email)
    
                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                        const userCred = snapshot.data()
                        if(userCred.role === 'Super Admin')
                        {
                            db.collection("User")
                            .onSnapshot((querySnapshot) => {
                                const list  = []
                                querySnapshot.forEach((doc) => {
                                    list.push(doc.data())
                                });
                                setData(list)
                                setConfirmLoading(false)
                            });
                        }
                        else{
                            
                            if(userCred.role === 'Admin'){
                                
                                db.collection("User").where("campus", "==", userCred.campus)
                                .onSnapshot((querySnapshot) => {
                                    const list  = []
                                    querySnapshot.forEach((doc) => {
                                        list.push(doc.data())
                                    });
                                    setData(list)
                                    setConfirmLoading(false)
                                });
                            }
                            else{
                                router.push("/")

                            }
                        }
                    }
                })
            }
        })

        return () => {
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
                let ref = db.collection('User').doc(user.email)

                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                        let userData = snapshot.data()
                        
                        const newValues = _.clone(values)
                        newValues.school = userData.school

                        if(newValues.offices == 'Administrative and Management Records'){
                            newValues.role = 'Super Admin'
                        }
                        else if(newValues.offices == 'Campus Director'){
                            newValues.role = 'Admin'
                        }
                        else {
                            newValues.role = 'Member'
                        }

                        db.collection('User').doc(newValues.email).set(newValues)
                        .then(function() {
                            setVisible(false);
                        })
                        .catch(function(error) {
                            console.error("Error adding document: ", error);
                            setVisible(false);
                        });
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
        console.log('Clicked cancel button');
        setVisible(false);
    };

    const onPopConfirm = (record) => {
        setConfirmLoading(true)
        db.collection("User").doc(record.email).delete().then(() => {
            console.log("Document successfully deleted!");
            setConfirmLoading(false)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const [search,setSearch] = useState({
    searchText: '',
    searchedColumn: '',
    })

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
    });
    };

    const getColumnSearchProps = dataIndex => ({

    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
        <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
            <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            >
            Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
            </Button>
        </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
        record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
        search.searchedColumn === dataIndex ? (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[search.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
        />
        ) : (
        text
        ),
    });

    const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
    };

    const columns = [
        {
            title: 'Email',
            width: 250,
            dataIndex: 'email',
            key: 'email',
            fixed: 'left',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'School',
            dataIndex: 'school',
            key: 'school',
            ...getColumnSearchProps('school'),
        },
        {
            title: 'Campus',
            dataIndex: 'campus',
            key: 'campus',
            ...getColumnSearchProps('campus'),
        },
        {
            title: 'Office',
            dataIndex: 'offices',
            key: 'offices',
            ...getColumnSearchProps('offices'),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            ...getColumnSearchProps('role'),
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
    
    return (<CustomLayout >
        <CustomPageheader title={'Users'} extra={[
            <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={showModal}>Add</Button>
        ]}>
            <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} loading={confirmLoading}/>
        </CustomPageheader>
        <Modal
            title="Create User"
            visible={visible}
            confirmLoading={confirmLoading}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
        >
            <CreateUser handleOk={handleOk} handleCancel={handleCancel} confirmLoading={confirmLoading} visible={visible} genKey={genKey}/>
        </Modal>
    </CustomLayout>)
}
