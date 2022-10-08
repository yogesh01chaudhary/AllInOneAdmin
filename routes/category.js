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
  deleteServiceForSubCategory2,
  deleteServiceForCategory,
  deleteServiceForSubCategory,
  allServices,
  allSubCategories2,
  allSubCategories,
  allCategories,
  updateCategory,
  updateSubCategory,
  updateSubCategory2,
  updateServiceToCategory,
  updateServiceToSubCategory,
  updateServiceToSubCategory2,
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
router.get("/getAllCategories/:id", auth, isAdmin, getAllCategories);
router.get("/getAllSubCategories/:id", auth, isAdmin, getAllSubCategories);
router.get("/getAllSubCategories2/:id", auth, isAdmin, getAllSubCategories2);
router.get("/getAllCategory", auth, isAdmin, getAllCategory);
router.get(
  "/getCategoryForSubCategory",
  auth,
  isAdmin,
  getCategoryForSubCategory
);
router.get("/getCategoryForService", auth, isAdmin, getCategoryForService);
router.get(
  "/getSubCategoryForSubCategory2/:id",
  auth,
  isAdmin,
  getSubCategoryForSubCategory2
);
router.get(
  "/getSubCategoryForService/:id",
  auth,
  isAdmin,
  getSubCategoryForService
);
router.get(
  "/getSubCategory2ForService/:id/:sid",
  auth,
  isAdmin,
  getSubCategory2ForService
);
router.delete("/category", auth, isAdmin, deleteCategory);
router.delete("/subCategory", auth, isAdmin, deleteSubCategory);
router.delete("/subCategory2", auth, isAdmin, deleteSubCategory2);
router.delete("/serviceCategory", auth, isAdmin, deleteServiceForCategory);
router.delete(
  "/serviceSubCategory",
  auth,
  isAdmin,
  deleteServiceForSubCategory
);
router.delete(
  "/serviceSubCategory2",
  auth,
  isAdmin,
  deleteServiceForSubCategory2
);
router.delete("/allServices", auth, isAdmin, allServices);
router.delete("/allSubCategories2", auth, isAdmin, allSubCategories2);
router.delete("/allSubCategories", auth, isAdmin, allSubCategories);
router.delete("/allCategories", auth, isAdmin, allCategories);
router.put("/category", auth, isAdmin, updateCategory);
router.put("/subCategory", auth, isAdmin, updateSubCategory);
router.put("/subCategory2", auth, isAdmin, updateSubCategory2);
router.put("/serviceCategory", auth, isAdmin, updateServiceToCategory);
router.put("/serviceSubCategory", auth, isAdmin, updateServiceToSubCategory);
router.put("/serviceSubCategory2", auth, isAdmin, updateServiceToSubCategory2);

module.exports = router;
