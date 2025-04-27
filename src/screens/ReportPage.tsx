import React, { useEffect, useState } from "react";
import {
  carInfo,
  location,
  planExpiryDate,
  carCleanedDays,
  updates,
} from "./data/mockData";
import { Car, Calendar, PackageOpen } from "lucide-react";
import { UpdateType } from "./types";
import BottomNavigation from "../components/BottomNavigation";
import CalendarSection from "../components/calendar"; // Updated import
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const navigate = useNavigate();
  const [groupedUpdates, setGroupedUpdates] = useState<
    Record<string, UpdateType[]>
  >({});
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [activeTab, setActiveTab] = useState<"home" | "plans" | "reports">(
    "reports" // Changed default active tab to reports
  );
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
      if (!currentUser?.id) {
        setIsLoading(false);
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
    
    checkUserPlan();
  }, [currentUser]);

  // Group updates by date - only if user has an active plan
  useEffect(() => {
    if (!hasActivePlan) return;
    
    const grouped: Record<string, UpdateType[]> = {};

    // Create actual date-based grouping
    updates.forEach((update, index) => {
      // For demo purposes using Today/Yesterday, but in real app use the actual date
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

  return (
    <div
      className="bg-white min-h-screen mx-auto"
      style={{ maxWidth: screenWidth > 768 ? "480px" : "100%" }}
    >
      <div className="relative">
        {/* Header */}
        <PageHeader userName={currentUser?.full_name?.[0] || "A"} />

        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-2 border-[#CAE661] border-t-[#3A4B06] rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 mt-4">Loading reports...</p>
          </div>
        ) : hasActivePlan ? (
          // User has an active plan - show calendar and reports
          <>
            <div className="flex justify-center px-4 mb-6">
              <div className="w-full max-w-[380px]">
                <CalendarSection />
              </div>
            </div>

            <div className="px-4 pb-20">
              {/* Wiper Updates Section */}
              <div className="wiper-updates-section">
                <div className="mb-3">
                  <h2 className="text-xl font-semibold text-[#3A4B06]">
                    Wiper Updates
                  </h2>
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
                          maxWidth: "100%", // For responsiveness
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
              </div>
            </div>
          </>
        ) : (
          // User does not have an active plan - show no plan message
          <div className="flex flex-col items-center justify-center px-4 py-16">
            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <div className="bg-[#F8FFDD] p-4 rounded-full mb-4">
                <Calendar className="w-12 h-12 text-[#3A4B06]" />
              </div>
              <h2 className="text-xl font-bold text-[#3A4B06] mb-2">
                No Reports Available
              </h2>
              <p className="text-gray-600 max-w-xs text-center mb-6">
                You need an active cleaning plan to access cleaning reports and history.
              </p>
              
              <div className="w-full max-w-sm bg-[#F8FFDD] rounded-lg border border-dashed border-[#CAE661] p-4 mb-6">
                <p className="text-center text-sm text-[#3A4B06] mb-2 font-medium">Reports Include:</p>
                <ul className="text-sm text-[#3A4B06] space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3A4B06] mr-2"></div>
                    <span>Daily cleaning updates</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3A4B06] mr-2"></div>
                    <span>Monthly cleaning history</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3A4B06] mr-2"></div>
                    <span>Special service notifications</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={() => navigate('/plans')}
                className="bg-black text-[#D3FF33] font-medium py-4 px-8 rounded-full flex items-center justify-center"
              >
                View Available Plans
              </button>
            </div>
          </div>
        )}

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
    </div>
  );
}

export default ReportPage; // Fixed the component name in export
