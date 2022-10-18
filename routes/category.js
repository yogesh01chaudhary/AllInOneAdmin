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
  addSilver,
  getServices,
  getService,
  updateVendorSilver,
  updateVendorGold,
  updateVendorPlatinum,
  rateSilver,
  rateGold,
  ratePlatinum,
  updateRateSilver,
  updateRateGold,
  updateRatePlatinum,
  getAllServicesForSubCategories2,
  getAllServicesForCategories,
  getAllServicesForSubCategories,
  updateService,
  getSubCategoryData,
  getSubCategory2Data,
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
router.get(
  "/getAllServicesForCategories/:id",
  auth,
  isAdmin,
  getAllServicesForCategories
);
router.get(
  "/getAllServicesForSubCategories/:id",
  auth,
  isAdmin,
  getAllServicesForSubCategories
);
router.get(
  "/getAllServicesForSubCategories2/:id",
  auth,
  isAdmin,
  getAllServicesForSubCategories2
);
router.get("/getAllCategories", auth, isAdmin, getAllCategories);
router.get("/getAllSubCategories/", auth, isAdmin, getAllSubCategories);
router.get("/getAllSubCategories2/", auth, isAdmin, getAllSubCategories2);
router.get("/getSubCategoryData/:id", auth, isAdmin, getSubCategoryData);
router.get("/getSubCategory2Data/:id", auth, isAdmin, getSubCategory2Data);

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
router.put("/service", auth, isAdmin, updateService);

//addPriceWithVendorByAdmin
router.put("/silver", auth, isAdmin, updateVendorSilver);
router.put("/gold", auth, isAdmin, updateVendorGold);
router.put("/platinum", auth, isAdmin, updateVendorPlatinum);
router.get("/services", auth, isAdmin, getServices);
router.get("/service", auth, isAdmin, getService);

//user rate service
router.post("/rateSilver", rateSilver);
router.post("/rateGold", rateGold);
router.post("/ratePlatinum", ratePlatinum);
router.put("/rateSilver", updateRateSilver);
router.put("/rateGold", updateRateGold);
router.put("/ratePlatinum", updateRatePlatinum);

module.exports = router;
