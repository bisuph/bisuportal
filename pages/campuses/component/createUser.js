import { Form, Input, Upload, Button, Modal, Col, Space } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TextArea from 'antd/lib/input/TextArea';
import { storage } from '../../../services/firebase';

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

const layouts = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 24,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */

const CreateUser = ({setState,state,handleOk,confirmLoading,handleCancel,form,...props}) => {
    
    const handleUpCancel = () => setState({...state, previewVisible: false });

    const processUpload = async (fileList) => {
        if(fileList?.length > 0){
            const file = fileList[0].originFileObj
            const storageRef = await storage.ref();
            const fileRef = await storageRef.child('logo/'+file.name);
            var task = fileRef.put(file);

            task.on('state_change',
                function progress(snapshot){
                    fileList[0].status = 'Uploading'
                    setState({...state, fileList })
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                (error) => {
                    // Handle unsuccessful uploads
                }, 
                () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                task.snapshot.ref.getDownloadURL().then( async(downloadURL) => {
                    fileList[0].url = downloadURL
                    fileList[0].status = 'done'
                    setState({...state, fileList })

                });
                }
            )
        }
        else{
            const file = state.fileList[0]
            console.log(state)
            const storageRef = await storage.ref();
            var desertRef = storageRef.child('logo/'+file.name);

            // Delete the file
            desertRef.delete().then(() => {
            setState({...state, fileList })
            // File deleted successfully
            }).catch((error) => {
            // Uh-oh, an error occurred!
            });


        }
        
        
    }
    
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        
        setState({
        ...state,
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    const handleChange = ({ fileList }) => {
        processUpload(fileList)
    };
    const { previewVisible, previewImage, fileList, previewTitle } = state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload Logo</div>
      </div>
    );
    return(
            <Form  form={form}  {...layouts} layout="vertical" name="nest-messages" onFinish={handleOk} validateMessages={validateMessages}>
                <Form.Item 
                    name={'logo'}
                >
                    <>
                        <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        >
                        {fileList?.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleUpCancel}
                        >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </>
                </Form.Item>
                <Form.Item
                    name={'name'}
                    label="Campus"
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                    tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                <Input size={'large'} autoComplete={'off'} />
                </Form.Item>

                <Form.Item
                    name={'address'}
                    label="Address"
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                    tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                <TextArea size={'large'} autoComplete={'off'} />
                </Form.Item>

                <Form.Item 
                    rules={[
                        {
                        required: true,
                        },
                ]}>

                <Space direction='vertical' style={{width:'100%'}}>
                    
                    <Button type="primary" htmlType="submit" loading={confirmLoading} style={{width:'100%'}}>
                        Submit
                    </Button>
                    <Button onClick={handleCancel} style={{width:'100%'}}>
                        Cancel
                    </Button>

                </Space>
               
                </Form.Item>
            </Form>
    )
}

export default CreateUser;