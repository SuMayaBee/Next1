import Link from "next/link";
import React from "react";
import { Sun, CloudRain, CloudSun, Cloud } from "lucide-react"; // Import Lucide icons

interface CardProps {
  destination: string;
  date: string;
  weather: string;
  id: string | number; // Add an id prop
  onGenerateBlog: (id: string) => void | Promise<void>; // Function to handle blog generation
  isGenerating: boolean; // Prop to indicate if the blog is being generated
  blog: string | number; // Add a blog prop to determine if the blog exists
}

const getWeatherIcon = (weather: string) => {
  switch (weather.toLowerCase()) {
    case 'sunny':
      return <Sun className="w-5 h-5 mr-2" />;
    case 'rainy':
      return <CloudRain className="w-5 h-5 mr-2" />;
    case 'partly cloudy':
      return <CloudSun className="w-5 h-5 mr-2" />;
    default:
      return <Cloud className="w-5 h-5 mr-2" />;
  }
};

const Card: React.FC<CardProps> = ({ destination, date, weather, id, onGenerateBlog, isGenerating, blog }) => {
    
  const weatherIcon = getWeatherIcon(weather); // Get appropriate weather icon based on weather description

  // Determine if the blog is empty
  const isBlogEmpty = typeof blog === 'string' && blog.trim() === ""; // Check if the blog is an empty string

  return (
    <article className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]">
      <div className="w-full rounded-[10px] bg-white p-4 !pt-20 sm:p-6">
        <time className="block -mt-5 text-gray-500" dateTime={date}>
          {date}
        </time>

        <h3 className="mt-0.5 text-3xl font-kanit font-medium text-gray-900">
          {destination}
        </h3>

        <div className="flex items-center mt-2">
          {weatherIcon}
          <p className="text-gray-700">
            {weather}
          </p>
        </div>

        {isBlogEmpty ? ( // Check if the blog is empty
          <button 
            onClick={() => onGenerateBlog(id)} // Pass the id when the button is clicked
            className="mt-6 flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition glow-effect"
            disabled={isGenerating} // Disable the button while generating
          >
            {isGenerating ? ( // Show spinner if generating
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16v-4a9 9 0 018-8.487M16 3a9 9 0 019 9v4m-9 8a9 9 0 01-9-9" />
              </svg>
            )}
            {isGenerating ? 'Generating...' : 'Generate Blog'}
          </button>
        ) : (
          <Link 
            href={`/dashboard/blogs/${id}`} // Adjust this path based on your routing setup
            className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition glow-effect "
          >
            View Blog
          </Link>
        )}
      </div>
    </article>
  );
};

export default Card;
