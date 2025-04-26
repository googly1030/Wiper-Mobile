import { ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom" // Add this import

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
  const navigate = useNavigate() // Add this hook
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    country: "India",
    countryCode: "+91", // Default to India
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

  const handleNextStep = () => {
    if (step === 4) {
      // Navigate to home page when "Welcome Aboard" is clicked
      navigate('/home')
    } else {
      setStep(prev => prev + 1)
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
        {step === 1 && "Lets Set Up Your Profile"}
        {step === 2 && "Contact Information"}
        {step === 3 && "Complete Your Profile"}
        {step === 4 && "Your Apartment Details"}
      </h1>
      <p className="text-sm mb-6">Your car deserve a wipe everyday!</p>

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
            <button className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-200 transition-colors">
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
        className="bg-black text-[#c5ff00] font-medium py-4 rounded-full mt-auto"
      >
        {step === 4 ? "Welcome Aboard!" : "Next"}
      </button>
    </div>
  )
}
