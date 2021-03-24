import { Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';

const { Meta } = Card;

const UserCard = ({title,description,avatar,cover}) => {

    return (
        <Card
            style={{ width: '100%', height:'100%' }}
            cover={cover}
            actions={[
            <EyeOutlined key="View"/>,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
            ]}
        >
            <Meta
            avatar={<Avatar src={avatar} />}
            title={title}
            description={description}
            />
        </Card>
    )
}

export default UserCard;