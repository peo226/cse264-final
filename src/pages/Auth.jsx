import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
//import './Auth.css'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <section className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome to CineList</h1>
          <p>Track, rate, and discover films</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign in
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <GoogleAuthButton />

        <div className="divider">
          <span>or</span>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </section>
  )
}

export default Auth