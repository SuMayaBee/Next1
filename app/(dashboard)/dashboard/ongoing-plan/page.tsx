'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Card from './Card'; // Adjust the import path based on your file structure
import Swal from 'sweetalert2'; // Import SweetAlert2

interface Plan {
  id: number;
  user_id: number;
  destination: string;
  date: string;
  weather_event: string;
  is_completed: boolean;
  blog: string;
}

const OngoingPlanPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8000/ongoingplan');
        setPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Failed to load plans. Please try again later.');
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // const handleComplete = async (userId: number) => {
  //   // Display the confirmation alert
  //   const result = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, complete it!'
  //   });

  //   // If the user clicks 'Yes'
  //   if (result.isConfirmed) {
  //     try {
  //       // Make the API request to mark the plan as completed
  //       const response = await axios.get(`http://localhost:8000/completedplan/${userId}`);
  //       if (response.status === 200) {
  //         toast.success('Plan completed successfully!');
  //         // Optionally, update the state to remove the completed plan
  //         setPlans((prevPlans) => prevPlans.filter(plan => plan.user_id !== userId));
  //       }
  //     } catch (error) {
  //       console.error('Error completing plan:', error);
  //       toast.error('Failed to complete the plan. Please try again later.');
  //     }
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
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
    return <div className="text-center text-red-500">Error loading plans: {error}</div>;
  }

  return (
    <div className="relative z-10 min-h-screen rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide font-kanit">
        Ongoing Plans
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <Card 
              key={plan.id} 
              destination={plan.destination} 
              date={plan.date} 
              weather={plan.weather_event} 
              // onComplete={() => handleComplete(plan.user_id)} // Pass the user ID to the completion handler
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full">No ongoing plans found.</p>
        )}
      </div>
    </div>
  );
};

export default OngoingPlanPage;
