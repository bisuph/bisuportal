import { Avatar, Card, List, Space } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SolutionOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { auth, db } from '../../../services/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OfficeRecords from './officeRecords';
import OfficeList from './officeList';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function CampusLayout ({...props}) {
    const [data,setData] = useState([])
    const [userCred,setUserCred] = useState(null)
    const router = useRouter()
    const {campus} = router.query

    return(
       <OfficeList campus={campus}/>
    )
}