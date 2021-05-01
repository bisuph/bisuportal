


import { PageHeader, Upload, Card, Tabs, Popconfirm, Space, Button, Tag, Input, Modal, Table } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SearchOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import React, { useEffect, useState} from 'react';
import { useRouter } from 'next/router'
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

    props.state = state
    props.list = state.list
    props.initLoading = state.initLoading
   
    useEffect(()=>{
        refresh()
    },[office])

    const refresh = () => {
        auth().onAuthStateChanged((user) => {
            if(user){
                const data = getUploadedFilesPerUser(props.office,decodeURI(campus))
                data.then(docs => {
                    setState({
                        initLoading: false,
                        list: docs,
                    });
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
                render: campus => (
                    campus.name
                )
            },
            {
                title: 'Record',
                dataIndex: 'record',
                key: 'office',
                width: '20%',
                render: office => (
                    office.name
                )
            },
            {
                title: 'Uploaded by',
                dataIndex: 'uploadedBy',
                key: 'uploader',
                width: '20%',
            },
            {
              title: 'Files',
              key: 'files',
              dataIndex: 'files',
              render: files => (
                files && (<>
                  {files.map((val,i) => {
                    
                    return (
                      <Tag  key={i} color={'green'}>
                        <a href={val.url} target="_blank" key={i}><PaperClipOutlined /> {val.name}</a>
                      </Tag>
                    );
                  })}
                </>)
              ),
            },
      ];
    return (<>
        <Table columns={columns} dataSource={state.list} bordered />
    </>)
}


