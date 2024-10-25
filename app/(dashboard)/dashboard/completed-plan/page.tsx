"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi'; // Importing a loader icon
import Card from './Card'; // Adjust the import path based on your file structure
import Swal from 'sweetalert2';
import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompletedPlan {
  id: number;
  user_id: number;
  destination: string;
  date: string;
  weather_event: string;
  blog: string;
}

const CompletedPlanPage: React.FC = () => {
  const router = useRouter();
  const [completedPlans, setCompletedPlans] = useState<CompletedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingBlogId, setGeneratingBlogId] = useState<number | null>(null); // Track which blog is being generated

  useEffect(() => {
    const fetchCompletedPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8000/completedplan'); // Adjust the endpoint as needed
        setCompletedPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed plans:', error);
        toast.error('Failed to load completed plans. Please try again later.');
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchCompletedPlans();
  }, []);

  const onGenerateBlog = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will generate a blog for the selected plan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, generate blog!'
    });

    if (result.isConfirmed) {
      setGeneratingBlogId(id); // Set the generating blog ID

      try {
        // Make the API request to generate the blog
        const response = await axios.put(`http://localhost:8000/createblog/${id}`); // Adjust the endpoint as needed
        if (response.status === 200) {
          toast.success('Blog generated successfully!');
        }
      } catch (error) {
        console.error('Error generating blog:', error);
        toast.error('Failed to generate blog. Please try again later.');
      } finally {
        setGeneratingBlogId(null);
        router.push(`/dashboard/blogs/${id}`) // Reset generating blog ID after completion
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex rounded-lg items-center justify-center bg-gradient-to-r from-green-400 via-green-500 to-cyan-500">
        <svg
          className="w-10 h-10 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading completed plans: {error}</div>;
  }

  return (
    <div className="min-h-screen rounded-lg z-10 relative bg-gradient-to-r from-green-400 via-green-500 to-cyan-500 p-8">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide font-kanit">
        Completed Plans
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {completedPlans.length > 0 ? (
          completedPlans.map((plan) => (
            <div key={plan.id}>
              <Card 
                destination={plan.destination} 
                date={plan.date} 
                blog={plan.blog}
                weather={plan.weather_event} 
                weatherIcon="path_to_weather_icon" // You can replace this with the actual icon path if needed
                id={plan.id} // Pass the id here
                onGenerateBlog={onGenerateBlog} 
              />
              {generatingBlogId === plan.id && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="text-center text-white">
                    <FiLoader className="animate-spin" size={48} />
                    <p className="text-lg mt-2">Generating...</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full">No completed plans found.</p>
        )}
      </div>
    </div>
  );
};

export default CompletedPlanPage;
