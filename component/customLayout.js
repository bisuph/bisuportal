import Link from 'next/link'
import {
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ApartmentOutlined,
  BulbOutlined,
  FileDoneOutlined,
  ClusterOutlined,
  UserAddOutlined,
  ReconciliationOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router'
import { FaChartBar, FaSignOutAlt, FaKaaba, FaClipboardList, FaUserCog, FaUser } from "react-icons/fa";
import { Layout, Menu, Typography, Drawer, Affix, Avatar, Space, Button, Tag, Divider } from 'antd';
import React, { useState, useEffect,useContext } from 'react';
import { auth, db } from './../services/firebase';
import Head from 'next/head';
import { getUser } from '../services/fecthData';
import { AccountContext } from '../context/AccountContext';

const { Header, Sider, Content, Footer } = Layout;

const menu = [
  {
    key : "/",
    title : "Dashboard",
    route : "/",
    icon :<BarChartOutlined />
  },
  {
    key : "/records",
    title : "Records",
    route : "/records",
    icon :<FileDoneOutlined />,
    access : ['Member','Admin']

  },
  {
    key : "/campuses",
    title : "Campuses",
    route : "/campuses",
    icon :<ClusterOutlined />,
    access : ['Super Admin','University admin']

  },
  {
    key : "/offices",
    title : "Offices",
    route : "/offices",
    icon :<ApartmentOutlined />,
    access : ['Super Admin','University admin']

  },
  {
    key : "/archive",
    title : "Archive",
    route : "/archived",
    icon :<ReconciliationOutlined />,
    access : ['Admin','Member']

  },
  {
    key : "/users",
    title : "Users",
    route : "/users",
    icon :<UserAddOutlined />,
    access : ['Super Admin','Admin']
  },
]
const CustomLayout = ({...props}) => {
    const { account, setAccount } = useContext(AccountContext)
    const router = useRouter()
    const [routes, setRoutes] = useState("")
    const [state, setState] = useState({
        broken:false,
        collapsed: false,
        collapsedWidth:80,
        visibility:'visible',
        drawer:false,
        changeHeader:false
    })

    const toggle = () => {
        if(state.broken){
            setState({...state,
            drawer:!state.drawer
            });
        }
        else{
            setState({...state,
            collapsed: !state.collapsed,
            visibility: state.collapsed ? 'visible' : 'collapse',
            });
        }
    };

    const onClose = () => {
        setState({...state,drawer:false});
    };

    
    const checkAuth = () => {
      auth().onAuthStateChanged((user) => {
        if (user) {
          var docRefCamp = getUser(user.email)
          docRefCamp.then(docsCamp => {
            setAccount(docsCamp[0])
          })
        } else {
          router.push("/signin")
        }
      })
    }
    
    useEffect(()=>{
      checkAuth()
    },[])

    useEffect(()=>{
      if(router){
        if(router.pathname.includes("/records")){
          setRoutes("/records")
        }
        else if(router.pathname.includes("/schools")){
          setRoutes("/schools")
        }
        else if(router.pathname.includes("/signin") || router.pathname.includes("/signin")) {
          setState({...state,collapsedWidth:0,collapsed:true,visibility:'collapse',changeHeader:true})
        }
        else{
          setRoutes(router.pathname)
        }
      }
    },[router])


    const signOut = () => {
      auth().signOut().then(() => {
        router.push('/signin')
      }).catch((error) => {
        // An error happened.
      });
      
    }

    return(
        <>
        <Head>
          <title>Electronic Records Management System</title>
        </Head>
        <Sider trigger={null} collapsible collapsed={state.collapsed} collapsedWidth={state.collapsedWidth}  theme={'light'} width={260}
          breakpoint={"lg","md"}
          onBreakpoint={broken => {
            broken ? setState({...state,broken,collapsedWidth:0,collapsed:true,visibility:'collapse'}) : setState({...state,broken,collapsedWidth:80})
          }}
         >
          
          <Menu theme="light" mode="inline" defaultSelectedKeys={[routes]} selectedKeys={[routes]} style={{background: 'linear-gradient(110deg, #fdcd3b 60%, #ffed4b 60%)'}}>
            <Menu.Item style={{height:!state.collapsed ? '180px' : 80}}>
              <div className={'title-header'} style={{marginBottom:15}}>
                <Avatar src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png" />
              </div>
              {(!state.collapsed)&&(
              <Space direction='vertical' align='center' style={{width:'100%'}} visibility={false}>
              {account?.email}
              {account?.role}
              {account?.campus?.name}
              </Space>)}
            </Menu.Item>
          </Menu>
          <Divider style={{marginTop:5}}/>
          <Menu theme="light" mode="inline" defaultSelectedKeys={[routes]} selectedKeys={[routes]}>
            {
                menu &&
                (
                    menu.map((items,i)=>{
                        if(items?.access){
                          if(items.access.includes(account?.role)){
                            return (
                              <Menu.Item key={items.key} icon={items.icon}>
                                  <Link href={items.route}>
                                      {items.title}
                                  </Link>
                              </Menu.Item>
                            )
                          }
                        }
                        else{
                          return (
                            <Menu.Item key={items.key} icon={items.icon}>
                                <Link href={items.route}>
                                    {items.title}
                                </Link>
                            </Menu.Item>
                          )
                        }
                        
                    })
                )
            }
            <Menu.Item key={'logout'} icon={<FaSignOutAlt />} onClick={()=>signOut()}>
                    Log out
            </Menu.Item>
          </Menu>
        </Sider>
        <Drawer
            title="Basic Drawer"
            placement="left"
            closable={false}
            onClose={onClose}
            visible={state.drawer}
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: '0px 0px 0px 0px' }}>
            <div className="logo" />
              <Menu mode="horizontal" defaultSelectedKeys={['2']}  style={{backgroundImage:'linear-gradient(to right,#2980B9, #6DD5FA,#FFFFFF)',color:'white',boxShadow:'0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'}}>
                <Menu.Item key="0"  disabled style={{color:'white!important'}}>
                  {(!state.changeHeader) && (
                      React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                      })
                  )}
                </Menu.Item>

                <Menu.Item key="1" style={{float:'right',color:'white!important'}} disabled>
                    <Button type="primary" icon={<BulbOutlined />} size={'large'}>
                      {account?.offices?.name ?? account?.role}
                    </Button>
                </Menu.Item>
              </Menu>
             
          </Header>
          <Content
            // className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: 'transparent!important'
            }}
          >
              {props.children}
          </Content>
          {/* <Affix offsetBottom={10}>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Affix> */}
        <Footer style={{ textAlign: 'center' }}>Electronic Records Management System  ©2021</Footer>
        </Layout>
        </>
    )
}

export default CustomLayout;