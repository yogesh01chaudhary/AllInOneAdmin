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
  getCategoryForSubCategory,
  getCategoryForService,
  getSubCategoryForSubCategory2,
  getSubCategoryForService,
  getSubCategory2ForService,
  deleteCategory,
  deleteSubCategory2,
  deleteSubCategory,
  deleteService,
  updateCategory,
  updateSubCategory,
  updateSubCategory2,
  updateService,
  deleteServiceForSubCategory2,
  deleteServiceForCategory,
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
router.get(
  "/getCategoryForSubCategory",
  auth,
  isAdmin,
  getCategoryForSubCategory
);
router.get("/getCategoryForService", auth, isAdmin, getCategoryForService);
router.get(
  "/getSubCategoryForSubCategory2",
  auth,
  isAdmin,
  getSubCategoryForSubCategory2
);
router.get(
  "/getSubCategoryForService",
  auth,
  isAdmin,
  getSubCategoryForService
);
router.get(
  "/getSubCategory2ForService",
  auth,
  isAdmin,
  getSubCategory2ForService
);
router.delete("/category", auth, isAdmin, deleteCategory);
router.delete("/subCategory", auth, isAdmin, deleteSubCategory);
router.delete("/subCategory2", auth, isAdmin, deleteSubCategory2);
router.delete("/serviceCategory", auth, isAdmin, deleteServiceForCategory);
router.delete("/serviceSubCategory", auth, isAdmin, deleteServiceForSubCategory2);
router.delete("/serviceSubCategory2", auth, isAdmin, deleteServiceForSubCategory2);
router.put("/category", auth, isAdmin, updateCategory);
router.put("/subCategory", auth, isAdmin, updateSubCategory);
router.put("/subCategory2", auth, isAdmin, updateSubCategory2);
router.put("/service", auth, isAdmin, updateService);

module.exports = router;
