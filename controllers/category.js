const Test = require("../models/test");
const Joi = require("joi");
const { Category } = require("../models/category");
const { SubCategory } = require("../models/sub-category");
const { SubCategory2 } = require("../models/sub-category2");
const { Service } = require("../models/services");

//*******************************************test*************************************************************************//
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

//*******************************************add*************************************************************************//
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

    let category = await Category.findById(body.categoryId).populate(
      "subCategory"
    );
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

    let p = 0;
    for (let i = 0; i < category.subCategory.length; i++) {
      if (category.subCategory[i].name === body.name) {
        p++;
        break;
      }
    }
    if (p) {
      return res.status(409).json({ message: "SubCategory already exist" });
    }

    let subCategory = new SubCategory({
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

    let subCategory = await SubCategory.findById(body.subCategoryId).populate(
      "subCategory2"
    );
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

    let p = 0;
    for (let i = 0; i < subCategory.subCategory2.length; i++) {
      if (subCategory.subCategory2[i].name === body.name) {
        p++;
        break;
      }
    }
    if (p) {
      return res.status(409).json({ message: "SubCategory already exist" });
    }

    let subCategory2 = new SubCategory2({ name: body.name, image: body.image });
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
        categoryId: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string(),
        silver: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
        gold: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
        platinum: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let category = await Category.findById(body.categoryId).populate("service");
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
    let p = 0;
    for (let i = 0; i < category.service.length; i++) {
      if (category.service[i].name === body.name) {
        p++;
        break;
      }
    }
    if (p) {
      return res.status(409).json({ message: "Service already exist" });
    }
    let service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      silver: {
        description: body.silver.description,
        price: body.silver.price,
        image: body.silver.image,
      },
      gold: {
        description: body.gold.description,
        price: body.gold.price,
        image: body.gold.image,
      },
      platinum: {
        description: body.platinum.description,
        price: body.platinum.price,
        image: body.silver.image,
      },
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
        subCategoryId: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string(),
        silver: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
        gold: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
        platinum: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let subCategory = await SubCategory.findById(body.subCategoryId).populate(
      "service"
    );
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
    let p = 0;
    for (let i = 0; i < subCategory.service.length; i++) {
      if (subCategory.service[i].name === body.name) {
        p++;
        break;
      }
    }

    if (p) {
      return res.status(409).json({ message: "Service already exist" });
    }

    let service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      silver: {
        description: body.silver.description,
        price: body.silver.price,
        image: body.silver.image,
      },
      gold: {
        description: body.gold.description,
        price: body.gold.price,
        image: body.gold.image,
      },
      platinum: {
        description: body.platinum.description,
        price: body.platinum.price,
        image: body.silver.image,
      },
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
        subCategory2Id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string(),
        silver: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
        gold: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
        platinum: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
          image: Joi.string(),
          vendor: Joi.string(),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let subCategory2 = await SubCategory2.findById(
      body.subCategory2Id
    ).populate("service");
    if (!subCategory2) {
      return res
        .status(500)
        .send({ success: false, message: "Subcategory2 doesn't exist" });
    }

    let p = 0;
    for (let i = 0; i < subCategory2.service.length; i++) {
      if (subCategory2.service[i].name === body.name) {
        p++;
        break;
      }
    }

    if (p) {
      return res.status(409).json({ message: "Service already exist" });
    }

    let service = new Service({
      name: body.name,
      image: body.image,
      description: body.description,
      silver: {
        description: body.silver.description,
        price: body.silver.price,
        image: body.silver.image,
      },
      gold: {
        description: body.gold.description,
        price: body.gold.price,
        image: body.gold.image,
      },
      platinum: {
        description: body.platinum.description,
        price: body.platinum.price,
        image: body.silver.image,
      },
    });
    service = await service.save();
    if (!service) {
      return res
        .status(400)
        .send({ success: false, message: "Service creation failed" });
    }
    subCategory2 = await SubCategory2.findByIdAndUpdate(
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

//*******************************************getAllCategoriesWithPopulated*************************************************************************//
exports.getAllCategories = async (req, res) => {
  try {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 6;
    let category = await Category.find({}, { __v: 0 })
      .populate({
        path: "subCategory",
        select: { __v: 0 },
        populate: {
          path: "subCategory2",
          select: { __v: 0 },
          populate: {
            path: "service",
            model: "service",
            select: {
              __v: 0,
            },
            populate: [
              {
                path: "silver",
                select: { __v: 0 },
                populate: [
                  {
                    path: "rating.ratedBy",
                    model: "user",
                    select: { firstName: 1 },
                  },
                  {
                    path: "vendor",
                    model: "vendor",
                    select: { firstName: 1 },
                  },
                ],
              },
              {
                path: "gold",
                populate: [
                  {
                    path: "rating.ratedBy",
                    model: "user",
                    select: { firstName: 1 },
                  },
                  {
                    path: "vendor",
                    model: "vendor",
                    select: { firstName: 1 },
                  },
                ],
              },
              {
                path: "platinum",
                populate: [
                  {
                    path: "rating.ratedBy",
                    model: "user",
                    select: { firstName: 1 },
                  },
                  {
                    path: "vendor",
                    model: "vendor",
                    select: { firstName: 1 },
                  },
                ],
              },
            ],
          },
        },
      })
      .populate({
        path: "subCategory",
        model: "subCategory",
        select: { __v: 0 },
        populate: {
          path: "service",
          model: "service",
          select: {
            _id: 1,
            name: 1,
            description: 1,
            rating: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
          },
          populate: [
            {
              path: "silver",
              select: { __v: 0 },
              populate: [
                {
                  path: "rating.ratedBy",
                  model: "user",
                  select: { firstName: 1 },
                },
                {
                  path: "vendor",
                  model: "vendor",
                  select: { firstName: 1 },
                },
              ],
            },
            {
              path: "gold",
              populate: [
                {
                  path: "rating.ratedBy",
                  model: "user",
                  select: { firstName: 1 },
                },
                {
                  path: "vendor",
                  model: "vendor",
                  select: { firstName: 1 },
                },
              ],
            },
            {
              path: "platinum",
              populate: [
                {
                  path: "rating.ratedBy",
                  model: "user",
                  select: { firstName: 1 },
                },
                {
                  path: "vendor",
                  model: "vendor",
                  select: { firstName: 1 },
                },
              ],
            },
          ],
        },
      })
      .populate({
        path: "service",
        model: "service",
        select: {
          ___v: 0,
        },
        populate: [
          {
            path: "silver",
            select: { __v: 0 },
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "gold",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "platinum",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
        ],
      })
    .skip(skip)
    .limit(limit);
    // let count = category.length;

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "All Category SubCategory SubCategory2 fetched successfully",
      category,
      // count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//*******************************************getAllSubCategoryWithPopulated*************************************************************************//
exports.getAllSubCategories = async (req, res) => {
  try {
    let category = await Category.find(
      { "subCategory.1": { $exists: true } },
      { __v: 0, service: 0 }
    ).populate({
      path: "subCategory",
      model: "subCategory",
      select: { __v: 0, subCategory2: 0 },
      populate: {
        path: "service",
        model: "service",
        select: {
          __v: 0,
        },
        populate: [
          {
            path: "silver",
            select: { __v: 0 },
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "gold",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "platinum",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
        ],
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

//*******************************************getAllSubCategory2WithPopulated*************************************************************************//
exports.getAllSubCategories2 = async (req, res) => {
  try {
    let category = await Category.find(
      // { $expr: { $gt: [{ $size: "$subCategory" }, 1] } },
      // {
      //   $expr: {
      //     $gt: [{ $size: { $ifNull: ["$subCategory", []] } }, 0],
      //   },
      // },
      // {subCategory:{$where:`this.subCategory.length >= 1`}},
      // { "subCategory.1": { $exists: true } },
      {
        subCategory: {
          // $elemMatch: {
          //   subCategory2: {
          $exists: true,
          $ne: [],
          $not: {
            $size: 1,
          },
        },
        //   },
        // },
      },
      { __v: 0, service: 0 }
    ).populate({
      path: "subCategory",
      model: "subCategory",
      select: { __v: 0, service: 0 },
      populate: {
        path: "subCategory2",
        select: { __v: 0 },
        populate: {
          path: "service",
          select: {
            __v: 0,
          },
          populate: [
            {
              path: "silver",
              select: { __v: 0 },
              populate: [
                {
                  path: "rating.ratedBy",
                  model: "user",
                  select: { firstName: 1 },
                },
                {
                  path: "vendor",
                  model: "vendor",
                  select: { firstName: 1 },
                },
              ],
            },
            {
              path: "gold",
              populate: [
                {
                  path: "rating.ratedBy",
                  model: "user",
                  select: { firstName: 1 },
                },
                {
                  path: "vendor",
                  model: "vendor",
                  select: { firstName: 1 },
                },
              ],
            },
            {
              path: "platinum",
              populate: [
                {
                  path: "rating.ratedBy",
                  model: "user",
                  select: { firstName: 1 },
                },
                {
                  path: "vendor",
                  model: "vendor",
                  select: { firstName: 1 },
                },
              ],
            },
          ],
        },
      },
    });

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    let subCategory = category;
    return res.status(200).send({
      success: true,
      message: "SubCategory2 fetched successfully",
      category: subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//*******************************************getAllSubCategoryDataForCategoryById*************************************************************************//
exports.getSubCategoryData = async (req, res) => {
  try {
    let category = await Category.find(
      { _id: req.params.id },
      { __v: 0, service: 0 }
    ).populate({
      path: "subCategory",
      model: "subCategory",
      select: { __v: 0, subCategory2: 0 },
      populate: {
        path: "service",
        model: "service",
        select: {
          __v: 0,
        },
        populate: [
          {
            path: "silver",
            select: { __v: 0 },
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "gold",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "platinum",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
        ],
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

//*******************************************getAllSubCategory2DataForSubCategoryById*************************************************************************//
exports.getSubCategory2Data = async (req, res) => {
  try {
    console.log(req.params);
    let subCategory = await SubCategory.findById(
      { _id: req.params.id },
      { __v: 0, service: 0 }
    ).populate({
      path: "subCategory2",
      model: "subCategory2",
      select: { __v: 0 },
      populate: {
        path: "service",
        model: "service",
        select: { __v: 0 },
        populate: [
          {
            path: "silver",
            select: { __v: 0 },
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "gold",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
          {
            path: "platinum",
            populate: [
              {
                path: "rating.ratedBy",
                model: "user",
                select: { firstName: 1 },
              },
              {
                path: "vendor",
                model: "vendor",
                select: { firstName: 1 },
              },
            ],
          },
        ],
      },
    });

    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    return res.status(200).send({
      success: true,
      message: "SubCategory2 fetched successfully",
      subCategory,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//*******************************************getAllServicesForCategoryById*************************************************************************//
exports.getAllServicesForCategories = async (req, res) => {
  try {
    let category = await Category.find(
      { _id: req.params.id },
      { _id: 1, name: 1, createdAt: 1, updatedAt: 1 }
    ).populate({
      path: "service",
      model: "service",
      select: {
        __v: 0,
      },
    });

    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }

    return res.status(200).send({
      success: true,
      message: "Services For Category fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//*******************************************getAllServicesForSubCategoryById*************************************************************************//
exports.getAllServicesForSubCategories = async (req, res) => {
  try {
    let services = await SubCategory.find(
      { _id: req.params.id, subCategory2: { $size: 0 } },
      { _id: 1, name: 1, createdAt: 1, updatedAt: 1 }
    ).populate({
      path: "service",
      model: "service",
      select: { __v: 0 },
      populate: [
        {
          path: "silver",
          select: { __v: 0 },
          populate: [
            {
              path: "rating.ratedBy",
              model: "user",
              select: { firstName: 1 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { firstName: 1 },
            },
          ],
        },
        {
          path: "gold",
          populate: [
            {
              path: "rating.ratedBy",
              model: "user",
              select: { firstName: 1 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { firstName: 1 },
            },
          ],
        },
        {
          path: "platinum",
          populate: [
            {
              path: "rating.ratedBy",
              model: "user",
              select: { firstName: 1 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { firstName: 1 },
            },
          ],
        },
      ],
    });

    if (!services) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }

    return res.status(200).send({
      success: true,
      message: "Services For SubCategories fetched successfully",
      services,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//*******************************************getAllServicesForSubCategory2ById*************************************************************************//
exports.getAllServicesForSubCategories2 = async (req, res) => {
  try {
    let services = await SubCategory2.find(
      { _id: req.params.id },
      { _id: 1, name: 1, createdAt: 1, updatedAt: 1 }
    ).populate({
      path: "service",
      model: "service",
      select: { __v: 0 },
      populate: [
        {
          path: "silver",
          select: { __v: 0 },
          populate: [
            {
              path: "rating.ratedBy",
              model: "user",
              select: { firstName: 1 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { firstName: 1 },
            },
          ],
        },
        {
          path: "gold",
          populate: [
            {
              path: "rating.ratedBy",
              model: "user",
              select: { firstName: 1 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { firstName: 1 },
            },
          ],
        },
        {
          path: "platinum",
          populate: [
            {
              path: "rating.ratedBy",
              model: "user",
              select: { firstName: 1 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { firstName: 1 },
            },
          ],
        },
      ],
    });

    if (!services) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }

    return res.status(200).send({
      success: true,
      message: "Services For SubCategories2 fetched successfully",
      services,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//********************************************getCategory/SubCategory/SubCategory2 in dropdowns while adding data*********************************************//
exports.getCategoryForSubCategory = async (req, res) => {
  try {
    let category = await Category.find(
      { service: { $size: 0 } },
      { _id: 1, name: 1, subCategory: 1, createdAt: 1, updatedAt: 1 }
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
      { _id: 1, name: 1, service: 1, createdAt: 1, updatedAt: 1 }
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
    const { id } = req.params;
    let subCategory = await Category.find(
      { _id: id, service: { $size: 0 } },
      { __v: 0 }
    ).populate({ path: "subCategory", select: { __v: 0 } });

    if (!subCategory) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    if (subCategory.length == 0) {
      return res
        .status(404)
        .send({ success: true, message: "No Data Found", subCategory });
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
    if (subCategory.length == 0) {
      return res
        .status(404)
        .send({ success: true, message: "No Data Found", subCategory });
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
    let subCategory = await Category.find(
      { _id: id },
      {
        _id: 1,
        name: 1,
        service: 1,
        subCategory: 1,
        createdAt: 1,
        updatedAt: 1,
      }
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
    if (subCategory.length == 0) {
      return res
        .status(404)
        .send({ success: true, message: "No Data Found", subCategory });
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

//***************************************deleteCategory*******************************************************************************//
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

//***************************************deleteSubCategory****************************************************************************//
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

//***************************************deleteSubCategory2***************************************************************************//
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

    if (subCategory2.service.length === 0) {
      let subCategory2 = await SubCategory2.findByIdAndDelete(id);
      if (!subCategory2) {
        return res
          .status(404)
          .send({ success: false, message: "SubCategory2 doesn't exist" });
      }

      let subCategory = await SubCategory.updateOne(
        { _id: subCategoryId },
        { $pull: { subCategory2: { $in: [id] } } },
        { new: true }
      );

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

//***************************************deleteServiceCategory************************************************************************//
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

    let category = await Category.updateOne(
      { _id: categoryId },
      { $pull: { service: { $in: [id] } } },
      { new: true }
    );
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

//***************************************deleteServiceSubCategory*********************************************************************//
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

    let subCategory = await SubCategory.updateOne(
      { _id: subCategoryId },
      { $pull: { service: { $in: [id] } } },
      { new: true }
    );
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

//***************************************deleteServiceSubCategory2********************************************************************//
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

    let subCategory2 = await SubCategory2.updateOne(
      { _id: subCategory2Id },
      { $pull: { service: { $in: [id] } } },
      { new: true }
    );

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

//***************************************deleteAllServiceFromDataBase**************************************************************//
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

//***************************************deleteAllSubCategories2FromDataBase**************************************************************//
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

//***************************************deleteAllSubCategoryFromDataBase**************************************************************//
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

//***************************************deleteAllCategoriesFromDataBase**************************************************************//
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

//***************************************updateCategory/SubCategory/SubCategory2ById*************************************************//
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
        subCategory2: Joi.string(),
        service: Joi.string(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
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
      });
    }

    return res.status(200).send({
      success: true,
      message: "subCategory updated successfully",
      subCategory,
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
        id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string(),
        service: Joi.string(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let subCategory2 = await SubCategory2.findByIdAndUpdate(
      { _id: body.id },
      { name: body.name, image: body.image },
      { new: true }
    );
    if (!subCategory2) {
      return res.status(409).send({
        success: false,
        message: "subCategory2 Doesn't Exists",
      });
    }

    return res.status(200).send({
      success: true,
      message: "subCategory2 upated successfully",
      subCategory2,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//***************************************updateService*******************************************************************************//
exports.updateService = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string(),
        silver: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
        }),
        gold: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
        }),
        platinum: Joi.object().keys({
          price: Joi.number().required(),
          description: Joi.string().required(),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let service = await Service.findByIdAndUpdate(
      { _id: body.id },
      {
        name: body.name,
        image: body.image,
        description: body.description,
        silver: {
          description: body.silver.description,
          price: body.silver.price,
          image: body.silver.image,
        },
        gold: {
          description: body.gold.description,
          price: body.gold.price,
          image: body.gold.image,
        },
        platinum: {
          description: body.platinum.description,
          price: body.platinum.price,
          image: body.silver.image,
        },
      },
      { new: true }
    );
    if (!service) {
      return res.status(409).send({
        success: false,
        message: "Service Doesn't Exist",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Service updated successfully to category",
      service,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

//***************************************updateServiceCategoriesWithVendor***********************************************************//
exports.updateVendorSilver = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        silver: Joi.object().keys({
          vendor: Joi.string(),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let service = await Service.findByIdAndUpdate(
      {
        _id: body.serviceId,
      },
      {
        $addToSet: { "silver.vendor": body.silver.vendor },
      },
      { new: true }
    );

    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Service Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Silver Service Updated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateVendorGold = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        gold: Joi.object().keys({
          vendor: Joi.string(),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let service = await Service.findByIdAndUpdate(
      {
        _id: body.serviceId,
      },
      {
        $addToSet: { "gold.vendor": body.gold.vendor },
      },
      { new: true }
    );

    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Service Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Gold Service Updated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateVendorPlatinum = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        platinum: Joi.object().keys({
          vendor: Joi.string(),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findByIdAndUpdate(
      {
        _id: body.serviceId,
      },
      {
        $addToSet: { "platinum.vendor": body.platinum.vendor },
      },
      { new: true }
    );
    console.log(service);
    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Service Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Platinum Service Updated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

//***************************************giveRatingAndUpdate*************************************************************************//
exports.rateSilver = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "silver.rating.ratedBy": { $nin: body.userId },
      },
      {
        $addToSet: {
          "silver.rating": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Data Found, Maybe User Already rated/ Service Not Exists",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Silver Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.rateGold = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "gold.rating.ratedBy": { $nin: body.userId },
      },
      {
        $addToSet: {
          "gold.rating": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Data Found, Maybe User Already rated/ Service Not Exists",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated  Gold Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.ratePlatinum = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "platinum.rating.ratedBy": { $nin: body.userId },
      },
      {
        $addToSet: {
          "platinum.rating": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Data Found, Maybe User Already rated/ Service Not Exists",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Platinum Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateRateSilver = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "silver.rating.ratedBy": { $eq: body.userId },
      },
      {
        $set: {
          "silver.rating.$": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Service Found/ MayBe User Not Rated",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateRateGold = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "gold.rating.ratedBy": { $in: body.userId },
      },

      {
        $set: {
          "gold.rating.$": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    // console.log(service);
    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Service Found" });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateRatePlatinum = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "platinum.rating.ratedBy": { $nin: body.userId },
      },

      {
        $set: {
          "platinum.rating.$": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Service Found" });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

//***************************************getAllServices*******************************************************************************//
exports.getServices = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        name: Joi.string(),
        image: Joi.string(),
        description: Joi.string(),
        silver: Joi.object().keys({
          description: Joi.string(),
          vendor: Joi.array().items(Joi.string()),
          rating: Joi.array().items(
            Joi.object().keys({
              ratedBy: Joi.string().required(),
              star: Joi.number(),
            })
          ),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.find({}, { __v: 0 }).populate([
      {
        path: "silver",
        select: { __v: 0 },
        populate: [
          {
            path: "rating.ratedBy",
            model: "user",
            select: { firstName: 1 },
          },
          {
            path: "vendor",
            model: "vendor",
            select: { firstName: 1 },
          },
        ],
      },
      {
        path: "gold",
        populate: [
          {
            path: "rating.ratedBy",
            model: "user",
            select: { firstName: 1 },
          },
          {
            path: "vendor",
            model: "vendor",
            select: { firstName: 1 },
          },
        ],
      },
      {
        path: "platinum",
        populate: [
          {
            path: "rating.ratedBy",
            model: "user",
            select: { firstName: 1 },
          },
          {
            path: "vendor",
            model: "vendor",
            select: { firstName: 1 },
          },
        ],
      },
    ]);

    if (!service) {
      return res
        .status(500)
        .send({ success: flase, message: "Something went wrong" });
    }

    if (service.length == 0) {
      return res
        .status(404)
        .send({ success: true, message: "No Servcie Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Service Fetched Successfully",
      service,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

//***************************************getServiceById*****************************************************************************//
exports.getService = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        name: Joi.string(),
        image: Joi.string(),
        description: Joi.string(),
        silver: Joi.object().keys({
          description: Joi.string(),
          vendor: Joi.array().items(Joi.string()),
          rating: Joi.array().items(
            Joi.object().keys({
              ratedBy: Joi.string().required(),
              star: Joi.number(),
            })
          ),
        }),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findById(
      { _id: body.serviceId },
      { __v: 0 }
    ).populate([
      {
        path: "silver",
        select: { __v: 0 },
        populate: [
          {
            path: "rating.ratedBy",
            model: "user",
            select: { firstName: 1 },
          },
          {
            path: "vendor",
            model: "vendor",
            select: { firstName: 1 },
          },
        ],
      },
      {
        path: "gold",
        populate: [
          {
            path: "rating.ratedBy",
            model: "user",
            select: { firstName: 1 },
          },
          {
            path: "vendor",
            model: "vendor",
            select: { firstName: 1 },
          },
        ],
      },
      {
        path: "platinum",
        populate: [
          {
            path: "rating.ratedBy",
            model: "user",
            select: { firstName: 1 },
          },
          {
            path: "vendor",
            model: "vendor",
            select: { firstName: 1 },
          },
        ],
      },
    ]);
    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Servcie Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Service Fetched Successfully",
      service,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};
