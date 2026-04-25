import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        return { data, error }
    }

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        return { data, error }
    }

    const loginWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
        return { data, error }
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    const deleteAccount = async () => {
        const { error } = await supabase.auth.admin.deleteUser(user.id)
        if (error) {
            throw error
        }
        await logout()
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout, deleteAccount }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)