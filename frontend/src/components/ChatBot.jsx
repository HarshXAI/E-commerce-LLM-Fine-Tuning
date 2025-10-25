import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  Link as InsertLinkIcon
} from "lucide-react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { ClipLoader } from "react-spinners";

const PdfRAG = () => {
  const [messageInput, setMessageInput] = useState("");
  const [pdfMsg, setPdfMsg] = useState({ isUser: "", isAi: "" });
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoad, setChatLoad] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setSelectedPdf(file);
    setStatusMessage(`Uploading "${file.name}"...`);

    const formData = new FormData();
    const isCSV = file.name.endsWith(".csv");
    formData.append(isCSV ? "csv" : "pdf", file);

    try {
      const uploadUrl = isCSV
        ? "http://localhost:5000/upload-csv"
        : "http://localhost:5000/upload-pdf";

      const resp = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("File uploaded successfully", resp.data);
      setStatusMessage(`"${file.name}" uploaded and processed successfully!`);
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatusMessage("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedPdf) {
      setStatusMessage("Error: Please upload a file before asking.");
      return;
    }
    if (messageInput.trim() === "") {
      setStatusMessage("Error: Please enter a message.");
      return;
    }

    setChatLoad(true);
    setPdfMsg((prev) => ({ ...prev, isUser: messageInput }));

    try {
      const uploadUrl = selectedPdf.name.endsWith(".csv")
        ? "http://localhost:5000/questions-csv"
        : "http://localhost:5000/questions-pdf";

      const resp = await axios.post(uploadUrl, { message: messageInput });

      setPdfMsg((prev) => ({ ...prev, isAi: resp.data.message }));
      console.log("Response:", resp.data.message);
    } catch (error) {
      console.error("Error:", error);
      setPdfMsg((prev) => ({ ...prev, isAi: "Error retrieving response." }));
    } finally {
      setChatLoad(false);
    }

    setMessageInput("");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6">
        <button
          className="p-2 bg-blue-500 text-white rounded-full shadow-md"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? "Close Chat" : "Open Chat"}
        </button>
      </div>
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[38%] h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Assistant</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {pdfMsg.isUser && (
                <div className="ml-auto bg-blue-500 p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm text-white">{pdfMsg.isUser}</p>
                </div>
              )}
              {pdfMsg.isAi && (
                <div className="flex items-start">
                  <div className="ml-3 bg-blue-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {pdfMsg.isAi}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Ask about the document..."
              className="w-full p-2 border rounded-lg focus:outline-none"
            />
            <input
              type="file"
              onChange={handlePdfUpload}
              className="mt-2 w-full"
            />
            <button
              onClick={handleSendMessage}
              className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PdfRAG;
