import React, { useState } from 'react';
import axios from 'axios';
import Loader from "../Loader/Loader";
import { ImagePlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImageUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null); // State to store the response
  const [loading, setLoading] = useState(false); // State for loading status
  const navigate = useNavigate();

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!file) {
      alert('Please select an image to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file); // 'image' is the field name that multer will look for

    try {
      // Send the image to the backend using axios
      const response = await axios.post('http://localhost:5000/imageUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response);
      const result = response.data.result;
      setResponseData(result);
      await addData(result);
    } catch (error) {
      console.error('Error uploading the image:', error);
    } finally {
      setLoading(false);
    }
  };

  const addData = async (result) => {
    try {
      const numericResult = parseInt(result, 10); // Convert result to a number
  
      if (isNaN(numericResult)) {
        console.error("Invalid number format:", result);
        return;
      }
  
      const response = await axios.post('http://localhost:5000/llm/imgData', { rows: numericResult });
  
      console.log('Data added successfully:', response.data);
      navigate('/customretailer');
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };
  

  return (
    <>
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Modal Background */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
        {/* Upload Modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto p-6">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Upload Data Image
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* File Upload Section */}
          <label
            htmlFor="file"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md cursor-pointer mt-4 hover:border-blue-500 transition"
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ImagePlus className="text-gray-400 dark:text-gray-500" size={40} />
                <span className="text-gray-500 dark:text-gray-300 mt-2">
                  Click to upload image
                </span>
              </div>
            )}
            <input
              type="file"
              id="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>

          {/* Display Response */}
          {responseData && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              {responseData} Data added Successfully
              </h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
