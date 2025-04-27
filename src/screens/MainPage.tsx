import React, { useEffect, useState } from "react";
import {
  carInfo,
  location,
  planExpiryDate,
  carCleanedDays,
  updates,
} from "./data/mockData";
import { Car, Calendar, X, PackageOpen } from "lucide-react";
import { UpdateType } from "./types";
import BottomNavigation from "../components/BottomNavigation";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function MainPage() {
  const navigate = useNavigate();
  const [groupedUpdates, setGroupedUpdates] = useState<
    Record<string, UpdateType[]>
  >({});
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [activeTab, setActiveTab] = useState<"home" | "plans" | "reports">(
    "home"
  );
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);
  const [registrationInput, setRegistrationInput] = useState<string>("");
  const [carFormData, setCarFormData] = useState({
    brand: "",
    make: "",
    class: ""
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get current user data
  useEffect(() => {
    const getUserData = async () => {
      // First try to get from Supabase
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      } else {
        // Fallback to localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      }
    };
    
    getUserData();
  }, []);

  // Check if user has active plan
  useEffect(() => {
    const checkUserPlan = async () => {
      // Keep loading state true if no user yet
      if (!currentUser?.id) {
        // Don't set isLoading to false here
        return;
      }
      
      try {
        const { data: planData, error } = await supabase
          .from('plan_purchases')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('is_active', true)
          .limit(1);
          
        if (error) throw error;
        
        setHasActivePlan(!!planData && planData.length > 0);
      } catch (err) {
        console.error('Error checking plan status:', err);
        setHasActivePlan(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser?.id) {
      checkUserPlan();
    }
  }, [currentUser]);

  // Group updates by date
  useEffect(() => {
    if (!hasActivePlan) return;
    
    const grouped: Record<string, UpdateType[]> = {};

    updates.forEach((update, index) => {
      const dateGroup = index < 2 ? "Today" : "Yesterday";

      if (!grouped[dateGroup]) {
        grouped[dateGroup] = [];
      }

      grouped[dateGroup].push(update);
    });

    setGroupedUpdates(grouped);
  }, [hasActivePlan]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCarInfoClick = () => {
    setIsCarModalOpen(true);
    setRegistrationInput(carInfo.registrationNumber);
    // Initialize form data with existing car info
    setCarFormData({
      brand: carInfo.brand || "",
      make: carInfo.make || "",
      class: carInfo.class || ""
    });
  };

  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistration = async () => {
    // Validate car info
    if (!registrationInput || !carFormData.brand || !carFormData.make || !carFormData.class) {
      // Show an error toast or message
      return;
    }

    try {
      setIsLoading(true);
      
      if (!currentUser?.id) {
        setIsCarModalOpen(false);
        setIsLoading(false);
        return;
      }
      
      // Check if this user already has vehicle info
      const { data: existingData, error: checkError } = await supabase
        .from('user_vehicles')
        .select('id')
        .eq('user_id', currentUser.id)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_vehicles')
          .update({
            registration_number: registrationInput,
            brand: carFormData.brand,
            make: carFormData.make,
            car_class: carFormData.class,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData[0].id);
        
        if (updateError) throw updateError;
      } else {
        // Create a new record
        const { error: insertError } = await supabase
          .from('user_vehicles')
          .insert({
            user_id: currentUser.id,
            registration_number: registrationInput,
            brand: carFormData.brand,
            make: carFormData.make,
            car_class: carFormData.class,
            created_at: new Date().toISOString()
          });
        
        if (insertError) throw insertError;
      }
      
      // Update local car info
      const updatedCarInfo = {
        ...carInfo,
        registrationNumber: registrationInput,
        brand: carFormData.brand,
        make: carFormData.make,
        class: carFormData.class
      };
      
      // You might need to create a setter function for carInfo if it's imported from mockData
      // Or just use the local state for displaying the updated info
      
      // Close the modal
      setIsCarModalOpen(false);
    } catch (err) {
      console.error('Error saving car info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white min-h-screen mx-auto"
      style={{ maxWidth: screenWidth > 768 ? "480px" : "100%" }}
    >
      <div className="relative">
        <PageHeader userName={currentUser?.full_name?.[0] || "A"} />

        <div className="px-4 pb-20">
          {/* Plan Notification - Only show if user has active plan */}
          {hasActivePlan && (
            <div
              className="flex items-center mb-4"
              style={{
                width: "380px",
                height: "52px",
                borderRadius: "6px",
                background: "#CAE661",
                padding: "0.375rem 0.75rem",
                maxWidth: "100%",
              }}
            >
              <span className="mr-2 text-lg">
                <Calendar className="w-5 h-5" />
              </span>
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--label-large-font)",
                  fontWeight: 500,
                  fontSize: "var(--label-large-size)",
                  lineHeight: "var(--label-large-line-height)",
                  letterSpacing: "var(--label-large-tracking)",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                Your current plan will end in {planExpiryDate}
              </p>
            </div>
          )}

          {/* Location Info */}
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
                background: "rgba(211, 255, 51, 0.12)",
                padding: "1rem 0.75rem",
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
                {location.name}
              </p>
            </div>
            <div
              className="flex-1 flex flex-col items-center justify-center"
              style={{
                width: "184px",
                height: "116px",
                borderRadius: "6px",
                background: "rgba(242, 255, 217, 0.16)",
                padding: "1rem 0.75rem",
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
              <p className="text-xs text-center">{location.building}</p>
            </div>
          </div>

          {/* Car Info - with onClick handler added */}
          <div
            className="mb-6 flex overflow-hidden cursor-pointer"
            style={{
              width: "383px",
              height: "130px",
              borderRadius: "12px",
              background: "rgba(206, 210, 198, 0.08)",
              maxWidth: "100%",
            }}
            onClick={handleCarInfoClick}
          >
            <div className="w-1/3">
              <img
                src="./cardetails.png"
                alt="Car"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-2/3 p-4">
              <p className="text-xs text-gray-500 font-medium">Your Car</p>
              <h3 className="text-lg font-semibold mt-1">{carInfo.carStyle}</h3>
              <p className="text-sm text-gray-700 mt-1">
                {carInfo.registrationNumber}
              </p>
            </div>
          </div>

          {/* Main content section */}
          {isLoading || !currentUser ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 border-2 border-[#CAE661] border-t-[#3A4B06] rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 mt-4">Loading updates...</p>
            </div>
          ) : hasActivePlan ? (
            // User has an active plan - show updates
            <div className="wiper-updates-section">
              {/* Existing code for updates section */}
              
              <div
                className="flex items-center mb-5 mx-auto w-full"
                style={{
                  maxWidth: "380px",
                  minHeight: "60px",
                  borderRadius: "12px",
                  background: "#F9FFE5",
                  padding: "1rem",
                }}
              >
                <span className="mr-3 flex-shrink-0">
                  <Car className="w-6 h-6 text-[#2A3A0F]" />
                </span>
                <p className="text-base text-[#2A3A0F] flex-1">
                  Your car has been cleaned for {carCleanedDays}
                </p>
              </div>

              {/* Updates by date */}
              {Object.entries(groupedUpdates).map(([date, dateUpdates]) => (
                <div key={date} className="mb-4">
                  <div className={`mb-2 ${date !== "Today" ? "mt-6" : "mt-2"}`}>
                    <p className="text-sm font-medium text-gray-500">{date}</p>
                  </div>
                  {dateUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="flex mb-4 overflow-hidden"
                      style={{
                        width: "380px",
                        height: "102px",
                        borderRadius: "12px",
                        background: "#FDFFF6",
                        border: "1px solid #7B8267",
                        maxWidth: "100%",
                      }}
                    >
                      <div className="flex-1 p-3 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span>{update.avatarLetter}</span>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">
                            {update.date} • {update.time}
                          </div>
                          <p className="font-medium mt-1">{update.wiperName}</p>
                          <p className="text-sm mt-1">{update.message}</p>
                        </div>
                      </div>
                      <div className="w-24 flex-shrink-0">
                        <img
                          src="./carupdates.png"
                          alt="Car update"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="w-full px-4">
                <button
                  className="w-full h-[48px] md:w-[380px] md:h-[64px] bg-black rounded-[100px] flex items-center justify-center gap-2 py-3 mx-auto"
                  style={{
                    background: "#000000",
                    maxWidth: "100%",
                  }}
                  onClick={() => {
                    navigate("/reports");
                  }}
                >
                  <span
                    className="font-medium text-sm md:text-base text-center"
                    style={{
                      fontFamily: "var(--label-large-font)",
                      color: "#D3FF33",
                      letterSpacing: "var(--label-large-tracking)",
                      lineHeight: "var(--label-large-line-height)",
                    }}
                  >
                    View Reports
                  </span>
                </button>
              </div>
            </div>
          ) : (
            // User does not have an active plan - show "Get started" section
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex flex-col items-center justify-center mb-6 text-center">
                <div className="bg-[#F8FFDD] p-4 rounded-full mb-4">
                  <PackageOpen className="w-12 h-12 text-[#3A4B06]" />
                </div>
                <h2 className="text-xl font-bold text-[#3A4B06] mb-2">
                  No Active Plan Found
                </h2>
                <p className="text-gray-600 max-w-xs text-center mb-4">
                  Get started with a plan to view daily updates about your car's cleaning schedule and history.
                </p>
                <button
                  onClick={() => navigate('/plans')}
                  className="bg-black text-[#D3FF33] font-medium py-4 px-8 rounded-full flex items-center justify-center"
                >
                  View Plans
                </button>
              </div>
              

            </div>
          )}
        </div>

        {/* Bottom Navigation Component */}
        <BottomNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          screenWidth={screenWidth}
        />

        {/* Chat button */}
        <div
          className="fixed w-[56px] h-[56px] bg-[#FCFFF2] rounded-2xl flex items-center justify-center z-20"
          style={{
            right: screenWidth > 768 ? "calc(50% - 240px + 1rem)" : "1rem",
            bottom: "5rem",
            boxShadow:
              "0px 1px 3px 0px rgba(0, 0, 0, 0.30), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            src="./Refer.png"
            alt="Refer icon"
            className="w-6 h-[18.86px] mt-[2.57px]"
          />
        </div>
      </div>

      {/* Car Details Modal */}
      {isCarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-[90%] max-w-md"
            style={{ maxWidth: screenWidth > 768 ? "380px" : "90%" }}
          >
            <h2 className="text-xl font-semibold mb-4">Your Car Details</h2>

            <div className="space-y-4 mb-6">
              {/* Car Number */}
              <div className="flex items-center gap-3 border p-3 rounded-md">
                <Car className="w-6 h-6 text-gray-700" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Registration Number</p>
                  <input
                    type="text"
                    value={registrationInput}
                    onChange={(e) => setRegistrationInput(e.target.value)}
                    className="w-full border-0 p-0 focus:outline-none text-base"
                    placeholder="Enter registration number"
                  />
                </div>
                {registrationInput && (
                  <button
                    className="transform"
                    onClick={() => setRegistrationInput("")}
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Brand */}
              <div className="flex items-center gap-3 border p-3 rounded-md">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-sm font-semibold">B</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Brand</p>
                  <input
                    type="text"
                    name="brand"
                    value={carFormData.brand}
                    onChange={handleCarInputChange}
                    className="w-full border-0 p-0 focus:outline-none text-base"
                    placeholder="Enter brand"
                  />
                </div>
              </div>

              {/* Make */}
              <div className="flex items-center gap-3 border p-3 rounded-md">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-sm font-semibold">M</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Make</p>
                  <input
                    type="text"
                    name="make"
                    value={carFormData.make}
                    onChange={handleCarInputChange}
                    className="w-full border-0 p-0 focus:outline-none text-base"
                    placeholder="Enter make"
                  />
                </div>
              </div>

              {/* Class - Dropdown */}
              <div className="flex items-center gap-3 border p-3 rounded-md">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-sm font-semibold">C</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Class</p>
                  <select
                    name="class"
                    value={carFormData.class}
                    onChange={handleCarInputChange}
                    className="w-full border-0 p-0 focus:outline-none text-base bg-transparent"
                  >
                    <option value="">Select class</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Premium</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsCarModalOpen(false)}
                className="px-4 py-2 text-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleSubmitRegistration}
                className="px-4 py-2 bg-black text-[#D3FF33] rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
