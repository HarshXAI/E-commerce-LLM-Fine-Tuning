import React, { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { MessageCircle, X } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const RetailerDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I can help you analyze your e-commerce data. What would you like to know?'
    }
  ]);

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Home & Garden'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Current Revenue',
        data: [65000, 59000, 80000, 81000, 86000, 95000],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Previous Revenue',
        data: [55000, 49000, 70000, 71000, 76000, 85000],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      }
    ],
  };

  const areaChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        fill: true,
        label: 'Customer Growth',
        data: [500, 800, 1200, 1500, 2000, 2500],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
      },
    },
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add user message
      setMessages(prev => [...prev, {
        type: 'user',
        content: messageInput
      }]);

      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: 'I received your message: ' + messageInput
        }]);
      }, 1000);

      // Clear input
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Monthly Sales</h3>
          <div className="h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Product Categories</h3>
          <div className="h-[250px]">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Trend</h3>
          <div className="h-[250px]">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Area Chart */}
        <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Customer Growth</h3>
          <div className="h-[300px]">
            <Line data={areaChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 ${
          isChatOpen ? 'hidden' : 'flex'
        }`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Popup */}
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
              {messages.map((message, index) => (
                <div key={index} className="flex items-start">
                  {message.type === 'ai' ? (
                    <>
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-sm">AI</span>
                        </div>
                      </div>
                      <div className="ml-3 bg-blue-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {message.content}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="ml-auto bg-blue-500 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm text-white">
                        {message.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Ask something about your data..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <button 
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerDashboard;