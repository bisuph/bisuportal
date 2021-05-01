import '../styles/globals.css'
import { Layout } from 'antd';

import React, { useState, useEffect,useContext, useMemo } from 'react';

import CustomLayout from './../component/customLayout'
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import { AccountContext, AccountProvider } from '../context/AccountContext';
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());



const MyApp = ({ Component, pageProps }) => {
    const router = useRouter()
    const [account,setAccount] = useState(null)
    const providerValue = useMemo(()=> ({account,setAccount}),[account,setAccount])
    return (
      <AccountProvider value={providerValue}>
      <Layout style={{ minHeight: '100vh' ,background: 'linear-gradient(to bottom, transparent 50%, rgb(2, 27, 121) 50%)'}}>
        <Component {...pageProps} />
      </Layout>
      </AccountProvider>
    );
}

export default MyApp
