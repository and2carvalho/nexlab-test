'use client'

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type AppContextType = {
    generatedQrCode: string | null;
    setGeneratedQrCode: (qrCode: string | null) => void;
}

const initialState: AppContextType = {
    generatedQrCode: null,
    setGeneratedQrCode: () => { }
};
const AppContext = createContext<AppContextType>(initialState);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [generatedQrCode, setGeneratedQrCode] = useState<string | null>(null)

    const state = useMemo(() => ({
        generatedQrCode,
        setGeneratedQrCode
    }), [generatedQrCode])
    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    )
}


export default AppContextProvider;


const useAppContext = () => {
    return useContext(AppContext)
}

export { AppContext, useAppContext }