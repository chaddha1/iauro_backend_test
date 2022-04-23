const jwt = require("jsonwebtoken");
const UsersModel = require("../models/users");

exports.authorizeAdminUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("Unauthorized access.");
    }

    const token = authHeader.split(" ")[1];
    try {
      let decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decode) {
        const adminUser = await UsersModel.findOne({
          _id: decode["_id"],
          role: "admin",
        });
        if (!adminUser) {
          return res.status(401).send("Unauthorized access.");
        }
      }
      req.next();
    } catch (error) {
      return res.status(401).send(error);
    }
  } catch (error) {
    return next(error);
  }
};
