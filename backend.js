const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // يخدم كل ملفات html + images

/* ================= MONGODB ================= */
mongoose.connect("mongodb+srv://sara14sara2005_db_user:sarrasarra@cluster0.bf9frcj.mongodb.net/project_takharoj")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

/* ================= ORDER ================= */
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

app.post("/order", async (req, res) => {
    try {
        const data = req.body;

        let total = 0;

        if (Array.isArray(data.cart)) {
            data.cart.forEach(item => {
                total += item.price || 0;
            });
        }

        const newOrder = new Order({
            name: data.name || "",
            phone: data.phone || "",
            wilaya: data.wilaya || "",
            delivery: data.delivery || "",
            cart: data.cart || [],
            total
        });

        await newOrder.save();

        res.json({ success: true });

    } catch (err) {
        console.log("ORDER ERROR ❌", err);
        res.status(500).json({ success: false });
    }
});

/* ================= ARTISAN ================= */
const artisanSchema = new mongoose.Schema({
    name: String,
    email: String,
    artisanName: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const ArtisanMessage = mongoose.model("ArtisanMessage", artisanSchema);

app.post("/contact-artisan", async (req, res) => {
    try {
        const data = req.body;

        const newMsg = new ArtisanMessage({
            name: data.name,
            email: data.email,
            artisanName: data.artisanName,
            message: data.message
        });

        await newMsg.save();

        console.log("ARTISAN MESSAGE SAVED ✅");

        res.json({ success: true });

    } catch (err) {
        console.log("ARTISAN ERROR ❌", err);
        res.status(500).json({ success: false });
    }
});

/* ================= GET ORDERS ================= */
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= HOME PAGE ================= */
app.get("/", (req, res) => {
    res.send("SERVER WORKING ✅");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running 🚀 on port " + PORT);
});