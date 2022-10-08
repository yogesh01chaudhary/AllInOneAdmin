const { Admin } = require("../models/admin");
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
