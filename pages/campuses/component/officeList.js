import { Avatar, Badge, Card, List, Modal, Skeleton, Button } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SolutionOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { auth, db } from '../../../services/firebase';
import { useEffect, useState } from 'react';
import OfficeRecords from './officeRecords';
import OfficeArchive from './officeArchive';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function OfficeList ({...props}) {
    const [data,setData] = useState([])
    const [visible, setVisible] = useState({
        records:false,
        archive:false,
    });
    const [office, setOffices] = useState({
        records:null,
        archive:null,
    });

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                
                        db.collection("office")
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
        setVisible({...visible,records:true})
        setOffices({...office,records:value})
    }

    const onModalArchiveOpen = (value) => {
        setVisible({...visible,archive:true})
        setOffices({...office,archive:value})
    }

    // console.log(data)
    // console.log(props?.campus)

    return(
        <>
            <Card >
            <List
                dataSource={data}
                renderItem={item => (
                <List.Item
                    actions={[
                    <Badge count={item[props?.campus]}>
                        <Button type='primary'  onClick={() => onModalOpen(item.id)}>Records</Button>
                    </Badge>,
                    <Badge count={item?.archive?.[props?.campus]}>
                        <Button danger type='primary' onClick={() => onModalArchiveOpen(item.id)}>Archive</Button>
                    </Badge>

                    ]}
                >
                    <Skeleton avatar title={false} loading={false} active>
                      <List.Item.Meta
                        avatar={
                                <Avatar shape="square" icon={<SolutionOutlined />} style={{ backgroundColor: '#52c41a' }}/>
                        }
                        title={<a >{item.name}</a>}
                        // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </Skeleton>
                </List.Item>
                // <List.Item style={{paddingBottom:'0px'}} size="small">
                //     <Card onClick={() => onModalOpen(item.id)} style={{width:'100%',cursor:'pointer',borderRadius:"max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px",boxShadow:'0 1px 2px rgba(0, 0, 0, 0.2)'}}>
                //         <Space >
                //         <Badge count={item[props?.campus]}>
                //             <Avatar shape={'square'} icon={<SolutionOutlined />} style={{ backgroundColor: '#52c41a' }} />
                //         </Badge>
                //         {item.name}
                //         <Button type='primary'>Records</Button>
                //         </Space>
                //     </Card>
                // </List.Item>
                )}
            />
            </Card>
            <Modal
                title="Records"
                centered
                visible={visible?.records}
                okButtonProps={{ hidden: true }}
                onCancel={() => setVisible({...visible,records:false})}
                // cancelButtonProps={{ hidden: true }}
                width={1000}
            >
                <OfficeRecords office={office?.records} />
            </Modal>
            <Modal
                title="Archives"
                centered
                visible={visible?.archive}
                okButtonProps={{ hidden: true }}
                onCancel={() => setVisible({...visible,archive:false})}
                // cancelButtonProps={{ hidden: true }}
                width={1000}
            >
                <OfficeArchive office={office?.archive} />
            </Modal>
        </>
    )
}