import { Form, Upload, Card, Tabs, Popconfirm, Space, Button, Tag, Input, Table, Select } from 'antd';
import { PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router'
import { auth, db } from '../../services/firebase';
import { decrementFilesCount, getRecords, getUploadedFilesPerAdmin, getUploadedFilesPerUser } from '../../services/fecthData';
import { AccountContext } from '../../context/AccountContext';
import { filter } from 'lodash';
import UpdateRecord from './updateRecord';

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
                            setState({
                                initLoading: false,
                                list: docs,
                            });
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
        db.collection("uploaded").doc(record.id).delete().then(() => {
            decrementFilesCount(office,account?.campus?.id)
            console.log("Document successfully deleted!");
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
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (record) => 
                ((record.uploadedBy === account?.email)&&(
                    <Space>
                        <Button type="primary"  icon={<EditOutlined />} onClick={() => onEditButton(record)} />
                        <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>onPopConfirm(record)}>
                            <Button type="primary"  danger  icon={<DeleteOutlined />} size={'middles'} />
                        </Popconfirm>
                    </Space>
                ))
        
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


