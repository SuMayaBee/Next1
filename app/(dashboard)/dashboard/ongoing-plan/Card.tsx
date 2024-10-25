import React from "react";
import { FaSun, FaCloudSun, FaCloudRain, FaSnowflake } from "react-icons/fa"; // Make sure to import the icons

const getWeatherIcon = (weather: string) => {
  switch (weather.toLowerCase()) {
    case "sunny":
      return <FaSun className="inline-block text-yellow-500" />;
    case "cloudy":
      return <FaCloudSun className="inline-block text-gray-400" />;
    case "rainy":
      return <FaCloudRain className="inline-block text-blue-500" />;
    case "snowy":
      return <FaSnowflake className="inline-block text-blue-200" />;
    default:
      return <FaCloudSun className="inline-block text-gray-400" />;
  }
};

const Card: React.FC<CardProps> = ({
  destination,
  date,
  weather,
  id,
  onGenerateBlog,
  isGenerating,
  blog,
  cloudCover,
  cloudDescription,
}) => {
  const weatherIcon = getWeatherIcon(weather); // Get the weather icon based on the weather prop

  return (
    <article className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]">
      <div className="w-full rounded-[10px] bg-white p-4 !pt-20 sm:p-6">
        <time className="block text-xs text-gray-500" dateTime={date}>
          {date}
        </time>

        <h3 className="mt-0.5 text-2xl font-medium text-gray-900">
          {destination}
        </h3>

        <div className="flex items-center mt-2">
          {weatherIcon} {/* Display the weather icon */}
          <p className="text-sm text-gray-700">{weather}</p>
        </div>

        {/* Display broker cloud information if available */}
        {cloudCover !== undefined && (
          <div className="mt-2 text-sm text-gray-600">
            <p>Cloud Cover: {cloudCover}%</p>
            {cloudDescription && <p>Description: {cloudDescription}</p>}
          </div>
        )}

        {blog === "" ? ( // Check if the blog is empty
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
          <a 
            href={`/blogs/${id}`} // Adjust this path based on your routing setup
            className="mt-6 flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-cyan-400 transition glow-effect"
          >
            View Blog
          </a>
        )}
      </div>
    </article>
  );
};

export default Card;
