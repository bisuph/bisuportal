import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import React, { useState, useEffect,useContext } from 'react';
import {AccountContext} from '../../context/AccountContext'
import { auth, db } from '../../services/firebase';
import { useRouter } from 'next/router';



export default function Dashboard() {
  const router = useRouter()
  const accountContext = useContext(AccountContext)
  const [profile , setProfile] = useState(null)
  useEffect(()=>{
      auth().onAuthStateChanged((user) => {
          if(user){

              let ref = db.collection('User').doc(user.email)

              ref.get()
              .then( snapshot => {  //DocSnapshot
                  if (snapshot.exists) {
                    setProfile(snapshot.data())
                  }
              })
          }
          else{
            router.push("/signin")
          }
      })

      return () => {
      }
  },[db])

  return (
    <div className={styles.container}>
      

      <main className={styles.main} >
        <h1 className={styles.title}>
          Welcome to 
        </h1>

        {
          (profile?.role === 'Super Admin') &&
          <>
            <h4 className={styles.title}>
              Bohol Island State University
            </h4>
            <p className={styles.description}>
              Super Admin
            </p>
          </>
        }
        <h4 className={styles.title}>
          {profile?.campus}
        </h4>

       
        <div className={styles.grid}>
          <img src={'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png'} />
        </div>
      </main>

    </div>
  )
}
