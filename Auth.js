const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }
    const user = await User.findOne({ email });

    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      return res.status(200).json({
        success: true,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

exports.InstructorDash = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Welcome To Instuctor Section",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong. Please try again.",
    });
  }
};

exports.StudentDash = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Welcome To Student Section",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong. Please try again.",
    });
  }
};
