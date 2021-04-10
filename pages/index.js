import Head from 'next/head'
import React, { useState, useEffect,useContext } from 'react';
import {AccountContext} from '@/context/AccountContext'
import { auth } from '@/services/firebase';
import CustomLayout from '@/component/customLayout';
import Dashboard from './dashboard'


export default function Home({ Component, pageProps }) {
  return (
    <CustomLayout>
      <Dashboard/>
    </CustomLayout>
    
  )
}
