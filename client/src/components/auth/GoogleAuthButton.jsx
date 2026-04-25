
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function GoogleAuthButton() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { loginWithGoogle } = useAuth()

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)
        const { error } = await loginWithGoogle()
        setLoading(false)

        if (error) {
            setError(error.message)
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="btn-google"
            >
                {loading ? 'Signing in...' : 'Continue with Google'}
            </button>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
}

export default GoogleAuthButton