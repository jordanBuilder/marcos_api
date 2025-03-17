const users = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
require("dotenv").config({ path: `${process.cwd()}/.env` });

const genereateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("invalid user type", 400);
  }

  console.log("body : ", body);
  const newUser = await users.create({
    ...req.body,
  });
  if (!newUser) {
    return next(new AppError("Failed to create the user", 400));
  }
  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = genereateToken({
    id: result.id,
    email: result.email,
  });

  return res.status(201).json({
    status: "success",
    message: "user created successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  const result = await users.findOne({
    where: { email },
  });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError('Incorrect email or password', 401));

  }
  const token = genereateToken({
    id: result.id,
    email: result.email,
  });
  return res.json({
    status: "success",
    token,
  });
});
module.exports = { signup, login };
