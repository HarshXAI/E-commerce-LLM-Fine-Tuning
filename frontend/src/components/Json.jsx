import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ParseExcel = ({ onClose }) => {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;
    setFileName(file.name);

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      parseCSV(file);
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      parseExcel(file);
    } else {
      alert("Invalid file format. Please upload a CSV or Excel file.");
      setFileName(null);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formattedData = formatData(result.data);
        setJsonData(formattedData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);

      setJsonData(formatData(excelData));
    };
    reader.readAsArrayBuffer(file);
  };

  // Format data into a structure suitable for MongoDB
  const formatData = (data) => {
    return data.map((row) => ({
      customer_id: row.customer_id || "",
      email: row.email || "",
      age: row.age ? parseInt(row.age, 10) : null,
      gender: row.gender || "",
      location: row.location || "",
      product_id: row.product_id || "",
      product_name: row.product_name || "",
      category: row.category || "",
      subcategory: row.subcategory || "",
      price: row.price ? parseFloat(row.price) : 0,
      brand: row.brand || "",
      shipping_address: row.shipping_address || "",
      purchase_date: row.purchase_date || "",
      delivery_status: row.delivery_status || "",
      return_status: row.return_status || "",
      discount_applied: row.discount_applied ? parseFloat(row.discount_applied) : 0,
      product_rating: row.product_rating ? parseFloat(row.product_rating) : null,
    }));
  };

  const handleSubmitData = async () => {
    if (!jsonData || jsonData.length === 0) {
      alert("No data to submit. Please upload a file first.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/llm/insertMany", { data: jsonData });
      console.log("Data inserted successfully:", response.data);
      toast.success('Data inserted successfully');
      navigate('/customretailer');
      setJsonData(null); // Clear state after successful insertion
      setFileName(null);
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal Background */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
        {/* Modal Container */}
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto p-6">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Upload CSV or Excel File
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* File Upload Box */}
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md cursor-pointer mt-4 hover:border-blue-500 transition"
          >
            {fileName ? (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 px-4 rounded-md shadow">
                <FileSpreadsheet size={20} className="text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 truncate">{fileName}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="text-gray-400 dark:text-gray-500" size={40} />
                <span className="text-gray-500 dark:text-gray-300 mt-2">
                  Click to upload (.csv, .xls, .xlsx)
                </span>
              </div>
            )}
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Submit Button */}
          {jsonData && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmitData}
                className={`px-5 py-2 rounded-lg shadow transition duration-200 ${
                  loading ? "bg-gray-500 text-white cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Data"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ParseExcel;
