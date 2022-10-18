const RefreshToken = require("../models/refreshToken");
const jwt = require("jsonwebtoken");

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null || requestToken.length === 0) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.admin._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.jwtExpiration,
      }
    );
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err.name });
  }
};
