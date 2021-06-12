import { Form, Row, Col, Space, Input, Popconfirm, Button , Table, Modal, message, Tag, Card } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import CustomPageheader from '../../component/customPageheader'
import React, { useContext, useEffect, useState } from 'react';
const { v4: uuidv4 } = require('uuid');
import { db, auth } from '../../services/firebase';
import _, { isString } from 'lodash'
import CustomLayout from '../../component/customLayout';

import {
    FileDoneOutlined, PaperClipOutlined
} from '@ant-design/icons';
import { AccountContext } from '../../context/AccountContext';
import { checkUserExist, getArchivedFilesPerOffice, getUploadedFilesPerUser, incrementFilesCount } from '../../services/fecthData';
import moment from 'moment';

    

export default function Archive() {
    const {account} = useContext(AccountContext)
    const router = useRouter()
    const {office} = router.query
    const [record,setRecord] = useState([])
    const [state, setState] = useState({
        initLoading: true,
        loading: false,
        list: [],
        
    })
   
    useEffect(()=>{
        refresh()
    },[account])

    const refresh = () => {
        auth().onAuthStateChanged((user) => {
            if(user){
                var docRef = db.collection("office").doc(account?.offices?.id);
                docRef.get().then((doc) => {
                    if (doc.exists) {
                            
                        const data = getArchivedFilesPerOffice(doc.id,account?.campus?.id)
                        // const data = getUploadedFilesPerAdmin(account?.campus.id)
                        data.then(docs => {
                            setState({
                                initLoading: false,
                                list: docs,
                            });
                            _.orderBy(docs, ['uploadedDate'], ['desc'])
                            setRecord(docs)
                        })

                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                })

                
            }
        })
    }

    const onRecord = (record) => {
        db.collection('uploaded').add(record)
        .then((docRef) => {
            db.collection("archived").doc(record.id).delete().then(() => {
                incrementFilesCount(account?.offices?.id,account?.campus?.id)
                message.success("Document successfully archive!");
                refresh()
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }


    function filterText (obj,value) {
        const result = Object.values(obj).filter(obj2 => {
            const source = String(obj2).toUpperCase()
            const compared = String(value).toUpperCase()
            return source.includes(compared)
        })

        if(!_.isEmpty(result)){
            return true
        }

    }

    const f_SearchData = async (e) => {
        const res = await _.clone(record).filter(obj => {
            return filterText(obj,e.target.value)
        });
        setState({...state,list:res})

    }

    const columns = [
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: '30%',
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
            title: 'Uploaded Date',
            dataIndex: 'uploadedDate',
            key: 'uploaded',
            width: '20%',
            render : uploadedDate => <p>{(uploadedDate != undefined) ? moment(uploadedDate?.toDate()).format('YYYY-MM-DD') : ''}</p>
            
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
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (record) => 
                ((record.uploadedBy === account?.email)&&(
                    <Space>
                        <Popconfirm title="This record will move back  to records, click yes  to proceed." okText="Yes" cancelText="No" onConfirm={()=>onRecord(record)}>
                            <Button type='default'  style={{background:'yellow'}}  icon={<FileDoneOutlined />} size={'middles'} />
                        </Popconfirm>
                    </Space>
                ))
        
        },
       
      ];
    
    return (<CustomLayout >
        <CustomPageheader title={'Archive'} extra={[
        ]}>
            <Space direction={'vertical'} style={{width:'100%'}}>
            <Card >
                <Space direction='horizontal' style={{width:'100%'}}>
                Search description : 
                <Input size='large' onChange={f_SearchData} style={{width:'100%'}}/>
                </Space>
            </Card>
            <Table 
                columns={columns} 
                dataSource={state.list}
                bordered
            />
            </Space>
        </CustomPageheader>
    </CustomLayout>)
}
