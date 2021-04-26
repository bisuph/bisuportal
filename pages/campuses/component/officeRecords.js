


import { PageHeader, Upload, Card, Tabs, Popconfirm, Space, Button, Tag, Input, Modal, Table } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SearchOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import React, { useEffect, useState} from 'react';
import { useRouter } from 'next/router'
import Highlighter from 'react-highlight-words';
import { getUploadedFilesPerUser } from '../../../services/fecthData';
import { auth, db } from '../../../services/firebase';
const { TabPane } = Tabs;

const { Search } = Input;

export default function OfficeRecords({...props}) {
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const {campus} = router.query
    const { office } = props
    const [state, setState] = useState({
        initLoading: true,
        loading: false,
        list: [],
    })

    const [cred, setCred] = useState(null)
    const [defaultProps, setDefaultProps] = useState(null)


    props.state = state
    props.list = state.list
    props.initLoading = state.initLoading
   
    useEffect(()=>{
        refresh()
    },[office])

    const refresh = () => {
        auth().onAuthStateChanged((user) => {
            if(user){

                let ref = db.collection('User').doc(user.email)

                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                        const userCred = snapshot.data()
                        setCred(userCred)

                        const data = getUploadedFilesPerUser(decodeURI(office),decodeURI(campus))
                        data.then(docs => {
                            setState({
                                initLoading: false,
                                list: docs,
                            });
                        })
                    }
                })
            }
        })
    }

    const columns = [
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: '30%',
        },
        {
          title: 'Campus',
          dataIndex: 'campus',
          key: 'campus',
          width: '20%',
        },
        {
            title: 'Office',
            dataIndex: 'offices',
            key: 'offices',
            width: '20%',
        },
        {
            title: 'Uploaded by',
            dataIndex: 'uploader',
            key: 'uploader',
            width: '20%',
        },
        {
            title: 'Files',
            key: 'files',
            dataIndex: 'files',
            render: files => (
              <>
                {files.map((val,i) => {
                  
                  return (
                    <Tag  key={i} color={'green'}>
                      <a href={val.url} target="_blank" key={i}><PaperClipOutlined /> {val.name}</a>
                    </Tag>
                  );
                })}
              </>
            ),
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (record) => 
            <Space>
                <Button type={'primary'} icon={<EditOutlined />} onClick={() => {setVisible(true),setDefaultProps(record)}} />
                <Popconfirm  title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>onPopConfirm(record)}>
                    <Button type={'primary'} danger icon={<DeleteOutlined />} size={'middles'} />
                </Popconfirm>
            </Space>
        
        },

        // {
        //   title: 'Uploaded by',
        //   dataIndex: 'address',
        //   key: 'address',
        //   ...getColumnSearchProps('address'),
        // },
      ];
    return (<>
        <Table columns={columns} dataSource={state.list} bordered />
    </>)
}


