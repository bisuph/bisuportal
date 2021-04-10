import Head from 'next/head'
import React, { useState, useEffect,useContext } from 'react';
import CustomLayout from './../component/customLayout';
import Dashboard from './dashboard'


export default function Home({ Component, pageProps }) {
  return (
    <CustomLayout>
      <Dashboard/>
    </CustomLayout>
    
  )
}
