import { create } from "zustand";
import { persist } from "zustand/middleware"

interface AuthState {
    userId : string | null;
    name : string | null;
    email : string | null;
    accessToken : string | null;
    userRole: "ADMIN" | "USER" | null;
    setUser : (
        user: Partial<AuthState>
    ) => void
    clearUser : () => void;
}

const useAuthStore = create<AuthState>() (
    persist(
        set => ({
            userId : null,
            name : null,
            email : null,
            accessToken : null,
            refreshToken : null,
            userRole : null,
            setUser : (user) => set(user),
            clearUser: ()=>set({
                userId : null,
                name : null,
                email :  null, 
                accessToken : null,
                userRole : null
            })
        }),
        {name : 'auth-storage'}
    )
)

export default useAuthStore