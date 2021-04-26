import { PageHeader, Card, Space} from 'antd';
import React, { useState, useEffect,useContext } from 'react';
import { useRouter } from 'next/router'

export default function CustomPageheader({title,extra,icon,...props}) {
    const router = useRouter()

    return (
        <>
            <Space direction="vertical" style={{width:'100%'}}>
                <PageHeader
                    style={{
                        background:'white',
                        borderRadius:"max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px",boxShadow:'0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                    onBack={() => window.history.back()}
                    avatar={{ icon: icon, shape : "square" , style : { backgroundColor: 'transparent', color:'black' }}}
                    
                    title={title}
                    extra={extra}
                />
                {/* <Card title="" bordered={false}  style={{width:'100%'}} > */}
                    {props.children}
                {/* </Card> */}
            </Space>
        </>
    )
}


