import { Avatar, Card, List, Space } from 'antd';
import CustomLayout from '../../component/customLayout';
import CustomPageheader from '../../component/customPageheader';
import { PlusSquareOutlined, SnippetsOutlined, SolutionOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { auth, db } from '../../services/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CampusLayout from './component/campusLayout';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function Records ({...props}) {
    const [data,setData] = useState([])
    const [userCred,setUserCred] = useState(null)
    
    return(
        <CustomLayout >
            <CustomPageheader title={'Records'} icon={<SnippetsOutlined />} >
            <CampusLayout />
            </CustomPageheader>
        </CustomLayout>
    )
}