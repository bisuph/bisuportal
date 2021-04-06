import Head from 'next/head'
import React, { useState, useEffect,useContext } from 'react';
import {AccountContext} from '@/context/AccountContext'
import { auth } from '@/services/firebase';
import CustomLayout from '@/component/customLayout';
import Dashboard from './dashboard'


export default function Home({ Component, pageProps }) {
  const accountContext = useContext(AccountContext)
  console.log(accountContext)
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        const data = {
          displayName : user.displayName,
          email : user.email,
          emailVerified : user.emailVerified,
          phoneNumber : user.phoneNumber,
          photoURL : user.photoURL
        }
        accountContext.saveProfile(data)
        // setState({
        //   ...state,
        //   authenticated: true,
        //   loading: false,
        // });
      } else {
        // setTimeout(function () {
        //   setState({...state, loading:false, authenticated:false });
        //   router.push("/login")
        // },3000)
      }
    })

    return () => {
      
    }
  }, [])



  return (
    <CustomLayout>
      <Dashboard/>
    </CustomLayout>
    
  )
}
