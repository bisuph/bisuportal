import Head from 'next/head'
import { PageHeader, Upload, Card, Tabs, Layout, Space, Button, Form, Input, Radio } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import React, { useState, useEffect,useContext } from 'react';
import { db, storage } from '@/services/firebase';
import { useRouter } from 'next/router'

export default function ConfigLayout(props) {
    const router = useRouter()

    return (
        <>
            <Space direction="vertical" style={{width:'100%'}}>
                <PageHeader
                    style={{
                        background:'white'
                    }}
                    onBack={() => window.history.back()}
                    title=""
                    extra={[
                        router.pathname !== '/records/create' ?
                        <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"} onClick={()=>router.push("/records/create")}>
                            Add
                        </Button>
                        :
                        <></>
                    ]}
                />
                <Card title="" bordered={false}  style={{width:'100%'}} >
                    {props.children}
                </Card>
            </Space>
        </>
    )
}


