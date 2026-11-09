import { create } from "zustand";
import {persist} from 'zustand/middleware'

const storeAuth = create(
    persist(

        (set)=>({
            token: null,
            rol: null,
            user: null,

            setAuth: (token, rol, user) => set({token, rol, user}),

            setUser: (newUser) => set((state) => ({
                user : newUser
            })),

            logout: () => {
                set({token: null, rol: null, user: null})
                localStorage.removeItem("auth-storage");
                localStorage.removeItem("profile-storage");
                localStorage.removeItem("address-storage");

            },
        }),
        {name: "auth-storage"}
    )
)

export default storeAuth