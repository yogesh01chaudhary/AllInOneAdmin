const Test = require("../models/test");
const Joi = require("joi");
const { Category } = require("../models/category");
const { SubCategory } = require("../models/sub-category");
const { SubCategory2 } = require("../models/sub-category2");
const { Service } = require("../models/services");
const { findById } = require("../models/user");

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

    let category = new Category({
      name: body.name,
      image: body.image,
    });

    category = await category.save();
    if (!category) {
      return res
        .status(400)
        .send({ success: false, message: "Category not created successfuly" });
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
        .send({ success: false, message: "No category Found" });
    }
    if (category.service.length !== 0) {
      return res.status(500).send({
        success: false,
        message:
          "You can not add sub-category, services already defined under category",
      });
    }
    let subCategory = new SubCategory({
      name: body.name,
      image: body.image,
    });
    subCategory = await subCategory.save();

    if (!subCategory) {
      return res.status(500).send({
        success: false,
        message: "subCategory not created successfuly",
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
        .send({ success: false, message: "No Sub Category Found" });
    }
    if (subCategory.service.length !== 0) {
      return res.status(200).send({
        success: false,
        message:
          "You can not add sub-category2 services already defined under subCategory",
      });
    }

    let subCategory2 = new SubCategory2({ name: body.name, image: body.image });
    subCategory2 = await subCategory2.save();
    if (!subCategory2) {
      return res.status(400).send({
        success: false,
        message: "subCategory2 not created successfuly",
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
        "subCategory2 added successfully with updation of subCategory field under subCategory",
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
        .send({ success: false, message: "No category Found" });
    }

    if (category.subCategory.length !== 0) {
      return res.status(200).send({
        success: false,
        message: "You can not add services because subCategory already defined",
      });
    }
    let service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      rating: body.rating,
    });
    service = await service.save();
    if (!service) {
      return res
        .status(400)
        .send({ success: false, message: "Service not created successfuly" });
    }
    category = await Category.findByIdAndUpdate(
      body.categoryId,
      { $push: { service: service._id } },
      { new: true }
    );
    if (!category) {
      return res.status(500).send({
        success: false,
        message: "Category updation failed for adding service",
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
        .send({ success: false, message: "No subCategory Found" });
    }
    if (subCategory.subCategory2.length !== 0) {
      return res.status(200).send({
        success: false,
        message:
          "You can not add services because subCategory already defined under subCategory",
      });
    }
    let service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      rating: body.rating,
    });
    service = await service.save();
    if (!service) {
      return res
        .status(400)
        .send({ success: false, message: "Service not created successfuly" });
    }
    subCategory = await SubCategory.findByIdAndUpdate(
      body.subCategoryId,
      { $push: { service: service._id } },
      { new: true }
    );
    if (!subCategory) {
      return res.status(500).send({
        success: false,
        message: "Sub Category updation failed for adding service",
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

    let service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      rating: body.rating,
    });
    service = await service.save();
    if (!service) {
      return res
        .status(400)
        .send({ success: false, message: "Service not created successfuly" });
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
      message: "Category fetched successfully",
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
      message: "Category fetched successfully",
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
      message: "Category fetched successfully",
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
