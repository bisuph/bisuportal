import { Avatar, Card, List, Space } from 'antd';
import CustomLayout from '../../component/customLayout';
import CustomPageheader from '../../component/customPageheader';
import { PlusSquareOutlined, SnippetsOutlined, SolutionOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { auth, db } from '../../services/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function Records () {
    const [data,setData] = useState([])
    const [userCred,setUserCred] = useState(null)

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

    return(
        <CustomLayout >
            <CustomPageheader title={'Records'} icon={<SnippetsOutlined />} >
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
                    <Link href={"/records/"+item.id}>
                    <Card.Grid style={{boxShadow:'0 20px 30px -16px rgba(9,9,16,0.2)',width:'100%',cursor:'pointer',}}>
                        <Space >
                        <Avatar shape={'square'} icon={<SolutionOutlined />} style={{ backgroundColor: '#1890ff' }} />{item.id}
                        </Space>
                    </Card.Grid>
                    </Link>
                </List.Item>
                )}
            />
            </CustomPageheader>
        </CustomLayout>
    )
}