import { Card, Avatar, Popconfirm, Button,Radio,Space } from 'antd';
import { EditTwoTone, DeleteTwoTone, EyeTwoTone , PlusCircleOutlined} from '@ant-design/icons';
import { useState } from 'react';
import { db } from './../services/firebase';
import { useRouter } from 'next/router';

const { Meta } = Card;

export default function UserCard  ({item,cover,showModal}) {
    const router = useRouter()
    const [confirmLoading, setConfirmLoading] = useState(false);

    const onDelete = (id) => {
        setConfirmLoading(true)
        db.collection("campus").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            setConfirmLoading(false)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    return (
        <Card
            loading={confirmLoading}
            style={{ width: '100%', height:'100%', boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}
            cover={cover}
            actions={
                item?.name ? 
                [<Space size={[8, 16]} wrap>
                    <Button size='middle' type='dashed' onClick={()=> router.push('/campuses/'+decodeURI(item?.id))}><EyeTwoTone twoToneColor={"#52c41a"} key="View" /></Button>
                    <Button size='middle' type='dashed' onClick={()=> showModal(item)}><EditTwoTone key="edit" /></Button>
                    <Popconfirm title="Delete？" okText="Yes" cancelText="No" onConfirm={()=>onDelete(item?.id)}>
                    <Button size='middle' type='dashed' >
                        <DeleteTwoTone twoToneColor={'#eb2f96'} />
                    </Button>
                    </Popconfirm>
                </Space>]
                :
                ''
            }
        >
            {
            item?.name ?
                <Meta
                avatar={<Avatar src={item.logo} />}
                title={item.name}
                description={item.address}
                style={{minHeight:'95px'}}
                />
                :
                <Space align="center" style={{width:'100%',padding:'44px 100px 44px 100px',cursor:'pointer'}} onClick={()=>showModal(item)}>
                    <PlusCircleOutlined style={{fontSize:'55px',color:'rgba(0, 0, 0, 0.45)'}}/>
                </Space>
            }
        </Card>
    )
}