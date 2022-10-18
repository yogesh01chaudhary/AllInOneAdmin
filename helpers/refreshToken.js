const { v4: uuidv4 } = require("uuid");
const RefreshToken = require("../models/refreshToken");

exports.createToken = async (admin) => {
  let token = uuidv4();

  let refreshToken = new RefreshToken({
    token,
    admin: admin._id,
  });

  refreshToken = await refreshToken.save();

  return refreshToken.token;
};
