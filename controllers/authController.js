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
    return next(new AppError("Incorrect email or password", 401));
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

const authentication = catchAsync(async (req, res, next) => {
  //1 get the token from headers
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // ex: Bearer tokenString.....
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }
  //2 token verification
  const tokenDetails = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  //3 get the user detail from db and add to req object
  const freshUser = await users.findByPk(tokenDetails.id);
  if (!freshUser) {
    return next(new AppError("User no longer exists", 400));
  }
  req.user = freshUser;
  return next();
});


const restrictedTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action ", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

module.exports = { signup, login, authentication, restrictedTo };
