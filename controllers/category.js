const Test = require("../models/test");
const Joi = require("joi");
const { Category } = require("../models/category");
const { SubCategory } = require("../models/sub-category");
const { SubCategory2 } = require("../models/sub-category2");
const { Service } = require("../models/services");

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
        description: Joi.string(),
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
        description: Joi.string(),
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
        description: Joi.string(),
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
    category = category.map((data) => {
      return data.subCategory.map((item) => {
        if (item.service.length == 0) return item;
      });
    });

    category = category.map((data) => {
      if (data.length !== 0) return data;
    });
    category = category.filter((data) => {
      if (data !== null) return data;
    });
    category = category[0].filter((data) => {
      if (data !== null) return data;
    });

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
    // console.log(category.length);
    category = category.map((data) => {
      return data.subCategory.map((item) => {
        if (item.subCategory2.length == 0) return item;
      });
    });

    category = category.map((data) => {
      if (data.length !== 0) return data;
    });
    category = category.filter((data) => {
      if (data !== null) return data;
    });
    category = category[0].filter((data) => {
      if (data !== null) return data;
    });

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

    // console.log(category.length);
    category = category.map((data) => {
      if (data.subCategory.length == 0) {
        return data;
      }
    });
    category = category.filter((data) => {
      if (data !== null) return data;
    });
    // console.log(category);
    // category = category.map((data) => {
    //   return data.subCategory.map((item) => {
    //     if (item.service.length === 0) return item;
    //   });
    // });
    // category = category.filter((data) => {
    //   if (data !== null) return data;
    // });
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
    console.log(req.params);
    const { id } = req.params;
    let subCategory = await Category.find(
      { _id: id, service: { $size: 0 } },
      { __v: 0 }
    ).populate({ path: "subCategory", select: { __v: 0 } });

    //  console.log(subCategory)
    // subCategory = subCategory.map((data) => {
    //   if (typeof data) console.log(data);
    // });

    // subCategory
    // data.subCategory[0].service.length;

    // let subCategory = await SubCategory.find(
    //   { service: { $size: 0 } },
    //   { _id: 1, name: 1, subCategory2: 1, service: 1 }
    // );

    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    subCategory = subCategory.map((data) => {
      return data.subCategory.map((item) => {
        if (item.service.length === 0) return item;
      });
    });
    subCategory = subCategory[0].filter((data) => {
      if (data !== null) return data;
    });
    return res.status(200).send({
      success: true,
      message: "SubCategory for SubCategory2 fetched successfully",
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getSubCategoryForService = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    let subCategory = await Category.find(
      { _id: id, subCategory2: { $size: 0 } },
      { __v: 0 }
    ).populate({ path: "subCategory", select: { __v: 0 } });

    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    subCategory = subCategory.map((data) => {
      return data.subCategory.map((item) => {
        if (item.subCategory2.length === 0) return item;
      });
    });
    subCategory = subCategory[0].filter((data) => {
      if (data !== null) return data;
    });
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
    const { id, sid } = req.params;
    // const { sid } = req.params;
    console.log({ req: req.params });

    let subCategory = await Category.find(
      { _id: id },
      { _id: 1, name: 1, service: 1, subCategory: 1 }
    ).populate({
      path: "subCategory",
      select: { __v: 0 },
      populate: {
        path: "subCategory2",
        select: { __v: 0 },
        populate: { path: "service" },
      },
    });

    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    subCategory = subCategory.map((data) => {
      return data.subCategory.map((item) => {
        if (item.service.length === 0 && item._id == sid) return item;
      });
    });
    subCategory = subCategory[0].filter((data) => {
      if (data !== null) return data;
    });
    return res.status(200).send({
      success: true,
      message: "SubCategory2 for service fetched successfully",
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required()
      .validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .send({ success: false, message: "Category doesn't exist" });
    }
    if (category.subCategory.length === 0 && category.service.length === 0) {
      let category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Category doesn't exist in condition",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Category Deleted Successfully",
        data: category,
      });
    }
    return res.status(200).send({
      success: true,
      message:
        "Catgory can't be deleted,You need to delete subCategory or service first",
      data: category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id, categoryId } = req.body;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        categoryId: Joi.string().required(),
      })
      .required()
      .validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    console.log(req.body);
    let subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res
        .status(404)
        .send({ success: false, message: "SubCategory doesn't exist" });
    }
    console.log(subCategory.subCategory2.length, subCategory.service.length);
    if (
      subCategory.subCategory2.length === 0 &&
      subCategory.service.length === 0
    ) {
      subCategory = await SubCategory.findByIdAndDelete(id);
      if (!subCategory) {
        return res.status(404).send({
          success: false,
          message: "SubCategory doesn't exist inside condition",
        });
      }

      let category = await Category.updateOne(
        { _id: categoryId },
        { $pull: { subCategory: { $in: [id] } } },
        { new: true }
      );

      //   console.log(category.subCategory[subCategory.length - 1]._id);

      return res.status(200).send({
        success: true,
        message: "SubCategory Deleted Successfully",
        data: subCategory,
        category,
      });
    }
    return res.status(200).send({
      success: true,
      message:
        "SubCategory can't be deleted,You need to delete subCategory2 or service first",
      data: subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.deleteSubCategory2 = async (req, res) => {
  try {
    const { id, subCategoryId } = req.body;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        subCategoryId: Joi.string().required(),
      })
      .required()
      .validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let subCategory2 = await SubCategory2.findById(id);
    if (!subCategory2) {
      return res
        .status(404)
        .send({ success: false, message: "SubCategory2 doesn't exist" });
    }
    // console.log(subCategory2.service.length)
    if (subCategory2.service.length === 0) {
      let subCategory2 = await SubCategory2.findByIdAndDelete(id);
      if (!subCategory2) {
        return res
          .status(404)
          .send({ success: false, message: "SubCategory2 doesn't exist" });
      }
      //   let subCategory = await SubCategory.findById(subCategoryId);
      let subCategory = await SubCategory.updateOne(
        { _id: subCategoryId },
        { $pull: { subCategory2: { $in: [id] } } },
        { new: true }
      );
      //   console.log(subCategory.subCategory2[subCategory2.length]._id);
      return res.status(200).send({
        success: true,
        message: "SubCategory2 Deleted Successfully",
        data: subCategory2,
        subCategory,
      });
    }
    return res.status(200).send({
      success: true,
      message: "SubCategory2 can't be deleted,You need to delete service first",
      data: subCategory2,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.deleteServiceForCategory = async (req, res) => {
  try {
    const { id, categoryId } = req.body;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        categoryId: Joi.string().required(),
      })
      .required()
      .validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    console.log(req.body);
    let service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Service doesn't exist" });
    }

    // let category = await Category.findById(categoryId);
    let category = await Category.updateOne(
      { _id: categoryId },
      { $pull: { service: { $in: [id] } } },
      { new: true }
    );
    // console.log(category.service[service.length - 1]._id);

    return res.status(200).send({
      success: true,
      message: "Service Deleted Successfully",
      data: service,
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.deleteServiceForSubCategory = async (req, res) => {
  try {
    const { id, subCategoryId } = req.body;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        subCategoryId: Joi.string().required(),
      })
      .required()
      .validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    console.log(req.body);
    let service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Service doesn't exist" });
    }

    // let subCategory = await SubCategory.findById(subCategoryId);
    let subCategory = await SubCategory.updateOne(
      { _id: subCategoryId },
      { $pull: { service: { $in: [id] } } },
      { new: true }
    );
    // console.log(subCategory.service[service.length - 1]._id);

    return res.status(200).send({
      success: true,
      message: "Service Deleted Successfully",
      data: service,
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.deleteServiceForSubCategory2 = async (req, res) => {
  try {
    const { id, subCategory2Id } = req.body;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        subCategory2Id: Joi.string().required(),
      })
      .required()
      .validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Service doesn't exist" });
    }

    // let subCategory2 = await SubCategory2.findById(subCategory2Id);
    let subCategory2 = await SubCategory2.updateOne(
      { _id: subCategory2Id },
      { $pull: { service: { $in: [id] } } },
      { new: true }
    );
    // console.log(subCategory2.service[service.length - 1]._id);

    return res.status(200).send({
      success: true,
      message: "Service Deleted Successfully",
      data: service,
      subCategory2,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.allServices = async (req, res) => {
  try {
    let service = await Service.deleteMany();
    if (!service) {
      return res.status(404).send({ success: false, message: true });
    }
    return res.status(200).send({
      success: true,
      message: "All Services Deleted",
      data: service,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.allSubCategories2 = async (req, res) => {
  try {
    let subCategory2 = await SubCategory2.deleteMany();
    if (!subCategory2) {
      return res.status(404).send({ success: false, message: true });
    }
    return res.status(200).send({
      success: true,
      message: "All Services Deleted",
      data: subCategory2,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.allSubCategories = async (req, res) => {
  try {
    let subCategory = await SubCategory.deleteMany();
    if (!subCategory) {
      return res.status(404).send({ success: false, message: true });
    }
    return res.status(200).send({
      success: true,
      message: "All Services Deleted",
      data: subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.allCategories = async (req, res) => {
  try {
    let category = await Category.deleteMany();
    if (!category) {
      return res.status(404).send({ success: false, message: true });
    }
    return res.status(200).send({
      success: true,
      message: "All Services Deleted",
      data: category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { body } = req;

    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
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
    let category = await Category.findByIdAndUpdate(
      { _id: body.id },
      {
        name: body.name,
        image: body.image,
        subCategory: body.subCategory,
        service: body.service,
      },
      { new: true }
    );
    if (!category) {
      return res.status(409).send({
        success: false,
        message: "Category Doesn't Exists",
        category,
      });
    }
    // category = new Category({
    //   name: body.name,
    //   image: body.image,
    // });

    // category = await category.save();
    // if (!category) {
    //   return res
    //     .status(400)
    //     .send({ success: false, message: "Category creation failed" });
    // }
    return res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
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
        message: "Can not update subCategory, service already defined",
      });
    }
    let subCategory = await SubCategory.findByIdAndUpdate(
      { _id: body.id },
      { name: body.name, image: body.image },
      { new: true }
    );
    if (!subCategory) {
      return res.status(409).send({
        success: false,
        message: "subCategory Doesn't Exists",
        subCategory,
        category,
      });
    }
    // subCategory = new SubCategory({
    //   name: body.name,
    //   image: body.image,
    // });
    // subCategory = await subCategory.save();

    // if (!subCategory) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "subCategory Creation Failed",
    //   });
    // }
    // category = await Category.findByIdAndUpdate(
    //   body.categoryId,
    //   {
    //     $push: { subCategory: subCategory._id },
    //   },
    //   { new: true }
    // );

    // if (!category) {
    //   return res
    //     .status(500)
    //     .send({ success: false, message: "Category updation failed" });
    // }
    return res.status(200).send({
      success: true,
      message:
        "subCategory updated successfully with updation of subcategory in category",
      subCategory,
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.updateSubCategory2 = async (req, res) => {
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

exports.updateServiceToCategory = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string(),
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

exports.updateServiceToSubCategory = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string(),
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

exports.updateServiceToSubCategory2 = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string(),
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
