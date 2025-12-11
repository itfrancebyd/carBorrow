'use client'
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface AppContextType {
    isCurrentUser: User | undefined;
    setCurrentUser: (user: User) => void;
}

interface ProviderProps {
    children: ReactNode
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children }: ProviderProps) => {
    const [isCurrentUser, setCurrentUser] = useState<User>()
    const supabase = createClient()

    useEffect(() => {
        const getCurrentUser = async () => {
            const { data, error } = await supabase.auth.getUser()
            if (error) {
                console.error("use not find: " + error)
                return
            } else {
                if (data.user?.email) {
                    setCurrentUser(data.user)
                }
            }
        }
        getCurrentUser()
    }, [supabase])

    const value = useMemo(() => ({
        isCurrentUser,
        setCurrentUser,
    }), [isCurrentUser])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}
export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("useAppContext must be used inside AppContextProvider")
    }
    return context
}

export { AppContext, AppContextProvider }