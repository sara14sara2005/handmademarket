const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔗 MongoDB connection */
mongoose.connect("mongodb+srv://sara14sara2005_db_user:sarrasarra@cluster0.bf9frcj.mongodb.net/project_takharoj")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

/* 📦 Order Schema */
const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    wilaya: String,
    delivery: String,
    cart: Array,
    total: Number,
    createdAt: { type: Date, default: Date.now }
});

/* 📦 Model */
const Order = mongoose.model("Order", orderSchema);

/* 🟢 POST - Save Order */
app.post("/order", async (req, res) => {
    try {
        const data = req.body;

        console.log("ORDER RECEIVED:", data);

        let total = 0;
        data.cart.forEach(item => {
            total += item.price;
        });

        const newOrder = new Order({
            name: data.name,
            phone: data.phone,
            wilaya: data.wilaya,
            delivery: data.delivery,
            cart: data.cart,
            total: total
        });

        await newOrder.save();

        console.log("SAVED IN DB ✅");

        res.json({ success: true });

    } catch (err) {
        console.log("ERROR:", err);
        res.json({ success: false });
    }
});

/* 📊 GET - Show All Orders */
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const path = require("path");

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "projet.html"));
});

/* 🏁 Start Server */
app.listen(3000, () => {
    console.log("Server running on port 3000 🚀");
});
