import { Button, Form, Input, Upload, Modal, Select, Space, Progress, Tag, Popconfirm, message } from "antd"
import { useContext, useEffect, useState } from "react"
import {
    InfoCircleOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { AccountContext } from "../../context/AccountContext";
import { auth, db, storage } from "../../services/firebase";
import { getRecords } from "../../services/fecthData";


const { Dragger } = Upload;
const { Option } = Select;

export default function UpdateRecord ({setMirror,mirror,office,toUpdate}) {
    const {account} = useContext(AccountContext)
    const [fileExist,setFileExist] = useState([])
    const [buttonDisable,setbuttonDisable] = useState(false)
    const [percent,setpercent] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [visible,setVisible] = useState(mirror)
    const [record,setRecord] = useState([])
    const [form] = Form.useForm(); 
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    })

    const {fileList} = state

    useEffect(()=>{
        form.setFieldsValue({description:toUpdate?.description,record:toUpdate?.record?.name})
        setVisible(mirror)

        if(toUpdate?.files.length > 0){
            setFileExist(toUpdate?.files)
        }
        else{
            setFileExist([])
        }
        
        setState({...state,fileList:[]})
        var docRefOff = getRecords()
        docRefOff.then(docsOff => {
            setRecord(docsOff)
        })
    },[mirror])

    const hideModal = () => {
        setMirror(false)
    }

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    const handleOk = (values) => {
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
                    files:forUpload.concat(fileExist),
                    uploadedBy:account.email
                }

                if(!isJson(values.record)) 
                {delete values.record} else {forSave.record = JSON.parse(values.record);}
             
                db.collection('uploaded').doc(toUpdate.id).update(forSave)
                .then((docRef) => {
                    setMirror(false)
                    message.success('Successfully updated');
                })
                .catch((error) => {
                    setUploading(false)
                    console.error("Error adding document: ", error);
                });
            }
        })
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
        required: 'Password is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

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
        var desertRef = storageRef.child('files/'+file.names);

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

    const removeFiles = async(i,name) => {
        
        const storageRef = await storage.ref();
        var desertRef = storageRef.child('files/'+name);
        // Delete the file
        desertRef.delete().then(() => {
            var ex = _.clone(fileExist)
            ex.splice(i, 1);
            setFileExist(ex)
            db.collection('uploaded').doc(toUpdate.id).update({files:ex})
            .then((docRef) => {
                message.success('Successfully updated');
            })
            .catch((error) => {
                setUploading(false)
                console.error("Error adding document: ", error);
            });
            
        // File deleted successfully
        }).catch((error) => {
        // Uh-oh, an error occurred!
        });

    }


    return (
        <Modal
        title="Update"
        visible={visible}
        okText='Confirm'
        cancelText="Cancel"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        closable={false}
        >
            <Form form={form} {...layouts}  layout="vertical" name="nest-messages" onFinish={handleOk} validateMessages={validateMessages}>
                
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
                }
                
                <Form.Item>
                    <Space direction='vertical'>
                        {/* <Space size={[8, 16]} wrap> */}
                            {(fileExist ?? []).map((items,i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Popconfirm title="Delete ?" okText="Yes" cancelText="No" onConfirm={()=>removeFiles(i,items.name)}>
                            <Tag key={i} color='geekblue-inverse'>{items.name}</Tag>
                            </Popconfirm>
                            ))}
                        {/* </Space> */}
                        <Space>
                            <Button type="primary" htmlType="submit" loading={uploading} disabled={buttonDisable}>Submit</Button>
                            <Button loading={uploading} onClick={()=>hideModal()}>Cancel</Button>
                        </Space>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}