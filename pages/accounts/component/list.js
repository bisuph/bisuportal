import { Table, Input, Button, Space, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../services/firebase';
import moment from 'moment';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function UserList() {
  const [state,setState] = useState({
    searchText: '',
    searchedColumn: '',
  })

  const [dataSource,setDataSource] = useState([])

  useEffect(() => {
    var unsubscribe = null
    auth().onAuthStateChanged((user) => {
      console.log(user.uid)
      if (user) {
        unsubscribe = db.collection(user.uid).doc('database').collection("accounts").onSnapshot(function (querySnapshot) {
            const data = querySnapshot.docs.map((doc,i) => {
              const newData = doc.data()
              newData.id = doc.id
              newData.key = i
              newData.birthday = moment(doc.data().birthday).format("MMMM DD, YYYY")
              return newData
            });
            setDataSource(data)
        });
      } else {
      router.push("/login")
      }
    })
    
  
    return () => {
      unsubscribe()
    }
  },[])

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  function showPromiseConfirm(record) {
    confirm({
      title: 'Do you want to delete these accounts?',
      icon: <ExclamationCircleOutlined />,
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
          auth().onAuthStateChanged((user) => {
            if (user) {
              db.collection(user.uid).doc('database').collection("accounts").doc(record.id).delete().then(function() {
                console.log("Document successfully deleted!");
              }).catch(function(error) {
                  console.error("Error removing document: ", error);
              });
            } else {
              router.push("/login")
            }
          })
      },
      onCancel() {},
    });
  }

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
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleReset = clearFilters => {
    clearFilters();
    setState({ searchText: '' });
  };

    const columns = [
      {
        key:'name',
        title: 'Name',
        dataIndex: 'name',
        width: '30%',
        ...getColumnSearchProps('name'),
      },
      {
        key:'birthday',
        title: 'Birthday',
        dataIndex: 'birthday',
        width: '20%',
        ...getColumnSearchProps('age'),
      },
      {
        key:'address',
        title: 'Address',
        dataIndex: 'address',
        ...getColumnSearchProps('address'),
      },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record) => <Button type={'danger'} icon={<DeleteOutlined />} onClick={()=>showPromiseConfirm(record)}>Delete</Button>,
      },
    ];
    return <Table columns={columns} dataSource={dataSource} />;
}
