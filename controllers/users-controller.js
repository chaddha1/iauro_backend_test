const UsersModel = require("../models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).send("Please provide email address.");
    }

    if (!req.body.password) {
      return res.status(400).send("Please provide password.");
    }

    const userAlready = await UsersModel.findOne({ email });
    if (userAlready) {
      return res.status(409).send("User already exists.");
    }

    if (req.body.role) {
      return res.status(401).send("Unauthorized request.");
    }

    const hashPass = await bcrypt.hash(req.body.password, saltRounds);
    const userObj = new UsersModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: email,
      password: hashPass,
    });

    await userObj.save();
    return res.status(201).send("User created successfully.");
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).send("Please provide email address.");
    }

    if (!req.body.password) {
      return res.status(400).send("Please provide password.");
    }

    const userAlready = await UsersModel.findOne({ email });
    if (!userAlready) {
      return res
        .status(404)
        .send("No such user exists. Create a new account to login.");
    }

    const hashPass = await bcrypt.hash(req.body.password, saltRounds);
    const passMatch = await bcrypt.compare(hashPass, userAlready.password);
    if (!passMatch) {
      return res.status(401).send("Invalid password.");
    }

    // jwt token
    const token = await jwt.sign(
      { _id: userAlready._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "User created successfully.",
      data: userAlready,
      accessToekn: token,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let UserId = req.params["id"];
    if (!UserId) {
      return res.status(400).send("Invalid params.");
    }

    let user = await UsersModel.findOne({ _id: UserId });

    if (!user) {
      return res.status(404).send("Invalid user id.");
    }

    await UsersModel.deleteOne({ _id: UserId });

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let userId = req.params["id"];
    if (!userId) {
      return res.status(400).send("Invalid params.");
    }

    let user = await UsersModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send("Invalid user id.");
    }

    if (req.body.email) {
      const emailAlready = await UsersModel.findOne({ email: req.body.email });
      if (emailAlready && user["_id"] !== emailAlready["_id"]) {
        return res.status(409).send("Email already registered.");
      }
    }

    await UsersModel.updateOne(
      { _id: userId },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        },
      }
    );

    user = await UsersModel.findOne({ _id: userId });
    return res.status(200).json({
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};
