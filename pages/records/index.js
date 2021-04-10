import { PageHeader, Upload, Card, Tabs, Layout, Space, Button, Form, Input, Radio } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import React, { useEffect, useState} from 'react';
import CustomPageheader from '@/component/customPageheader'
import { useRouter } from 'next/router'
import CustomLayout from '@/component/customLayout';
import { auth, db } from '@/services/firebase';
import { property } from 'lodash';
import { getUploadedFiles, getUploadedFilesPerUser, getUploadedFilesPerAdmin } from '@/services/fecthData';

const ListOfMemo = dynamic(() => import('./listOfMemo'))


export default function Records({...props}) {
    const router = useRouter()
    const [state, setState] = useState({
        initLoading: true,
        loading: false,
        list: [],
    })

    props.state = state
    props.list = state.list
    props.initLoading = state.initLoading
   
    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if(user){

                let ref = db.collection('User').doc(user.email)

                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                    const userCred = snapshot.data()
                    if(userCred.role === 'Super Admin'){
                        const data = getUploadedFiles()
                        data.then(docs => {
                            setState({
                                initLoading: false,
                                list: docs,
                            });
                        })
                    }
                    else{
                        if(userCred.role === 'Admin'){
                            const data = getUploadedFilesPerAdmin(userCred.campus)
                            data.then(docs => {
                                setState({
                                    initLoading: false,
                                    list: docs,
                                });
                            })
                        }
                        else{
                            const data = getUploadedFilesPerUser(userCred.offices,userCred.campus)
                            data.then(docs => {
                                setState({
                                    initLoading: false,
                                    list: docs,
                                });
                            })
                        }
                    }
                    }
                })
            }
        })
    
    },[db])

    return (
        <CustomLayout >
        <CustomPageheader title={'Records'} icon={<SnippetsOutlined />} extra={[
            router.pathname !== '/records/create' ?
            <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={()=>router.push("/records/create")}>
                Add
            </Button>
            :
            <></>
        ]}>
            <ListOfMemo {...props}/>
        </CustomPageheader>
        </CustomLayout>
    )
}


