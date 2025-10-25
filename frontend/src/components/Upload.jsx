import React, { useState } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ParseExcel = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const onClose = () => {
    navigate("/");
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    console.log("Selected file:", uploadedFile);
  };

  const handlebtnClick = () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    navigate("/customretailer");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Upload CSV or Excel File
            </h3>
            <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* File Upload Box */}
          <label
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md cursor-pointer mt-4 hover:border-blue-500 transition"
          >
            <input
              type="file"
              accept=".csv, .xls, .xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center">
              <Upload className="text-gray-400 dark:text-gray-500" size={40} />
              <span className="text-gray-500 dark:text-gray-300 mt-2">
                Click to upload (.csv, .xls, .xlsx)
              </span>
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  {file.name} selected
                </p>
              )}
            </div>
          </label>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handlebtnClick}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParseExcel;
