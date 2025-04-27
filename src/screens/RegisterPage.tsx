import { ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase" // Import supabase client

// Country data with codes
const countries = [
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
]

// Sample data for blocks and apartments
const blocks = ["A", "B", "C", "D", "E", "F", "G", "H"]
const apartments = ["Lake View", "Garden View", "City View", "Mountain View", "Park Side", "River Side"]

export default function WiperSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    country: "India",
    countryCode: "+91",
    phoneNumber: "",
    fullName: "",
    confirmPassword: "",
    referralCode: "",
    block: "",
    apartmentName: ""
  })
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showBlockDropdown, setShowBlockDropdown] = useState(false)
  const [showApartmentDropdown, setShowApartmentDropdown] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const selectCountry = (country: typeof countries[0]) => {
    setFormData(prev => ({ 
      ...prev, 
      country: country.name,
      countryCode: country.dialCode
    }))
    setShowCountryDropdown(false)
  }

  const selectBlock = (block: string) => {
    setFormData(prev => ({ ...prev, block }))
    setShowBlockDropdown(false)
  }

  const selectApartment = (apartmentName: string) => {
    setFormData(prev => ({ ...prev, apartmentName }))
    setShowApartmentDropdown(false)
  }

  const nextStep = () => {
    setStep(prev => prev + 1)
  }

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1))
  }

  const handleNextStep = async () => {
    // Clear previous errors
    setError("")
    
    if (step === 1) {
      // Validate email and password
      if (!formData.email || !formData.password) {
        setError("Email and password are required")
        return
      }
      nextStep()
    } 
    else if (step === 2) {
      // Validate phone number
      if (!formData.phoneNumber) {
        setError("Phone number is required")
        return
      }
      nextStep()
    }
    else if (step === 3) {
      // Validate name and password confirmation
      if (!formData.fullName) {
        setError("Full name is required")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      nextStep()
    }
    else if (step === 4) {
      // Final step - register the user
      if (!formData.block || !formData.apartmentName) {
        setError("Block and apartment name are required")
        return
      }
      
      try {
        setLoading(true)
        
        // Create a user data object
        const userData = {
          id: crypto.randomUUID(), // Generate a random ID
          email: formData.email,
          password: formData.password, // Note: storing passwords in localStorage is not secure
          full_name: formData.fullName,
          phone: `${formData.countryCode}${formData.phoneNumber}`,
          country: formData.country,
          block: formData.block,
          apartment_name: formData.apartmentName,
          referral_code: formData.referralCode || null,
          created_at: new Date().toISOString()
        }
        
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        // Store in users array if needed
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
        existingUsers.push(userData)
        localStorage.setItem('users', JSON.stringify(existingUsers))
        
        // Add a delay to show the loader before navigation
        setTimeout(() => {
          // Navigate to home on success
          navigate('/home')
        }, 2000) // 2 seconds delay to show the loader
      } catch (err: any) {
        console.error('Error during registration:', err)
        setError(err.message || "Registration failed")
        setLoading(false)
      }
    }
  }

  // Social login with Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      
      // Mock Google login
      const mockGoogleUser = {
        id: crypto.randomUUID(),
        email: 'google-user@example.com',
        full_name: 'Google User',
        provider: 'google',
        created_at: new Date().toISOString()
      }
      
      // Store the user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser))
      
      // Navigate to home
      navigate('/home')
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
      <button className="flex items-center text-black mb-6" onClick={prevStep}>
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span>Go back</span>
      </button>

      {/* Logo and brand */}
      <div className="flex items-center mb-8">
        <img src="./Registerpagelogo.png" alt="" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-1">
        {step === 1 && "Let's Set Up Your Profile"}
        {step === 2 && "Contact Information"}
        {step === 3 && "Complete Your Profile"}
        {step === 4 && "Your Apartment Details"}
      </h1>
      <p className="text-sm mb-6">Your car deserves a wipe everyday!</p>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Form Steps */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Mail*</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your mail" 
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
              placeholder="Enter your Password"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-center mt-2">
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <span 
          className="text-[#3A4B06] font-medium cursor-pointer hover:underline"
          onClick={() => navigate('/login')}
        >
          Login
        </span>
      </p>
    </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Mobile Number*</label>
            <div className="flex relative">
              <div 
                className="bg-gray-100 p-3 border border-r-0 border-gray-300 rounded-l-md min-w-[70px] flex justify-center items-center gap-1 cursor-pointer"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                {formData.countryCode}
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full p-3 border border-gray-300 rounded-r-md"
              />
              
              {/* Country dropdown positioned below the country code */}
              {showCountryDropdown && (
                <div className="absolute z-10 top-full left-0 mt-1 w-56 bg-white shadow-lg max-h-60 rounded-md overflow-auto">
                  {countries.map(country => (
                    <div 
                      key={country.code} 
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => selectCountry(country)}
                    >
                      <span>{country.name}</span>
                      <span className="ml-auto text-gray-500 text-sm">{country.dialCode}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col">
          {/* Group first three inputs together */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name*</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name" 
                className="w-full p-3 border border-gray-300 rounded-md" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Referral code with 69px space above */}
          <div className="space-y-1 mt-[69px]">
            <label className="text-sm font-medium">Referral Code (Optional)</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Enter referral code"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}

      {/* Step 4: Block and Apartment Selection */}
      {step === 4 && (
        <div className="space-y-4">
          {/* Block Dropdown */}
          <div className="space-y-1 relative">
            <label className="text-sm font-medium">Block*</label>
            <div 
              className="w-full p-3 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
              onClick={() => setShowBlockDropdown(!showBlockDropdown)}
            >
              <span>{formData.block || "Select your block"}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            
            {/* Block dropdown */}
            {showBlockDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto">
                {blocks.map(block => (
                  <div 
                    key={block} 
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectBlock(block)}
                  >
                    <span>Block {block}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Apartment Name Dropdown */}
          <div className="space-y-1 relative">
            <label className="text-sm font-medium">Apartment Name*</label>
            <div 
              className="w-full p-3 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
              onClick={() => setShowApartmentDropdown(!showApartmentDropdown)}
            >
              <span>{formData.apartmentName || "Select your apartment"}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            
            {/* Apartment dropdown */}
            {showApartmentDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto">
                {apartments.map(apt => (
                  <div 
                    key={apt} 
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectApartment(apt)}
                  >
                    <span>{apt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Divider - show only on step 1 */}
      {step === 1 && (
        <>
          <div className="flex items-center my-8">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-base font-normal text-gray-600 tracking-wide leading-6 align-middle">Or Sign in using</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Social login options */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
                <img src="./google.png" alt="Google" className="w-10 h-10 object-contain" />
            </button>
            <button className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-200 transition-colors">
                <img src="./apple.png" alt="Apple" className="w-10 h-10 object-contain" />
            </button>
          </div>
        </>
      )}

      {/* Next button - modify the onClick handler */}
      <button 
  onClick={handleNextStep}
  disabled={loading}
  className={`bg-black text-[#c5ff00] font-medium py-4 rounded-full mt-auto flex items-center justify-center ${loading ? 'opacity-90' : ''}`}
>
  {loading ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#c5ff00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Setting up your account...
    </div>
  ) : (
    step === 4 ? "Welcome Aboard!" : "Next"
  )}
</button>
    </div>
  )
}
