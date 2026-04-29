import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    //When we're not logged in it should redirect users to the login/signup page
    if (!user) {
        return <Navigate to="/auth" replace />
    }

    //If adminOnly is true, check if the user has the admin role
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute