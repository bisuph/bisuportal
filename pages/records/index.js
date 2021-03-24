import { PageHeader, Upload, Card, Tabs, Layout, Space, Button, Form, Input, Radio } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import React, { useState} from 'react';
import CustomPageheader from '@/component/customPageheader'
import { useRouter } from 'next/router'

const ListOfMemo = dynamic(() => import('./listOfMemo'))


export default function Memo() {
    const router = useRouter()
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    })

    return (
        <CustomPageheader title={'Records'} icon={<SnippetsOutlined />} extra={[
            router.pathname !== '/records/create' ?
            <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={()=>router.push("/records/create")}>
                Add
            </Button>
            :
            <></>
        ]}>
            <ListOfMemo />
        </CustomPageheader>
    )
}


