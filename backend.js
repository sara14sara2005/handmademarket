const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // 👈 خليها هنا فقط مرة وحدة

/* 🔗 MongoDB connection */
mongoose.connect("mongodb+srv://sara14sara2005_db_user:sarrasarra@cluster0.bf9frcj.mongodb.net/project_takharoj")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

/* 📦 Schema */
const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    wilaya: String,
    delivery: String,
    cart: Array,
    total: Number,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

/* 🟢 ORDER */
app.post("/order", async (req, res) => {
    try {
        const data = req.body;

        let total = 0;
        data.cart.forEach(item => total += item.price);

        const newOrder = new Order({
            name: data.name,
            phone: data.phone,
            wilaya: data.wilaya,
            delivery: data.delivery,
            cart: data.cart,
            total
        });

        await newOrder.save();

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

/* 📊 GET ORDERS */
app.get("/orders", async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

/* 🏠 ROOT */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* 🚀 START */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT + " 🚀");
});