"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react"; // Import icon from Lucide for the search

const CompletedPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]); // State to hold completed plans
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [filteredPlans, setFilteredPlans] = useState<any[]>([]); // State for filtered plans
  const [loading, setLoading] = useState<boolean>(true); // State for loading animation

  // Fetch completed plans on component mount
  useEffect(() => {
    const fetchCompletedPlans = async () => {
      try {
        const response = await axios.get("http://localhost:8000/completedplan");
        setPlans(response.data); // Assuming the response data is an array of plans
      } catch (error) {
        console.error("Error fetching completed plans:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCompletedPlans();
  }, []);

  // Filter plans based on search term
  useEffect(() => {
    const results = plans.filter((plan) =>
      plan.blog && plan.blog.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlans(results);
  }, [searchTerm, plans]);

  return (
    <div className="flex flex-col">
      <div className="py-20 min">
        <h1 className="text-4xl font-bold mb-6 text-center font-kanit">Chase Your Dreams: Explore Our Travel Tales</h1>
        <div className="relative max-w-screen-md mx-auto mb-4 w-full flex items-center">
          <Search className="absolute top-2.5 left-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search for Blog..."
            className="pl-10 mb-4 p-3 border rounded shadow-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-center text-lg text-gray-600">
          {filteredPlans.length} blog{filteredPlans.length !== 1 ? 's' : ''} available
        </p>
      </div>
      <div className="bg-white border-t-2 min-h-screen">
        <div className="w-full max-w-screen-lg grid grid-cols-3 gap-3 mt-10 mx-auto">
          {loading ? (
            // Skeleton loader
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            ))
          ) : filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => {
              // Split the blog into title and content
              const [title, ...contentParts] = plan.blog.split(','); // Split by comma
              const content = contentParts.join(','); // Join the remaining parts back

              return (
                <div key={plan.id} className="mb-4 p-4 border rounded-lg shadow-lg">
                  <h2 className="font-semibold font-kanit">{title.trim()}</h2> {/* Show title */}
                  <p className="text-gray-600 line-clamp-2 mt-2">{content.trim()}</p> {/* Show content */}
                </div>
              );
            })
          ) : (
            <p>No plans found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedPlansPage;
