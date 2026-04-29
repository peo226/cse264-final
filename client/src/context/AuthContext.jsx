import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if we have an active session and set the user accordingly
    useEffect(() => {

        // Helper function to fetch user role
        const fetchUserRole = async (userId) => {
            const { data } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single()
            return data?.role
        }

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            console.log('AuthContext: session retrieved', session)

            if (session?.user) {
                const role = await fetchUserRole(session.user.id)
                setUser({ ...session.user, role })
            } else {
                setUser(null)
            }
            setLoading(false)
        }).catch((error) => {
            console.error('AuthContext: error getting session', error)
            setLoading(false)
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {

            // Break the execution flow with setTimeout to avoid deadlock
            setTimeout(async () => {
                if (session?.user) {
                    const role = await fetchUserRole(session.user.id)
                    setUser({ ...session.user, role })
                } else {
                    setUser(null)
                }
            }, 0)
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
