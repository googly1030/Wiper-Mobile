import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto px-4">
      {/* Logo section with black background */}
      <div className="bg-black w-full aspect-square flex items-center justify-center mt-4" style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
        <div className="w-32 h-32 relative">
          <img src="/Wiper.png" alt="Wipe Logo" className="object-contain w-full h-full" />
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-gray-100 flex flex-col p-8 ">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold leading-tight">Your car deserves a wipe everyday!</h1>
          <p className="text-xl mt-4">Book now and get the first 7 days free!!!!!!</p>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1 my-6">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>
      </div>

      {/* Get Started button */}
      <div className="p-4 mb-6">
        <button
          onClick={handleGetStarted}
          className="block w-full bg-black text-[#c8ff00] font-semibold py-4 rounded-full text-center shadow-md"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
