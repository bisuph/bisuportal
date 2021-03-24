import Head from 'next/head'
import { PageHeader, Row, Col, Tabs, Layout, Card } from 'antd';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import {
    BlockOutlined
} from '@ant-design/icons';

const ExpensesList = dynamic(() => import('./tabPane/list'))
const ExpensesType = dynamic(() => import('./tabPane/type'))

const { TabPane } = Tabs;
const { Content} = Layout;

export default function Income() {
    
    const router = useRouter()
    return (
        <>
        <PageHeader
            className="site-page-header"
            onBack={() => router.push("/")}
            title="Expenses"
            subTitle="This is a subtitle"
        />
        <Content style={{ margin: '0 16px' }}>
            {/* <Divider orientation="left">List</Divider> */}
            <Row gutter={24}>
            <Col className="gutter-row" span={24}>
            <Card basic>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab={<span><BlockOutlined />Expenses List</span>} key="1">
                    <ExpensesList/>
                    </TabPane>
                    <TabPane tab={<span><BlockOutlined />Expenses Type</span>} key="2">
                    <ExpensesType/>
                    </TabPane>
                    {/* <TabPane tab="Tab 3" key="3">
                    Content of Tab Pane 3
                    </TabPane> */}
                </Tabs>
            </Card>
            </Col>
            </Row>
        </Content>
        
        </>
    )
}
