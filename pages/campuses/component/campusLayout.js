import { Avatar, Card, List, Space } from 'antd';
import { PlusSquareOutlined, SnippetsOutlined, SolutionOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { auth, db } from '../../../services/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OfficeRecords from './officeRecords';
import OfficeList from './officeList';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

export default function CampusLayout ({...props}) {
    const {changePage} = props
    const [data,setData] = useState([])
    const [userCred,setUserCred] = useState(null)
    const router = useRouter()
    const {campus} = router.query
    const [page,setPage] = useState(<OfficeList />)

    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
                let ref = db.collection('User').doc(user.email)
                ref.get()
                .then( snapshot => {  //DocSnapshot
                    if (snapshot.exists) {
                        setUserCred(snapshot.data())
                        db.collection("Offices")
                        .onSnapshot((querySnapshot) => {
                            const list  = []
                            querySnapshot.forEach((doc) => {
                                var l = doc.data()
                                l.id = doc.id
                                list.push(l)
                            });
                            setData(list)
                        });
                    }

                })

                
            }
        })

        // return () => {
        //     unsubscribe()
        // }
    },[db])

    return(
    <>
        {page}
    </>
    )
}