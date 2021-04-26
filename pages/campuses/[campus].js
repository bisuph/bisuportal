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
    const router = useRouter()
    const {campus} = router.query   
    return(
        <CustomLayout >
            <CustomPageheader title={decodeURI(campus)} icon={<img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"  />}>
            <CampusLayout />
            </CustomPageheader>
        </CustomLayout>
    )
}