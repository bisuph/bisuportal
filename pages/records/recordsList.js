import { Form, Upload, Card, Tabs, Popconfirm, Space, Button, Tag, Input, Table, Select, message } from 'antd';
import { PaperClipOutlined, DeleteOutlined, EditOutlined, ReconciliationOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router'
import { auth, db } from '../../services/firebase';
import { decrementFilesCount, getRecords, getUploadedFilesPerAdmin, getUploadedFilesPerUser, incrementArchivesCount } from '../../services/fecthData';
import { AccountContext } from '../../context/AccountContext';
import _ from 'lodash';
import UpdateRecord from './updateRecord';
import PasswordConfirm from '../campuses/component/passwordConfirm';
import moment from 'moment';

const { Search } = Input;

export default function RecordsList({...props}) {
    const {account} = useContext(AccountContext)
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const {office} = router.query
    const [record,setRecord] = useState([])
    const [selected,setSelected] = useState(null)
    const [state, setState] = useState({
        initLoading: true,
        loading: false,
        list: [],
        
    })
    const [password,setPassword] = useState(null)

   
    useEffect(()=>{
        refresh()
    },[account,visible])

    const refresh = () => {
        auth().onAuthStateChanged((user) => {
            if(user){
                var docRef = db.collection("office").doc(office);
                docRef.get().then((doc) => {
                    if (doc.exists) {

                        const data = getUploadedFilesPerUser(doc.id,account?.campus?.id)
                        // const data = getUploadedFilesPerAdmin(account?.campus.id)
                        data.then(docs => {
                            setState({...state,
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

    const onPopConfirm = (record) => {
        setPassword(record.id)
    }

    const onArchive = (record) => {
        db.collection('archived').add(record)
        .then((docRef) => {
            db.collection("uploaded").doc(record.id).delete().then(() => {
                decrementFilesCount(office,account?.campus?.id)
                incrementArchivesCount(account?.offices,account?.campus?.id)
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

    const afterResult = (id) => {
        db.collection("uploaded").doc(id).delete().then(() => {
            decrementFilesCount(office,account?.campus?.id)
            message.success("Document successfully deleted!");
            refresh()
        }).catch((error) => {
            console.error("Error removing document: ", error);
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

    const onEditButton = (value) => {
        setSelected(value)
        setVisible(true)
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
                    <Space>
                    {((record.uploadedBy === account?.email)&&(
                        <>
                        <Button type="primary"  icon={<EditOutlined />} onClick={() => onEditButton(record)} />
                        <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>onPopConfirm(record)}>
                            <Button type="primary"  danger  icon={<DeleteOutlined />} size={'middles'} />
                        </Popconfirm>
                        </>
                    ))}
                        <Popconfirm title="This record will move to archive, click yes  to proceed." okText="Yes" cancelText="No" onConfirm={()=>onArchive(record)}>
                            <Button type='default'  style={{background:'yellow'}}  icon={<ReconciliationOutlined />} size={'middles'} />
                        </Popconfirm>
                    </Space>
        
        },
       
      ];
    return (
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
            <UpdateRecord mirror={visible} setMirror={setVisible} toUpdate={selected} office={office}/>
            {(password)&&(<PasswordConfirm open={password} setClose={setPassword} afterResult={afterResult}/>)}
        </Space>
                    // <Modal
                    // title="Update"
                    // centered
                    // visible={visible}
                    // okButtonProps={{ hidden: true }}
                    // cancelButtonProps={{ hidden: true }}
                    // width={1000}
                    // >
                    // <Create default={defaultProps} onHide={setVisible}/>
                    // </Modal>
    )
}


