import { Avatar, Card, List, Modal, Space } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SolutionOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { auth, db } from '../../../services/firebase';
import { useEffect, useState } from 'react';
import OfficeRecords from './officeRecords';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function OfficeList ({...props}) {
    const [data,setData] = useState([])
    const [visible, setVisible] = useState(false);
    const [office, setOffices] = useState(null);

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                
                        db.collection("Offices")
                        .onSnapshot((querySnapshot) => {
                            const list  = []
                            querySnapshot.forEach((doc) => {
                                var l = doc.data()
                                l.id = doc.id
                                list.push(l)
                            });
                            setData(list)
                        });
            }
        })

        // return () => {
        //     unsubscribe()
        // }
    },[db])

    const onModalOpen = (value) => {
        setVisible(true)
        setOffices(value)
    }


    return(
        <>
            <List
                dataSource={data}
                renderItem={item => (
                <List.Item style={{paddingBottom:'0px'}}>
                    <Card onClick={() => onModalOpen(item.id)} style={{width:'100%',cursor:'pointer',borderRadius:"max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px",boxShadow:'0 1px 2px rgba(0, 0, 0, 0.2)'}}>
                        <Space >
                        <Avatar shape={'square'} icon={<SolutionOutlined />} style={{ backgroundColor: "#52c41a" }} />{item.id}
                        </Space>
                    </Card>
                </List.Item>
                )}
            />

            <Modal
                title="Records"
                centered
                visible={visible}
                okButtonProps={{ hidden: true }}
                onCancel={() => setVisible(false)}
                // cancelButtonProps={{ hidden: true }}
                width={1000}
            >
                <OfficeRecords office={office} />
            </Modal>
        </>
    )
}