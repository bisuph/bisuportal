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
                        background:'white'
                    }}
                    onBack={() => window.history.back()}
                    avatar={{ icon: icon, shape : "square" , style : { backgroundColor: 'transparent', color:'black', marginRight:0 }}}
                    
                    title={title}
                    extra={extra}
                />
                <Card title="" bordered={false}  style={{width:'100%'}} >
                    {props.children}
                </Card>
            </Space>
        </>
    )
}


