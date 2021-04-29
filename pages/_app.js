import '../styles/globals.css'
import { Layout } from 'antd';

import React, { useState, useEffect,useContext, useMemo } from 'react';

import CustomLayout from './../component/customLayout'
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import { AccountContext, AccountProvider } from '../context/AccountContext';
import { auth } from '../services/firebase';
import { getUser } from '../services/fecthData';
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());



const MyApp = ({ Component, pageProps }) => {
    const router = useRouter()
    const [account,setAccount] = useState(null)
    const providerValue = useMemo(()=> ({account,setAccount}),[account,setAccount])

    const checkAuth = () => {
      auth().onAuthStateChanged((user) => {
        console.log(user)
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
    

    return (
      <AccountProvider value={providerValue}>
      <Layout style={{ minHeight: '100vh' }}>
        <Component {...pageProps} />
      </Layout>
      </AccountProvider>
    );
}

export default MyApp
