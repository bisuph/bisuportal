import { PageHeader, Upload, Card, Tabs, Popconfirm, Space, Button, Tag, Input, Modal, Table } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SearchOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import React, { useEffect, useState} from 'react';
import { useRouter } from 'next/router'
import { auth, db } from '../../services/firebase';
import Highlighter from 'react-highlight-words';
import { getUploadedFilesPerUser } from '../../services/fecthData';
const { TabPane } = Tabs;

// const Create = dynamic(() => import('../create'))
const { Search } = Input;

export default function RecordsList({...props}) {
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const { office } = router.query

    const [state, setState] = useState({
        initLoading: true,
        loading: false,
        list: [],
    })

    const [cred, setCred] = useState(null)
    const [defaultProps, setDefaultProps] = useState(null)


    props.state = state
    props.list = state.list
    props.initLoading = state.initLoading
   
    useEffect(()=>{
        refresh()
    },[])

    function callback(key) {
        refresh()
    }

    const refresh = () => {
        auth().onAuthStateChanged((user) => {
            if(user){

                let ref = db.collection('User').doc(user.email)

                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                    const userCred = snapshot.data()
                    setCred(userCred)
                    console.log(decodeURI(office))
                    if(userCred.role === 'Super Admin'){
                        const data = getUploadedFilesPerUser(decodeURI(office),userCred.campus)
                        data.then(docs => {
                            setState({
                                initLoading: false,
                                list: docs,
                            });
                        })
                    }
                    else{
                        if(userCred.role === 'Admin'){
                            const data = getUploadedFilesPerUser(decodeURI(office),userCred.campus)
                            data.then(docs => {
                                setState({
                                    initLoading: false,
                                    list: docs,
                                });
                            })
                        }
                        else{
                            const data = getUploadedFilesPerUser(decodeURI(office),userCred.campus)
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
    }

    const [search,setSearch] = useState({
    searchText: '',
    searchedColumn: '',
    })

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
    });
    };

    const getColumnSearchProps = dataIndex => ({

    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
        <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
            <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            >
            Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
            </Button>
        </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
        record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
        search.searchedColumn === dataIndex ? (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[search.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
        />
        ) : (
        text
        ),
    });

    const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
    };
    
    const onPopConfirm = (record) => {
        db.collection("UploadedFiles").doc(record.id).delete().then(() => {
            console.log("Document successfully deleted!");
            refresh()
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
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
        },
        {
            title: 'Office',
            dataIndex: 'offices',
            key: 'offices',
            width: '20%',
        },
        {
            title: 'Uploaded by',
            dataIndex: 'uploader',
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
                <Button type="primary"  icon={<EditOutlined />} onClick={() => {setVisible(true),setDefaultProps(record)}} />
                <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>onPopConfirm(record)}>
                    <Button type="primary"  danger  icon={<DeleteOutlined />} size={'middles'} />
                </Popconfirm>
            </Space>
        
        },

        // {
        //   title: 'Uploaded by',
        //   dataIndex: 'address',
        //   key: 'address',
        //   ...getColumnSearchProps('address'),
        // },
      ];
    return (
                    <Table 
                        columns={columns} 
                        dataSource={state.list}
                        bordered
                        title={() => 'Records'}
                    />
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


