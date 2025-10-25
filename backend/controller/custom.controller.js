import Order from "../models/order.model.js"

import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_KEY });

const monthXprice = async (req, res) => {
    try {
      // Fetch only purchase_date and price from all orders in MongoDB
      const orders = await Order.find({}, { purchase_date: 1, price: 1, _id: 0 });
  
      // Check if data exists
      if (!orders || orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No order data found.",
        });
      }
  
      // Initialize an object to store total price for each month
      const monthlyPrices = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      };
  
      // Iterate through orders and sum prices by month
      orders.forEach((order) => {
        if (order.purchase_date && order.price) {
          const monthIndex = new Date(order.purchase_date).getMonth(); // Get month index (0-11)
          const monthNames = Object.keys(monthlyPrices);
          const monthName = monthNames[monthIndex];
          monthlyPrices[monthName] += order.price; // Sum up prices for the corresponding month
        }
      });
  
      // Convert monthly price object into an array of values in order from Jan to Dec
      const priceArray = Object.values(monthlyPrices);
  
      // Convert MongoDB data into the required format for LLM
      const formattedData = orders.map((order) => ({
        purchase_date: order.purchase_date,
        price: order.price,
      }));
  
      // Convert JSON to a properly formatted string for LLM
      const formattedJson = JSON.stringify(formattedData, null, 2);
  
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `You are a data analyst expert. I need you to analyze the following JSON data and generate **brief, data-driven insights** based on the relationship between **purchase_date** and **price**.
                      - Identify **trends** in purchase amounts over time.
                      - Highlight **peak spending periods** or noticeable **drops**.
                      - Detect any **seasonal patterns** or significant fluctuations in pricing.
                      - Provide insights on **high-value vs low-value purchase trends**.
  
                      ### **STRICT RESPONSE GUIDELINES:**  
                      ✅ **Return output strictly in HTML format** for easy rendering.  
                      ❌ **Do NOT include any JavaScript, charts, or CSS styling.**  
                      ❌ **Do NOT add any generic explanations or disclaimers.**  
  
                      Here is the JSON data:
                      \n\`\`\`json\n${formattedJson}\n\`\`\`
  
                      The output should be structured using only **HTML elements (e.g., <h2>, <p>, <ul>, <li>)** and contain **only the insights** related to the given data.
                      `,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 1,
        max_tokens: 1024,
      });
  
      return res.status(200).json({
        success: true,
        response:
          completion.choices[0]?.message?.content || "No response generated",
        data: priceArray, // Array of total prices per month (Jan to Dec)
      });
    } catch (error) {
      console.error("Error during AI chat generation:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

// pie chart
const categoryPie = async (req, res) => {
    try {
        // Fetch only category from all orders in MongoDB
        const orders = await Order.find({}, { category: 1, _id: 0 });

        // Check if data exists
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No category data found.",
            });
        }

        // Create a frequency counter for categories
        const categoryCount = {};

        orders.forEach((order) => {
            if (order.category) {
                categoryCount[order.category] = (categoryCount[order.category] || 0) + 1;
            }
        });

        // Extract category labels and values separately
        const categoryLabels = Object.keys(categoryCount); // Category names
        const categoryValues = Object.values(categoryCount); // Occurrences per category

        // Convert MongoDB data into the required format for LLM
        const formattedData = orders.map((order) => ({
            category: order.category,
        }));

        // Convert JSON to a properly formatted string for LLM
        const formattedJson = JSON.stringify(formattedData, null, 2);

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    "role": "user",
                    "content": `You are a data analyst expert. I need you to analyze the following JSON data and generate **brief, data-driven insights** based on the **category** attribute.
                                        - Identify **top categories** with the highest purchase frequency.
                                        - Highlight **least purchased categories**.
                                        - Provide percentage distribution of categories.
                                        - Detect any notable **patterns or trends** in category preferences.
                  
                                        ### **STRICT RESPONSE GUIDELINES:**  
                                        ✅ **Return output strictly in HTML format** for easy rendering.  
                                        ✅ **Use Tailwind CSS classes in HTML for styling.**  
                                        ✅ **Apply inline styles (e.g., <div style="color: white;">) to ensure readability in a dark-themed UI.**  
                                        ❌ **Do NOT include any JavaScript, charts, or external CSS stylesheets.**  
                                        ❌ **Do NOT add any generic explanations or disclaimers.**  
                  
                                        Here is the JSON data:
                                        \n\`\`\`json\n${formattedJson}\n\`\`\`
                  
                                        The output should be structured using only **HTML elements (e.g., <h2>, <p>, <ul>, <li>)** and contain **only the insights** related to the given data.  
                                        Ensure the text is **readable in a dark-themed UI** by applying **both Tailwind CSS classes and inline styles** where necessary (e.g., light text on a dark background).
                    `
                  }
                  ,
            ],
            model: "llama3-8b-8192",
            temperature: 1,
            max_tokens: 1024,
        });

        return res.status(200).json({
            success: true,
            response:
                completion.choices[0]?.message?.content || "No response generated",
            data: categoryValues,  // Array of category occurrences (count per category)
            label: categoryLabels, // Array of category labels (category names)
        });
    } catch (error) {
        console.error("Error during AI chat generation:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};




// multiline graph
const genderXcategory = async (req, res) => {
    try {
      // Fetch only gender and category from all orders in MongoDB
      const orders = await Order.find({}, { gender: 1, category: 1, _id: 0 });
  
      // Check if data exists
      if (!orders || orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No gender-category data found.",
        });
      }
  
      // Create separate frequency counters for male and female
      const maleCategoryCount = {};
      const femaleCategoryCount = {};
  
      orders.forEach((order) => {
        if (order.gender && order.category) {
          if (order.gender.toLowerCase() === "male") {
            maleCategoryCount[order.category] =
              (maleCategoryCount[order.category] || 0) + 1;
          } else if (order.gender.toLowerCase() === "female") {
            femaleCategoryCount[order.category] =
              (femaleCategoryCount[order.category] || 0) + 1;
          }
        }
      });
  
      // Extract unique categories (ensuring both arrays have the same category order)
      const uniqueCategories = [
        ...new Set([
          ...Object.keys(maleCategoryCount),
          ...Object.keys(femaleCategoryCount),
        ]),
      ];
  
      // Create arrays for male and female category counts in the same order as uniqueCategories
      const maleArray = uniqueCategories.map(
        (category) => maleCategoryCount[category] || 0
      );
      const femaleArray = uniqueCategories.map(
        (category) => femaleCategoryCount[category] || 0
      );
  
      // Convert MongoDB data into the required format for LLM
      const formattedData = orders.map((order) => ({
        gender: order.gender,
        category: order.category,
      }));
  
      // Convert JSON to a properly formatted string for LLM
      const formattedJson = JSON.stringify(formattedData, null, 2);
  
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `You are a data analyst expert. I need you to analyze the following JSON data and generate **brief, data-driven insights** based on the relationship between **gender and category**.
                      - Identify **which categories are more popular among males vs females**.
                      - Highlight **top categories for each gender**.
                      - Detect any notable **purchase trends based on gender**.
                      
                      ### **STRICT RESPONSE GUIDELINES:**  
                      ✅ **Return output strictly in HTML format** for easy rendering.  
                      ✅ **Use Tailwind CSS classes in HTML for styling.**  
                      ✅ **Apply inline styles (e.g., <div style="color: white;">) to ensure readability in a dark-themed UI.**  
                      ❌ **Do NOT include any JavaScript, charts, or external CSS stylesheets.**  
                      ❌ **Do NOT add any generic explanations or disclaimers.**  
  
                      Here is the JSON data:
                      \n\`\`\`json\n${formattedJson}\n\`\`\`
  
                      The output should be structured using only **HTML elements (e.g., <h2>, <p>, <ul>, <li>)** and contain **only the insights** related to the given data.  
                      Ensure the text is **readable in a dark-themed UI** by applying **both Tailwind CSS classes and inline styles** where necessary (e.g., light text on a dark background).
            `,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 1,
        max_tokens: 1024,
      });
  
      return res.status(200).json({
        success: true,
        response:
          completion.choices[0]?.message?.content || "No response generated",
        male: maleArray, // Array of male category counts
        female: femaleArray, // Array of female category counts
        label: uniqueCategories, // Array of category labels
      });
    } catch (error) {
      console.error("Error during AI chat generation:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };


  const deliveryVsReturnStatus = async (req, res) => {
    try {
        // Fetch only delivery_status and return_status from all orders in MongoDB
        const orders = await Order.find({}, { delivery_status: 1, return_status: 1, _id: 0 });

        // Check if data exists
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No delivery or return status data found.",
            });
        }

        // Create a frequency counter for delivery_status and return_status combinations
        const statusCount = {
            "Delivered - Not Returned": 0,
            "Delivered - Returned": 0,
            "Shipped - Not Returned": 0,
            "Shipped - Returned": 0,
            "Pending - Not Returned": 0,
            "Pending - Returned": 0,
        };

        orders.forEach((order) => {
            if (order.delivery_status && order.return_status) {
                const statusKey = `${order.delivery_status} - ${order.return_status}`;
                if (statusCount[statusKey] !== undefined) {
                    statusCount[statusKey]++;
                }
            }
        });

        // Extract the status combinations and their counts separately
        const statusCombinations = Object.keys(statusCount); // "Delivered - Not Returned", etc.
        const statusValues = Object.values(statusCount); // Occurrences per combination

        // Convert MongoDB data into the required format for LLM
        const formattedData = orders.map((order) => ({
            delivery_status: order.delivery_status,
            return_status: order.return_status,
        }));

        // Convert JSON to a properly formatted string for LLM
        const formattedJson = JSON.stringify(formattedData, null, 2);

        // Pass the formatted data to the AI model for analysis
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `You are a data analyst expert. I need you to analyze the following JSON data and generate **brief, data-driven insights** based on the relationship between **delivery_status** and **return_status**.
                              - Identify the most common **delivery and return status combinations**.
                              - Highlight any notable **trends or correlations** between the two statuses.
                              - Provide **percentages or ratios** for the various status combinations.
                              
                              ### **STRICT RESPONSE GUIDELINES:**  
                              ✅ **Return output strictly in HTML format** for easy rendering.  
                              ✅ **Use Tailwind CSS classes in HTML for styling.**  
                              ✅ **Apply inline styles (e.g., <div style="color: white;">) to ensure readability in a dark-themed UI.**  
                              ❌ **Do NOT include any JavaScript, charts, or external CSS stylesheets.**  
                              ❌ **Do NOT add any generic explanations or disclaimers.**  
                              
                              Here is the JSON data:
                              \n\`\`\`json\n${formattedJson}\n\`\`\`
                              
                              The output should be structured using only **HTML elements (e.g., <h2>, <p>, <ul>, <li>)** and contain **only the insights** related to the given data.  
                              Ensure the text is **readable in a dark-themed UI** by applying **both Tailwind CSS classes and inline styles** where necessary (e.g., light text on a dark background).
                    `,
                },
            ],
            model: "llama3-8b-8192",
            temperature: 1,
            max_tokens: 1024,
        });

        // Respond with the data and insights to the frontend
        return res.status(200).json({
            success: true,
            response:
                completion.choices[0]?.message?.content || "No response generated",
            data: statusValues,  // Array of status combinations count
            labels: statusCombinations, // Array of status combinations labels
        });
    } catch (error) {
        console.error("Error during AI chat generation:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
  

const getSummaryMetrics = async (req, res) => {
  try {
    // Fetch all orders and relevant fields
    const orders = await Order.find({}, { 
      customer_id: 1, 
      price: 1, 
      return_status: 1, 
      product_rating: 1 // Correct field name
    });

    // Check if data exists
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No order data found.",
      });
    }

    // Calculate Total Customers (unique customer_ids)
    const uniqueCustomers = new Set();
    orders.forEach(order => {
      if (order.customer_id) {
        uniqueCustomers.add(order.customer_id);
      }
    });
    const totalCustomers = uniqueCustomers.size;

    // Calculate Average Order Value
    let totalOrderValue = 0;
    orders.forEach(order => {
      if (order.price) {
        totalOrderValue += order.price;
      }
    });
    const averageOrderValue = orders.length > 0 ? 
      (totalOrderValue / orders.length).toFixed(2) : 0;

    // Calculate Return Rate
    let returnedOrders = 0;
    orders.forEach(order => {
      if (order.return_status === "Returned") {
        returnedOrders++;
      }
    });
    const returnRate = orders.length > 0 ? 
      ((returnedOrders / orders.length) * 100).toFixed(2) : 0;

    // Calculate Average Rating
    let totalRating = 0;
    let ratedOrders = 0;
    orders.forEach(order => {
      if (order.product_rating) { // Use correct field name
        totalRating += order.product_rating;
        ratedOrders++;
      }
    });

    const averageRating = ratedOrders > 0 ? 
      (totalRating / ratedOrders).toFixed(1) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        averageOrderValue,
        returnRate,
        averageRating,
        totalOrders: orders.length
      }
    });
  } catch (error) {
    console.error("Error during summary metrics generation:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



export { monthXprice, categoryPie, genderXcategory, deliveryVsReturnStatus , getSummaryMetrics  };
