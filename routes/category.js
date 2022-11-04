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
  s3UrlCategory,
  updateImageUrlCategory,
  imageUrlCategory,
  deleteImageUrlCategory,
  s3UrlSubCategory,
  updateImageUrlSubCategory,
  imageUrlSubCategory,
  deleteImageUrlSubCategory,
  s3UrlSubCategory2,
  updateImageUrlSubCategory2,
  imageUrlSubCategory2,
  deleteImageUrlSubCategory2,
  s3UrlService,
  updateImageUrlService,
  imageUrlService,
  deleteImageUrlService,
} = require("../controllers/category");

const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

// ********************************************test******************************************************************************//
router.post("/createTest", auth, isAdmin, createTest);
router.post("/findtest", auth, isAdmin, findTest);

// ********************************************category******************************************************************************//
router.post("/addCategory", auth, isAdmin, addCategory);
router.get("/s3Url/category/:id",auth,isAdmin,s3UrlCategory)
router.put("/imageUrl/category",auth,isAdmin,updateImageUrlCategory)
router.get("/imageUrl/category/:id",auth,isAdmin,imageUrlCategory)
router.delete("/imageUrl/category",auth,isAdmin,deleteImageUrlCategory)

// ********************************************subCategory******************************************************************************//
router.post("/addSubCategory", auth, isAdmin, addSubCategory);
router.get("/s3Url/subCategory/:id",auth,isAdmin,s3UrlSubCategory)
router.put("/imageUrl/subCategory",auth,isAdmin,updateImageUrlSubCategory)
router.get("/imageUrl/subCategory/:id",auth,isAdmin,imageUrlSubCategory)
router.delete("/imageUrl/subCategory",auth,isAdmin,deleteImageUrlSubCategory)

// ********************************************subCategory2******************************************************************************//
router.post("/addSubCategory2", auth, isAdmin, addSubCategory2);
router.get("/s3Url/subCategory2/:id",auth,isAdmin,s3UrlSubCategory2)
router.put("/imageUrl/subCategory2",auth,isAdmin,updateImageUrlSubCategory2)
router.get("/imageUrl/subCategory2/:id",auth,isAdmin,imageUrlSubCategory2)
router.delete("/imageUrl/subCategory2",auth,isAdmin,deleteImageUrlSubCategory2)

// ********************************************service******************************************************************************//
router.post("/addServiceToCategory", auth, isAdmin, addServiceToCategory);
router.post("/addServiceToSubCategory", auth, isAdmin, addServiceToSubCategory);
router.post(
  "/addServiceToSubCategory2",
  auth,
  isAdmin,
  addServiceToSubCategory2
);
router.get("/s3Url/service/:id",auth,isAdmin,s3UrlService)
router.put("/imageUrl/service",auth,isAdmin,updateImageUrlService)
router.get("/imageUrl/service/:id",auth,isAdmin,imageUrlService)
router.delete("/imageUrl/service",auth,isAdmin,deleteImageUrlService)

// ********************************************GET_ALL_SERVICES_BY_ID******************************************************************************//
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

// ********************************************GET_ALL******************************************************************************//
router.get("/getAllCategories", auth, isAdmin, getAllCategories);
router.get("/getAllSubCategories/", auth, isAdmin, getAllSubCategories);
router.get("/getAllSubCategories2/", auth, isAdmin, getAllSubCategories2);
router.get("/services", auth, isAdmin, getServices);

// ********************************************GET_BY_ID******************************************************************************//
router.get("/getSubCategoryData/:id", auth, isAdmin, getSubCategoryData);
router.get("/getSubCategory2Data/:id", auth, isAdmin, getSubCategory2Data);
router.get("/service", auth, isAdmin, getService);

// ********************************************GET_DATA_FOR_DROPDOWNS******************************************************************************//
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

// ********************************************DELETE_BY_ID******************************************************************************//
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

// ********************************************DELETE_ALL******************************************************************************//
router.delete("/allServices", auth, isAdmin, allServices);
router.delete("/allSubCategories2", auth, isAdmin, allSubCategories2);
router.delete("/allSubCategories", auth, isAdmin, allSubCategories);
router.delete("/allCategories", auth, isAdmin, allCategories);

// ********************************************UPDATE******************************************************************************//
router.put("/category", auth, isAdmin, updateCategory);
router.put("/subCategory", auth, isAdmin, updateSubCategory);
router.put("/subCategory2", auth, isAdmin, updateSubCategory2);
router.put("/service", auth, isAdmin, updateService);

//addPriceWithVendorByAdmin
router.put("/silver", auth, isAdmin, updateVendorSilver);
router.put("/gold", auth, isAdmin, updateVendorGold);
router.put("/platinum", auth, isAdmin, updateVendorPlatinum);

//user rate service
router.post("/rateSilver", rateSilver);
router.post("/rateGold", rateGold);
router.post("/ratePlatinum", ratePlatinum);
router.put("/rateSilver", updateRateSilver);
router.put("/rateGold", updateRateGold);
router.put("/ratePlatinum", updateRatePlatinum);

module.exports = router;
