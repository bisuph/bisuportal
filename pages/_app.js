import '../styles/globals.css'
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
    

    return (
      <AccountProvider >
      <Layout style={{ minHeight: '100vh' }}>
        <Component {...pageProps} />
      </Layout>
      </AccountProvider>
    );
}

export default MyApp
