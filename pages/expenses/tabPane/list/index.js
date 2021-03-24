import { PageHeader, Row, Col, Space, Layout, Button } from 'antd';
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

export default function IncomeType() {
    
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
        <Content style={{ margin: '0 16px' }}>
            {/* <Divider orientation="left">List</Divider> */}
            <Space direction="vertical" size={'large'} style={{width:'100%'}}>
            <Row>
                <Col className="gutter-row" span={24}>
                <Button 
                    style={{float:'right'}}
                    type="primary" 
                    loading={loadings} 
                    icon={<PlusCircleOutlined />}
                    onClick={() => enterLoading(0)}>
                    Add
                </Button>
                </Col>
            </Row>
            <Row>
                <Col className="gutter-row" span={24}>
                    <List />
                </Col>
            </Row>
            </Space>

        </Content>
        <Add onFinish={onFinish} onClose={onClose} handleCancel={handleCancel} isModalVisible={isModalVisible}/>
        </>
    )
}
