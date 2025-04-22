'use client'

import AxiosInstance from "@/utils/axiosInstance";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id : number;
    email : string;
    userMetadata: {
        name : string;
        avatarUrl : string;
        email : string;
        emailVerified : boolean;
        agentId: string;
    }
}

interface UserContextType {
    user: User | null;
    isAuthenticated : boolean;
}

interface UserProviderProps {
    children : React.ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error("User must be use in UserProvider");
    }
    return context
}

export const UserProvider : React.FC<UserProviderProps> = ({children}) => {
    const [user , setUser] = useState<User | null>(null);
    const [isAuthenticated , setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        (async() => {
            try {
                const response = await AxiosInstance.get(`/api/v1/user`, {
                    withCredentials: true,
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                });
                if(response.data.success == true){
                   setUser(response.data.data);
                   setIsAuthenticated(true);
                }
            } catch (err) {
                console.error(err);
            }
        })()
    },[]);
    return (
        <UserContext.Provider value={{user, isAuthenticated}}>
            {children}
        </UserContext.Provider>
    )
}