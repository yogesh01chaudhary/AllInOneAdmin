const Test = require("../models/test");
const Joi = require("joi");
const { Category } = require("../models/category");
const { SubCategory } = require("../models/sub-category");
const { SubCategory2 } = require("../models/sub-category2");
const { Service } = require("../models/services");
const { findOne } = require("../models/user");

exports.createTest = async (req, res) => {
  const { body } = req;
  const test = new Test(body);
  test
    .save()
    .then((result) => {
      console.log({ result });
      return res
        .status(200)
        .send({ success: true, message: "Test Created Sccessfully", result });
    })
    .catch((e) => {
      console.log({ e: e.name });
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        error: e.name,
      });
    });
};

exports.findTest = async (req, res) => {
  try {
    const { id } = req.body;
    let test = await Test.findById(id).populate("vendor");
    if (!test) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Data Fetched", test });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { body } = req;

    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        subCategory: Joi.string(),
        service: Joi.string(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let category = await Category.findOne({ name: body.name });
    if (category) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
        category,
      });
    }
    category = new Category({
      name: body.name,
      image: body.image,
    });

    category = await category.save();
    if (!category) {
      return res
        .status(400)
        .send({ success: false, message: "Category creation failed" });
    }
    return res.status(200).send({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.addSubCategory = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        subCategory: Joi.string(),
        service: Joi.string(),
        categoryId: Joi.string().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let category = await Category.findById(body.categoryId);
    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Category doesn't exist" });
    }
    if (category.service.length !== 0) {
      return res.status(500).send({
        success: false,
        message: "Can not add subCategory, service already defined",
      });
    }
    let subCategory = await SubCategory.findOne({ name: body.name });
    if (subCategory) {
      return res.status(409).send({
        success: false,
        message: "subCategory Already Exists",
        subCategory,
        category,
      });
    }
    subCategory = new SubCategory({
      name: body.name,
      image: body.image,
    });
    subCategory = await subCategory.save();

    if (!subCategory) {
      return res.status(500).send({
        success: false,
        message: "subCategory Creation Failed",
      });
    }
    category = await Category.findByIdAndUpdate(
      body.categoryId,
      {
        $push: { subCategory: subCategory._id },
      },
      { new: true }
    );

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Category updation failed" });
    }
    return res.status(200).send({
      success: true,
      message:
        "subCategory added successfully with updation of subcategory in category",
      subCategory,
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.addSubCategory2 = async (req, res) => {
  try {
    const { body } = req;

    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        service: Joi.string(),
        subCategoryId: Joi.string().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    // console.log({ body });

    let subCategory = await SubCategory.findById(body.subCategoryId);
    // console.log({ subCategory });
    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "subCategory doesn't exist" });
    }
    if (subCategory.service.length !== 0) {
      return res.status(200).send({
        success: false,
        message:
          "Can not add subCategory2, services already defined under subCategory",
      });
    }

    let subCategory2 = await SubCategory2.findOne({ name: body.name });
    if (subCategory2) {
      return res.status(409).send({
        success: false,
        message: "subCategory2 Already Exists",
        subCategory2,
        subCategory,
      });
    }
    subCategory2 = new SubCategory2({ name: body.name, image: body.image });
    subCategory2 = await subCategory2.save();
    if (!subCategory2) {
      return res.status(400).send({
        success: false,
        message: "subCategory2 creation failed",
      });
    }
    subCategory = await SubCategory.findByIdAndUpdate(
      body.subCategoryId,
      {
        $push: { subCategory2: subCategory2._id },
      },
      { new: true }
    );
    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "subCategory updation failed" });
    }
    return res.status(200).send({
      success: true,
      message:
        "subCategory2 added successfully with updation of subCategory2 field under subCategory",
      subCategory2,
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.addServiceToCategory = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string().required(),
        rating: Joi.number(),
        categoryId: Joi.string().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let category = await Category.findById(body.categoryId);
    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Category doesn't exist" });
    }

    if (category.subCategory.length !== 0) {
      return res.status(200).send({
        success: false,
        message:
          "service can't be added, subCategory already defined under category",
      });
    }
    let service = await Service.findOne({ name: body.name });
    if (service) {
      return res.status(409).send({
        success: false,
        message: "Service Already Exists",
        category,
        service,
      });
    }
    service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      rating: body.rating,
    });
    service = await service.save();
    if (!service) {
      return res
        .status(400)
        .send({ success: false, message: "Service creation failed" });
    }
    category = await Category.findByIdAndUpdate(
      body.categoryId,
      { $push: { service: service._id } },
      { new: true }
    );
    if (!category) {
      return res.status(500).send({
        success: false,
        message: "Category updation failed for service",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Service added successfully to category",
      service,
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.addServiceToSubCategory = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string().required(),
        rating: Joi.number(),
        subCategoryId: Joi.string().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let subCategory = await SubCategory.findById(body.subCategoryId);
    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Subcategory doesn't exist" });
    }
    if (subCategory.subCategory2.length !== 0) {
      return res.status(200).send({
        success: false,
        message:
          "Can not add service,subCategory2 already defined under subCategory",
      });
    }
    let service = await Service.findOne({ name: body.name });
    if (service) {
      return res.status(409).send({
        success: false,
        message: "Service Already Exists",
        subCategory,
        service,
      });
    }
    service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      rating: body.rating,
    });
    service = await service.save();
    if (!service) {
      return res
        .status(400)
        .send({ success: false, message: "Service creation failed" });
    }
    subCategory = await SubCategory.findByIdAndUpdate(
      body.subCategoryId,
      { $push: { service: service._id } },
      { new: true }
    );
    if (!subCategory) {
      return res.status(500).send({
        success: false,
        message: "SubCategory updation failed for adding service",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Service added successfully to subCategory",
      service,
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.addServiceToSubCategory2 = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string().required(),
        rating: Joi.number(),
        subCategory2Id: Joi.string().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOne({ name: body.name });
    if (service) {
      return res.status(409).send({
        success: false,
        message: "Service Already Exists",
        service,
      });
    }
    service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      rating: body.rating,
    });
    service = await service.save();
    if (!service) {
      return res
        .status(400)
        .send({ success: false, message: "Service creation failed" });
    }
    let subCategory2 = await SubCategory2.findByIdAndUpdate(
      body.subCategory2Id,
      { $push: { service: service._id } },
      { new: true }
    );
    console.log(subCategory2.service);
    if (!subCategory2) {
      return res.status(500).send({
        success: false,
        message: "SubCategory2 updation failed for adding service",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Service added successfully to subCategory2",
      service,
      subCategory2,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    // let category2 = await Category.find(
    //   {},
    //   { _id: 1, name: 1, subCategory: 1, service: 1 }
    // ).populate({
    //   path: "subCategory",
    //   populate: { path: "subCategory2", populate: "service" },
    // });

    let category = await Category.find(
      {},
      { _id: 1, name: 1, subCategory: 1, service: 1 }
    )
      .populate({
        path: "subCategory",
        populate: {
          path: "subCategory2",
          select: { _id: 1, name: 1, service: 1 },
          populate: {
            path: "service",
            model: "service",
            select: { _id: 1, name: 1, description: 1, rating: 1, image: 1 },
          },
        },
      })
      .populate({
        path: "subCategory",
        model: "subCategory",
        select: { _id: 1, name: 1, service: 1, subCategory2: 1 },
        populate: {
          path: "service",
          model: "service",
          select: { _id: 1, name: 1, description: 1, rating: 1, image: 1 },
        },
      })
      .populate("service", { name: 1, description: 1, rating: 1, image: 1 });

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "All Category fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getAllSubCategories2 = async (req, res) => {
  try {
    let category = await Category.find(
      {},
      { _id: 1, name: 1, subCategory: 1, service: 1 }
    ).populate({
      path: "subCategory",
      model: "subCategory",
      select: { _id: 1, name: 1, service: 1 },
      populate: {
        path: "subCategory2",
        model: "subCategory2",
        select: { _id: 1, name: 1, service: 1 },
        populate: {
          path: "service",
          model: "service",
          select: { _id: 1, name: 1, description: 1, rating: 1, image: 1 },
        },
      },
    });

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "SubCategory2 fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};
exports.getAllSubCategories = async (req, res) => {
  try {
    let category = await Category.find(
      {},
      { _id: 1, name: 1, subCategory: 1, service: 1 }
    ).populate({
      path: "subCategory",
      model: "subCategory",
      select: { _id: 1, name: 1, service: 1, subCategory2: 1 },
      populate: {
        path: "service",
        model: "service",
        select: { _id: 1, name: 1, description: 1, rating: 1, image: 1 },
      },
    });

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "SubCategory fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    let category = await Category.find(
      {},
      { _id: 1, name: 1, service: 1, subCategory: 1 }
    ).populate("service", {
      _id: 1,
      name: 1,
      description: 1,
      rating: 1,
      image: 1,
    });

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getCategoryForSubCategory = async (req, res) => {
  try {
    let category = await Category.find(
      { service: { $size: 0 } },
      { _id: 1, name: 1, subCategory: 1, service: 1 }
    );

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "Category for subCategory fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getCategoryForService = async (req, res) => {
  try {
    let category = await Category.find(
      { subCategory: { $size: 0 } },
      { _id: 1, name: 1, subCategory: 1, service: 1 }
    );

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "Category for Service fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getSubCategoryForSubCategory2 = async (req, res) => {
  try {
    let subCategory = await SubCategory.find(
      { service: { $size: 0 } },
      { _id: 1, name: 1, subCategory2: 1, service: 1 }
    );

    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "SubCategory fro SubCategory2 fetched successfully",
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getSubCategoryForService = async (req, res) => {
  try {
    let subCategory = await SubCategory.find(
      { subCategory2: { $size: 0 } },
      { _id: 1, name: 1, subCategory2: 1, service: 1 }
    );

    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "SubCategory for Service fetched successfully",
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getSubCategory2ForService = async (req, res) => {
  try {
    let subCategory2 = await SubCategory2.find(
      {},
      { _id: 1, name: 1, service: 1 }
    );

    if (!subCategory2) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "SubCategory2 for service fetched successfully",
      subCategory2,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.deleteCategory = async (req, res) => {};

exports.deleteSubCategory = async (req, res) => {};

exports.deleteSubCategory2 = async (req, res) => {};

exports.deleteService = async (req, res) => {};

exports.updateCategory = async (req, res) => {};

exports.updateSubCategory = async (req, res) => {};

exports.updateSubCategory2 = async (req, res) => {};

exports.updateService = async (req, res) => {};
