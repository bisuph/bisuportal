import React, { useState, useEffect,useContext } from 'react';
import {AccountContext} from '../../context/AccountContext'
import { auth, db } from '../../services/firebase';
import { useRouter } from 'next/router';
import { Row, Col, Space, Typography, Layout, Card, Divider } from 'antd';
import DemoDualAxes from './chart';

const {Footer} = Layout
const { Title } = Typography;

export default function Dashboard() {
  const router = useRouter()
  const accountContext = useContext(AccountContext)
  const [profile , setProfile] = useState(null)
  // useEffect(()=>{
  //     auth().onAuthStateChanged((user) => {
  //         if(user){

  //             let ref = db.collection('User').doc(user.email)

  //             ref.get()
  //             .then( snapshot => {  //DocSnapshot
  //                 if (snapshot.exists) {
  //                   setProfile(snapshot.data())
  //                 }
  //             })
  //         }
  //         else{
  //           router.push("/signin")
  //         }
  //     })

  //     return () => {
  //     }
  // },[db])

  
  return (
    <Row>
      <Col span={24}>
        <Space direction='vertical' align='center' style={{width:'100%'}}> 
        <Title style={{color:'white'}} level={4}>Electronic Records Management System </Title>
        <Title style={{color:'white'}} level={5}>Bohol Island State University</Title>
        
        <img src={'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png'} />
        </Space>
      </Col>
    </Row>
  )
}
