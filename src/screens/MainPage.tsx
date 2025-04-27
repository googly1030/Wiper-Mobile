import React, { useEffect, useState } from "react";
import {
  carInfo,
  location,
  planExpiryDate,
  carCleanedDays,
  updates,
} from "./data/mockData";
import { Car, Calendar, X } from "lucide-react";
import { UpdateType } from "./types";
import BottomNavigation from "../components/BottomNavigation";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";

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

  // Group updates by date
  useEffect(() => {
    const grouped: Record<string, UpdateType[]> = {};

    updates.forEach((update, index) => {
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

  const handleSubmitRegistration = () => {
    // Here you would handle updating all car info
    // For now, we'll just close the modal
    setIsCarModalOpen(false);
  };

  return (
    <div
      className="bg-white min-h-screen mx-auto"
      style={{ maxWidth: screenWidth > 768 ? "480px" : "100%" }}
    >
      <div className="relative">
        <PageHeader userName="A" />

        <div className="px-4 pb-20">
          {/* Plan Notification */}
          <div
            className="flex items-center mb-4"
            style={{
              width: "380px",
              height: "52px",
              borderRadius: "6px",
              background: "#CAE661",
              padding: "0.375rem 0.75rem", // Space/150 equivalent
              maxWidth: "100%", // For responsiveness
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

          {/* Wiper Updates Section */}
          <div className="wiper-updates-section ">
            <div className="mb-3">
              <h2 className="text-xl font-semibold text-[#3A4B06]">
                Wiper Updates
              </h2>
            </div>
            <div
              className="flex items-center mb-5 mx-auto w-full"
              style={{
                maxWidth: "380px",
                minHeight: "60px", // Increased for better touch targets
                borderRadius: "12px", // Increased for modern look
                background: "#F9FFE5",
                padding: "1rem", // Increased padding for better spacing
              }}
            >
              <span className="mr-3 flex-shrink-0">
                {" "}
                {/* Increased margin and prevented shrinking */}
                <Car className="w-6 h-6 text-[#2A3A0F]" />{" "}
                {/* Increased icon size */}
              </span>
              <p className="text-base text-[#2A3A0F] flex-1">
                {" "}
                {/* Increased text size and added flex-1 */}
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
