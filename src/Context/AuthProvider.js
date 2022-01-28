import { Spin } from 'antd';
import React, { useState } from 'react'
import { useHistory } from 'react-router';
import {auth} from '../firebase/config'

export const AuthContext = React.createContext();

export default function AuthProvider({children}) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();

    React.useEffect(()=>{
        const unsubcribe = auth.onAuthStateChanged((user)=>{
            if(user){
                const {displayName, email, uid, photoURL } = user;
                setUser({
                    displayName, email, uid, photoURL 
                });
                history.push('/');
                setIsLoading(false);
                
            }else{
                setIsLoading(false);
                history.push('/login')
            }
            
        });
        return()=>{
            unsubcribe();
        }
    },[history])

    
    return (
        <AuthContext.Provider value={user}>
            {isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    )
}
