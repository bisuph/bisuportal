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
                        boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'
                    }}
                    onBack={() => window.history.back()}
                    avatar={{ icon: icon? <img src={icon} /> : <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"  />, shape : "square" , style : { backgroundColor: 'transparent', color:'black' }}}
                    
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


