import React, { useEffect, useState } from 'react';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import { MessageCircle, X, Upload, FileText, Paperclip, Cat } from 'lucide-react';
import Chatbot from '../components/ChatBot';
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
  Filler,
  RadialLinearScale
} from 'chart.js';
import axios from 'axios';
import SummaryMetrics from '../components/SummaryMetrics';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

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
  Filler,
  RadialLinearScale
);

const CustomRetailerDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfError, setPdfError] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [activeChart, setActiveChart] = useState('monthly');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I can help you analyze your e-commerce data. You can also upload PDF documents for analysis.'
    }
  ]);
  const [Month, setMonth] = useState({
    html: "", values: []
  })
  const [category, setCategory] = useState({
    html: "",
    values: [],
    label: []
  });
  const [line, setLine] = useState({
    html: "",
    male: [],
    female: [],
    label: []
  });
  const [radarData, setRadarData] = useState({
    html: "",
    values: [],
    labels: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();


  // State to manage selected file type
  const [fileType, setFileType] = useState('');
  const [showFileOptions, setGiveOptions] = useState(false); // Renamed function

  // Add these file options with icons
  const fileOptions = [
    { type: 'image', label: 'Image', icon: '🖼️', url: '/upload-img' },
    { type: 'csv', label: 'CSV', icon: '📊', url: '/upload-csv' },
    // { type: 'text', label: 'Text', icon: '📝', url: '' } // Ensure URL is valid
  ];
  const monthlyAnalysis = async () => {
    setLoader(true);
    try {
      const res = await axios.post("http://localhost:5000/llm/monthxprice");
      console.log(res.data);


      // Ensure the response contains data before updating state
      if (res.data && res.data.data) {
        setMonth((prevState) => ({
          ...prevState,
          values: res.data.data,
          html: res.data.response
        }));
      }

    } catch (error) {
      console.error("Error fetching monthly analysis data:", error);
    }
    finally {
      setLoader(false);
    }
  };

  useEffect(() => {
  }, [])

  const categoryAnalysis = async () => {
    setLoader(true); // Show loader
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/llm/categoryPie");

      if (res.data && res.data.data && res.data.response && res.data.label) {
        setCategory((prevState) => ({
          ...prevState,
          values: res.data.data,
          html: res.data.response,
          label: res.data.label
        }));
      } else {
        console.error("⚠️ Unexpected API response structure:", res.data);
        setError("Invalid data format received from the server");
      }
    } catch (error) {
      console.error("❌ Error fetching category analysis data:", error);
      setError("Failed to fetch category analysis data");
    } finally {
      setLoader(false); // Hide loader
    }
  };


  const lineAnalysis = async () => {
    setLoader(true); // Show loader
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/llm/genderxcategory");

      setLine((prevState) => ({
        ...prevState,
        male: res.data.male,
        female: res.data.female,
        html: res.data.response,
        label: res.data.label || ["Groceries", "Home Appliances", "Electronics", "Beauty & Personal Care", "Apparel"]
      }));
    } catch (error) {
      console.error("❌ Error fetching line analysis data:", error);
      setError("Failed to fetch gender analysis data");
    } finally {
      setLoader(false); // Hide loader
    }
  };

  const fetchDeliveryReturnData = async () => {
    setLoader(true); // Show loader
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/llm/deliver");

      if (res.data && res.data.data && res.data.response && res.data.labels) {
        setRadarData({
          values: res.data.data,
          html: res.data.response,
          labels: res.data.labels
        });
      } else {
        console.error("⚠️ Unexpected API response structure:", res.data);
        setError("Invalid data format received from the server");
      }
    } catch (error) {
      console.error("❌ Error fetching delivery return data:", error);
      setError("Failed to fetch delivery and return status data");
    } finally {
      setLoader(false); // Hide loader
    }
  };

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: Month.values,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(53, 162, 235, 0.7)',
        hoverBorderColor: 'rgb(53, 162, 235)',
        hoverBorderWidth: 3,
      },
    ],
  };

  const doughnut = {
    labels: category.label.length > 0 ? category.label : ["Groceries", "Home Appliances", "Electronics", "Beauty & Personal Care", "Apparel"],
    datasets: [
      {
        data: category.values.length > 0 ? category.values : [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  const lineData = {
    labels: line.label.length > 0 ? line.label : ["Groceries", "Home Appliances", "Electronics", "Beauty & Personal Care", "Apparel"],
    datasets: [
      {
        label: 'Male',
        data: line.male,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(75, 192, 192)',
        pointHoverBackgroundColor: 'rgb(75, 192, 192)',
        pointHoverBorderColor: 'white',
      },
      {
        label: 'Female',
        data: line.female,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(255, 99, 132)',
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'white',
      }
    ],
  };

  // Default data as fallback
  const defaultData = {
    labels: [
      "Delivered - Not Returned",
      "Delivered - Returned",
      "Shipped - Not Returned",
      "Shipped - Returned",
      "Pending - Not Returned",
      "Pending - Returned"
    ],
    values: [32, 8, 24, 4, 26, 6]
  };

  // Prepare radar chart data with fallback
  const radarChartData = {
    labels: radarData.labels.length > 0 ? radarData.labels : defaultData.labels,
    datasets: [
      {
        label: 'Delivery & Return Combinations',
        data: radarData.values.length > 0 ? radarData.values : defaultData.values,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
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
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // Format as whole number instead of currency
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        borderWidth: 2,
        backgroundColor: 'white',
        hoverBorderWidth: 3,
        hitRadius: 8
      },
      line: {
        tension: 0.3
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          // Remove currency formatting
          callback: function (value) {
            return value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    radius: '90%'
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          font: {
            size: 10
          }
        },
        pointLabels: {
          font: {
            size: 11
          },
          callback: function (label) {
            // Shortens the labels for better display
            if (label.includes(' - ')) {
              const parts = label.split(' - ');
              return [parts[0], parts[1]];
            }
            return label;
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        angleLines: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `Count: ${value} (${percentage}% of total)`;
          }
        }
      }
    }
  };



  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    setPdfError(''); // Reset error message

    if (file) {
      if (file.type !== 'application/pdf') {
        setPdfError('Please upload only PDF files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
        setPdfError('File size must be less than 5MB');
        return;
      }
      setSelectedPdf(file); // Set the selected PDF file

      // Send a message to the chat indicating the PDF has been uploaded
      setMessages(prev => [
        ...prev,
        {
          type: 'user',
          content: `PDF uploaded: ${file.name}`
        }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages(prev => [...prev, {
        type: 'user',
        content: messageInput
      }]);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: 'I received your message: ' + messageInput
        }]);
      }, 1000);
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Left Sidebar with Data Insights Title */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Data Insights</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Analytics Dashboard</p>
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveChart('monthly');
                monthlyAnalysis();
              }}
              className={`w-full px-4 py-3 text-left rounded-lg transition-colors duration-150 ${activeChart === 'monthly'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Monthly Sales</span>
              </div>
            </button>


            <button
              onClick={() => {
                setActiveChart('categories');
                categoryAnalysis();
              }}
              className={`w-full px-4 py-3 text-left rounded-lg transition-colors duration-150 ${activeChart === 'categories'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <span>Product Categories</span>
              </div>
            </button>


            <button
              onClick={() => {
                setActiveChart('revenue');
                lineAnalysis();
              }}
              className={`w-full px-4 py-3 text-left rounded-lg transition-colors duration-150 ${activeChart === 'revenue'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Gender Analisys</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveChart('growth');
                fetchDeliveryReturnData();
              }}
              className={`w-full px-4 py-3 text-left rounded-lg transition-colors duration-150 ${activeChart === 'growth'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Delivery and Returns</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <SummaryMetrics />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {loader ? (
            <Loader />
          ) : (
            activeChart === "monthly" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Monthly Sales
                </h3>
                <div className="h-[400px]">
                  <Bar data={barData} options={chartOptions} />
                </div>
                {/* Insights Section */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    Key Insights
                  </h4>
                  <div className="space-y-3">
                    <div
              className="p-3 bg-gray-100 dark:bg-gray-300 rounded-lg border-l-4 border-blue-500 shadow-md"
              dangerouslySetInnerHTML={{ __html: Month.html }}
            />
                  </div>
                </div>
              </div>
            )
          )}


          {loader ? (
            <Loader />
          ) : (
            activeChart === 'categories' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-black">Product Categories</h3>
                <div className="h-[400px]">
                  <Doughnut data={doughnut} options={doughnutOptions} />              </div>
                {/* Replace the existing insights section with this simpler version */}
                <div className="mt-6 pt-6 border-t border-gray-200 bg-gray-300/80 p-2 border rounded-lg dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-black">Key Insights</h4>
                  <div className="space-y-3">
                    <div dangerouslySetInnerHTML={{ __html: category.html }} />
                  </div>
                </div>
              </div>
            )
          )}

          {loader ? (
            <Loader />
          ) : (
            activeChart === 'revenue' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Trend</h3>
                <div className="h-[400px]">
                  <Line data={lineData} options={chartOptions} />
                </div>
                {/* Replace the existing insights section with this simpler version */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Key Insights</h4>
                  <div className="space-y-3">
                    <div className='bg-white/80 p-2 border rounded-lg' dangerouslySetInnerHTML={{ __html: line.html }} />
                  </div>
                </div>
              </div>

            )
          )}

          {loader ?(
            <Loader />):(
              activeChart === 'growth' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Customer Growth</h3>
                  <div className="h-[400px]">
                    <Radar data={radarChartData} options={radarOptions} />
                  </div>
                  {/* Replace the existing insights section with this simpler version */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Key Insights</h4>
                    <div className="space-y-3">
                      <div className='border border-white bg-gray-600' dangerouslySetInnerHTML={{ __html: radarData.html }} />
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
      </div>

      {/* Paperclip Button with Circular Menu */}
      <div className="fixed bottom-32 right-6">
        {/* Circular Options */}
        <div className="relative">
          {showFileOptions && fileOptions.map((option, index) => {
            const startAngle = 235 * (Math.PI / 180);
            const endAngle = 170 * (Math.PI / 180);
            const angle = startAngle + (index * ((endAngle - startAngle) / (fileOptions.length - 1)));
            const distance = 80;

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <button
                key={index}
                onClick={() => {
                  if (option.url) {
                    navigate(option.url); // Only navigate if URL exists
                  } else {
                    alert('No URL defined for this option.');
                  }
                }}
                className={`absolute p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg 
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform duration-300 ease-out
                border border-gray-400/60 
                group ${showFileOptions ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                style={{
                  transform: `translate(${x}px, ${y}px) ${showFileOptions ? 'scale(1)' : 'scale(0)'}`,
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {/* Icon */}
                <span className="text-xl">{option.icon}</span>

                {/* Tooltip */}
                <span
                  className={`absolute whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300
                  bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-400/20
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  ${index === 2 ? '-left-20 top-2 z-[60]' : '-top-8'}`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Paperclip Button */}
        <button
          onClick={() => setGiveOptions(!showFileOptions)}
          className={`p-4 relative top-10 bg-green-500 text-white rounded-full shadow-lg 
            hover:bg-green-600 transition-all duration-300 z-50
            transform ${showFileOptions ? ' rotate-45' : ' rotate-0'}`}
        >
          <Paperclip size={24} />
        </button>
      </div>
    </div>
  );
};

export default CustomRetailerDashboard;