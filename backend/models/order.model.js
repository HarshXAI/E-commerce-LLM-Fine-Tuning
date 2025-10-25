import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer_id: String,
    email: String,
    age: Number,
    gender: String,
    location: String,
    product_id: String,
    product_name: String,
    category: String,
    subcategory: String,
    price: Number,
    brand: String,
    shipping_address: String,
    delivery_status: String,
    return_status: String,
    discount_applied: Number,
    product_rating: Number,
    purchase_date: String,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;