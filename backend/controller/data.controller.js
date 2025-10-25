import Order from "../models/order.model.js"; // Ensure correct path

const indianNames = [
  "Amit Sharma", "Priya Patel", "Rajesh Kumar", "Neha Verma", "Suresh Reddy",
  "Ananya Iyer", "Vikram Singh", "Pooja Thakur", "Ravi Joshi", "Meera Nair"
];

const imgdata = async (req, res) => {
    try {
        const { rows } = req.body;
        // // Get the last customer_id from DB
        const lastOrder = await Order.findOne().sort({ customer_id: -1 });        
        let lastCustomerId = lastOrder ? parseInt(lastOrder.customer_id.replace("CUST", "")) : 0;
            console.log(lastCustomerId);
            
        const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"];
        const categories = {
            "Electronics": ["Smartphone", "Laptop", "Smartwatch", "Headphones", "Tablet"],
            "Apparel": ["T-Shirt", "Jeans", "Saree", "Kurta", "Jacket"],
            "Home Appliances": ["Microwave", "Refrigerator", "Washing Machine", "Mixer Grinder", "Air Conditioner"],
            "Beauty & Personal Care": ["Face Cream", "Shampoo", "Lipstick", "Perfume", "Hair Dryer"],
            "Groceries": ["Basmati Rice", "Wheat Flour", "Cooking Oil", "Turmeric Powder", "Tea Powder"],
        };

        const brands = {
            "Electronics": ["Samsung", "Apple", "Xiaomi", "OnePlus", "Sony"],
            "Apparel": ["Nike", "Adidas", "Puma", "Raymond", "FabIndia"],
            "Home Appliances": ["LG", "Samsung", "Whirlpool", "Bosch", "Philips"],
            "Beauty & Personal Care": ["Lakme", "Nivea", "Dove", "L'Oreal", "Himalaya"],
            "Groceries": ["India Gate", "Aashirvaad", "Fortune", "Tata", "Brooke Bond"],
        };

        const statuses = ["Pending", "Shipped", "Delivered"];
        const data = [];

        for (let i = 1; i <= rows; i++) {
            lastCustomerId++; // Increment ID sequentially
            const category = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
            const subcategory = categories[category][Math.floor(Math.random() * categories[category].length)];
            const brand = brands[category][Math.floor(Math.random() * brands[category].length)];
            const name = indianNames[Math.floor(Math.random() * indianNames.length)]; // Select a random Indian name

            data.push({
                customer_id: `CUST${lastCustomerId.toString().padStart(3, '0')}`,
                email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
                age: Math.floor(Math.random() * (60 - 18 + 1)) + 18,
                gender: Math.random() < 0.5 ? "Male" : "Female",
                location: locations[Math.floor(Math.random() * locations.length)],
                product_id: `PROD${i.toString().padStart(3, '0')}`,
                product_name: `${brand} ${subcategory}`,
                category: category,
                subcategory: subcategory,
                price: Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000,
                brand: brand,
                shipping_address: `${Math.floor(Math.random() * 1000)} Main St, ${locations[Math.floor(Math.random() * locations.length)]}`,
                purchase_date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28 + 1))
                    .toISOString().split('T')[0],
                delivery_status: statuses[Math.floor(Math.random() * statuses.length)],
                return_status: Math.random() < 0.1 ? "Returned" : "Not Returned",
                discount_applied: [0, 10, 20][Math.floor(Math.random() * 3)],
                product_rating: Number((Math.random() * (5 - 1) + 1).toFixed(1))
            });
        }

        // Insert generated data into MongoDB
        await Order.insertMany(data);

        res.status(200).json({ message: `${rows} Records Inserted Successfully!` });
    } catch (error) {
        console.error("Error generating data:", error);
        res.status(500).json({ message: "Error inserting data" });
    }
};


const insertManyData = async (req, res) => {
    try {
      const { data } = req.body;
  
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: "Invalid or empty data provided." });
      }
  
      // Insert data into MongoDB using insertMany
      const insertedDocs = await Order.insertMany(data);
  
      res.status(201).json({
        message: "Data inserted successfully",
        insertedCount: insertedDocs.length,
        insertedIds: insertedDocs.map((doc) => doc._id),
      });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Failed to insert data" });
    }
  };


export  {imgdata, insertManyData};
