import { Avatar, Badge, Card, List, Space } from 'antd';
import CustomLayout from '../../component/customLayout';
import CustomPageheader from '../../component/customPageheader';
import { PlusSquareOutlined, SnippetsOutlined, SolutionOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { auth, db } from '../../services/firebase';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AccountContext } from '../../context/AccountContext';
import { getOfficesById } from '../../services/fecthData';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function Records () {
    const {account} = useContext(AccountContext)
    const [data,setData] = useState([])

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                
                if(account?.role === 'Admin'){
                    db.collection("office")
                    .onSnapshot((querySnapshot) => {
                        const list  = []
                        querySnapshot.forEach((doc) => {
                            const pushed = doc.data()
                            pushed.id = doc.id
                            list.push(pushed)
                            
                        });
                        setData(list)
                    });
                }
                else {
                    
                    const existing = getOfficesById(account?.offices?.id)
                    existing.then(function(result){
                        if(result){
                            setData([result])
                        }
                    })
                    
                    // setData(list)

                }
            }
        })

        // return () => {
        //     unsubscribe()
        // }
    },[account])

    return(
        <CustomLayout >
            <CustomPageheader title={'Archive'} icon={"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"} >
            <List
                dataSource={data}
                renderItem={item => (
                <List.Item style={{paddingBottom:'0px'}}>
                    <Link href={"/archived/"+item.id}>
                    <Card style={{width:'100%',cursor:'pointer',boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}>
                        <Space >
                        <Badge count={item[`archive-${account?.campus?.id}`]}>
                            <Avatar shape={'square'} icon={<SolutionOutlined />} style={{ backgroundColor: '#1890ff' }} />
                        </Badge>
                        {item.name}
                        </Space>
                    </Card>
                    </Link>
                </List.Item>
                )}
            />
            </CustomPageheader>
        </CustomLayout>
    )
}