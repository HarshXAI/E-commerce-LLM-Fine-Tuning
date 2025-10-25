import React from 'react';
import { Upload, BarChart, MessageCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';


const AnalyticsSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" className="w-full h-full">
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="480" height="360" rx="12" fill="#1f2937" className="dark:fill-gray-800" />

      {/* Document Icon */}
      <g transform="translate(80, 60)" filter="url(#shadow)">
        <rect width="120" height="150" rx="8" fill="white" className="dark:fill-gray-700" />
        <rect x="20" y="25" width="80" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />
        <rect x="20" y="45" width="80" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />
        <rect x="20" y="65" width="60" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />
        <rect x="20" y="85" width="80" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />
        <rect x="20" y="105" width="40" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />

        {/* CSV Label */}
        <rect x="35" y="140" width="50" height="20" rx="4" fill="#3b82f6" />
        <text x="60" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">.CSV</text>
      </g>

      {/* Arrow Animation */}
      <path
        d="M210 105 L260 105"
        stroke="#3b82f6"
        strokeWidth="4"
        strokeDasharray="10,5"
        className="animate-[dash_3s_linear_infinite]"
      />
      <polygon points="265,105 255,100 255,110" fill="#3b82f6" className="animate-[pulse_3s_infinite]" />

      {/* Analytics Dashboard */}
      <g transform="translate(270, 40)" filter="url(#shadow)">
        <rect width="160" height="200" rx="8" fill="white" className="dark:fill-gray-700" />

        {/* Header */}
        <rect x="10" y="10" width="140" height="30" rx="4" fill="#f1f5f9" className="dark:fill-gray-600" />
        <text x="80" y="30" textAnchor="middle" fill="#475569" fontSize="14" fontWeight="bold" className="dark:fill-gray-300">Dashboard</text>

        {/* Chart 1 - Bar chart */}
        <rect x="15" y="50" width="130" height="60" rx="4" fill="#f8fafc" className="dark:fill-gray-800" />
        <rect x="25" y="90" width="15" height="15" rx="2" fill="url(#gradient1)" className="animate-[pulse_2s_infinite]" />
        <rect x="50" y="80" width="15" height="25" rx="2" fill="url(#gradient1)" className="animate-[pulse_2.2s_infinite]" />
        <rect x="75" y="70" width="15" height="35" rx="2" fill="url(#gradient1)" className="animate-[pulse_2.4s_infinite]" />
        <rect x="100" y="60" width="15" height="45" rx="2" fill="url(#gradient1)" className="animate-[pulse_2.6s_infinite]" />

        {/* Chart 2 - Line chart */}
        <rect x="15" y="120" width="130" height="60" rx="4" fill="#f8fafc" className="dark:fill-gray-800" />
        <path
          d="M25 160 Q40 140, 55 155 Q70 170, 85 145 Q100 120, 115 140 Q130 160, 145 150"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Floating Elements - Data points */}
      <circle cx="160" cy="50" r="6" fill="#3b82f6" className="animate-[ping_3s_infinite]" opacity="0.8" />
      <circle cx="320" cy="30" r="4" fill="#06b6d4" className="animate-[ping_2.5s_infinite]" opacity="0.7" />
      <circle cx="100" cy="250" r="5" fill="#4f46e5" className="animate-[ping_4s_infinite]" opacity="0.7" />
      <circle cx="370" cy="280" r="7" fill="#3b82f6" className="animate-[ping_3.5s_infinite]" opacity="0.8" />
      <circle cx="220" cy="300" r="4" fill="#06b6d4" className="animate-[ping_3s_infinite]" opacity="0.7" />

      {/* Connection Lines */}
      <path
        d="M140 125 C 100 180, 160 220, 120 260"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        className="dark:stroke-gray-600"
      />
      <path
        d="M340 125 C 380 180, 310 220, 360 260"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        className="dark:stroke-gray-600"
      />
    </svg>
  );
};

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg- dark:from-gray-900 dark:to-gray-800 pt-16 pb-24">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/5 left-1/4 w-48 h-48 bg-indigo-500 opacity-30 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-indigo-400 opacity-40 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/15 w-96 h-96 bg-indigo-300 opacity-50 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 left-1/8 w-56 h-56 bg-indigo-600 opacity-25 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/5 right-1/4 w-64 h-64 bg-indigo-200 opacity-60 blur-3xl rounded-full animate-pulse"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Transform Your</span>
              <span className="block text-blue-600 dark:text-blue-400">E-Commerce Data</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Upload your CSV data and get instant insights. Our AI-powered platform analyzes your e-commerce data and provides actionable recommendations.
            </p>
            <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>

              </div>

            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden backdrop-blur-sm bg-opacity-70 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700 p-2">
                <AnalyticsSVG />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const FeaturesSection = () => {
  const features = [
    {
      icon: <Upload size={24} />,
      title: "Easy Data Upload",
      description: "Simply upload your CSV files and our platform handles the rest"
    },
    {
      icon: <BarChart size={24} />,
      title: "Advanced Analytics",
      description: "Get deep insights into your e-commerce performance with AI-powered analysis"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "AI Chatbot",
      description: "Query your data naturally with our conversational AI assistant"
    }
  ];

  return (
    <div id="features" className="py-16 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Features that empower your business
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Our platform provides everything you need to understand and optimize your e-commerce performance.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="relative p-6  dark:bg-gray-800 rounded-xl shadow-md backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Your Data",
      description: "Upload your e-commerce CSV data securely to our platform."
    },
    {
      number: "02",
      title: "Automated Analysis",
      description: "Our AI analyzes your data to find patterns and insights."
    },
    {
      number: "03",
      title: "Get Actionable Insights",
      description: "Review visualizations and recommendations for your business."
    },
    {
      number: "04",
      title: "Query with AI Chatbot",
      description: "Ask questions about your data in natural language."
    }
  ];

  return (
    <div id="how-it-works" className="py-16 dark:bg-gray-900">
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 pt-16 pb-24">
        {/* Background Spheres */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/5 left-1/4 w-48 h-48 bg-indigo-500 opacity-30 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-indigo-400 opacity-40 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/15 w-96 h-96 bg-indigo-300 opacity-50 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 left-1/8 w-56 h-56 bg-indigo-600 opacity-25 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/5 right-1/4 w-64 h-64 bg-indigo-200 opacity-60 blur-3xl rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              Four simple steps to transform your e-commerce data into actionable insights.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-200 dark:border-gray-700">
                <div className="absolute -top-4 -left-4 bg-indigo-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">{step.title}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

};

const CTASection = () => {
  return (
    <div className=" dark:bg-indigo-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to dive deeper?</span>
          <span className="block text-indigo-200">Start your free trial today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Get started
              <ChevronRight size={16} className="ml-2" />
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  // Add useEffect to ensure dark mode is applied
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    // Change the wrapper div to force dark mode styles
    <div className="bg-gray-900 text-white">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};

export default Landing;
