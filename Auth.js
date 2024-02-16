const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token);
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    const { accountType } = req.user;

    if (accountType != "STUDENT") {
      res.status(401).json({
        success: false,
        message: "Yeh Student ke liye hai sir",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    const { accountType } = req.user;

    if (accountType != "Instructor") {
      res.status(401).json({
        success: false,
        message: "Bakchodi Mat Kar Sir hun main",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};
