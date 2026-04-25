import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    //When we're not logged in it should redirect users to the login/signup page
    if (!user) {
        return <Navigate to="/auth" replace />
    }

    return children
}

export default ProtectedRoute