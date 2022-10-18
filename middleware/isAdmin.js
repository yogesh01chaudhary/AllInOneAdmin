const { Admin } = require("../models/admin");
const { SubAdmin } = require("../models/subAdmin");

exports.isAdmin = async (req, res, next) => {
  try {
    // console.log(req.user);
    const { id } = req.user;
    const admin = await Admin.findById({ _id: id });
    // console.log(admin);
    if (!admin) {
      return res.status(200).send({ success: true, message: "Not Admin" });
    }
    next();
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.isSubAdmin = async (req, res, next) => {
  try {
    const { id } = req.user;
    const subAdmin = await SubAdmin.findById({ _id: id });
    if (!subAdmin) {
      return res.status(200).send({ success: true, message: "Not a subAdmin" });
    }
    req.user.responsibilities = subAdmin.responsibilities;
    next();
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};
