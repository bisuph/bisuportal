import { PageHeader, Row, Col, Card, Layout, Button } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import React, { useState } from 'react';
import {
    PlusCircleOutlined,
    AppstoreOutlined,
  } from '@ant-design/icons';

const List = dynamic(() => import('./component/list'))
const Add = dynamic(() => import('./component/add'))
const { Content} = Layout;

export default function User() {
    
    const router = useRouter()
    const [state,setState] = useState({
        loadings: false,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    async function onFinish (values) {
        console.log('Success:', values);
        try {
        setIsModalVisible(false);
        setState({loadings:!state.loadings})
        } catch (error) {
        setState({ error: error.message });
        }
    };

    const onClose = () => {
        setIsModalVisible(false);
        setState({loadings:!state.loadings})
    };
 
    const handleCancel = () => {
        setIsModalVisible(false);
        setState({loadings:!state.loadings})
    };

    
    const enterLoading = index => {
        setState({loadings:!state.loadings})
        showModal();
    };

    const { loadings } = state;

    return (
        <>
        <PageHeader
            className="site-page-header"
            onBack={() => router.push("/")}
            title="Accounts"
            subTitle="This is a subtitle"
        />
        <Content style={{ margin: '0 16px' }}>
            {/* <Divider orientation="left">List</Divider> */}
            <Row gutter={24}>
            <Col className="gutter-row" span={24}>
            <Card title="" extra={
                <Button 
                    type="primary" 
                    loading={loadings} 
                    icon={<PlusCircleOutlined />}
                    onClick={() => enterLoading(0)}>
                    Add
                </Button>} >
                <List />
            </Card>
            </Col>
            </Row>
        </Content>
        <Add onFinish={onFinish} onClose={onClose} handleCancel={handleCancel} isModalVisible={isModalVisible}/>
        </>
    )
}
