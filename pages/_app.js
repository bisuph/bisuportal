import '../styles/globals.css'
import { FaChartBar, FaSignOutAlt, FaSchool, FaClipboardList, FaUserCog } from "react-icons/fa";
import {AccountProvider} from '../context/AccountContext'
import { Layout } from 'antd';

import React, { useState, useEffect,useContext } from 'react';

import CustomLayout from '@/component/customLayout'
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());



const MyApp = ({ Component, pageProps }) => {
    

    const sideBarItems = [
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
        icon :<FaClipboardList />
      },
      {
        key : "/schools",
        title : "Schools",
        route : "/schools",
        icon :<FaSchool />
      },
      {
        key : "/users",
        title : "Users",
        route : "/users",
        icon :<FaUserCog />
      },
      {
        key : "logout",
        title : "Log out",
        route : "/logout",
        icon :<FaSignOutAlt />
      }
    ]
    return (
      <AccountProvider >
      <Layout style={{ minHeight: '100vh' }}>
      <CustomLayout menu={sideBarItems} >
        <Component {...pageProps} />
      </CustomLayout>
      </Layout>
      </AccountProvider>
    );
}

export default MyApp
