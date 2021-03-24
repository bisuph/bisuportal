import { PageHeader, Row, Col, Card, Layout, Button } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import UserCard from '@/component/UserCard'
import React, { useState } from 'react';
import {
    PlusSquareOutlined
  } from '@ant-design/icons';
import { EditOutlined, EllipsisOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
  

const List = dynamic(() => import('./component/list'))
const Add = dynamic(() => import('./component/add'))
const { Content} = Layout;

const colCard = {
    xs:24 ,
    sm:12 ,
    md:6 ,
    lg:6 ,
    xl:6 ,
    xxl:6
}

export default function Schools() {
    
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
        <Row gutter={[16, 16]}>
            <Col span={24}>
            <PageHeader
                style={{
                    background:'white',
                    marginBottom:10
                }}
                className="site-page-header"
                onBack={() => window.history.back()}
                title="Schools"
                subTitle="This is a subtitle"

                extra={[
                    <Button type="primary" icon={<PlusSquareOutlined />} size={"middle"}>
                        Add
                    </Button>
                ]}
            />
            </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
        {
            
        }
            <Col  {...colCard}>
                <UserCard 
                    title = {'Bisu Balilihan'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

            <Col  {...colCard}>
                <UserCard 
                    title = {'Bisu Calape'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

            <Col  {...colCard}>
                <UserCard 
                    title = {'Bisu Loon'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

            <Col  {...colCard}>
            <UserCard 
                    title = {'Bisu Dauis'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

            <Col  {...colCard}>
                <UserCard 
                    title = {'Bisu Guindulman'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

            <Col  {...colCard}>
                <UserCard 
                    title = {'Bisu Guindulman'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

            <Col  {...colCard}>
                <UserCard 
                    title = {'Bisu Guindulman'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

            <Col  {...colCard}>
                <UserCard 
                    title = {'Bisu Guindulman'}
                    description = { 'Balilihan, Bohol, Philippines' }
                    avatar = {"https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png"}
                />
            </Col>

        </Row>
        {/* <Content style={{ margin: '0 16px' }}>
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
        <Add onFinish={onFinish} onClose={onClose} handleCancel={handleCancel} isModalVisible={isModalVisible}/> */}
        </>
    )
}
