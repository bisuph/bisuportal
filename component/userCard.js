import { Card, Avatar, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { db } from '@/services/firebase';

const { Meta } = Card;

const UserCard = ({title,description,avatar,cover}) => {
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
            style={{ width: '100%', height:'100%' }}
            cover={cover}
            actions={[
            <EyeOutlined key="View"/>,
            <EditOutlined key="edit" />,
            <Popconfirm title="Delete？" okText="Yes" cancelText="No" onConfirm={()=>onDelete(title)}>
                <DeleteOutlined/>
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

export default UserCard;