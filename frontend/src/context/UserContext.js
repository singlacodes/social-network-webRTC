import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    return(
        <UserContext.Provider value={{user:"xyz"}}>
            {children}
        </UserContext.Provider>
    )
}



export const UserData = () => useContext(UserContext);