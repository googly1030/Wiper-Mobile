import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, CheckIcon, Car, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import BottomNavigation from "../components/BottomNavigation";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

// Plan data for mapping
const plans = [
  {
    id: 1,
    type: "Hatchback",
    price: "₹799",
    image: "/image.png",
    popular: false,
    features: [
      "6 days /week",
      "2 interior cleaning /month",
      "Slot based on your selection",
      "Daily updates",
    ],
  },
  {
    id: 2,
    type: "Sedan",
    price: "₹899",
    image: "/image-1.png",
    popular: true,
    features: [
      "6 days /week",
      "2 interior cleaning /month",
      "Slot based on your selection",
      "Daily updates",
    ],
  },
  {
    id: 3,
    type: "SUV",
    price: "₹999",
    image: "/image-2.png",
    popular: false,
    features: [
      "6 days /week",
      "2 interior cleaning /month",
      "Slot based on your selection",
      "Daily updates",
    ],
  },
  {
    id: 4,
    type: "Premium",
    price: "₹1199",
    image: "/image-3.png",
    popular: false,
    features: [
      "6 days /week",
      "2 interior cleaning /month",
      "2 rim cleaning /month",
      "Slot based on your selection",
      "Daily updates",
    ],
  },
];

export const Plans = (): JSX.Element => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [activeTab, setActiveTab] = useState<"home" | "plans" | "reports">("plans");
  const [purchasedPlanId, setPurchasedPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Add car modal state
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [carFormData, setCarFormData] = useState({
    registrationNumber: "",
    brand: "",
    make: "",
    class: ""
  });
  const [userHasCarInfo, setUserHasCarInfo] = useState<boolean>(false);

  // Get current user data on component mount
  useEffect(() => {
    // First try to get user from Supabase
    const getUserFromSupabase = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      } else {
        // Fallback to localStorage if not authenticated
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      }
    };
    
    getUserFromSupabase();
  }, []);

  // Check if user has any active plans and car info
  useEffect(() => {
    if (currentUser?.id) {
      const checkActivePlan = async () => {
        const { data: planData, error } = await supabase
          .from('plan_purchases')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('is_active', true)
          .order('purchase_date', { ascending: false })
          .limit(1);
          
        if (!error && planData && planData.length > 0) {
          // Find the matching plan in our list and mark it as purchased
          const matchingPlan = plans.find(plan => plan.type === planData[0].plan_type);
          if (matchingPlan) {
            setPurchasedPlanId(matchingPlan.id);
          }
        }
      };

      const checkUserCarInfo = async () => {
        const { data: carData, error } = await supabase
          .from('user_vehicles')
          .select('*')
          .eq('user_id', currentUser.id)
          .limit(1);
          
        if (!error && carData && carData.length > 0) {
          setUserHasCarInfo(true);
          // Pre-fill car info if available
          setCarFormData({
            registrationNumber: carData[0].registration_number || "",
            brand: carData[0].brand || "",
            make: carData[0].make || "",
            class: carData[0].car_class || ""
          });
        }
      };
      
      checkActivePlan();
      checkUserCarInfo();
    }
  }, [currentUser]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanSelection = (plan: typeof plans[0]) => {
    if (!currentUser?.id) {
      toast.error("Please login to purchase a plan");
      return;
    }

    // If user already has car info, proceed with purchase
    // Otherwise show car info modal
    if (userHasCarInfo) {
      handlePurchase(plan);
    } else {
      setSelectedPlan(plan);
      setIsCarModalOpen(true);
    }
  };

  const handleSubmitCarInfo = async () => {
    // Validate car info
    if (!carFormData.registrationNumber || !carFormData.brand || !carFormData.make || !carFormData.class) {
      toast.error("Please fill all car details");
      return;
    }

    try {
      setLoading(true);
      
      // Save car info to database
      const { error: carError } = await supabase
        .from('user_vehicles')
        .insert({
          user_id: currentUser.id,
          registration_number: carFormData.registrationNumber,
          brand: carFormData.brand,
          make: carFormData.make,
          car_class: carFormData.class,
          created_at: new Date().toISOString()
        });
      
      if (carError) throw carError;
      
      // Now that we have car info, proceed with the plan purchase
      if (selectedPlan) {
        await handlePurchase(selectedPlan);
      }
      
      setUserHasCarInfo(true);
      setIsCarModalOpen(false);
    } catch (err) {
      console.error('Error saving car info:', err);
      toast.error('Failed to save car information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (plan: typeof plans[0]) => {
    setLoading(true);
    try {
      // Calculate expiry date (30 days from now)
      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setDate(now.getDate() + 30);
      
      // Insert purchase record in database
      const { error } = await supabase
        .from('plan_purchases')
        .insert({
          user_id: currentUser.id,
          plan_type: plan.type,
          plan_price: plan.price,
          purchase_date: now.toISOString(),
          expiry_date: expiryDate.toISOString(),
          is_active: true
        });
      
      if (error) throw error;
      
      // Update UI to show plan as purchased
      setPurchasedPlanId(plan.id);
      toast.success(`Successfully purchased ${plan.type} plan!`);
      
      // Update user's plan info in localStorage
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      userObj.current_plan = plan.type;
      userObj.plan_expiry = expiryDate.toISOString();
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      
    } catch (err) {
      console.error('Error purchasing plan:', err);
      toast.error('Failed to purchase plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader userName={currentUser?.full_name?.[0] || "A"} />
      <section className="flex flex-col w-full pb-[100px] px-4 bg-gradient-to-b from-[#f8ffdd] to-white">
        <div className="flex flex-col w-full gap-2 py-6">
          <h2 className="font-sans font-bold text-[#263000] text-3xl tracking-tight">
            Our Plans, Tailored for You
          </h2>
          <p className="font-sans text-gray-600 text-lg">
            Keep your car shining with our flexible and affordable packages
          </p>
        </div>

        {/* Plan cards */}
        <div className="flex flex-col w-full gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`w-full overflow-hidden rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] border-[3px] ${
                purchasedPlanId === plan.id ? 'border-green-500' : 'border-[#9cc700]'
              }`}
            >
              <div className="flex flex-col rounded-xl overflow-hidden">
                <div className="relative w-full h-[200px]">
                  <img
                    className="absolute w-full h-[200px] top-0 left-0 object-cover"
                    alt={`${plan.type} car`}
                    src={plan.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 font-sans font-bold text-white text-3xl">
                    {plan.type}
                  </h3>
                  
                  {/* Show badge for purchased plan */}
                  {purchasedPlanId === plan.id && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                      <CheckIcon className="w-4 h-4 mr-1" />
                      <span>Active Plan</span>
                    </div>
                  )}
                </div>

                <CardContent className="flex flex-col gap-5 p-6 bg-white">
                  <div className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
                    <div className="font-sans">
                      <span className="text-3xl font-bold text-[#263000]">
                        {plan.price}
                      </span>
                      <span className="text-lg text-gray-600">/month</span>
                    </div>
                    <Button 
                      className={`h-12 px-8 ${
                        purchasedPlanId === plan.id 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-[#9cc700] hover:bg-[#8cb600]'
                      } text-[#263000] font-medium rounded-full shadow-md transition-all duration-200`}
                      onClick={() => handlePlanSelection(plan)}
                      disabled={loading || purchasedPlanId === plan.id}
                    >
                      {loading 
                        ? "Processing..." 
                        : purchasedPlanId === plan.id 
                          ? "Current Plan" 
                          : "Select Plan"}
                    </Button>
                  </div>

                  <div className="text-gray-700 space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-[#9cc700]" />
                        <span className="font-sans text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Navigation Component */}
        <BottomNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          screenWidth={screenWidth}
        />
      </section>

      {/* Car Details Modal */}
      {isCarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-[90%] max-w-md"
            style={{ maxWidth: screenWidth > 768 ? "380px" : "90%" }}
          >
            <h2 className="text-xl font-semibold mb-4">Add Car Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              To continue with your plan purchase, please provide your car details.
            </p>

            <div className="space-y-4 mb-6">
              {/* Car Number */}
              <div className="flex items-center gap-3 border p-3 rounded-md">
                <Car className="w-6 h-6 text-gray-700" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Registration Number*</p>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={carFormData.registrationNumber}
                    onChange={handleCarInputChange}
                    className="w-full border-0 p-0 focus:outline-none text-base"
                    placeholder="Enter registration number"
                    required
                  />
                </div>
                {carFormData.registrationNumber && (
                  <button
                    className="transform"
                    onClick={() => setCarFormData(prev => ({ ...prev, registrationNumber: "" }))}
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
                  <p className="text-xs text-gray-500">Brand*</p>
                  <input
                    type="text"
                    name="brand"
                    value={carFormData.brand}
                    onChange={handleCarInputChange}
                    className="w-full border-0 p-0 focus:outline-none text-base"
                    placeholder="Enter brand"
                    required
                  />
                </div>
              </div>

              {/* Make */}
              <div className="flex items-center gap-3 border p-3 rounded-md">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-sm font-semibold">M</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Make*</p>
                  <input
                    type="text"
                    name="make"
                    value={carFormData.make}
                    onChange={handleCarInputChange}
                    className="w-full border-0 p-0 focus:outline-none text-base"
                    placeholder="Enter make"
                    required
                  />
                </div>
              </div>

              {/* Class - Dropdown */}
              <div className="flex items-center gap-3 border p-3 rounded-md">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-sm font-semibold">C</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Class*</p>
                  <select
                    name="class"
                    value={carFormData.class}
                    onChange={handleCarInputChange}
                    className="w-full border-0 p-0 focus:outline-none text-base bg-transparent"
                    required
                  >
                    <option value="">Select class</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsCarModalOpen(false)}
                className="px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCarInfo}
                disabled={loading}
                className="px-4 py-2 bg-black text-[#D3FF33] rounded-md"
              >
                {loading ? "Submitting..." : "Continue with Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Plans;
