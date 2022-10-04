const express = require("express");
const {
  addCategory,
  addSubCategory,
  addSubCategory2,
  addServiceToSubCategory2,
  addServiceToSubCategory,
  addServiceToCategory,
  createTest,
  findTest,
  getAllCategories,
  getAllSubCategories,
  getAllSubCategories2,
  getAllCategory,
} = require("../controllers/category");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();
router.post("/createTest", auth, isAdmin, createTest);
router.post("/findtest", auth, isAdmin, findTest);
router.post("/addCategory", auth, isAdmin, addCategory);
router.post("/addSubCategory", auth, isAdmin, addSubCategory);
router.post("/addSubCategory2", auth, isAdmin, addSubCategory2);
router.post("/addServiceToCategory", auth, isAdmin, addServiceToCategory);
router.post("/addServiceToSubCategory", auth, isAdmin, addServiceToSubCategory);
router.post(
  "/addServiceToSubCategory2",
  auth,
  isAdmin,
  addServiceToSubCategory2
);
router.get("/getAllCategories", auth, isAdmin, getAllCategories);
router.get("/getAllSubCategories", auth, isAdmin, getAllSubCategories);
router.get("/getAllSubCategories2", auth, isAdmin, getAllSubCategories2);
router.get("/getAllCategory", auth, isAdmin, getAllCategory);

module.exports = router;
