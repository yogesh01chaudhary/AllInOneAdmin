const RefreshToken = require("../models/refreshToken");
const jwt = require("jsonwebtoken");

exports.refreshToken = async (req, res) => {
  console.log({ body: req.body });
  const { refreshToken: requestToken } = req.body;
  console.log({ requestToken });
  if (requestToken == null || requestToken.length === 0) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });
    console.log({ refreshToken });
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    // if (RefreshToken.verifyExpiration(refreshToken)) {
    //   RefreshToken.findByIdAndRemove(refreshToken._id, {
    //     useFindAndModify: false,
    //   }).exec();

    //   res.status(403).json({
    //     message: "Refresh token was expired. Please make a new signin request",
    //   });
    //   return;
    // }
    console.log(refreshToken.admin);
    console.log(process.env.JWT_SECRET, process.env.jwtExpiration);
    let newAccessToken = jwt.sign(
      { id: refreshToken.admin._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.jwtExpiration,
      }
    );
    console.log({ newAccessToken });
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err.name });
  }
};
