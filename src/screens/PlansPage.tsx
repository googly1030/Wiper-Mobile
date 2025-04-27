import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, CheckIcon } from "lucide-react";
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

  // Check if user has any active plans
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
      
      checkActivePlan();
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

  const handlePurchase = async (plan: typeof plans[0]) => {
    if (!currentUser?.id) {
      toast.error("Please login to purchase a plan");
      return;
    }
    
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
      
      // You could also update the user's plan info in localStorage if needed
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
                      onClick={() => handlePurchase(plan)}
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
    </>
  );
};

export default Plans;
