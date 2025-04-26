import React, { useEffect, useState } from "react";
import {
  carInfo,
  location,
  planExpiryDate,
  carCleanedDays,
  updates,
} from "./data/mockData";
import { Car, Calendar } from "lucide-react";
import { UpdateType } from "./types";
import BottomNavigation from "../components/BottomNavigation";
import CalendarSection from "../components/calendar"; // Updated import
import PageHeader from "../components/PageHeader";

function MainPage() {
  const [groupedUpdates, setGroupedUpdates] = useState<
    Record<string, UpdateType[]>
  >({});
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [activeTab, setActiveTab] = useState<"home" | "plans" | "reports">(
    "home"
  );

  // Group updates by date
  useEffect(() => {
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
  }, []);

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
        <PageHeader userName="A" />

        {/* Main Content */}

        <div className="flex justify-center px-4 mb-6">
          <div className="w-full max-w-[380px]">
            <CalendarSection />
          </div>
        </div>

        <div className="px-4 pb-20">
          {/* Wiper Updates Section */}
          <div className="wiper-updates-section ">
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

export default MainPage;
