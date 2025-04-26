import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, Headphones, MessageSquare, Gift, Pencil, CreditCard, Mail, Star, ArrowLeft } from "lucide-react";
import PageHeader from "../components/PageHeader";
import BottomNavigation from "../components/BottomNavigation";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [activeTab, setActiveTab] = useState<"home" | "plans" | "reports">("home");
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  // Add a new state for the logout modal
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReturnHome = () => {
    navigate('/home');
  };

  const handleFeedbackClick = () => {
    setShowFeedback(true);
    setShowLogoutModal(false); // Add this line to close the modal
  };

  const handleBackToProfile = () => {
    setShowFeedback(false);
  };

  // Add these handler functions
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc)
    navigate('/'); // Navigate to login page
  };

  const FeedbackSection = () => (
    <div className="px-4 pb-24">
      <div className="flex items-center mb-4">
        <button onClick={handleBackToProfile} className="mr-4">
          <ArrowLeft className="w-5 h-5 text-[#2A3A0F]" />
        </button>
        <h2 className="text-[#2A3A0F] text-xl font-medium">Feedback</h2>
      </div>
      
      <p className="text-[#2A3A0F] mb-6">
        Help us improve our service by sharing your experience.
      </p>
      
      {/* Star Rating */}
      <div className="flex justify-center items-center mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="mx-2"
          >
            <Star
              className={`w-8 h-8 ${
                rating >= star ? "text-[#D3FF33] fill-[#D3FF33]" : "text-[#D3FF33]"
              }`}
            />
          </button>
        ))}
      </div>
      
      {/* Feedback Textarea */}
      <div className="mb-6">
        <textarea
          placeholder="Share your thoughts with us..."
          className="w-full p-4 border border-[#F2FFD9] rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-[#D3FF33]"
        ></textarea>
      </div>
      
      {/* Submit Button */}
      <button className="w-full bg-[#D3FF33] rounded-full py-3 text-[#2A3A0F] font-medium mb-4">
        Submit Feedback
      </button>
    </div>
  );

  // Add this new component for the modal
  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-[#2A3A0F] text-lg font-medium mb-3">Are you sure you want to logout?</h3>
        <p className="text-[#2A3A0F] text-sm mb-6">
          Let us know how you enjoyed our service in feedback. You can login anytime you want once you have logged out.
        </p>
        <div className="flex space-x-3">
          <button 
            onClick={handleFeedbackClick}
            className="flex-1 bg-[#F8FFDB] rounded-full py-2 text-[#2A3A0F] font-medium"
          >
            Give feedback
          </button>
          <button 
            onClick={handleLogout}
            className="flex-1 bg-[#FFD6D6] rounded-full py-2 text-[#2A3A0F] font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="bg-white min-h-screen mx-auto relative"
      style={{ maxWidth: screenWidth > 768 ? "480px" : "100%" }}
    >
      <div>
        {/* Using common PageHeader component */}
        <PageHeader userName="A" />

        {showFeedback ? (
          <FeedbackSection />
        ) : (
          /* Profile Section */
          <div className="px-4 pb-24">
            <h2 className="text-[#2A3A0F] text-xl font-medium mb-4">Profile</h2>

            {/* Full Name */}
            <div className="bg-[#f9f9f9] rounded-md p-4 mb-3 flex justify-between items-center">
              <span className="text-[#2A3A0F] font-medium">Full Name</span>
              <button>
                <Pencil className="w-5 h-5 text-[#2A3A0F]" />
              </button>
            </div>

            {/* Payment Method */}
            <div className="bg-[#f9f9f9] rounded-md p-4 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 text-[#2A3A0F] mr-3" />
              <span className="text-[#2A3A0F] font-medium">Payment Method</span>
            </div>

            {/* Email */}
            <div className="bg-[#f9f9f9] rounded-md p-4 mb-3 flex items-center">
              <Mail className="w-5 h-5 text-[#2A3A0F] mr-3" />
              <span className="text-[#2A3A0F] font-medium">Email</span>
            </div>

            {/* Mobile Number */}
            <div className="bg-[#f9f9f9] rounded-md p-4 mb-3 flex items-center">
              <div className="w-5 h-5 mr-3 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-3 w-5 flex flex-col">
                    <div className="h-1 bg-[#FF9933]"></div>
                    <div className="h-1 bg-white"></div>
                    <div className="h-1 bg-[#138808]"></div>
                  </div>
                </div>
              </div>
              <span className="text-[#2A3A0F] font-medium">Mobile Number</span>
            </div>

            <div
              className="flex gap-3 mb-4"
              style={{
                width: "380px",
                height: "116px",
                maxWidth: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                className="flex-1 flex flex-col items-center justify-center"
                style={{
                  width: "184px",
                  height: "116px",
                  borderRadius: "6px",
                  background: "rgba(211, 255, 51, 0.12)", // #D3FF331F converted to rgba
                  padding: "1rem 0.75rem", // Space/200 equivalent
                }}
              >
                <div className="flex items-center mb-2">
                  <img
                    src="./locationicon.png"
                    alt="Location icon"
                    style={{
                      width: "18.67px",
                      height: "26.67px",
                      marginTop: "2.67px",
                      marginLeft: "6.67px",
                    }}
                  />
                </div>
                <p className="text-xs text-center line-clamp-2">
                Atlantis, Pyramids of Narnia, Galactus Region
                </p>
              </div>
              <div
                className="flex-1 flex flex-col items-center justify-center"
                style={{
                  width: "184px",
                  height: "116px",
                  borderRadius: "6px",
                  background: "rgba(242, 255, 217, 0.16)", // #F2FFD929 converted to rgba
                  padding: "1rem 0.75rem", // Space/200 equivalent
                }}
              >
                <div className="flex items-center mb-2">
                  <img
                    src="./buildingicon.png"
                    alt="Building icon"
                    style={{
                      width: "32px",
                      height: "25.33px",
                      marginTop: "2.67px",
                    }}
                  />
                </div>
                <p className="text-xs text-center">Block A
                Building 5</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-4">
              <button className="w-full bg-[#F8FFDB] rounded-full py-3 flex items-center justify-center text-[#2A3A0F] font-medium">
                <Headphones className="w-5 h-5 mr-2" />
                Support
              </button>

              <button 
                className="w-full bg-[#F8FFDB] rounded-full py-3 flex items-center justify-center text-[#2A3A0F] font-medium"
                onClick={handleFeedbackClick}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Feedback
              </button>

              <button className="w-full bg-[#F8FFDB] rounded-full py-3 flex items-center justify-center text-[#2A3A0F] font-medium">
                <Gift className="w-5 h-5 mr-2" />
                Referral
              </button>
            </div>

            {/* Logout Button */}
            <button 
              className="w-full bg-[#FFD6D6] rounded-full py-3 text-[#2A3A0F] font-medium mb-4"
              onClick={handleLogoutClick}
            >
              Logout
            </button>

            {/* Terms and Conditions */}
            <div className="text-center text-xs text-[#2A3A0F] mb-4">Terms and conditions Applied</div>
          </div>
        )}
      </div>
      
      {/* Return Home Navigation at bottom */}
      <div className="bg-[#F8FFDB] py-3 text-center fixed bottom-0 left-0 right-0" style={{ maxWidth: screenWidth > 768 ? "480px" : "100%", margin: "0 auto" }}>
        <button 
          onClick={handleReturnHome}
          className="w-full flex flex-col items-center text-[#2A3A0F] font-medium"
        >
          <Home className="w-5 h-5 mb-1" />
          Return Home
        </button>
      </div>

      {/* Add this to the main return statement (just before the closing </div> of the main container) */}
      {showLogoutModal && <LogoutModal />}
    </div>
  );
}