import Link from 'next/link'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CoffeeOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router'
import { FaChartBar, FaSignOutAlt, FaSchool, FaClipboardList, FaUserCog, FaUser } from "react-icons/fa";
import { Layout, Menu, Typography, Drawer, Affix, Avatar, Space } from 'antd';
import React, { useState, useEffect,useContext } from 'react';
import { auth, db } from './../services/firebase';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const menu = [
  {
    key : "/",
    title : "Dashboard",
    route : "/",
    icon :<FaChartBar />
  },
  {
    key : "/records",
    title : "Records",
    route : "/records",
    icon :<FaClipboardList />,
    access : ['Member','Admin']

  },
  {
    key : "/campuses",
    title : "Campuses",
    route : "/campuses",
    icon :<FaSchool />,
    access : ['Super Admin']

  },
  {
    key : "/offices",
    title : "Offices",
    route : "/offices",
    icon :<CoffeeOutlined />
  },
  {
    key : "/users",
    title : "Users",
    route : "/users",
    icon :<FaUserCog />,
    access : ['Super Admin','Admin']
  },
]
const CustomLayout = ({...props}) => {
    const router = useRouter()
    const [cred, setCred] = useState("")
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
          let ref = db.collection('User').doc(user.email)

          ref.get()
          .then( snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                setCred(snapshot.data())
              }
          })
        } else {
          router.push("/signin")
        }
      })
    }
    useEffect(()=>{
      checkAuth()
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
        <Sider trigger={null} collapsible collapsed={state.collapsed} collapsedWidth={state.collapsedWidth} 
          breakpoint={"lg","md"}
          onBreakpoint={broken => {
            broken ? setState({...state,broken,collapsedWidth:0,collapsed:true,visibility:'collapse'}) : setState({...state,broken,collapsedWidth:80})
          }}
         >
          <div className={'title-header'} style={{marginBottom:15}}>
            <Avatar src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png" />
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[routes]} selectedKeys={[routes]}>
            <Menu.Item icon={<FaUser />}>
                {/* <Link href={'#'}> */}
                    {cred?.email}
                {/* </Link> */}
            </Menu.Item>
            {
                menu &&
                (
                    menu.map((items,i)=>{
                        if(items?.access){
                          if(items.access.includes(cred?.role)){
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
          <Header className="site-layout-background" style={{ padding: '0px 0px 0px 20px' }}>
            <div className="logo" />
              <Menu mode="horizontal" defaultSelectedKeys={['1']} >
                  {(!state.changeHeader) && (
                      React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                      })
                  )}
              </Menu>
          </Header>
          <Content
            // className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              
            }}
          >
              {props.children}
          </Content>
          {/* <Affix offsetBottom={10}>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Affix> */}
        </Layout>
        </>
    )
}

export default CustomLayout;