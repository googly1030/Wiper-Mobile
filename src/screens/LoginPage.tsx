import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { supabase } from "../lib/supabase"

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }
    
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      if (error) throw error
      
      // Navigate to home on success
      navigate('/home')
    } catch (err: any) {
      console.error('Error logging in:', err)
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      })
      if (error) throw error
      // Auth redirect will handle navigation
    } catch (err: any) {
      console.error('Error during Google login:', err)
      setError(err.message || "Google login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-5 py-4 max-w-md mx-auto">
      {/* Back button */}
      <button className="flex items-center text-black mb-6" onClick={() => navigate('/')}>
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span>Go back</span>
      </button>

      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src="./Registerpagelogo.png" alt="Wiper Logo" />
      </div>

      <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
      <p className="text-sm mb-6">Sign in to continue</p>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email" 
            className="w-full p-3 border border-gray-300 rounded-md" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="text-right">
          <button 
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-black text-[#c5ff00] font-medium py-4 rounded-full ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center my-8">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-3 text-base font-normal text-gray-600">Or Sign in with</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          disabled={loading}
          className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-200 transition-colors"
        >
          <img src="./google.png" alt="Google" className="w-10 h-10 object-contain" />
        </button>
        <button className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-200 transition-colors">
          <img src="./apple.png" alt="Apple" className="w-10 h-10 object-contain" />
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-auto">
        Don't have an account?{" "}
        <button 
          onClick={() => navigate('/register')}
          className="text-black font-medium hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  )
}