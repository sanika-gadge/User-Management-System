const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// 1. Create User - POST
// ==================================================
router.post("/", async (req, res) => {
  try {
    console.log("POST request received");
    console.log("MongoDB State:", mongoose.connection.readyState);

    const { name, email, password, age } = req.body;

    const user = new User({
      name,
      email,
      password,
      age,
    });

    const savedUser = await user.save();

    console.log("User saved successfully");

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });

  } catch (error) {
    console.log("SAVE ERROR:", error);

    // Duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    // Other error
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});


// ==================================================
// 2. Get All Users - GET
// ==================================================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      users: users,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});


// ==================================================
// 3. Test Route
// ==================================================
router.get("/test", (req, res) => {
  res.send("User routes are working");
});


// ==================================================
// 4. Login User - POST
// ==================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
    });

  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
});


// ==================================================
// 5. Protected Profile - GET
// ==================================================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Protected profile accessed successfully",
      user: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
});


// ==================================================
// 6. Get User by ID - GET
// ==================================================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
});


// ==================================================
// 7. Update User - PUT
// ==================================================
router.put("/:id", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        age,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {

    // Duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});


// ==================================================
// 8. Delete User - DELETE
// ==================================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(
      req.params.id
    );

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});


module.exports = router;
