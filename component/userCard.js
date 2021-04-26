import { Card, Avatar, Popconfirm } from 'antd';
import { EditTwoTone, DeleteTwoTone, EyeTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import { db } from './../services/firebase';
import { useRouter } from 'next/router';

const { Meta } = Card;

export default function UserCard  ({title,description,avatar,cover}) {
    const router = useRouter()
    const [confirmLoading, setConfirmLoading] = useState(false);

    const onDelete = (title) => {
        setConfirmLoading(true)
        db.collection("Campuses").doc(title).delete().then(() => {
            console.log("Document successfully deleted!");
            setConfirmLoading(false)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    return (
        <Card
            loading={confirmLoading}
            style={{ width: '100%', height:'100%', borderRadius:"max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px",boxShadow:'0 1px 2px rgba(0, 0, 0, 0.2)' }}
            cover={cover}
            actions={[
            <EyeTwoTone twoToneColor={"#52c41a"} key="View" onClick={()=> router.push('/campuses/'+decodeURI(title))}/>,
            <EditTwoTone key="edit" />,
            <Popconfirm title="Delete？" okText="Yes" cancelText="No" onConfirm={()=>onDelete(title)}>
            <DeleteTwoTone twoToneColor={'#eb2f96'} />
            </Popconfirm>
            ]}
        >
            <Meta
            avatar={<Avatar src={avatar} />}
            title={title}
            description={description}
            style={{minHeight:'95px'}}
            />
        </Card>
    )
}