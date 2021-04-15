import Head from 'next/head'
import { PageHeader, Upload, Card, Tabs, Layout, Space, Button, Form, Input, message, Select, Progress } from 'antd';
import { InboxOutlined , InfoCircleOutlined, SnippetsOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import React, { useState, useEffect,useContext } from 'react';
import { auth, db, storage } from '../../services/firebase';
import CustomPageheader from '../../component/customPageheader'
import CustomLayout from '../../component/customLayout';
import { getRecords } from '../../services/fecthData';
import _ from 'lodash'
import { set } from 'nprogress';

const { Dragger } = Upload;
const { Option } = Select;

export default function CreateRecord({...props}) {
    const [buttonDisable,setbuttonDisable] = useState(false)
    const [percent,setpercent] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [form] = Form.useForm();
    const [record, setRecord] = useState([])
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    })
      
    useEffect(()=>{
        var docRefOff = getRecords()
        docRefOff.then(docsOff => {
            setRecord(docsOff)
        })
    },[db])
    
    useEffect(()=>{
        if(!_.isEmpty(props?.default)){
            console.log(props?.default)
            const {description} = props?.default
            form.setFieldsValue({ description: description});
        }
    },[props?.default])

    const reset = () => {
        form.setFieldsValue({ 
            description: '',
            record: '',
            file: '',
        });
        setbuttonDisable(false)
        setpercent(0)
        setState({...state,fileList:[]})
        if(props?.default){
            props?.onHide(false)
        }
    }

    const handleUpload = async (values) => {
        if(!_.isEmpty(values?.description)){
            setbuttonDisable(true)
            setUploading(!uploading)

            auth().onAuthStateChanged((user) => {
                if(user){

                    let ref = db.collection('User').doc(user.email)

                    ref.get()
                    .then( snapshot => {  //DocSnapshot
                        if (snapshot.exists) {
                            if(props?.default){
                                db.collection('UploadedFiles').doc(props?.default.id).update(values)
                                setUploading(false)
                                props?.onHide(false)
                            }
                            else {
                                const { fileList } = state;

                                const newData = {
                                    description : values.description,
                                    records : values.record,
                                    uploader : user.email,
                                    campus : snapshot.data().campus,
                                    offices : snapshot.data().offices,
                                }
                                if(!_.isEmpty(newData)){
                                    db.collection('UploadedFiles').add(newData)
                                    .then((docRef) => {
                                        var upld = []
                                        fileList.forEach(async (file) => {
                                            setUploading(!uploading)
                                        
                                            const storageRef = await storage.ref();
                                            const fileRef = await storageRef.child(file.name);
                                            var task = fileRef.put(file);

                                            task.on('state_change',
                                                function progress(snapshot){
                                                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                                    setpercent(progress)
                                                },
                                                (error) => {
                                                    // Handle unsuccessful uploads
                                                }, 
                                                () => {
                                                // Handle successful uploads on complete
                                                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                                task.snapshot.ref.getDownloadURL().then( async(downloadURL) => {
                                                    const newUpld = {
                                                        name : file.name,
                                                        url : downloadURL,
                                                        type : file.type,
                                                    }
                                                    upld.push(newUpld)

                                                    db.collection('UploadedFiles').doc(docRef.id).update({
                                                        files : upld
                                                    }).then(() => {
                                                        setUploading(false)
                                                        console.log("Document successfully updated!");
                                                    })
                                                    .catch((error) => {
                                                        setUploading(false)
                                                        // The document probably doesn't exist.
                                                        console.error("Error updating document: ", error);
                                                    });
                                                });
                                                }
                                            )
                                            
                                        });

                                    
                                        console.log("Document written with ID: ", docRef.id);
                                        // reset()
                                    })
                                    .catch((error) => {
                                        setUploading(false)
                                        console.error("Error adding document: ", error);
                                    });
                                }
                            }
                            
                        }
                    })
                }
            })
        }
    }   
    
    const {fileList} = state

    const propers = {
        onRemove: file => {
            setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
            });
        },
        beforeUpload: file => {
            setState(state => ({
                fileList: [...state.fileList, file],
            }));
            return false;
        },
        fileList,
    };

    return (
        <Card title="" bordered={false}  style={{width:'100%'}} loading={uploading}>
            <Form
            form={form}
            layout="vertical"
            onFinish={handleUpload}
            >
            <Form.Item 
                name={'description'}
                label="Description" 
                tooltip="This is a required field"
                rules={[
                    {
                    required: true,
                    },
                ]}
            >
                <Input placeholder="Description" size={'large'} autoComplete={"off"} />
            </Form.Item>
            {
                !props?.default ?
                    <>
                        <Form.Item name={'record'} label="Records" 
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                        >
                            <Select style={{ width: '100%' }}  size={'large'}>
                                {record.map(records => (
                                <Option key={records}>{records}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="file"
                            label="Upload File"
                            tooltip={{
                            title: 'Tooltip with customize icon',
                            icon: <InfoCircleOutlined />,
                            }}
                        >
                            <Dragger {...propers} fileList={state.fileList} multiple={true}>
                                <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                                </p>
                            </Dragger>
                        </Form.Item>
                        <Progress
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            percent={percent}
                        />
                    </>
                :
                    <></>
            }
            
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={uploading} disabled={buttonDisable}>Submit</Button>
                    <Button loading={uploading} onClick={()=>reset()}>Cancel</Button>
                </Space>
            </Form.Item>
            </Form>
            
        </Card>

        
    )
}


