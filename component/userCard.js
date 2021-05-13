import { Card, Avatar, Popconfirm, Button,Radio,Space, message } from 'antd';
import { EditTwoTone, DeleteTwoTone, EyeTwoTone , PlusCircleOutlined} from '@ant-design/icons';
import { useContext, useState } from 'react';
import { db } from './../services/firebase';
import { useRouter } from 'next/router';
import PasswordConfirm from '../pages/campuses/component/passwordConfirm';
import { AccountContext } from '../context/AccountContext';
import { checkCampusData, updateRemoveCampus } from '../services/fecthData';

const { Meta } = Card;

export default function UserCard  ({item,cover,showModal}) {
    const {account} = useContext(AccountContext)
    const router = useRouter()
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [password,setPassword] = useState(null)

    const onDelete = (item) => {
        checkCampusData(item.name).then(function(values){
            if(values.length === 0){
                setPassword(item.id)
            }
            else{
                message.error('Uploaded files exist.')
            }
        })
    }

    const afterResult = (id) => {
        db.collection("campus").doc(id).delete().then(() => {
            updateRemoveCampus(id)
            console.log("Document successfully deleted!");
            message.success('Successfully deleted.')
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    
    return (
        <>
        <Card
            loading={confirmLoading}
            style={{ width: '100%', height:'100%', boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}
            cover={cover}
            cover={item?.logo ? <img alt="example" src={item?.logo} height={150}/>  : ''}
            actions={
                item?.name ? 
                [<Space size={[8, 16]} wrap>
                    <Button size='middle' type='dashed' onClick={()=> router.push('/campuses/'+decodeURI(item?.id))}><EyeTwoTone twoToneColor={"#52c41a"} key="View" /> View</Button>
                    {(account?.role === 'Super Admin') && (
                    <><Button size='middle' type='dashed' onClick={()=> showModal(item)}><EditTwoTone key="edit" /> Edit</Button>
                    <Popconfirm title="Delete？" okText="Yes" cancelText="No" onConfirm={()=>onDelete(item)}>
                    <Button size='middle' type='dashed' >
                        <DeleteTwoTone twoToneColor={'#eb2f96'} /> Delete
                    </Button>
                    </Popconfirm></>)}
                    
                </Space>]
                :
                ''
            }
        >
            {
            item?.name ?
                <Meta
                // avatar={<Avatar src={item.logo} shape="square"/>}
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
        {(password)&&(<PasswordConfirm open={password} setClose={setPassword} afterResult={afterResult}/>)}
        </>
    )
}