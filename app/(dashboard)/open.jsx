"use client";
import { useState, useEffect } from "react";
import { OpenAI } from "openai";


// Initialize OpenAI with environment variable for security
const openai = new OpenAI({
  apiKey:  // Store your API key in environment variables
  dangerouslyAllowBrowser: true, // Allow browser usage of API
});

// Helper function to convert image to base64
const convertImageToBase64 = (imageUrl) => {
  return new Promise((resolve, reject) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
  });
};

const ImageDescriptionsWithGPT = () => {
  const [fileArray, setFileArray] = useState([]); // Store list of files
  const [gptResponses, setGptResponses] = useState([]); // Store GPT responses
  const [passingString, setPassingString] = useState(JSON.stringify([])); // Initialize passingString with empty array
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userMessage, setUserMessage] = useState(""); // Store user input
  const [modelResponse, setModelResponse] = useState("");
  const [imageToShow, setImageToShow] = useState(null);
  //const [message, setMessage] = useState(null); // Store success or failure message
  const [saveSuccess, setSaveSuccess] = useState(false); // Track if the save was successful


  // Fetch all the uploaded images from the server
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/list-files");
      const data = await response.json();

      if (data.files && Array.isArray(data.files)) {
        setFileArray(data.files);
      }

      if (data.files.length === 0) {
        setMessage("No images found in the uploads folder.");
        setLoading(false);
        return;
      }

      const imageUrls = data.files.map((file) => `http://localhost:3000/uploads/${file}`);

      // Get GPT responses for each image URL
      const imagesWithResponses = await Promise.all(
        imageUrls.map(async (url, index) => {
          const base64Image = await convertImageToBase64(url);
          const description = await getDescriptionFromGPT(base64Image, index);
          return { url, description };
        })
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage("Error fetching images.");
      setLoading(false);
    }
  };

  // Function to get description for an image using OpenAI API
  const getDescriptionFromGPT = async (base64Image, index) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "What is in this image? Write shortly.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `${base64Image}`, // base64Image passed here
                },
              },
            ],
          },
        ],
      });

      const gptResponseText = response?.choices?.[0]?.message?.content || "No description available.";
      console.log("GPT response (string):", gptResponseText);

      // Add the GPT response and index to the state array
      setGptResponses((prevResponses) => [
        ...prevResponses,
        { index: index, response: gptResponseText }, // Store both index and response
      ]);

      return gptResponseText;
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      return "Error generating description.";
    }
  };

    // Function to send user input to backend
    // const handleUserMessageSubmit = async () => {
    //   try {
    //     const response = await fetch("http://localhost:8000/chat", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ userMessage }), // Send userMessage to backend
    //     });
  
    //     const data = await response.json();
    //     setModelResponse(data.model_response); // Get and set model_response from backend
    //   } catch (error) {
    //     console.error("Error sending user message to backend:", error);
    //   }
    // };

  // UseEffect to monitor changes to gptResponses and update passingString with index and response
  useEffect(() => {
    if (gptResponses.length > 0) {
      const updatedString = JSON.stringify(
        gptResponses.map((responseObj) => ({
          index: responseObj.index, // Ensure index is included
          response: responseObj.response,
        }))
      );

      console.log("Files: ", fileArray);

      setPassingString(updatedString); // Update passingString state
      console.log("Updated passingString with index:", updatedString); // Log the stringified gptResponses with index
    }
  }, [gptResponses]); // Dependency array with gptResponses

  useEffect(() => {
    fetchImages();
  }, []);

    // Function to send the string to the backend
    const handleSaveToFile = async () => {
      try {
        const response = await fetch("http://localhost:8000/save-string", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: passingString }), // Send the passingString as "content"
        });
  
        if (response.ok) {
          console.log("String saved successfully!");
          setMessage("File saved successfully!"); // Set success message
          setSaveSuccess(true); // Indicate the save was successful
          setTimeout(() => setSaveSuccess(false), 3000); // Hide the message after 3 seconds
        } else {
          setMessage("Failed to save the file."); // Set failure message
          setSaveSuccess(false);
        }
      } catch (error) {
        console.error("Error sending string to backend:", error);
        setMessage("Error occurred while saving the file."); // Set error message
        setSaveSuccess(false);
      }
    };

    const handleUserMessageSubmit = async () => {
      setLoading(true); // Set loading state to true to show the spinner
    
      // Append the additional string to the user's message
      const appendedMessage = `${userMessage} Find the index number and Only answer in the index number`;
    
      try {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userMessage: appendedMessage }),
        });
    
        const data = await response.json();
        if (data && data.model_response && data.model_response.length <= 2) {
          const responseIndex = parseInt(data.model_response, 10);
          if (responseIndex >= 0 && responseIndex < fileArray.length) {
            setImageToShow(fileArray[responseIndex]); // Set the image to show
            console.log("Image to show:", fileArray[responseIndex]);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    
      setLoading(false); // Hide the spinner when done
    };

  return (
<div className="flex flex-col items-center py-10 px-4 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
  {/* Input for user message */}
   {/* Button to Save String to Backend */}
   <button
        className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={handleSaveToFile}
      >
        Update Vector Database
      </button>

      {/* Display success or error message */}
      {message && (
        <div
          className={`mt-4 px-4 py-2 rounded-lg text-white shadow-md ${
            saveSuccess ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message}
        </div>
      )}
  <div className="mt-10 w-full max-w-md">
    <label htmlFor="userMessage" className="block text-lg font-bold text-gray-800 mb-4">
      Ask a Question:
    </label>
    <div className="flex">
      <input
        id="userMessage"
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm"
        placeholder="Enter your question here..."
      />
      <button
        onClick={handleUserMessageSubmit}
        className="ml-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
      >
        Submit
      </button>
    </div>
  </div>

  {/* Show Loading Spinner when image is being fetched */}
  {loading && (
    <div className="mt-8 flex justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}

  {/* Display the image corresponding to the model response */}
  {!loading && imageToShow && (
    <div className="mt-12 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Image Based on Model Response</h2>
      <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
        <img
          src={`http://localhost:3000/uploads/${imageToShow}`}
          alt="Selected Image"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )}

  {/* Display the stringified GPT responses with indexes */}
  <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Image Descriptions</h2>
    <ul className="space-y-4">
      {gptResponses.map((item, index) => (
        <li key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold text-blue-600">Image {item.index}:</span> {item.response}
          </p>
        </li>
      ))}
    </ul>
  </div>
</div>


  );
};

export default ImageDescriptionsWithGPT;
