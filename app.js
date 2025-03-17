require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");

const app = express();

app.use(express.json());

const authRouter = require("./routes/authRoute");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// all routes will be here

app.use("/api/v1/auth", authRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    /* We can call next() without an argument in order to call the next middleware but if you pass any error object it will call the error handler*/
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 3000;
app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running ", PORT);
});
