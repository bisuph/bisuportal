import Head from 'next/head'
import { PageHeader, Upload, Card, Tabs, Layout, Space, Button, Form, Input, message } from 'antd';
import { InboxOutlined , InfoCircleOutlined, SnippetsOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import React, { useState, useEffect,useContext } from 'react';
import { db, storage } from '@/services/firebase';
import CustomPageheader from '@/component/customPageheader'

const { Dragger } = Upload;

export default function Memo() {
    const [fileUrl, setFileUrl] = useState(null)
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
      })
    const [form] = Form.useForm();
    
    const handleUpload = async (e) => {
        setState({...state,
            uploading: true,
        });

        const { fileList } = state;
        const formData = new FormData();
        fileList.forEach(async(file) => {
            // formData.append('files[]', file);

            // const file = e.target.files[0];
            const storageRef = storage.ref();
            const fileRef = storageRef.child(file.name);
            await fileRef.put(file);
            setFileUrl(await fileRef.getDownloadURL());
        });

        setState({...state,
            uploading: false,
        });
        
    }   
    console.log(fileUrl)
    


    const { uploading, fileList } = state;

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
    };

    // const props = {
    //   onRemove: file => {
    //     setState(state => {
    //       const index = state.fileList.indexOf(file);
    //       const newFileList = state.fileList.slice();
    //       newFileList.splice(index, 1);
    //       return {
    //         fileList: newFileList,
    //       };
    //     });
    //   },
    //   beforeUpload: file => {
    //     setState(state => ({
    //       fileList: [...state.fileList, file],
    //     }));
    //     return false;
    //   },
    //   fileList,
    // };

    return (
        <CustomPageheader title={'Records'} icon={<SnippetsOutlined />} >
        <Card title="" bordered={false}  style={{width:'100%'}}>
            <Form
            form={form}
            layout="vertical"
            >
            <Form.Item label="Description" required tooltip="This is a required field">
                <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item
                label="Upload File"
                tooltip={{
                title: 'Tooltip with customize icon',
                icon: <InfoCircleOutlined />,
                }}
            >
                {/* <Upload {...props}>
                <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload> */}
                {/* <Button
                type="primary"
                onClick={()=>handleUpload()}
                // disabled={state.fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
                >
                {uploading ? 'Uploading' : 'Start Upload'}
                </Button> */}

                <Dragger {...props}>
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
            <Form.Item>
                <Button type="primary">Submit</Button>
            </Form.Item>
            </Form>
        
        </Card>
        </CustomPageheader>
    )
}


