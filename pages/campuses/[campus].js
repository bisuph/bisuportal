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
    const [state,setState] = useState(null)
    useEffect(()=>{
        var docRef = db.collection("campus").doc(campus);
        docRef.get().then((doc) => {
            if (doc.exists) {
                setState(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
    },[])

    return(
        <CustomLayout >
            <CustomPageheader title={state?.name} icon={state?.logo}>
            <CampusLayout />
            </CustomPageheader>
        </CustomLayout>
    )
}