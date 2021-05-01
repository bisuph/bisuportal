import { PageHeader, Upload, Card, Tabs, Layout, Space, Button, Form, Input, message, Select, Progress } from 'antd';
import { InboxOutlined , InfoCircleOutlined, SnippetsOutlined } from '@ant-design/icons';
import React, { useState, useEffect,useContext } from 'react';
import { auth, db, storage } from '../../services/firebase';
import { getRecords, incrementFilesCount } from '../../services/fecthData';
import _ from 'lodash'
import { AccountContext } from '../../context/AccountContext';
import { useRouter } from 'next/router';

const { Dragger } = Upload;
const { Option } = Select;

export default function CreateRecord({...props}) {
    const {office} = props
    console.log(office.data)

    const {account} = useContext(AccountContext)
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

    const processUpload = async (file) => {
        const rand = (Math.floor((Math.random() * 1000) + 1))
        const storageRef = await storage.ref();
        const fileRef = await storageRef.child('files/'+rand+file.name);
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
            task.snapshot.ref.getDownloadURL().then( async(downloadURL) => {
                file.downloadURL = downloadURL
                file.names = rand+file.name
                setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                setpercent(0)

            });
            }
        )
    }

    const processRemove = async (file) => {
        const storageRef = await storage.ref();
        const index = state.fileList.indexOf(file);
        console.log(state.fileList[index])
        var desertRef = storageRef.child('files/'+state.fileList[index].names);
        // Delete the file
        desertRef.delete().then(() => {
            setState(state => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);

                return {
                    fileList: newFileList,
                };
            });
        // File deleted successfully
        }).catch((error) => {
        // Uh-oh, an error occurred!
        });
    }

    const handleUpload = async (values) => {
            auth().onAuthStateChanged((user) => {
                if(user){
                    var forUpload = []
                    fileList.map( async (items,i)=>{
                        const addItem = {
                            name:items.names,
                            url:items.downloadURL
                        }
                        await forUpload.push(addItem)
                    })

                    const forSave = {
                        description:values.description,
                        record:JSON.parse(values.record),
                        files:forUpload,
                        campus:account.campus,
                        office:{
                            id:office?.data.id,
                            name:office?.data.name
                        },
                        uploadedBy:account.email
                    }
                 
                    db.collection('uploaded').add(forSave)
                    .then((docRef) => {
                        message.success('Successfully saved');
                        incrementFilesCount(office?.data.id,account.campus.id)
                        .then(function(){
                            window.location.reload()
                        })
                    })
                    .catch((error) => {
                        setUploading(false)
                        console.error("Error adding document: ", error);
                    });
                }
            })
    }   
    

    const {fileList} = state

    const propers = {
        onRemove: file => {
            processRemove(file)
            
        },
        beforeUpload: file => {
            processUpload(file)
            // setState(state => ({
            //     fileList: [...state.fileList, file],
            // }));
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
                        <Form.Item name={'record'} label="Type" 
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                        >
                            <Select style={{ width: '100%' }}  size={'large'}>
                                {record.map(records => (
                                <Option key={JSON.stringify(records)}>{records.name}</Option>
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


