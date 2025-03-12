const users = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: `${process.cwd()}/.env` });

const genereateToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const signup = async (req, res, next) => {
  const body = req.body;
  if (!["1", "2"].includes(body.userType)) {
    return res.status(400).json({
      status: "fail",
      message: "invalid user Type"
    });
  }

  console.log("body : ", body);
  const newUser = await users.create({
    ...req.body
  });
  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = genereateToken({
    id: result.id,
    email: result.email
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      message: "failed to create the user"
    });
  }
  return res.status(201).json({
    status: "success",
    message: "user created successfully",
    data: result
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "email and password are required"
    });
  }
  const result = await users.findOne({
    where: { email }
  });

  if (!result || await !bcrypt.compareSync(password, result.password)) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password"
    });
  }
  const token = genereateToken({
    id: result.id,
    email: result.email
  });
  return res.json({
    status: "success",
    token
  });
};
module.exports = { signup,login };
