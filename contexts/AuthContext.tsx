import { createContext, useContext, PropsWithChildren } from "react";
import { useStorageState } from "@/hooks/useStorageStage";

import { IAuthContext } from "@/types";

const AuthContext = createContext<IAuthContext | null>(null);

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

    return (
        <AuthContext.Provider
            value={{
                signIn: (token) => {
                    setSession(token);
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}