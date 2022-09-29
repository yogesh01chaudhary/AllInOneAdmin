const { v4: uuidv4 } = require("uuid");
const RefreshToken = require("../models/refreshToken");
exports.createToken = async (admin) => {
//   let expiredAt = new Date();

//   expiredAt.setSeconds(
//     expiredAt.getSeconds() + process.env.jwtRefreshExpiration
//   );

  let token = uuidv4();

  let refreshToken = new RefreshToken({
    token,
    admin: admin._id,
    // expiryDate: expiredAt.getTime(),
  });

//   console.log({refreshToken});

  refreshToken = await refreshToken.save();

  return refreshToken.token;
};

// exports.verifyExpiration = (token) => {
//   return token.expiryDate.getTime() < new Date().getTime();
// };
