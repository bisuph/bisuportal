import { Button, Card, Tabs } from 'antd';
import CustomLayout from "../../component/customLayout";
import { useState } from "react";
import RecordsList from './recordsList';
import CustomPageheader from '../../component/customPageheader';
import { useRouter } from 'next/router';
import CreateRecord from './create';
import { FormOutlined , ContainerOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const Office = () => {
    const router = useRouter()
    const {office} = router.query
    const [state,setState] = useState ({
        current: 'mail',
        activeKey:"1"
    });
    
    const handleClick = e => {
        console.log('click ', e);
        setState({ current: e.key });
    };

    const { current , activeKey} = state

    function callback(key) {
        console.log(key)
        setState({...state,activeKey:key})
    }

    return <CustomLayout >
        <CustomPageheader title={decodeURI(office)}  >
        <Card style={{borderRadius:"max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px",boxShadow:'0 1px 2px rgba(0, 0, 0, 0.2)'}}>
        <Tabs onChange={callback} centered activeKey={activeKey} addIcon={<FormOutlined />}>
                
            <TabPane 
                tab={
                    <span>
                    <ContainerOutlined />
                    RECORDS
                    </span>
                }
                key="1"
            >
                {(activeKey == "1" && (
                    <RecordsList/>
                ))}
            </TabPane>
            <TabPane 
                tab={
                    <span>
                    <FormOutlined />
                    CREATE
                    </span>
                }
                key="2">
                {(activeKey == "2" && (
                    <CreateRecord/>
                ))}
            </TabPane>
        </Tabs>
        </Card>
    </CustomPageheader>
    </CustomLayout>
}

export default  Office;