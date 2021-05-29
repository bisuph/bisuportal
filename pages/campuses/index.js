import { Form, Row, Col, message, Button } from 'antd';
import UserCard from '../../component/userCard'
import React, { useContext, useEffect, useState } from 'react';
import CustomLayout from '../../component/customLayout';
import Modal from 'antd/lib/modal/Modal';
import CreatCampus from './component/createCampus';
import { auth, db } from '../../services/firebase';
import CustomPageheader from '../../component/customPageheader';
import _ from 'lodash';
import { AccountContext } from '../../context/AccountContext';
import { checkCampusExist } from '../../services/fecthData';
import { PlusCircleOutlined } from '@ant-design/icons';

const colCard = {
    xs:24 ,
    sm:12 ,
    md:12 ,
    lg:8 ,
    xl:8 ,
    xxl:8
}

export default function Campuses() {
    const {account} = useContext(AccountContext)
    const [state,setState] = useState(
        {
            id:'',
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [
            ],
          }
    )
    const [form] = Form.useForm()
    const [data,setData] = useState([])
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                db.collection('campus')
                .onSnapshot((querySnapshot) => {
                    const list  = []
                    querySnapshot.forEach((doc) => {

                        var newList = doc.data()
                        newList.id = doc.id
                        list.push(newList)
                    });
                    setData(list)
                    // setConfirmLoading(false)
                });
            } 
        })
        return () => {
            // unsubscribe()
        }
    },[db])


    const showModal = (item) => {

        setState({...state,fileList:
            item?.logo_name ?
            [{
                name : item?.logo_name,
                url : item?.logo
            }]
            :
            []
        ,id:item?.id ? item?.id : ''})
        form.setFieldsValue({ name: item?.name ? item?.name :'' , address : item?.address ? item?.address : '', logo :''});
        setVisible(true);
    };

    const handleOk = (values) => {
        
        setConfirmLoading(true);

        auth().onAuthStateChanged((user) => {
            if (user) {
                var query = null
                values.name = values.name.toUpperCase()
                checkCampusExist(values.name)
                .then(function(data){
                    console.log(data)
                    console.log(state)
                    if(data.length === 0 || data[0].id ===  state.id){
                                
                        if(!_.isEmpty(state?.id)){
                            query = db.collection('campus').doc(state?.id)
                            return query.update({
                                name:values.name,
                                address:values.address,
                                logo_name:state?.fileList[0]?.name ?? '',
                                logo:state?.fileList[0]?.url ?? 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png' ,
                            })
                            .then(() => {
                                setState({...state,fileList:[],id:''})
                                setVisible(false);
                                setConfirmLoading(false);
                            })
                            .catch((error) => {
                                // The document probably doesn't exist.
                                console.error("Error updating document: ", error);
                            });
                        }
                        else {
                            query = db.collection('campus').doc()
                            query.set({
                                name:values.name,
                                address:values.address,
                                logo_name:state?.fileList[0]?.name ?? '',
                                logo:state?.fileList[0]?.url ?? 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png' ,
                            })
                            .then(function() {
                                setState({...state,fileList:[],id:''})
                                setVisible(false);
                                setConfirmLoading(false);
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                                setVisible(false);
                            });

                        }
                    }
                    else{
                        message.error('Campus name already exists.')
                        setConfirmLoading(false);
                    }
                })
                

                
            } else {
                router.push("/signin")
            }
        })

    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
        setState({...state,fileList:[],id:''})
    };

    return (
        <CustomLayout>
        <Row gutter={[16, 16]} style={{marginBottom:10}}>
            <Col span={24}>
            <CustomPageheader title={'Campuses'} extra={[
                (account?.role === 'Super Admin' && (
                    <Button type='primary' icon={<PlusCircleOutlined />} size='large' onClick={()=>showModal()}>   Add</Button>
                ))
                
            ]}>
            </CustomPageheader>
            </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
        {
            data.map((item,i) => {
                return(
                    <Col  {...colCard} key={i}>
                        <UserCard 
                            showModal={showModal}
                            item={item}
                        />
                    </Col>
                )
            })
        }
            {/* {
                (account?.role === 'Super Admin' && (
                    <Col  {...colCard}>
                        <UserCard 
                            showModal={showModal}
                        />
                    </Col>
                ))
            } */}
            
        </Row>
        <Modal
            visible={visible}
            confirmLoading={confirmLoading}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            closable={false}
        >
            <CreatCampus state={state} setState={setState} form={form} handleOk={handleOk} handleCancel={handleCancel} confirmLoading={confirmLoading} visible={visible}/>
        </Modal>
        </CustomLayout>
    )
}
