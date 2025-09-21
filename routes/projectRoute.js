const { response } = require("express");
const { authentication, restrictedTo } = require("../controllers/authController");
const { createProject } = require("../controllers/projectController");

const router = require("express").Router();

router.route("/").post(authentication, restrictedTo('1'), createProject);

module.exports = router;
