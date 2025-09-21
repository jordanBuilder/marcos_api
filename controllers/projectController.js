const project = require("../db/models/project");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;

  const newProject = await project.create({
    createdBy: userId,
    ...body,
  });
  return res.status(201).json({
    status: "success",
    data: newProject,
  });
});

module.exports = {createProject};