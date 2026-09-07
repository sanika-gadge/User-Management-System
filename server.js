const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("User Management System API is Running");
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    console.log("Database Name:", mongoose.connection.name);
    console.log("Database Host:", mongoose.connection.host);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });
