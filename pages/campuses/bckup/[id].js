import { PageHeader, Upload, Card, Tabs, Layout, Space, Button, Tag, Input, Divider, Table } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SearchOutlined, PaperClipOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import React, { useEffect, useState} from 'react';
import CustomPageheader from '../../../component/customPageheader'
import { useRouter } from 'next/router'
import CustomLayout from '../../../component/customLayout';
import { auth, db } from '../../../services/firebase';
import Highlighter from 'react-highlight-words';
import { getUploadedFiles, getUploadedFilesPerUser, getUploadedFilesPerAdmin } from '../../../services/fecthData';
import { upperCase } from 'lodash';


export default function Records({...props}) {
    const router = useRouter()
    const { id } = router.query
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
                        const data = getUploadedFilesPerAdmin(decodeURI(id))
                        data.then(docs => {
                            setState({
                                initLoading: false,
                                list: docs,
                            });
                        })
                    }
                })
            }
        })
    
    },[db])

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
    
    const columns = [
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: '30%',
          ...getColumnSearchProps('description'),
        },
        {
          title: 'Campus',
          dataIndex: 'campus',
          key: 'campus',
          width: '20%',
          ...getColumnSearchProps('campus'),
        },
        {
            title: 'Office',
            dataIndex: 'offices',
            key: 'offices',
            width: '20%',
            ...getColumnSearchProps('offices'),
        },
        {
            title: 'Uploaded by',
            dataIndex: 'uploader',
            key: 'uploader',
            width: '20%',
            ...getColumnSearchProps('uploader'),
        },
        {
            title: 'Files',
            key: 'files',
            dataIndex: 'files',
            render: files => (
              <>
                {files.map((val,i) => {
                  
                  return (
                    <Tag  key={i} color={'blue'}>
                      <a href={val.url} target="_blank" key={i}><PaperClipOutlined /> {val.name}</a>
                    </Tag>
                  );
                })}
              </>
            ),
        },

        // {
        //   title: 'Uploaded by',
        //   dataIndex: 'address',
        //   key: 'address',
        //   ...getColumnSearchProps('address'),
        // },
      ];
    return (
        <CustomLayout >
        <CustomPageheader title={upperCase(decodeURI(id))} icon={<SnippetsOutlined />} >
                <Table columns={columns} dataSource={state.list} />
        </CustomPageheader>
        </CustomLayout>
    )
}


