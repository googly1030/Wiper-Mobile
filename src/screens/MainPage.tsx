import React, { useEffect, useState } from "react";
import {
  carInfo,
  location,
  planExpiryDate,
  carCleanedDays,
  updates,
} from "./data/mockData";
import { Car ,Calendar} from "lucide-react";
import { UpdateType } from "./types";

function MainPage() {
  const [groupedUpdates, setGroupedUpdates] = useState<
    Record<string, UpdateType[]>
  >({});
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

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
        <header className="flex justify-between items-center p-4 w-full sticky top-0 bg-white z-10">
          <h1 className="text-2xl font-bold text-[#3A4B06]">Wiper</h1>
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            <span>A</span>
          </div>
        </header>

        <div className="px-4 pb-20">
          {/* Plan Notification */}
          <div 
            className="flex items-center mb-4"
            style={{
                width: '380px',
                height: '52px',
                borderRadius: '6px',
                background: '#CAE661',
                padding: '0.375rem 0.75rem', // Space/150 equivalent
                maxWidth: '100%' // For responsiveness
            }}
            >
                    <span className="mr-2 text-lg">
        <Calendar className="w-5 h-5" />
        </span>
        <p 
        className="text-sm"
        style={{
            fontFamily: 'var(--label-large-font)',
            fontWeight: 500,
            fontSize: 'var(--label-large-size)',
            lineHeight: 'var(--label-large-line-height)',
            letterSpacing: 'var(--label-large-tracking)',
            textAlign: 'center',
            verticalAlign: 'middle'
        }}
        >
        Your current plan will end in {planExpiryDate}
        </p>
            </div>

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
                {location.name}
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
              <p className="text-xs text-center">{location.building}</p>
            </div>
          </div>

          {/* Car Info */}
          <div
            className="mb-6 flex overflow-hidden"
            style={{
              width: "383px",
              height: "130px",
              borderRadius: "12px",
              background: "rgba(206, 210, 198, 0.08)", // #CED2C614 converted to rgba
              maxWidth: "100%", // For responsiveness
            }}
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

          {/* Wiper Updates Section */}
          <div>
            <div className="mb-3">
              <h2 className="text-xl font-semibold text-[#3A4B06]">
                Wiper Updates
              </h2>
            </div>
            <div
              className="flex items-center mb-5"
              style={{
                width: "380px",
                height: "52px",
                borderRadius: "6px",
                background: "#F9FFE5",
                maxWidth: "100%",
                padding: "0.375rem 0.75rem",
              }}
            >
              <span className="mr-2 text-lg">
                <Car className="w-5 h-5" />
              </span>
              <p className="text-sm">
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
          <div className="w-full px-4">
            <button
              className="w-[380px] h-[64px] bg-black rounded-[100px] flex items-center justify-center gap-2 py-3 mx-auto"
              style={{
                background: "#000000",
                maxWidth: "100%", // This ensures button is responsive on smaller screens
              }}
            >
              <span
                className="font-medium text-xl text-center"
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

        {/* Bottom Navigation */}
        <div
  className="fixed bottom-0 left-0 right-0 bg-[#F8FFDD] h-16 flex items-center justify-around z-10 shadow-md"
  style={{
    maxWidth: screenWidth > 768 ? "480px" : "100%",
    margin: "0 auto",
  }}
>
  <button className="flex flex-col items-center flex-1 py-2">
    <img 
      src="./homeicon.png" 
      alt="Home" 
      style={{
        width: '22px',
        height: '18px',
        marginTop: '4px',
        marginLeft: '1px'
      }}
    />
    <span className="text-xs text-gray-700">Home</span>
  </button>
  <button className="flex flex-col items-center flex-1 py-2">
    <img 
      src="./planicon.png" 
      alt="Plans" 
      style={{
        width: '22px',
        height: '18px',
        marginTop: '4px',
        marginLeft: '1px'
      }}
    />
    <span className="text-xs text-gray-700">Plans</span>
  </button>
  <button className="flex flex-col items-center flex-1 py-2">
    <img 
      src="./reporticon.png" 
      alt="Reports" 
      style={{
        width: '16px',
        height: '20px',
        top: '2px',
        left: '4px'
        
      }}
    />
    <span className="text-xs text-gray-700">Reports</span>
  </button>
</div>

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
