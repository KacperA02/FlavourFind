import { createContext, useContext, PropsWithChildren, useEffect, useState } from "react";
import { useStorageState } from "@/hooks/useStorageStage";
// for decoding importing all from jwtDecode
import jwtDecode from 'jwt-decode';

import { IAuthContext, IUser } from "@/types";

const AuthContext = createContext<IAuthContext | null>(null);
// const jwt = jwtDecode()
// Hook can be used to access the session info
// place in hooks eventually
export function useSession(){
    const value = useContext(AuthContext);

    if(process.env.NODE_ENV !== 'production'){
        if(!value){
            throw new Error('useSession must be wrapped in <SessionProvider>')
        }
    }
   
    return value as IAuthContext;
}

export function SessionProvider(props: PropsWithChildren){
    // only need to do it for storage state as it is how it comes back
    const [[isLoading, session],setSession] = useStorageState('session');
    const [user, setUser] = useState<IUser | null>(null);
    // checking if session exists for storing users data
    useEffect(()=> {
        if(session) {
            try {
                const decodedToken = jwtDecode(session);
                console.log(decodedToken);
                setUser(decodedToken as IUser);
        } catch(err){
            console.log("no token to decode",err)
            setUser(null)
        }}
        else{
            setUser(null)
        }
    },[session]);
   
    return (
        <AuthContext.Provider
            value={{
                signIn: (token) => {
                    setSession(token);
                },
                signOut: () => {
                    setUser(null)
                    setSession(null);
                },
                session,
                isLoading,
                user
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}