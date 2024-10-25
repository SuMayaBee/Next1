"use client";
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import InputField from '../InputField'; // Import the InputField component

const CreatePlanPage = () => {
  // State for form inputs
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [userId] = useState(Math.floor(Math.random() * 1000) + 1); // Random user ID
  const [loading, setLoading] = useState(false); // Loading state for spinner

  // Error handling (optional)
  const [errors, setErrors] = useState({ destination: '', date: '' });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before making the POST request
    if (!destination) {
      setErrors((prevErrors) => ({ ...prevErrors, destination: 'Destination is required' }));
      return;
    }

    if (!date) {
      setErrors((prevErrors) => ({ ...prevErrors, date: 'Date is required' }));
      return;
    }

    // Prepare the data to send in POST request
    const data = {
      user_id: userId,
      destination: destination,
      date: date,
    };

    setLoading(true); // Show loader

    try {
      const response = await axios.post('http://localhost:8000/createplan', data);
      console.log('Plan created successfully:', response.data);

      // Display success message and clear form inputs
      toast.success('Plan created successfully!');
      setDestination('');
      setDate('');
      setErrors({ destination: '', date: '' }); // Clear errors on success
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Failed to create plan. Please try again.');
    } finally {
      setLoading(false); // Hide loader after request completes
    }
  };

  return (
    <div className="relative rounded-lg flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-lg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 font-kanit text-[#FF5733] font-mukit">Create a Travel Plan</h2>

        {/* Destination Input Field */}
        <InputField
          label="Destination"
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          error={errors.destination}
        />

        {/* Date Input Field */}
        <InputField
          label="Date"
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />

        <button
          type="submit"
          className="w-full bg-[#FF5733] text-white py-3 rounded hover:bg-red-600 flex items-center justify-center transition duration-200"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="w-5 h-5 animate-spin text-white"
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
          ) : (
            "Create Plan"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePlanPage;
