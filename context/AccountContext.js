import React,{useState,createContext} from 'react';

export const AccountContext = createContext(null);
export const AccountConsumer = AccountContext.Consumer;

export const AccountProvider = (props) => {
  const [account, setAccount] = useState(null);
  const [profile,setProfile] = useState(null);

  function saveProfile(data){
    setProfile(data)
  }
  return (
    <AccountContext.Provider value={{account, setAccount, profile, saveProfile}}>
      {props.children}
    </AccountContext.Provider>
  );
};
