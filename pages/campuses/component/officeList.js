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
    const {changePage} = props
    const [data,setData] = useState([])
    const [userCred,setUserCred] = useState(null)
    const [visible, setVisible] = useState(false);
    const [office, setOffices] = useState(null);

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                let ref = db.collection('User').doc(user.email)
                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                        setUserCred(snapshot.data())
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
                grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
                }}
                dataSource={data}
                renderItem={item => (
                <List.Item>
                    <Card.Grid style={{boxShadow:'0 20px 30px -16px rgba(9,9,16,0.2)',width:'100%',cursor:'pointer',}} onClick={() => onModalOpen(item.id)}>
                        <Space >
                        <Avatar shape={'square'} icon={<SolutionOutlined />} style={{ backgroundColor: '#1890ff' }} />{item.id}
                        </Space>
                    </Card.Grid>
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