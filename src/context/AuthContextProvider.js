import { useState } from "react"
import AuthContext from "./AuthContext";

const AuthContextProvider = ({children})=>{
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('token') || null,
        uid: localStorage.getItem('token') || null,
    })

    const login = (token, role, uid)=>{
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('uid', uid);
    }

    const logout = ()=>{
        localStorage.clear();
        setAuth({ token: null, role: null, uid: null });
    }

    return (
        <AuthContext.Provider value={{auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;