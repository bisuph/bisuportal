import { Button, Card, Tabs } from 'antd';
import CustomLayout from "../../component/customLayout";
import { useContext, useEffect, useState } from "react";
import RecordsList from './recordsList';
import CustomPageheader from '../../component/customPageheader';
import { useRouter } from 'next/router';
import CreateRecord from './create';
import { FormOutlined , ContainerOutlined } from '@ant-design/icons';
import { db } from '../../services/firebase';
import { AccountContext } from '../../context/AccountContext';
import _ from 'lodash';

const { TabPane } = Tabs;

const Office = ({...props}) => {
    const {account} = useContext(AccountContext)
    const router = useRouter()
    const {office} = router.query
    const [state,setState] = useState ({
        activeKey:"1",
        data:null
    });
    
   
    const { activeKey} = state

    function callback(key) {
        setState({...state,activeKey:key})
    }

    useEffect(()=>{
        var docRef = db.collection("office").doc(office);
        docRef.get().then((doc) => {
            if (doc.exists) {
                var addup = doc.data()
                addup.id = doc.id
                setState({...state,data:addup})
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
    },[account])

    const changeTab = (page) => {
        setState({...state,activeKey:page,})
    }
    console.log(account)

    return <CustomLayout >
        <CustomPageheader title={state.data?.name} icon={state.data?.logo} >
        <Card style={{boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}} loading={_.isEmpty(state.data)}>
        {(!_.isEmpty(state.data)) && (
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
                        <RecordsList office={state}  />
                    ))}
                </TabPane>
                {((account.offices.id === office) &&(
                    <TabPane 
                    tab={
                        <span>
                        <FormOutlined />
                        CREATE
                        </span>
                    }
                    key="2">
                    {(activeKey == "2" && (
                        <CreateRecord changeTab={changeTab} office={state}/>
                    ))}
                </TabPane>
                ))}
            </Tabs>
        )}
        </Card>
    </CustomPageheader>
    </CustomLayout>
}

export default  Office;
