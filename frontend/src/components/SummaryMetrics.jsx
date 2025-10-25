import React, { useState, useEffect } from 'react';
import { Users, DollarSign, RefreshCw, Star, IndianRupee } from 'lucide-react';
import { motion, animate } from 'framer-motion';
import axios from 'axios';

// Updated Counter component with better speed
const Counter = ({ value, duration = 2.5, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: duration,
      delay: delay,
      ease: [0.32, 0.72, 0, 1], // Custom easing for smoother counting
      onUpdate: (latest) => setDisplayValue(latest),
    });

    return () => controls.stop();
  }, [value, duration, delay]);

  return Math.round(displayValue).toLocaleString();
};

const SummaryMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    averageOrderValue: 0,
    returnRate: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/llm/getSummaryMetrics', {
          signal: controller.signal
        });

        if (isMounted) {
          const formattedData = {
            totalCustomers: Number(response.data.data.totalCustomers),
            averageOrderValue: parseFloat(response.data.data.averageOrderValue),
            returnRate: parseFloat(response.data.data.returnRate),
            averageRating: parseFloat(response.data.data.averageRating),
            totalOrders: Number(response.data.data.totalOrders)
          };

          setMetrics(formattedData);
        }
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          setError('Error connecting to server');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMetrics();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Empty dependency array

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.2,
      rotate: 12,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const numberVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const decorativeCircleVariants = {
    initial: { scale: 1, opacity: 0.5 },
    hover: {
      scale: 1.2,
      opacity: 0.8,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const getGradientByIndex = (index) => {
    const gradients = [
      'from-violet-500/10 via-purple-500/10 to-blue-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-blue-500/20',
      'from-emerald-500/10 via-green-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:via-green-500/20 dark:to-teal-500/20',
      'from-rose-500/10 via-orange-500/10 to-yellow-500/10 dark:from-rose-500/20 dark:via-orange-500/20 dark:to-yellow-500/20',
      'from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-indigo-500/20'
    ];
    return gradients[index];
  };

  const getIconColorByIndex = (index) => {
    const colors = [
      'text-violet-600 dark:text-violet-400',
      'text-emerald-600 dark:text-emerald-400',
      'text-orange-600 dark:text-orange-400',
      'text-blue-600 dark:text-blue-400'
    ];
    return colors[index];
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, delay, format = 'number', index }) => {
    let displayValue;

    if (format === 'currency') {
      displayValue = (
        <>
          ₹<Counter value={value} delay={delay} />
        </>
      );
    } else if (format === 'percentage') {
      displayValue = (
        <>
          <Counter value={value} delay={delay} />%
        </>
      );
    } else if (format === 'rating') {
      displayValue = (
        <>
          <Counter value={value} delay={delay} /> / 5
        </>
      );
    } else {
      displayValue = <Counter value={value} delay={delay} />;
    }

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay }}
        whileHover={{
          scale: 1.02,
          translateY: -8,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 15
          }
        }}
        className={`bg-gradient-to-br ${getGradientByIndex(index)} 
                   backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-8
                   border border-white/20 dark:border-gray-800
                   hover:shadow-2xl transition-all duration-300
                   relative group`}
      >
        {/* Enhanced decorative elements */}
        <motion.div
          variants={decorativeCircleVariants}
          initial="initial"
          whileHover="hover"
          className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"
        />
        <motion.div
          variants={decorativeCircleVariants}
          initial="initial"
          whileHover="hover"
          className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"
        />

        <div className="relative">
          <div className="flex flex-row items-center justify-between mb-6">
            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="text-base font-semibold text-gray-700 dark:text-gray-200 
                       group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
            >
              {title}
            </motion.h3>
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className={`p-3 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg
                         backdrop-blur-md group-hover:shadow-xl transition-all duration-300`}
            >
              <Icon className={`h-6 w-6 ${getIconColorByIndex(index)}`} />
            </motion.div>
          </div>
          <motion.p
            variants={numberVariants}
            initial="initial"
            whileHover="hover"
            className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {displayValue}
          </motion.p>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-sm text-gray-600 dark:text-gray-300 font-medium
                    group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors"
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent
                     shadow-lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 p-6 bg-red-100/80 dark:bg-red-900/20 rounded-xl backdrop-blur-md
                   border border-red-200 dark:border-red-800"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Customers"
          value={metrics.totalCustomers}
          subtitle="Unique customer count"
          icon={Users}
          delay={0}
          index={0}
        />

        <MetricCard
          title="Avg. Order Value"
          value={metrics.averageOrderValue}
          subtitle="Per order average"
          icon={IndianRupee}
          delay={0.2}
          format="currency"
          index={1}
        />

        <MetricCard
          title="Return Rate"
          value={metrics.returnRate}
          subtitle="Of total orders"
          icon={RefreshCw}
          delay={0.4}
          format="percentage"
          index={2}
        />

        <MetricCard
          title="Avg. Rating"
          value={metrics.averageRating}
          subtitle="Customer satisfaction"
          icon={Star}
          delay={0.6}
          format="rating"
          index={3}
        />
      </div>
    </div>
  );
};

export default React.memo(SummaryMetrics);